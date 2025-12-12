'use client';

import { useEffect, useMemo } from 'react';
import axiosInstance from './axios';

import { useDialog } from '@/provider/DialogProvider';
import { useAuth } from '@/provider/AuthProvider';
import { getRegenerate } from './apiConfig';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';
import { filterNavigation, getAllowedPermissionIds } from '@/layout-components/sidebar/Sidebar';
import { links, NavItem, noPermissionRoutes } from '@/layout-components/sidebar/NavigationConfig';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { handleLoader, handleResponse } = useDialog();
  const { handleApiResponse } = useResponseHandler();
  const { user, setTokenDetails } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const extractUrls = (menu: NavItem[]) => {
    const urls: string[] = [];

    const loop = (items: any[]) => {
      items.forEach((item) => {
        if (item.to) urls.push(item.to);
        if (item.children?.length) loop(item.children);
      });
    };

    loop(menu);
    return urls;
  };

  const allowedIds = useMemo(() => getAllowedPermissionIds(user?.rolePermissions || []), [user]);

  const allowedMenu = useMemo(() => filterNavigation(links, allowedIds), [allowedIds]);

  const allowedRoutes = useMemo(() => extractUrls(allowedMenu), [allowedMenu]);

  console.log('allowedMenu →', allowedMenu);
  console.log('allowedRoutes →', allowedRoutes);

  useEffect(() => {
    if (!user) return;
    if (allowedRoutes.length === 0) return;

    const clean = (str: string) => str.replace(/\/+$/, '');

    const current = clean(pathname);

    const isNoPermissionRoute = noPermissionRoutes.some((route) => current.startsWith(clean(route)));

    if (isNoPermissionRoute) {
      return;
    }
    if (current === '/unauthorized') return;
    const isAllowed = allowedRoutes.some((route) => current.startsWith(clean(route)));
    if (!isAllowed) {
      router.replace('/unauthorized');
    }
  }, [pathname, allowedRoutes, user]);

  let pendingRequests = 0;

  const getRegenerateToken = async (payload) => {
    const res = await getRegenerate(payload);

    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;

        axiosInstance.defaults.headers.common['instnId'] = 1;
        axiosInstance.defaults.headers.common['channel'] = '01';

        setTokenDetails({
          token: res.data.data.token,
          refreshToken: res.data.data.refreshToken,
        });
      },
    });

    return res;
  };

  const TokenExpiry = async () => {
    setTokenDetails({ token: null, refreshToken: null });

    delete axiosInstance.defaults.headers.common.Authorization;

    sessionStorage.clear();

    router.replace('/sign-in');
    handleResponse('Access Timeout: Please log in again to proceed', true);
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

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = sessionStorage.getItem('refreshToken');

            if (!refreshToken) return TokenExpiry();

            const res = await getRegenerateToken({
              refreshToken,
              loginUserName: user?.loginUsername,
            });

            if (res.data.responseCode === 0) {
              originalRequest.headers.Authorization = `Bearer ${res.data.data.token}`;

              return axiosInstance(originalRequest);
            }

            return TokenExpiry();
          } catch (err) {
            return TokenExpiry();
          }
        }

        handleResponse('Service unavailable. Try later.', true);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  };

  useEffect(() => {
    const cleanup = setupAxiosInterceptors();
    return cleanup;
  }, []);

  return <>{children}</>;
}
