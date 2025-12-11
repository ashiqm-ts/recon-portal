'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDialogStore } from './useDialogStore';
 
export default function GlobalStateWatcher() {
  const pathname = usePathname();
  const {closeDialog} = useDialogStore()

  useEffect(() => {
     closeDialog();
  }, [pathname, closeDialog]);

  return null;
}
