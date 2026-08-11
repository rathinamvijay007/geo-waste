import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ElectricBorder from '../components/common/ElectricBorder';

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password, rememberMe);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch {
      // Error handled by context
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center pt-28 sm:pt-36 pb-36 px-6 relative overflow-hidden font-sans"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#4ade80]/12 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10 flex flex-col gap-8"
        style={{ maxWidth: '32rem', width: '100%' }}
      >
        {/* Header & Logo Section */}
        <div className="text-center flex flex-col items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-3 group mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg shadow-[#22c55e]/25 group-hover:scale-105 transition-transform">
              <Leaf className="w-7 h-7 text-[#052e16]" />
            </div>
            <span className="text-3xl font-extrabold font-display text-[#edf7ee] tracking-tight">
              EcoDrop
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#edf7ee] tracking-tight leading-tight">
            Welcome back
          </h1>

          <p className="text-sm sm:text-base text-[#edf7ee]/75 font-normal max-w-md mx-auto leading-relaxed">
            Sign in to your EcoDrop account to manage recycling hubs, track CO₂ impact, and save favorite drop-offs.
          </p>
        </div>

        {/* Card Form Wrapped in ElectricBorder */}
        <ElectricBorder color="#4ade80" speed={1} chaos={0.12} borderRadius={24} className="w-full">
          <div
            className="liquid-glass-card p-8 sm:p-12 flex flex-col gap-6"
            style={{
              padding: '2.5rem',
            }}
          >
          {success && (
            <div className="p-4 rounded-2xl bg-[#4ade80]/15 border border-[#4ade80]/30 text-xs font-mono font-bold text-[#4ade80] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
              <span>Sign in successful! Redirecting to member dashboard...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs font-mono font-bold text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4.5 h-4.5 text-[#4ade80]" />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4.5 h-4.5 text-[#4ade80]" />}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between py-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-[#4ade80] focus:ring-[#4ade80] cursor-pointer accent-[#22c55e]"
                />
                <span className="text-xs sm:text-sm font-semibold text-[#edf7ee]/80">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="text-xs sm:text-sm font-bold text-[#4ade80] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 rounded-2xl shadow-xl shadow-[#22c55e]/25 text-base font-extrabold"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Sign In to EcoDrop
            </Button>
          </form>

          <div className="pt-4 border-t border-white/10 mt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <p className="text-xs text-[#edf7ee]/60 uppercase tracking-widest font-mono font-bold">Demo Login Credentials</p>
              <p className="text-sm font-mono font-bold text-[#4ade80]">
                vijay@ecodrop.in <span className="text-[#edf7ee]/40 font-normal">/</span> password
              </p>
            </div>
          </div>
        </div>
      </ElectricBorder>

        {/* Footer Link */}
        <p className="text-center text-sm sm:text-base text-[#edf7ee]/75 font-normal">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="text-[#4ade80] hover:underline font-bold"
          >
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
