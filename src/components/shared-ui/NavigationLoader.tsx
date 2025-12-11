'use client';

import { type ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/provider/NavigationContext';
import SplashScreen from '../splash-screen/SplashScreen';
export default function NavigationLoader(): ReactNode {
  const pathname = usePathname();
  const { loading, stopLoading } = useNavigation();

  useEffect(() => {
    if (loading) {
      stopLoading();
    }
  }, [pathname]);

  if (!loading) return null;

  return <SplashScreen size={50} thickness={4} />;
}
