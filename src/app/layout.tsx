import type { Metadata } from 'next';
import AppProviders from '../AppProvider';
import './globals.css';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'File Reconciliation',
  description: 'File Reconciliation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactNode {
  return (
    <html lang="en">
      <body className="flex ">
        <main className=" w-full min-h-screen bg-primary.main">
          <AppProviders>{children}</AppProviders>
        </main>
      </body>
    </html>
  );
}
