import { getDB } from './db';
import { v4 as uuid } from 'uuid';

export const populateDB = async () => {
  const db = await getDB();
  const accountId = 'e157be93-3ae6-4f13-997e-bae923f5b1ba';

  const transactions = Array.from({ length: 100 }, () => {
    // Generate a random date between 2025-05-01 and 2025-05-20
    const start = new Date('2025-05-01').getTime();
    const end = new Date('2025-05-20').getTime();
    const randomDate = new Date(start + Math.random() * (end - start));
    const formattedDate = randomDate.toISOString().slice(0, 10);
    const negativeOrPositive = Math.random() < 0.5 ? -1 : 1;
    return {
      id: uuid(),
      accountId,
      type: negativeOrPositive === 1 ? 'Depósito' : 'Saque',
      value: Math.random() * 10000 * negativeOrPositive,
      date: formattedDate,
    };
  });

  // Order transactions by date descending (most recent first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const tx of transactions) {
    await db.put('transactions', tx);
  }

  const services = [
    { id: 'loan', label: 'Empréstimo', icon: 'loan', enabled: true, order: 1 },
    { id: 'cards', label: 'Meus cartões', icon: 'cards', enabled: true, order: 2 },
    { id: 'donations', label: 'Doações', icon: 'donations', enabled: true, order: 3 },
    { id: 'pix', label: 'Pix', icon: 'pix', enabled: true, order: 4 },
    { id: 'insurance', label: 'Seguros', icon: 'insurance', enabled: true, order: 5 },
    { id: 'cell', label: 'Crédito celular', icon: 'cell', enabled: true, order: 6 },
  ];

  for (const service of services) {
    await db.put('services', service);
  }

  // Calculate the balance for the account 'e157be93-3ae6-4f13-997e-bae923f5b1ba'
  const balance = transactions
    .filter(tx => tx.accountId === accountId)
    .reduce((sum, tx) => sum + tx.value, 0);

  // Update the account with the new balance
  await db.put('accounts', {
    id: accountId,
    name: 'Conta Teste',
    balance,
    balanceVisible: true,
    type: 'Conta Corrente',
    updatedAt: new Date().toISOString(),
  });

  console.log('🌱 IndexedDB populado com sucesso.');
};
