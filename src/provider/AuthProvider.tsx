'use client';
import { getRefresh } from '@/config/apiConfig';
import axiosInstance from '@/config/axios';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type User = Record<string, unknown>;

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  setTokenDetails: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: React.ReactNode }): ReactNode {
  const [user, setUser] = useState<User | null>({});
  const [tokenDetails, setTokenDetails] = useState({
    token: null,
    refreshToken: null,
  });
  const contextValue = useMemo(() => {
    return { user, setUser, tokenDetails, setTokenDetails };
  }, [user, tokenDetails]);


  useEffect(() => {
    const token = sessionStorage?.getItem('token');
    const refreshToken = sessionStorage?.getItem('refreshToken');
    setTokenDetails({ token, refreshToken });
  }, []);

  useEffect(() => {
    console.log('userAuth', user);
    console.log(tokenDetails);
    if (tokenDetails?.token && tokenDetails?.refreshToken) {
      console.log('Token,', tokenDetails?.token);
      sessionStorage.setItem('token', tokenDetails.token);
      sessionStorage.setItem('refreshToken', tokenDetails.refreshToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokenDetails.token}`;
      axiosInstance.defaults.headers.common['instnId'] = 1;
      axiosInstance.defaults.headers.common['channel'] = '01';

    } else {
      console.log('else');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
    }
  }, [user, tokenDetails]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
