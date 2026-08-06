import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const styles: Record<Variant, string> = {
    primary:
      'bg-ink-900 text-cream hover:bg-ink-800 active:scale-[0.98] shadow-sm',
    outline:
      'border border-ink-900/20 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-cream',
    ghost: 'text-ink-700 hover:text-ink-900 hover:bg-ink-900/5',
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
