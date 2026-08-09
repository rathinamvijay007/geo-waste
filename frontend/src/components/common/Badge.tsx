import { ShieldCheck } from 'lucide-react';

interface BadgeProps {
  variant?: 'verified' | 'open' | 'closed' | 'waste' | 'status';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  verified: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium',
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-medium',
  closed: 'bg-surface-100 text-surface-600 border-surface-200 font-medium',
  waste: 'bg-surface-100 text-surface-700 border-surface-200/80 font-normal',
  status: 'bg-blue-50 text-blue-700 border-blue-200/80 font-medium',
};

export default function Badge({ variant = 'waste', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full border ${variantStyles[variant]} ${className}`}>
      {variant === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
      {variant === 'open' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
      {variant === 'closed' && <span className="w-1.5 h-1.5 rounded-full bg-surface-400 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
