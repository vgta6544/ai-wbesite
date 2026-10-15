import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import {
  getDbProjects,
  insertDbProject,
  updateDbProject,
  deleteDbProject,
  getDbServices,
  insertDbService,
  updateDbService,
  deleteDbService,
  getDbMessages,
  insertDbMessage,
  updateDbMessageStatus,
  deleteDbMessage,
  getDbSettings,
  upsertDbSettings,
  seedDatabaseIfEmpty,
  getOrCreateDbUser,
} from './src/db/queries.ts';
import {
  verifyGoogleAccount,
  verifyPin,
  validateSessionToken,
  invalidateSession,
  requireAdminAuth,
  checkRateLimit,
  getClientIp,
  getAuthorizedEmail,
  updateRuntimePin,
} from './server/auth.js';

const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Auto-seed Cloud SQL Database with initial default data if empty
  try {
    const initialData = db.getAllData();
    seedDatabaseIfEmpty(initialData).catch((err) => {
      console.error('Non-blocking Cloud SQL seed notification:', err.message);
    });
  } catch (err) {
    console.error('Failed to initiate Cloud SQL seeding:', err);
  }

  // Body parsers with support for base64 media uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Serve persistent uploaded images
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================

  // Check rate limit and current auth configuration status
  app.get('/api/auth/status', (req: Request, res: Response) => {
    const ip = getClientIp(req);
    const rateStatus = checkRateLimit(ip);
    const authorizedEmail = getAuthorizedEmail();
    
    // Mask authorized email slightly for security display (e.g., vg***@gmail.com)
    const [name, domain] = authorizedEmail.split('@');
    const maskedEmail = name.length > 2 
      ? `${name.substring(0, 2)}***@${domain}`
      : `${name}***@${domain}`;

    res.json({
      locked: rateStatus.locked,
      remainingAttempts: rateStatus.remainingAttempts,
      lockoutSeconds: rateStatus.lockoutSeconds,
      authorizedEmailHint: maskedEmail,
      authorizedEmailFull: authorizedEmail, // provided for preview convenience
    });
  });

  // Step 2: Google Account Verification
  app.post('/api/auth/google', (req: Request, res: Response) => {
    const { email, name, picture } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google authentication.' });
    }

    const verification = verifyGoogleAccount(email);
    if (!verification.authorized) {
      return res.status(403).json({
        error: verification.reason || 'Unauthorized Google account.',
      });
    }

    // Account authorized, proceed to PIN step
    getOrCreateDbUser(email.toLowerCase().trim(), email.toLowerCase().trim(), name || 'Admin Zohair').catch((e) => {
      console.error('Non-blocking user DB sync:', e.message);
    });

    res.json({
      success: true,
      user: {
        email: email.toLowerCase().trim(),
        name: name || 'Admin Zohair',
        picture: picture || '',
        role: 'admin',
      },
      nextStep: 'pin',
      message: 'Google identity verified. Please enter your Administrator PIN to continue.',
    });
  });

  // Step 3: Admin PIN Verification
  app.post('/api/auth/pin', (req: Request, res: Response) => {
    const { pin } = req.body;
    const ip = getClientIp(req);

    if (!pin) {
      return res.status(400).json({ error: 'Admin PIN is required.' });
    }

    const result = verifyPin(pin, ip);
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    res.json({
      success: true,
      token: result.sessionToken,
      message: 'Authentication successful. Welcome to the Admin Panel.',
    });
  });

  // Admin: Update PIN
  app.post('/api/auth/pin/update', requireAdminAuth, (req: Request, res: Response) => {
    const { currentPin, newPin } = req.body;
    if (!currentPin || !newPin) {
      return res.status(400).json({ error: 'Both currentPin and newPin are required.' });
    }
    const result = updateRuntimePin(currentPin, newPin);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true, message: 'Admin PIN updated successfully.' });
  });

  // Session verification
  app.get('/api/auth/verify', (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    const isValid = validateSessionToken(token);
    if (!isValid) {
      return res.status(401).json({ valid: false, error: 'Session expired or invalid.' });
    }

    res.json({
      valid: true,
      user: {
        email: getAuthorizedEmail(),
        role: 'admin',
        name: 'Zohair',
      },
    });
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      invalidateSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ==========================================
  // PROJECTS ROUTES
  // ==========================================

  // Public: Get all projects
  app.get('/api/projects', async (_req: Request, res: Response) => {
    try {
      const projects = await getDbProjects();
      res.json(projects);
    } catch (err) {
      console.error('Database query fallback for projects:', err);
      const fallback = db.getProjects();
      res.json(fallback);
    }
  });

  // Public: Get single project
  app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const all = await getDbProjects();
      const project = all.find((p) => p.id === req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (err) {
      const project = db.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    }
  });

  // Admin: Create project
  app.post('/api/projects', requireAdminAuth, async (req: Request, res: Response) => {
    const { title, category, description, coverImage, images, videoUrl, tools, projectDate, client, featured, sortOrder } = req.body;
    if (!title || !category || !description || !coverImage) {
      return res.status(400).json({ error: 'Missing required project fields (title, category, description, coverImage).' });
    }

    const newProject = db.addProject({
      title,
      category,
      description,
      coverImage,
      images: Array.isArray(images) && images.length > 0 ? images : [coverImage],
      videoUrl: videoUrl || undefined,
      tools: Array.isArray(tools) ? tools : [],
      projectDate: projectDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      client: client || undefined,
      featured: Boolean(featured),
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
    });

    try {
      await insertDbProject(newProject);
    } catch (err) {
      console.error('Failed to write project to Cloud SQL:', err);
    }

    res.status(201).json(newProject);
  });

  // Admin: Update project
  app.put('/api/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const updated = db.updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    try {
      await updateDbProject(req.params.id, req.body);
    } catch (err) {
      console.error('Failed to update project in Cloud SQL:', err);
    }

    res.json(updated);
  });

  // Admin: Delete project
  app.delete('/api/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const deleted = db.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found or already deleted' });
    }

    try {
      await deleteDbProject(req.params.id);
    } catch (err) {
      console.error('Failed to delete project from Cloud SQL:', err);
    }

    res.json({ success: true, message: 'Project removed successfully' });
  });

  // ==========================================
  // SERVICES ROUTES
  // ==========================================

  // Public: Get all services
  app.get('/api/services', async (_req: Request, res: Response) => {
    try {
      const services = await getDbServices();
      res.json(services);
    } catch (err) {
      console.error('Database query fallback for services:', err);
      const fallback = db.getServices();
      res.json(fallback);
    }
  });

  // Admin: Create service
  app.post('/api/services', requireAdminAuth, async (req: Request, res: Response) => {
    const { title, description, icon, enabled, sortOrder } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const newService = db.addService({
      title,
      description,
      icon: icon || 'Sparkles',
      enabled: enabled !== undefined ? Boolean(enabled) : true,
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
    });

    try {
      await insertDbService(newService);
    } catch (err) {
      console.error('Failed to write service to Cloud SQL:', err);
    }

    res.status(201).json(newService);
  });

  // Admin: Update service
  app.put('/api/services/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }

    try {
      await updateDbService(req.params.id, req.body);
    } catch (err) {
      console.error('Failed to update service in Cloud SQL:', err);
    }

    res.json(updated);
  });

  // Admin: Delete service
  app.delete('/api/services/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const deleted = db.deleteService(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }

    try {
      await deleteDbService(req.params.id);
    } catch (err) {
      console.error('Failed to delete service from Cloud SQL:', err);
    }

    res.json({ success: true, message: 'Service removed successfully' });
  });

  // ==========================================
  // CONTACT MESSAGES ROUTES
  // ==========================================

  // Public: Send contact message
  app.post('/api/messages', async (req: Request, res: Response) => {
    const { name, email, subject, message, product, isChat, honeypot } = req.body;

    // Honeypot spam protection
    if (honeypot) {
      return res.json({ success: true, message: 'Message sent successfully.' });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please fill out all required message fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newMsg = db.addMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      product: product ? String(product).trim() : undefined,
      isChat: Boolean(isChat),
    });

    try {
      await insertDbMessage(newMsg);
    } catch (err) {
      console.error('Failed to write message to Cloud SQL:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Thanks! Your message has been sent successfully.',
      data: newMsg,
    });
  });

  // Public: Live Chat endpoint (supports anonymous / email and selected product)
  app.post('/api/chat', async (req: Request, res: Response) => {
    const { name, email, product, message, isAnonymous } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const cleanName = isAnonymous || !name || !String(name).trim() ? 'Anonymous Visitor' : String(name).trim();
    const cleanEmail = email && String(email).trim() ? String(email).trim() : 'anonymous@visitor.local';
    const cleanProduct = product && String(product).trim() ? String(product).trim() : 'General Inquiry';

    const newMsg = db.addMessage({
      name: cleanName,
      email: cleanEmail,
      subject: `[Live Chat] ${cleanProduct}`,
      message: String(message).trim(),
      product: cleanProduct,
      isChat: true,
    });

    try {
      await insertDbMessage(newMsg);
    } catch (err) {
      console.error('Failed to write chat message to Cloud SQL:', err);
    }

    let isOnline = true;
    try {
      const dbSettings = await getDbSettings();
      if (dbSettings) {
        isOnline = dbSettings.isOnline !== false;
      } else {
        const settings = db.getSettings();
        isOnline = settings.isOnline !== false;
      }
    } catch {
      const settings = db.getSettings();
      isOnline = settings.isOnline !== false;
    }

    const autoReply = isOnline
      ? "Thanks for reaching out! Zohair is currently active online and has received your message. If you provided an email, you will also receive a direct response shortly."
      : "Thanks! Zohair is currently offline, but your message has been logged in his priority inbox. Make sure to provide your email so he can reply promptly!";

    res.status(201).json({
      success: true,
      message: 'Message delivered to Zohair.',
      data: newMsg,
      autoReply,
    });
  });

  // Public: Retrieve chat history for visitor or thread
  app.get('/api/chat', async (req: Request, res: Response) => {
    const { email } = req.query;
    let all: any[] = [];
    try {
      all = await getDbMessages();
    } catch (err) {
      all = db.getMessages();
    }
    const chatMsgs = all.filter((m) => m.isChat);

    if (email && typeof email === 'string' && email.includes('@') && email !== 'anonymous@visitor.local') {
      return res.json(chatMsgs.filter((m) => m.email.toLowerCase() === email.toLowerCase()));
    }

    // Return last 20 chat messages
    res.json(chatMsgs.slice(0, 20));
  });

  // Admin: Get all messages
  app.get('/api/messages', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      const messages = await getDbMessages();
      res.json(messages);
    } catch (err) {
      console.error('Database query fallback for messages:', err);
      const fallback = db.getMessages();
      res.json(fallback);
    }
  });

  // Admin: Update message status
  app.patch('/api/messages/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!['New', 'Read', 'Replied', 'Archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid message status value.' });
    }

    const updated = db.updateMessageStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    try {
      await updateDbMessageStatus(req.params.id, status);
    } catch (err) {
      console.error('Failed to update message status in Cloud SQL:', err);
    }

    res.json(updated);
  });

  // Admin: Delete message
  app.delete('/api/messages/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const deleted = db.deleteMessage(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    try {
      await deleteDbMessage(req.params.id);
    } catch (err) {
      console.error('Failed to delete message from Cloud SQL:', err);
    }

    res.json({ success: true, message: 'Message deleted successfully.' });
  });

  // ==========================================
  // SETTINGS ROUTES
  // ==========================================

  // Public: Get site settings
  app.get('/api/settings', async (_req: Request, res: Response) => {
    try {
      const settings = await getDbSettings();
      if (settings) {
        return res.json(settings);
      }
      res.json(db.getSettings());
    } catch (err) {
      console.error('Database query fallback for settings:', err);
      res.json(db.getSettings());
    }
  });

  // Admin: Update site settings
  app.put('/api/settings', requireAdminAuth, async (req: Request, res: Response) => {
    const updated = db.updateSettings(req.body);
    try {
      await upsertDbSettings(updated);
    } catch (err) {
      console.error('Failed to write settings to Cloud SQL:', err);
    }
    res.json(updated);
  });

  // ==========================================
  // FILE UPLOAD ROUTE (Admin)
  // ==========================================
  app.post('/api/upload', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Valid base64 image dataUrl required.' });
      }

      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: 'Malformed base64 image data.' });
      }

      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1].replace('svg+xml', 'svg');
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const safeName = `${Date.now()}-${(filename || 'image').replace(/[^a-zA-Z0-9_-]/g, '')}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeName}`;

      res.json({ url: publicUrl });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to process uploaded image.' });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE OR STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zohair Portfolio & Admin Server running at http://localhost:${PORT}`);
  });
}

startServer();
