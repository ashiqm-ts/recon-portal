'use client';
import dynamic from 'next/dynamic';

import SplashScreen from '@/components/splash-screen/SplashScreen';
import type { ReactNode } from 'react';
const ForgotPassword = dynamic(() => import('./ForgotPasswordPage'), {
  loading: () => <SplashScreen />,
});

export default function ForgotPasswordPage(): ReactNode {
  return <ForgotPassword />;
}
