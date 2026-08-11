import { ShieldCheck } from 'lucide-react';

interface BadgeProps {
  variant?: 'verified' | 'open' | 'closed' | 'waste' | 'status';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  verified:
    'bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/30 font-mono font-bold shadow-sm',
  open: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold',
  closed: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold',
  waste: 'bg-white/5 text-[#edf7ee]/80 border-white/10 font-medium',
  status: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold',
};

export default function Badge({
  variant = 'waste',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${variantStyles[variant]} ${className}`}
    >
      {variant === 'verified' && (
        <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
      )}
      {variant === 'open' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {variant === 'closed' && (
        <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
      )}
      <span>{children}</span>
    </span>
  );
}
