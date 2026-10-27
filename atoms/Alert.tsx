import type { ReactNode } from 'react';

interface AlertProps {
  variant: 'success' | 'danger' | 'warning' | 'info';
  children: ReactNode;
}

export function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      {children}
    </div>
  );
}
