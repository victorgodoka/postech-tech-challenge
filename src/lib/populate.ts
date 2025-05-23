import { getDB } from './db';
import { v4 as uuid } from 'uuid';

export const populateDB = async () => {
  const db = await getDB();

  // await db.put('users', {
  //   email: 'oi@oi.com.br',
  //   name: 'Victor',
  // });

  // await db.put('accounts', {
  //   id: "62883312-b758-40c9-a103-12a07bd688f6",
  //   name: 'Victor',
  //   balance: 15674891,
  //   balanceVisible: false,
  //   type: 'Conta Corrente',
  //   updatedAt: new Date().toISOString(),
  // });

  const transactions = [
    {
      id: uuid(),
      accountId: "62883312-b758-40c9-a103-12a07bd688f6",
      type: 'Depósito',
      value: 150,
      date: '2022-11-18',
    },
    {
      id: uuid(),
      accountId: "62883312-b758-40c9-a103-12a07bd688f6",
      type: 'Depósito',
      value: 100,
      date: '2022-11-21',
    },
    {
      id: uuid(),
      accountId: "62883312-b758-40c9-a103-12a07bd688f6",
      type: 'Depósito',
      value: 50,
      date: '2022-11-21',
    },
    {
      id: uuid(),
      accountId: "62883312-b758-40c9-a103-12a07bd688f6",
      type: 'Transferência',
      value: -500,
      date: '2022-11-21',
    },
  ];

  for (const tx of transactions) {
    await db.put('transactions', tx);
  }

  // const services = [
  //   { id: 'loan', label: 'Empréstimo', icon: 'loan', enabled: true, order: 1 },
  //   { id: 'cards', label: 'Meus cartões', icon: 'cards', enabled: true, order: 2 },
  //   { id: 'donations', label: 'Doações', icon: 'donations', enabled: true, order: 3 },
  //   { id: 'pix', label: 'Pix', icon: 'pix', enabled: true, order: 4 },
  //   { id: 'insurance', label: 'Seguros', icon: 'insurance', enabled: true, order: 5 },
  //   { id: 'cell', label: 'Crédito celular', icon: 'cell', enabled: true, order: 6 },
  // ];

  // for (const service of services) {
  //   await db.put('services', service);
  // }

  console.log('🌱 IndexedDB populado com sucesso.');
};
