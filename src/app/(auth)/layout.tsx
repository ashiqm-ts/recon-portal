import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return <main>{children}</main>;
}
