import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, type, className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-widest text-[#4a554e] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#788a7e] pointer-events-none transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={`w-full rounded-2xl border bg-white/70 backdrop-blur-md text-[#1b251f] placeholder:text-[#8b9b90] transition-all duration-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] ${
              icon ? 'pl-11' : 'pl-4.5'
            } ${isPassword ? 'pr-11' : 'pr-4.5'} py-3.5 text-sm shadow-xs ${
              error ? 'border-rose-400 focus:ring-rose-500/15 focus:border-rose-500' : 'border-[#d5ded8]'
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#788a7e] hover:text-[#143e2b] transition-colors p-1 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-500 font-semibold">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

