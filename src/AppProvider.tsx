'use client';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { type ReactNode } from 'react';
import { AuthProvider } from './provider/AuthProvider';
import DialogProvider from './provider/DialogProvider';
import { ThemeProvider, CssBaseline } from '@mui/material';
import ProtectedRoute from './config/ProtectedRoute';
import { StyledEngineProvider } from '@mui/material/styles';
import theme from './lib/theme';
import GlobalStateWatcher from './components/store.js/GlobalStateWatcher';
import { ResponseProvider } from './provider/ResponseProvider';

const AppProviders = ({ children }: { children: React.ReactNode }): ReactNode => {
  return (
    <StyledEngineProvider injectFirst>
      <DialogProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <ResponseProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStateWatcher />
                <ProtectedRoute> {children}</ProtectedRoute>
              </ThemeProvider>
            </ResponseProvider>
          </AuthProvider>
        </LocalizationProvider>
      </DialogProvider>
    </StyledEngineProvider>
  );
};

export default AppProviders;
