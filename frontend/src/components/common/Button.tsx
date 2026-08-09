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
  primary: 'bg-eco-800 text-white hover:bg-eco-900 active:bg-eco-950 shadow-sm border border-eco-900/10',
  secondary: 'bg-eco-50 text-eco-800 hover:bg-eco-100 active:bg-eco-200 border border-eco-200/60',
  outline: 'border border-surface-300 text-surface-800 bg-white hover:bg-surface-50 hover:border-surface-400 active:bg-surface-100 shadow-2xs',
  ghost: 'text-surface-700 hover:bg-surface-100/80 active:bg-surface-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
};

const sizeStyles = {
  sm: 'px-3.5 py-2 text-xs font-medium gap-1.5 rounded-xl',
  md: 'px-4.5 py-2.5 text-sm font-medium gap-2 rounded-xl',
  lg: 'px-6 py-3.5 text-base font-semibold gap-2.5 rounded-2xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
