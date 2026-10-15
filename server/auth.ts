import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Secure configuration
const AUTHORIZED_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'vgta6544@gmail.com').toLowerCase().trim();
let runtimeAdminPin = process.env.ADMIN_PIN || '0620';

export function updateRuntimePin(currentPin: string, newPin: string): { success: boolean; error?: string } {
  if (currentPin.trim() !== runtimeAdminPin.trim()) {
    return { success: false, error: 'Current PIN is incorrect.' };
  }
  if (newPin.trim().length < 4 || newPin.trim().length > 6) {
    return { success: false, error: 'New PIN must be between 4 and 6 digits.' };
  }
  runtimeAdminPin = newPin.trim();
  return { success: true };
}

// Active in-memory session tokens
const activeSessions = new Map<
  string,
  {
    email: string;
    expiresAt: number;
    createdAt: number;
  }
>();

// Failed attempt rate-limiting per IP
interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

const MAX_PIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export function checkRateLimit(ip: string): { locked: boolean; remainingAttempts: number; lockoutSeconds: number } {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record) {
    return { locked: false, remainingAttempts: MAX_PIN_ATTEMPTS, lockoutSeconds: 0 };
  }

  if (record.lockoutUntil > now) {
    const lockoutSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { locked: true, remainingAttempts: 0, lockoutSeconds };
  }

  // If lockout expired, reset
  if (record.lockoutUntil > 0 && record.lockoutUntil <= now) {
    rateLimits.delete(ip);
    return { locked: false, remainingAttempts: MAX_PIN_ATTEMPTS, lockoutSeconds: 0 };
  }

  const remaining = Math.max(0, MAX_PIN_ATTEMPTS - record.attempts);
  return { locked: false, remainingAttempts: remaining, lockoutSeconds: 0 };
}

export function recordFailedAttempt(ip: string): { locked: boolean; remainingAttempts: number; lockoutSeconds: number } {
  const now = Date.now();
  let record = rateLimits.get(ip);
  if (!record || (record.lockoutUntil > 0 && record.lockoutUntil <= now)) {
    record = { attempts: 1, lockoutUntil: 0 };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= MAX_PIN_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_DURATION_MS;
    rateLimits.set(ip, record);
    return { locked: true, remainingAttempts: 0, lockoutSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  rateLimits.set(ip, record);
  return {
    locked: false,
    remainingAttempts: MAX_PIN_ATTEMPTS - record.attempts,
    lockoutSeconds: 0,
  };
}

export function resetRateLimit(ip: string) {
  rateLimits.delete(ip);
}

export function verifyGoogleAccount(email: string): { authorized: boolean; reason?: string } {
  const normalized = (email || '').toLowerCase().trim();
  if (!normalized) {
    return { authorized: false, reason: 'Email is required' };
  }

  if (normalized !== AUTHORIZED_ADMIN_EMAIL) {
    return {
      authorized: false,
      reason: `Account (${normalized}) is not authorized. Access is strictly restricted to the registered administrator.`,
    };
  }

  return { authorized: true };
}

export function verifyPin(pin: string, ip: string): { success: boolean; sessionToken?: string; error?: string } {
  const rateStatus = checkRateLimit(ip);
  if (rateStatus.locked) {
    return {
      success: false,
      error: `Too many failed attempts. Security lockout active for ${rateStatus.lockoutSeconds} seconds.`,
    };
  }

  const cleanInput = (pin || '').trim();
  const cleanTarget = runtimeAdminPin.trim();

  // Timing safe comparison to prevent timing attacks
  const match =
    cleanInput.length === cleanTarget.length &&
    crypto.timingSafeEqual(Buffer.from(cleanInput), Buffer.from(cleanTarget));

  if (!match) {
    const failed = recordFailedAttempt(ip);
    if (failed.locked) {
      return {
        success: false,
        error: `Invalid PIN. Maximum attempts exceeded. Security lockout active for ${failed.lockoutSeconds} seconds.`,
      };
    }
    return {
      success: false,
      error: `Invalid Admin PIN. ${failed.remainingAttempts} attempt${failed.remainingAttempts === 1 ? '' : 's'} remaining before temporary security lockout.`,
    };
  }

  // Success: reset rate limits and generate session token
  resetRateLimit(ip);
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  activeSessions.set(token, {
    email: AUTHORIZED_ADMIN_EMAIL,
    expiresAt,
    createdAt: Date.now(),
  });

  return { success: true, sessionToken: token };
}

export function validateSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;

  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

export function invalidateSession(token: string | undefined): void {
  if (token) {
    activeSessions.delete(token);
  }
}

// Express authentication middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!validateSessionToken(token)) {
    return res.status(401).json({
      error: 'Unauthorized: Valid administrator session token required.',
    });
  }

  next();
}

export function getAuthorizedEmail(): string {
  return AUTHORIZED_ADMIN_EMAIL;
}
