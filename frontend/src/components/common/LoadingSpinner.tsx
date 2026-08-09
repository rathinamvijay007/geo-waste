import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

export default function LoadingSpinner({ text, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative p-4 rounded-full bg-white/70 backdrop-blur-md border border-[#22c55e]/20 shadow-md">
        <Loader2 className={`${sizeStyles[size]} text-[#143e2b] animate-spin`} />
      </div>
      {text && <p className="text-xs font-semibold uppercase tracking-wider text-[#4a554e]">{text}</p>}
    </div>
  );
}

