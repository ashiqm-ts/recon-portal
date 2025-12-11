'use client';
import { getRefresh } from '@/config/apiConfig';
import axiosInstance from '@/config/axios';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';

const ResponseContext = createContext(undefined);

export function ResponseProvider({ children }: { readonly children: React.ReactNode }): ReactNode {
  const { tokenDetails, setTokenDetails,setUser } = useAuth();
  const { handleApiResponse } = useResponseHandler();
  const getTokenFromRefreshApi = async (refreshToken) => {
    // const refreshToken = sessionStorage?.getItem('refreshToken');
    const payload = {
      refreshToken,
    };
    const res = await getRefresh(payload);
    console.log(res.data.data);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
        axiosInstance.defaults.headers.common['instnId'] = 1;
        axiosInstance.defaults.headers.common['channel'] = '01';
        setUser(res.data.data);
        setTokenDetails({ token: res.data.data.token, refreshToken: res.data.data.refreshToken });
      },
    });
  };
  useEffect(() => {
    const refreshToken = sessionStorage?.getItem('refreshToken');
    if (refreshToken) {
      getTokenFromRefreshApi(refreshToken);
    }
  }, []);
  const contextValue = useMemo(() => {
    return { tokenDetails, setTokenDetails };
  }, [tokenDetails]);
  return <ResponseContext.Provider value={contextValue}>{children}</ResponseContext.Provider>;
}
