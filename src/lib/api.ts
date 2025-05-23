// lib/api.ts
import { getDB } from './db';
import { hashPassword, createSession } from "@/utils";
import { v4 as uuid } from 'uuid';

export type User = {
  id?: string;
  name: string;
  email: string;
  password: string
}

export async function createUser(user: User) {
  const db = await getDB();

  const existing = await getUserByEmail(user.email);
  if (existing) {
    throw new Error("E-mail já cadastrado.");
  }

  const hashed = await hashPassword(user.password);
  await db.put("users", { ...user, password: hashed, id: uuid() });
}

export async function getUserByEmail(email: string) {
  const db = await getDB();
  return await db.get('users', email);
}

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("Usuário não encontrado.");

  const hashed = await hashPassword(password);
  if (user.password !== hashed) throw new Error("Senha incorreta.");

  createSession(email, user.id!);

  return user;
}
