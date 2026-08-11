import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#4ade80] hover:to-[#22c55e] text-[#052e16] font-extrabold shadow-md shadow-[#22c55e]/25 border border-[#4ade80]/40 hover:scale-[1.02] active:scale-[0.98]',
  secondary:
    'bg-[#4ade80]/10 hover:bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/25 font-bold hover:scale-[1.02] active:scale-[0.98]',
  outline:
    'bg-white/5 backdrop-blur-md border border-white/12 text-[#edf7ee] font-semibold hover:bg-white/10 hover:border-[#4ade80]/40 hover:scale-[1.02] active:scale-[0.98]',
  ghost:
    'text-[#edf7ee]/70 hover:text-[#edf7ee] hover:bg-white/5 active:bg-white/10 font-semibold',
  danger:
    'bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/30 border border-rose-500/40 hover:scale-[1.02] active:scale-[0.98]',
};

const sizeStyles = {
  sm: 'px-5 py-2.5 text-xs gap-2 rounded-full',
  md: 'px-6 py-3 text-sm gap-2.5 rounded-full',
  lg: 'px-8 py-4 text-base gap-3 rounded-full',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon
        )}
        <span className="truncate">{children}</span>
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
