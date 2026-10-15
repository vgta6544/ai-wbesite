import { eq, desc, asc } from 'drizzle-orm';
import { db } from './index.ts';
import { projects, services, messages, siteSettings, users } from './schema.ts';
import { Project, Service, ContactMessage, SiteSettings, MessageStatus } from '../types.ts';

// ---------------------- PROJECTS ----------------------
export async function getDbProjects(): Promise<Project[]> {
  try {
    const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category as any,
      description: r.description,
      coverImage: r.coverImage,
      images: JSON.parse(r.images || '[]'),
      videoUrl: r.videoUrl || undefined,
      tools: JSON.parse(r.tools || '[]'),
      projectDate: r.projectDate,
      client: r.client || undefined,
      featured: r.featured,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to query projects from database:', error);
    throw new Error('Database query for projects failed', { cause: error });
  }
}

export async function insertDbProject(project: Project): Promise<Project> {
  try {
    await db.insert(projects).values({
      id: project.id,
      title: project.title,
      category: project.category,
      description: project.description,
      coverImage: project.coverImage,
      images: JSON.stringify(project.images || []),
      videoUrl: project.videoUrl || null,
      tools: JSON.stringify(project.tools || []),
      projectDate: project.projectDate,
      client: project.client || null,
      featured: project.featured,
      sortOrder: project.sortOrder,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
    return project;
  } catch (error) {
    console.error('Failed to insert project into database:', error);
    throw new Error('Database insert for project failed', { cause: error });
  }
}

export async function updateDbProject(id: string, updates: Partial<Project>): Promise<void> {
  try {
    const val: any = { updatedAt: new Date().toISOString() };
    if (updates.title !== undefined) val.title = updates.title;
    if (updates.category !== undefined) val.category = updates.category;
    if (updates.description !== undefined) val.description = updates.description;
    if (updates.coverImage !== undefined) val.coverImage = updates.coverImage;
    if (updates.images !== undefined) val.images = JSON.stringify(updates.images);
    if (updates.videoUrl !== undefined) val.videoUrl = updates.videoUrl || null;
    if (updates.tools !== undefined) val.tools = JSON.stringify(updates.tools);
    if (updates.projectDate !== undefined) val.projectDate = updates.projectDate;
    if (updates.client !== undefined) val.client = updates.client || null;
    if (updates.featured !== undefined) val.featured = updates.featured;
    if (updates.sortOrder !== undefined) val.sortOrder = updates.sortOrder;

    await db.update(projects).set(val).where(eq(projects.id, id));
  } catch (error) {
    console.error('Failed to update project in database:', error);
    throw new Error('Database update for project failed', { cause: error });
  }
}

export async function deleteDbProject(id: string): Promise<void> {
  try {
    await db.delete(projects).where(eq(projects.id, id));
  } catch (error) {
    console.error('Failed to delete project from database:', error);
    throw new Error('Database delete for project failed', { cause: error });
  }
}

// ---------------------- SERVICES ----------------------
export async function getDbServices(): Promise<Service[]> {
  try {
    const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      icon: r.icon,
      enabled: r.enabled,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to query services from database:', error);
    throw new Error('Database query for services failed', { cause: error });
  }
}

export async function insertDbService(service: Service): Promise<Service> {
  try {
    await db.insert(services).values({
      id: service.id,
      title: service.title,
      description: service.description,
      icon: service.icon,
      enabled: service.enabled,
      sortOrder: service.sortOrder,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    });
    return service;
  } catch (error) {
    console.error('Failed to insert service into database:', error);
    throw new Error('Database insert for service failed', { cause: error });
  }
}

export async function updateDbService(id: string, updates: Partial<Service>): Promise<void> {
  try {
    const val: any = { updatedAt: new Date().toISOString() };
    if (updates.title !== undefined) val.title = updates.title;
    if (updates.description !== undefined) val.description = updates.description;
    if (updates.icon !== undefined) val.icon = updates.icon;
    if (updates.enabled !== undefined) val.enabled = updates.enabled;
    if (updates.sortOrder !== undefined) val.sortOrder = updates.sortOrder;

    await db.update(services).set(val).where(eq(services.id, id));
  } catch (error) {
    console.error('Failed to update service in database:', error);
    throw new Error('Database update for service failed', { cause: error });
  }
}

export async function deleteDbService(id: string): Promise<void> {
  try {
    await db.delete(services).where(eq(services.id, id));
  } catch (error) {
    console.error('Failed to delete service from database:', error);
    throw new Error('Database delete for service failed', { cause: error });
  }
}

// ---------------------- MESSAGES ----------------------
export async function getDbMessages(): Promise<ContactMessage[]> {
  try {
    const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      message: r.message,
      product: r.product || undefined,
      isChat: r.isChat,
      status: r.status as MessageStatus,
      createdAt: r.createdAt,
    }));
  } catch (error) {
    console.error('Failed to query messages from database:', error);
    throw new Error('Database query for messages failed', { cause: error });
  }
}

