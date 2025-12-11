'use client';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import type { ReactNode } from 'react';

export default function ErrorComponent({ error }: { readonly error: Error }): ReactNode {
  return <ErrorBoundary error={error} />;
}
