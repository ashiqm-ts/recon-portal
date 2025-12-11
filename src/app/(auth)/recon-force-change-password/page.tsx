'use client';
import dynamic from 'next/dynamic';

import SplashScreen from '@/components/splash-screen/SplashScreen';
import type { ReactNode } from 'react';
const ForceChangePasswordPage = dynamic(() => import('./ForceChangePassword.tsx'), {
  loading: () => <SplashScreen />,
});

export default function ForceChangePassword(): ReactNode {
  return <ForceChangePasswordPage />;
}
