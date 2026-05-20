import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function AnimatedBackground() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.glow-a', { x: 60, y: 30, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.glow-b', { x: -50, y: 45, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink bg-mesh">
      <div className="glow-a absolute left-[8%] top-[14%] h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
      <div className="glow-b absolute right-[6%] top-[10%] h-80 w-80 rounded-full bg-fuchsia-500/14 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
    </div>
  );
}
