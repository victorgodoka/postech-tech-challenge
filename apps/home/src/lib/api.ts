// lib/api.ts
import { getDB } from './db';
import { populateDB } from './populate';
import { v4 as uuid } from 'uuid';

export type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export type Account = {
  id: string;
  balance: number;
  balanceVisible: boolean;
  type: string;
  name: string;
  updatedAt: string;
}
const accountId = 'e157be93-3ae6-4f13-997e-bae923f5b1ba';

// Função para hash simples da senha (em produção usar bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createUser(user: User): Promise<User> {
  const db = await getDB();

  // Verificar se usuário já existe
  const existing = await getUserByEmail(user.email);
  if (existing) {
    throw new Error("E-mail já cadastrado.");
  }

  // Hash da senha
  const hashedPassword = await hashPassword(user.password);
  
  // Criar usuário
  const newUser = {
    ...user,
    id: accountId,
    password: hashedPassword
  };

  // Salvar usuário
  await db.put("users", newUser);
  
  // Criar conta associada
  const account: Account = {
    id: accountId,
    balance: 0,
    balanceVisible: true,
    type: "corrente",
    name: user.name,
    updatedAt: new Date().toISOString()
  };
  
  await db.put("accounts", account);
  
  // Popular banco com dados iniciais
  await populateDB();

  return { ...newUser, password: user.password }; // Retornar sem hash para o frontend
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDB();
  return await db.get('users', email);
}

export async function loginUser(email: string, password: string): Promise<User> {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const hashedPassword = await hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error("Senha incorreta.");
  }

  return user;
}

export async function getAllUsers(): Promise<User[]> {
  const db = await getDB();
  return await db.getAll('users');
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = await getDB();
  const allUsers = await db.getAll('users');
  return allUsers.find(user => user.id === id);
}

export async function getAccountById(id: string): Promise<Account | undefined> {
  const db = await getDB();
  return await db.get('accounts', id);
}
