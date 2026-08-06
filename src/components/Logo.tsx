type LogoProps = {
  className?: string;
  variant?: 'dark' | 'light';
  showPersian?: boolean;
};

export default function Logo({ className = '', variant = 'dark', showPersian = true }: LogoProps) {
  const color = variant === 'dark' ? 'text-ink-900 dark:text-night-50' : 'text-cream';
  const sub = variant === 'dark' ? 'text-ink-500 dark:text-night-300' : 'text-cream/60';

  return (
    <span className={`inline-flex flex-col leading-none ${color} ${className}`}>
      <span className="font-display text-2xl font-semibold tracking-[0.18em] select-none">
        VeXR<span className="text-sand-400">Clothes</span>
      </span>
      {showPersian && (
        <span className={`mt-1 text-[11px] font-medium tracking-[0.32em] ${sub}`}>
          پوشاک وکس آر
        </span>
      )}
    </span>
  );
}
