
'use client';

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export type Session = {
  id: string;
  email: string;
  token: string;
  expiresAt: number;
};

const SESSION_KEY = "bank-app-session";

export function createSession(email: string, id: string, durationMinutes = 30): Session {
  const now = Date.now();
  const expiresAt = now + durationMinutes * 60 * 1000;
  const token = crypto.randomUUID();

  const session: Session = { email, token, expiresAt, id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as Session;
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function setSessionCookie(session: Session) {
  const encoded = btoa(JSON.stringify(session));
  document.cookie = `session=${encoded}; path=/; max-age=1800; SameSite=Lax`;
}

export function removeSessionCookie() {
  document.cookie = "session=; path=/; max-age=0";
}

export function getSessionCookie(): Session | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("session="));

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.split("=")[1]) as Session;
  } catch {
    return null;
  }
}