export async function insertDbMessage(message: ContactMessage): Promise<ContactMessage> {
  try {
    await db.insert(messages).values({
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      product: message.product || null,
      isChat: message.isChat || false,
      status: message.status || 'New',
      createdAt: message.createdAt,
    });
    return message;
  } catch (error) {
    console.error('Failed to insert message into database:', error);
    throw new Error('Database insert for message failed', { cause: error });
  }
}

export async function updateDbMessageStatus(id: string, status: MessageStatus): Promise<void> {
  try {
    await db.update(messages).set({ status }).where(eq(messages.id, id));
  } catch (error) {
    console.error('Failed to update message status in database:', error);
    throw new Error('Database update for message status failed', { cause: error });
  }
}

export async function deleteDbMessage(id: string): Promise<void> {
  try {
    await db.delete(messages).where(eq(messages.id, id));
  } catch (error) {
    console.error('Failed to delete message from database:', error);
    throw new Error('Database delete for message failed', { cause: error });
  }
}

// ---------------------- SITE SETTINGS ----------------------
export async function getDbSettings(): Promise<SiteSettings | null> {
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 'default'));
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.id,
      siteTitle: r.siteTitle,
      professionalTitle: r.professionalTitle,
      heroTitle: r.heroTitle,
      heroSubtitle: r.heroSubtitle,
      heroDescription: r.heroDescription,
      primaryCta: r.primaryCta,
      secondaryCta: r.secondaryCta,
      bio: r.bio,
      email: r.email,
      whatsapp: r.whatsapp,
      location: r.location,
      availabilityStatus: r.availabilityStatus,
      isOnline: r.isOnline,
      socialLinks: JSON.parse(r.socialLinks || '{}'),
      footerText: r.footerText,
      updatedAt: r.updatedAt,
    };
  } catch (error) {
    console.error('Failed to query site settings from database:', error);
    throw new Error('Database query for site settings failed', { cause: error });
  }
}

export async function upsertDbSettings(settings: SiteSettings): Promise<SiteSettings> {
  try {
    const payload = {
      id: 'default',
      siteTitle: settings.siteTitle,
      professionalTitle: settings.professionalTitle,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroDescription: settings.heroDescription,
      primaryCta: settings.primaryCta,
      secondaryCta: settings.secondaryCta,
      bio: settings.bio,
      email: settings.email,
      whatsapp: settings.whatsapp,
      location: settings.location,
      availabilityStatus: settings.availabilityStatus,
      isOnline: settings.isOnline,
      socialLinks: JSON.stringify(settings.socialLinks || {}),
      footerText: settings.footerText,
      updatedAt: new Date().toISOString(),
    };

    const existing = await db.select().from(siteSettings).where(eq(siteSettings.id, 'default'));
    if (existing.length > 0) {
      await db.update(siteSettings).set(payload).where(eq(siteSettings.id, 'default'));
    } else {
      await db.insert(siteSettings).values(payload);
    }
    return settings;
  } catch (error) {
    console.error('Failed to upsert site settings in database:', error);
    throw new Error('Database upsert for site settings failed', { cause: error });
  }
}

// ---------------------- USERS ----------------------
export async function getOrCreateDbUser(uid: string, email: string, name?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name: name || null,
        role: 'admin',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to get or create user in database:', error);
    throw new Error('Database user registration failed', { cause: error });
  }
}

// ---------------------- SEEDING ----------------------
export async function seedDatabaseIfEmpty(defaults: {
  projects: Project[];
  services: Service[];
  messages: ContactMessage[];
  settings: SiteSettings;
}) {
  try {
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length === 0 && defaults.projects.length > 0) {
      console.log('Seeding projects to Cloud SQL database...');
      for (const p of defaults.projects) {
        await insertDbProject(p);
      }
    }

    const existingServices = await db.select().from(services);
    if (existingServices.length === 0 && defaults.services.length > 0) {
      console.log('Seeding services to Cloud SQL database...');
      for (const s of defaults.services) {
        await insertDbService(s);
      }
    }

    const existingSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, 'default'));
    if (existingSettings.length === 0 && defaults.settings) {
      console.log('Seeding site settings to Cloud SQL database...');
      await upsertDbSettings(defaults.settings);
    }
  } catch (error) {
    console.error('Non-blocking seed error:', error);
  }
}
