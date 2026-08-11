import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, type, className = '', id, style, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full flex flex-col gap-2 mb-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[#4ade80]"
            style={{ display: 'block', marginBottom: '0.5rem', color: '#4ade80' }}
          >
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          {icon && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4ade80] pointer-events-none z-20 flex items-center justify-center"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={`w-full rounded-2xl border bg-[#0d1611] text-[#edf7ee] placeholder:text-[#edf7ee]/40 transition-all duration-300 focus:outline-none focus:bg-[#132018] focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80] text-base shadow-inner ${
              error
                ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500'
                : 'border-white/20 hover:border-[#4ade80]/40'
            } ${className}`}
            style={{
              width: '100%',
              paddingTop: '0.875rem',
              paddingBottom: '0.875rem',
              paddingLeft: icon ? '3rem' : '1.25rem',
              paddingRight: isPassword ? '3rem' : '1.25rem',
              boxSizing: 'border-box',
              display: 'block',
              ...style,
            }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#edf7ee]/60 hover:text-[#4ade80] transition-colors p-1 cursor-pointer z-20 flex items-center justify-center"
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-rose-400 font-semibold mt-1" style={{ color: '#f87171', marginTop: '0.25rem' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
