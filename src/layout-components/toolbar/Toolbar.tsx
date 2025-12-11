'use client';

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { redirect, usePathname } from 'next/navigation';
import Notification from '@/layout-components/toolbar/Notification';
import type { ReactNode } from 'react';
import { getLogout } from '@/config/apiConfig';
import { useAuth } from '@/provider/AuthProvider';
import { useRouter } from 'next/navigation';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';
import axiosInstance from '@/config/axios';
import Profile from './Profile';

export default function ToolBar(): ReactNode {
  const { tokenDetails, setTokenDetails, user } = useAuth();
  const { handleApiResponse } = useResponseHandler();
  const router = useRouter();
  const handleLogout = async (): void => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    const payload = {
      refreshToken: tokenDetails?.refreshToken,
    };
    const res = await getLogout(payload);
    router.push('/sign-in');

    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setTokenDetails((prev) => ({ ...prev, token: null, refreshToken: null }));
        delete axiosInstance.defaults.headers.common.Authorization;
      },
    });
  };
  const handleProfile = () => {
    redirect('/profile');
  };
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        color: 'var(--color-primary)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Typography sx={{ fontSize: '19px', fontWeight: 'bold' }}>Welcome, {user?.loginUsername}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton disableRipple onClick={handleProfile}>
            <Profile />
          </IconButton>
          <IconButton disableRipple>
            <Notification />
          </IconButton>
          <IconButton disableRipple onClick={handleLogout}>
            <LogoutIcon sx={{ color: 'var(--color-primary)' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
