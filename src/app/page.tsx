import { redirect } from 'next/navigation';
import './globals.css';
import type { ReactNode } from 'react';
export default function page(): ReactNode {
  redirect('/sign-in');
}
