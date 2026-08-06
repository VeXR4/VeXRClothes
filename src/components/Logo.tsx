type LogoProps = {
  className?: string;
  variant?: 'dark' | 'light';
  showPersian?: boolean;
  size?: number;
};

export default function Logo({ className = '', variant = 'dark', showPersian = true, size = 40 }: LogoProps) {
  const color = variant === 'dark' ? 'text-ink-900 dark:text-night-50' : 'text-cream';
  const sub = variant === 'dark' ? 'text-ink-500 dark:text-night-300' : 'text-cream/60';

  return (
    <span className={`inline-flex items-center gap-2.5 leading-none ${color} ${className}`}>
      <img
        src="/LogoBrand.webp"
        alt="لوگوی وکس آر"
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-[0.16em] select-none">
          VeXR<span className="text-sand-500 dark:text-sand-400">Clothes</span>
        </span>
        {showPersian && (
          <span className={`mt-1 text-[10px] font-medium tracking-[0.3em] ${sub}`}>
            پوشاک وکس آر
          </span>
        )}
      </span>
    </span>
  );
}