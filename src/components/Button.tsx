'use client';

import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: 'neutral' | 'danger' | 'primary';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  tone = 'neutral',
  size = 'xs',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = classNames(
    'inline-flex items-center justify-center border font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    tone === 'danger'
      ? 'border-[color:color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,var(--paper))] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)]'
      : tone === 'primary'
        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--background)] hover:opacity-80'
        : 'border-[var(--border)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--background)]',
    size === 'lg'
      ? 'px-4 py-3 text-sm font-semibold'
      : size === 'md'
        ? 'px-4 py-2 text-sm'
        : size === 'sm'
          ? 'px-3 py-1.5 text-sm'
          : 'px-2 py-1 text-xs',
    className,
  );

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}