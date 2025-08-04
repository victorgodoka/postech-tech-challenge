// lib/api.ts
import { getDB } from './db';
import { hashPassword, createSession } from "@/utils";
import { populateDB } from './populate';
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
  const accountId = 'e157be93-3ae6-4f13-997e-bae923f5b1ba';

  await db.put("users", { ...user, password: hashed, id: accountId });
  await db.put("accounts", { id: accountId, balance: 0, balanceVisible: true, type: "corrente", name: user.name, updatedAt: new Date().toISOString() });
  await populateDB();
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

type Transaction = { accountId: string; value: number; type: string; date: string };

async function updateAccountBalance(accountId: string) {
  const db = await getDB();
  // Get all transactions for this account
  const allTransactions = await db.getAll('transactions');
  const balance = allTransactions
    .filter((tx: Transaction) => tx.accountId === accountId)
    .reduce((sum: number, tx: Transaction) => sum + tx.value, 0);
  const account = await db.get('accounts', accountId);
  if (account) {
    account.balance = balance;
    account.updatedAt = new Date().toISOString();
    await db.put('accounts', account);
  }
}

export async function deleteTransactionById(id: string) {
  const db = await getDB();
  const transaction = await db.get('transactions', id);
  await db.delete('transactions', id);
  if (transaction && transaction.accountId) {
    await updateAccountBalance(transaction.accountId);
  }
}

export async function updateTransactionValueById(id: string, newValue: number) {
  const db = await getDB();
  const transaction = await db.get('transactions', id);
  if (!transaction) throw new Error('Transaction not found');
  transaction.value = newValue;
  transaction.type = newValue < 0 ? 'Saque' : 'Depósito';
  await db.put('transactions', transaction);
  if (transaction.accountId) {
    await updateAccountBalance(transaction.accountId);
  }
}

export async function addTransaction(transaction: { accountId: string, type: string, value: number, date: string, category?: string, description?: string, id?: string }) {
  const db = await getDB();
  const id = transaction.id || uuid();
  await db.put('transactions', { ...transaction, id });
  if (transaction.accountId) {
    await updateAccountBalance(transaction.accountId);
  }
  return { ...transaction, id };
}

export async function updateTransactionById(id: string, data: { accountId: string, type: string, value: number, date: string }) {
  const db = await getDB();
  const transaction = await db.get('transactions', id);
  if (!transaction) throw new Error('Transaction not found');
  const updatedTransaction = { ...transaction, ...data, id };
  await db.put('transactions', updatedTransaction);
  if (updatedTransaction.accountId) {
    await updateAccountBalance(updatedTransaction.accountId);
  }
}
