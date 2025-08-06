// lib/db.ts
import { openDB } from 'idb';

export const getDB = () => {
  return openDB('bank-app', 4, {
    upgrade(db, oldVersion) {
      // Criar stores básicos (versão 1)
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' });
      }

      if (!db.objectStoreNames.contains('accounts')) {
        db.createObjectStore('accounts', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('services')) {
        db.createObjectStore('services', { keyPath: 'id' });
      }

      // Adicionar store de metas financeiras (versão 2)
      if (oldVersion < 2 && !db.objectStoreNames.contains('financial-goals')) {
        const store = db.createObjectStore('financial-goals', { keyPath: 'id' });
        store.createIndex('category', 'category');
        store.createIndex('deadline', 'deadline');
      }

      // Adicionar store de anexos (versão 3)
      if (oldVersion < 3 && !db.objectStoreNames.contains('attachments')) {
        const store = db.createObjectStore('attachments', { keyPath: 'id' });
        store.createIndex('transactionId', 'transactionId');
        store.createIndex('uploadDate', 'uploadDate');
        store.createIndex('fileType', 'fileType');
      }

      // Adicionar store de sessões (versão 4)
      if (oldVersion < 4 && !db.objectStoreNames.contains('sessions')) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' });
        store.createIndex('userId', 'userId');
        store.createIndex('expiresAt', 'expiresAt');
      }
    },
  });
};
