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
  primary: 'bg-[#143e2b] hover:bg-[#0e2c1f] text-white shadow-md shadow-[#143e2b]/20 border border-[#22c55e]/30 hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'bg-[#ebf5ed] hover:bg-[#d8ebd9] text-[#143e2b] border border-[#22c55e]/20 hover:scale-[1.02] active:scale-[0.98]',
  outline: 'bg-white/80 backdrop-blur-md border border-[#d5ded8] text-[#143e2b] hover:bg-white hover:border-[#143e2b]/40 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]',
  ghost: 'text-[#4a554e] hover:text-[#143e2b] hover:bg-[#ebf5ed]/60 active:bg-[#d8ebd9]/80',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 border border-rose-500/30 hover:scale-[1.02] active:scale-[0.98]',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-xs font-semibold gap-2 rounded-full',
  md: 'px-5 py-2.5 text-sm font-semibold gap-2.5 rounded-full',
  lg: 'px-7 py-3.5 text-base font-semibold gap-3 rounded-full',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : leftIcon}
        <span className="truncate">{children}</span>
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

