import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'ghost' | 'danger';
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({ className, children, variant = 'primary', icon, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-white text-ink shadow-glow hover:bg-cyan-100',
        variant === 'ghost' && 'border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10',
        variant === 'danger' && 'bg-rose-500/90 text-white hover:bg-rose-400',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}
