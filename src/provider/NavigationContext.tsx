'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface NavigationContextProps {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export function NavigationProvider({ children }: { readonly children: ReactNode }): ReactNode {
  const [loading, setLoading] = useState(false);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const contextValue = useMemo(() => {
    return { loading, startLoading, stopLoading };
  }, [loading, startLoading, stopLoading]);

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationContextProps {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
}
