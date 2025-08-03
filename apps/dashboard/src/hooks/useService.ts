import { useEffect, useState } from 'react';
import { getDB } from '../lib/db';

export type Services = {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  order: number;
};

export const useServices = () => {
  const [services, setServices] = useState<Services[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const db = await getDB();
      const all = await db.getAll('services');
      const enabled = all
        .filter((s: Services) => s.enabled)
        .sort((a, b) => a.order - b.order);
      setServices(enabled);
    };
    fetch();
  }, []);

  return services;
};
