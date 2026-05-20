import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-lg border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
