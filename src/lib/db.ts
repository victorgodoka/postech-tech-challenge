// lib/db.ts
import { openDB } from 'idb';

export const getDB = () => {
  return openDB('bank-app', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' });
      }
    },
  });
};
