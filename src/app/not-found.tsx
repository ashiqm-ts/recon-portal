'use client';

import type { ReactNode } from 'react';

export default function NotFound(): ReactNode {
  const msg = `The page you're looking for doesn't exist`;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">{msg}</p>
      </div>
    </div>
  );
}
