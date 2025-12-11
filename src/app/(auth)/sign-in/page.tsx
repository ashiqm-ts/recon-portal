'use client';
import dynamic from 'next/dynamic';

import SplashScreen from '@/components/splash-screen/SplashScreen';
import type { ReactNode } from 'react';
const SignIn = dynamic(() => import('./SignInPage'), {
  ssr: false,
  loading: () => <SplashScreen />,
});

export default function SignInPage(): ReactNode {
  return <SignIn />;
}
