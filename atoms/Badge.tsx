import type { ReactNode } from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'secondary' | 'primary';
  children: ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const textClass = variant === 'warning' ? ' text-dark' : '';
  return <span className={`badge text-bg-${variant}${textClass}`}>{children}</span>;
}
