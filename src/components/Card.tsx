import classNames from 'classnames';
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type CardProps<T extends ElementType = 'div'> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

const baseCardClass = 'bg-[var(--paper)] border border-[var(--border)] paper-shadow transition-colors duration-200';

export default function Card<T extends ElementType = 'div'>({
  as,
  className = '',
  children,
  ...props
}: CardProps<T>) {
  const Component = as ?? 'div';
  const isInteractive = typeof props.onClick === 'function' || Boolean((props as { href?: unknown }).href);
  const classes = classNames(
    baseCardClass,
    isInteractive && 'hover:border-[var(--accent)]',
    className,
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}