'use client';
import dynamic from 'next/dynamic';
import SplashScreen from '@/components/splash-screen/SplashScreen';
import type { ReactNode } from 'react';

const Users = dynamic(() => import('./FileReconciliation'), {
  ssr: false,
  loading: () => <SplashScreen />,
});

export default function UserPage(): ReactNode {
  return <Users />;
}
