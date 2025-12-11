'use client';
import dynamic from 'next/dynamic';

import SplashScreen from '@/components/splash-screen/SplashScreen';
const RolePage = dynamic(() => import('./RolePage'), {
  ssr: false,
  loading: () => <SplashScreen />,
});

export default function Roles() {
  return <RolePage />;
}
