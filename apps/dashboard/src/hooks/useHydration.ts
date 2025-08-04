import { useEffect, useState } from 'react';

/**
 * Hook para lidar com problemas de hidratação
 * Garante que componentes que dependem de valores client-side
 * só renderizem após a hidratação estar completa
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook para valores que podem causar mismatch de hidratação
 * Retorna um valor padrão durante SSR e o valor real após hidratação
 */
export function useClientValue<T>(
  clientValue: () => T,
  defaultValue: T
): T {
  const isHydrated = useHydration();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isHydrated) {
      setValue(clientValue());
    }
  }, [isHydrated, clientValue]);

  return isHydrated ? value : defaultValue;
}

/**
 * Hook para IDs únicos que não causem mismatch de hidratação
 */
export function useUniqueId(prefix: string = 'id'): string {
  return useClientValue(
    () => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
    `${prefix}-ssr`
  );
}
