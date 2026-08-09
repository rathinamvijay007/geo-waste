import { ShieldCheck } from 'lucide-react';

interface BadgeProps {
  variant?: 'verified' | 'open' | 'closed' | 'waste' | 'status';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  verified: 'bg-[#ebf5ed]/80 backdrop-blur-md text-[#143e2b] border-[#22c55e]/30 font-bold shadow-xs',
  open: 'bg-emerald-500/10 text-emerald-700 backdrop-blur-md border-emerald-500/30 font-semibold',
  closed: 'bg-stone-500/10 text-stone-600 backdrop-blur-md border-stone-400/20 font-semibold',
  waste: 'bg-white/70 backdrop-blur-md text-[#4a554e] border-[#d5ded8] font-medium shadow-2xs',
  status: 'bg-emerald-500/10 text-emerald-800 backdrop-blur-md border-emerald-500/20 font-semibold',
};

export default function Badge({ variant = 'waste', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${variantStyles[variant]} ${className}`}>
      {variant === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-[#143e2b] shrink-0" />}
      {variant === 'open' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {variant === 'closed' && <span className="w-2 h-2 rounded-full bg-stone-400 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

