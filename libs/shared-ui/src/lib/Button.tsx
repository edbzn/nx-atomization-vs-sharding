import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Visual density. Defaults to `md` so existing call sites are unchanged. */
  size?: ButtonSize;
}

export function Button({ variant = 'primary', size = 'md', type = 'button', className, ...rest }: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className].filter(Boolean).join(' ');
  return <button type={type} className={classes} data-size={size} {...rest} />;
}
