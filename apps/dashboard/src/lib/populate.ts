import { getDB } from './db';
import { v4 as uuid } from 'uuid';

export const populateDB = async () => {
  const db = await getDB();
  const accountId = 'e157be93-3ae6-4f13-997e-bae923f5b1ba';
  
  // Verificar se já existem dados para evitar duplicação
  const existingTransactions = await db.getAll('transactions');
  if (existingTransactions.length > 0) {
    console.log('📊 Dados já existem no IndexedDB, pulando população.');
    return;
  }

  // Categorias realistas com probabilidades e valores típicos
  const expenseCategories = [
    { name: 'Alimentação', probability: 0.25, minValue: 15, maxValue: 150 },
    { name: 'Transporte', probability: 0.15, minValue: 5, maxValue: 80 },
    { name: 'Supermercado', probability: 0.12, minValue: 30, maxValue: 300 },
    { name: 'Lazer', probability: 0.10, minValue: 20, maxValue: 200 },
    { name: 'Saúde', probability: 0.08, minValue: 25, maxValue: 500 },
    { name: 'Educação', probability: 0.06, minValue: 50, maxValue: 800 },
    { name: 'Casa', probability: 0.08, minValue: 40, maxValue: 600 },
    { name: 'Roupas', probability: 0.05, minValue: 30, maxValue: 400 },
    { name: 'Tecnologia', probability: 0.04, minValue: 100, maxValue: 2000 },
    { name: 'Outros', probability: 0.07, minValue: 10, maxValue: 300 }
  ];

  const incomeCategories = [
    { name: 'Salário', probability: 0.60, minValue: 2000, maxValue: 8000 },
    { name: 'Freelance', probability: 0.20, minValue: 300, maxValue: 2000 },
    { name: 'Investimentos', probability: 0.10, minValue: 100, maxValue: 1500 },
    { name: 'Outros', probability: 0.10, minValue: 50, maxValue: 800 }
  ];

  const getRandomCategory = (categories: typeof expenseCategories) => {
    const random = Math.random();
    let accumulated = 0;
    for (const category of categories) {
      accumulated += category.probability;
      if (random <= accumulated) {
        return category;
      }
    }
    return categories[categories.length - 1];
  };

  const getRandomValue = (min: number, max: number) => {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  };

  const transactions = [];
  const today = new Date();
  const startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 dias atrás

  // Gerar transações para cada dia dos últimos 90 dias
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);
    const formattedDate = currentDate.toISOString().slice(0, 10);
    
    // Número aleatório de transações por dia (4-10)
    const dailyTransactionCount = Math.floor(Math.random() * 7) + 4;
    
    // Probabilidade maior de receitas nos primeiros dias do mês (salário)
    const dayOfMonth = currentDate.getDate();
    const isPayday = dayOfMonth <= 5;
    const incomeChance = isPayday ? 0.3 : 0.1;
    
    for (let i = 0; i < dailyTransactionCount; i++) {
      const isIncome = Math.random() < incomeChance;
      
      if (isIncome) {
        const category = getRandomCategory(incomeCategories);
        const value = getRandomValue(category.minValue, category.maxValue);
        
        transactions.push({
          id: uuid(),
          accountId,
          type: 'Depósito',
          value: value,
          date: formattedDate,
          category: category.name
        });
      } else {
        const category = getRandomCategory(expenseCategories);
        const value = getRandomValue(category.minValue, category.maxValue);
        
        transactions.push({
          id: uuid(),
          accountId,
          type: 'Saque',
          value: -value,
          date: formattedDate,
          category: category.name
        });
      }
    }
  }

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
