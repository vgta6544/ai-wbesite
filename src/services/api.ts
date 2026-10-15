import { Project, Service, ContactMessage, SiteSettings } from '../types.js';

const TOKEN_KEY = 'zohair_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function clearAdminToken(): void {
  removeAdminToken();
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ================= PROJECTS API =================
export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create project');
  }
  return res.json();
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update project');
  }
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete project');
  }
}

// ================= SERVICES API =================
export async function fetchServices(): Promise<Service[]> {
  const res = await fetch('/api/services');
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function createService(data: Partial<Service>): Promise<Service> {
  const res = await fetch('/api/services', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create service');
  }
  return res.json();
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  const res = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update service');
  }
  return res.json();
}

export async function deleteService(id: string): Promise<void> {
  const res = await fetch(`/api/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete service');
  }
}

// ================= MESSAGES API =================
export async function sendMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  product?: string;
  isChat?: boolean;
  honeypot?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Failed to send message');
  }
  return body;
}

export async function sendChatMessage(data: {
  name?: string;
  email?: string;
  product?: string;
  message: string;
  isAnonymous?: boolean;
}): Promise<{ success: boolean; message: string; data: ContactMessage; autoReply?: string }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Failed to send chat message');
  }
  return body;
}

export async function fetchChatMessages(visitorEmail?: string): Promise<ContactMessage[]> {
  const url = visitorEmail ? `/api/chat?email=${encodeURIComponent(visitorEmail)}` : '/api/chat';
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const res = await fetch('/api/messages', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch messages');
  }
  return res.json();
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
  const res = await fetch(`/api/messages/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update message status');
  }
  return res.json();
}

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete message');
  }
}

// ================= SETTINGS API =================
export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update settings');
  }
  return res.json();
}

export const updateSiteSettings = updateSettings;

// ================= AUTH API =================
export async function fetchAuthStatus(): Promise<{
  locked: boolean;
  remainingAttempts: number;
  lockoutSeconds: number;
  authorizedEmailHint: string;
  authorizedEmailFull: string;
}> {
  const res = await fetch('/api/auth/status');
  return res.json();
}

export async function verifyGoogleAuth(email: string, name?: string, picture?: string): Promise<{
  success: boolean;
  user?: any;
  nextStep?: string;
  error?: string;
}> {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, picture }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Google authentication failed');
  }
  return body;
}

export async function verifyAdminPin(pin: string): Promise<{
  success: boolean;
  token: string;
}> {
  const res = await fetch('/api/auth/pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'PIN verification failed');
  }
  return body;
}

export async function verifySession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/auth/verify', {
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAdminUser(): Promise<{ email: string; role: string; name: string } | null> {
  const token = getAdminToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/verify', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function updateAdminPin(currentPin: string, newPin: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/auth/pin/update', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPin, newPin }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update PIN');
  }
  return data;
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } finally {
    removeAdminToken();
  }
}

// ================= UPLOAD API =================
export async function uploadImage(dataUrl: string, filename: string): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ dataUrl, filename }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Image upload failed');
  }
  return body.url;
}
