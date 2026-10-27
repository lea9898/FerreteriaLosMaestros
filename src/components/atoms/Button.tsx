import type { ReactNode } from 'react';

export type ButtonVariant =
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  | 'outline-primary' | 'outline-secondary' | 'outline-danger';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  type?: 'button' | 'submit';
  size?: 'sm' | 'md';
  disabled?: boolean;
  ariaLabel?: string;
}

export function Button({
  children, onClick, variant = 'primary', type = 'button', size = 'md', disabled = false, ariaLabel,
}: ButtonProps) {
  const sizeClass = size === 'sm' ? ' btn-sm' : '';
  return (
    <button
      type={type}
      className={`btn btn-${variant}${sizeClass}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
