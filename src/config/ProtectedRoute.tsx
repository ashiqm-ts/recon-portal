'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from './axios';
import { useDialog } from '@/provider/DialogProvider';
import { useAuth } from '@/provider/AuthProvider';
import { redirect } from 'next/navigation';
import { getRegenerate } from './apiConfig';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { handleLoader, handleResponse } = useDialog();
  const { handleApiResponse } = useResponseHandler();
  const { user, setTokenDetails, setUser } = useAuth();
  let pendingRequests = 0;
  const getRegenerateToken = async (payload) => {
    const res = await getRegenerate(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
        axiosInstance.defaults.headers.common['instnId'] = 1;
        axiosInstance.defaults.headers.common['channel'] = '01';
        setTokenDetails({ token: res.data.data.token, refreshToken: res.data.data.refreshToken });
      },
    });
  };
  const TokenExpiry = async () => {
    setTokenDetails({ token: null, refreshToken: null });
    delete axiosInstance.defaults.headers.common.Authorization;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('instnId');
    sessionStorage.removeItem('parentId');
    await redirect('/sign-in');
    handleResponse(true, 'Access Timeout: Please log in again to proceed');
  };

  const setupAxiosInterceptors = () => {
    const reqInterceptor = axiosInstance.interceptors.request.use((config) => {
      config.timeout = 80000;
      pendingRequests++;
      handleLoader(true);
      return config;
    });

    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        pendingRequests = Math.max(0, pendingRequests - 1);
        if (pendingRequests === 0) handleLoader(false);
        return response;
      },
      async (error) => {
        pendingRequests = Math.max(0, pendingRequests - 1);
        if (pendingRequests === 0) handleLoader(false);
        console.log('Session expired. Redirecting to login..."', error);

        const originalRequest = error.config;
        console.log('Original Req,', originalRequest);

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          handleLoader(false);
          console.log(error.config);
          originalRequest._retry = true;
          try {
            console.log('try block');
            delete axiosInstance.defaults.headers.common.Authorization;

            const refreshTokenFromSession = sessionStorage.getItem('refreshToken');
            console.log('try block 2');

            const data: { loginUserName: string; refreshToken: string } = {
              refreshToken: refreshTokenFromSession,
              loginUserName: user?.loginUsername,
            };
            if (refreshTokenFromSession !== null) {
              const res = await getRegenerateToken(data);
              console.log(res.data);
              if (res.data.responseCode === 0) {
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${res.data.data.token}`;
                setTokenDetails({ token: res?.data?.data?.token, refreshToken: res?.data?.data?.refreshToken });

                originalRequest.headers.Authorization = `Bearer ${res.data.data.token}`;
                return axiosInstance(originalRequest);
              } else if (res.data.responseCode === 197) {
                TokenExpiry();
              } else {
                TokenExpiry();
              }
            } else {
              console.log('Test');
              TokenExpiry();
            }
          } catch (err) {
            console.log('Test2');
            TokenExpiry();
          }
        } else {
          handleResponse('Service is currently unavailable. Please try again later', true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  };

  useEffect(() => {
    const cleanupInterceptors = setupAxiosInterceptors();
    return cleanupInterceptors;
  }, [handleLoader, handleResponse]);

  return <>{children}</>;
}
