'use client';
import dynamic from 'next/dynamic';

import SplashScreen from '@/components/splash-screen/SplashScreen';
import type { ReactNode } from 'react';
const Profile = dynamic(() => import('./Profile.tsx'), {
  ssr: false,
  loading: () => <SplashScreen />,
});

export default function ProfilePage(): ReactNode {
  return <Profile />;
}
