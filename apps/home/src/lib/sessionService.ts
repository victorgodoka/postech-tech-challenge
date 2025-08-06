// lib/sessionService.ts
import { getDB } from './db';

export interface Session {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

// Salvar sessão no IndexedDB
export async function saveSessionToIDB(session: Session): Promise<void> {
  try {
    const db = await getDB();
    await db.put('sessions', session);
    console.log('Sessão salva no IndexedDB:', session.id);
  } catch (error) {
    console.error('Erro ao salvar sessão no IndexedDB:', error);
  }
}

// Buscar sessão ativa no IndexedDB
export async function getActiveSessionFromIDB(): Promise<Session | null> {
  try {
    const db = await getDB();
    const sessions = await db.getAll('sessions');
    
    // Buscar sessão válida (não expirada)
    const now = Date.now();
    const activeSession = sessions.find(session => session.expiresAt > now);
    
    if (activeSession) {
      console.log('Sessão ativa encontrada no IndexedDB:', activeSession.id);
      return activeSession;
    }
    
    // Limpar sessões expiradas
    await clearExpiredSessions();
    return null;
  } catch (error) {
    console.error('Erro ao buscar sessão no IndexedDB:', error);
    return null;
  }
}

// Limpar sessão específica do IndexedDB
export async function clearSessionFromIDB(sessionId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('sessions', sessionId);
    console.log('Sessão removida do IndexedDB:', sessionId);
  } catch (error) {
    console.error('Erro ao remover sessão do IndexedDB:', error);
  }
}

// Limpar todas as sessões do IndexedDB
export async function clearAllSessionsFromIDB(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('sessions');
    console.log('Todas as sessões removidas do IndexedDB');
  } catch (error) {
    console.error('Erro ao limpar sessões do IndexedDB:', error);
  }
}

// Limpar sessões expiradas
export async function clearExpiredSessions(): Promise<void> {
  try {
    const db = await getDB();
    const sessions = await db.getAll('sessions');
    const now = Date.now();
    
    const expiredSessions = sessions.filter(session => session.expiresAt <= now);
    
    for (const session of expiredSessions) {
      await db.delete('sessions', session.id);
    }
    
    if (expiredSessions.length > 0) {
      console.log(`${expiredSessions.length} sessões expiradas removidas do IndexedDB`);
    }
  } catch (error) {
    console.error('Erro ao limpar sessões expiradas:', error);
  }
}

// Gerar token único
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Criar nova sessão
export function createSessionData(userId: string, email: string): Session {
  return {
    id: generateToken(),
    userId,
    email,
    token: generateToken(),
    expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutos
    createdAt: Date.now()
  };
}
