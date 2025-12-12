'use client';
import dynamic from 'next/dynamic';
import SplashScreen from '@/components/splash-screen/SplashScreen';
import type { ReactNode } from 'react';

const UnauthorizedPage = dynamic(() => import('./Unauthorized'), {
  ssr: false,
  loading: () => <SplashScreen />,
});

export default function Unauthorized(): ReactNode {
  return <UnauthorizedPage />;
}
