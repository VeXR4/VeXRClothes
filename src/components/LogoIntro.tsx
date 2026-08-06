import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function LogoIntro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('vexr-intro');
    if (seen) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem('vexr-intro', '1');
      setDone(true);
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950 animate-[fade-in_0.4s_ease]">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-[fade-in_1s_ease]">
          <img src="/assets/logo.svg" alt="وکس آر" width={96} height={96} className="drop-shadow-[0_0_30px_rgba(200,169,126,0.35)]" />
        </div>
        <div className="h-px w-24 overflow-hidden bg-cream/15">
          <div className="h-full w-full origin-left animate-[fade-in_1.4s_ease] bg-sand-400" />
        </div>
        <span className="text-[11px] tracking-[0.4em] text-cream/40 animate-[fade-in_1.6s_ease]">
          VEXR
        </span>
      </div>
      <div className="absolute inset-0 animate-[fade-in_0.5s_ease_forwards] [animation-delay:2.1s] bg-ink-950/0 pointer-events-none" />
    </div>
  );
}
