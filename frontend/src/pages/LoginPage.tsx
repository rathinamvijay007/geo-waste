import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

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
    <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 bg-ambient-light relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-[#143e2b] flex items-center justify-center shadow-lg shadow-[#143e2b]/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-[#4ade80]" />
            </div>
            <span className="text-3xl font-extrabold font-display text-[#143e2b] tracking-tight">EcoDrop</span>
          </Link>
          <h1 className="text-3xl font-extrabold font-display text-[#1b251f] tracking-tight">Welcome back</h1>
          <p className="text-sm text-[#556358] mt-2 font-medium">Sign in to your EcoDrop account to continue</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/80 p-8 sm:p-10 shadow-2xl">
          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-[#ebf5ed] border border-[#22c55e]/40 text-xs font-bold text-[#143e2b]">
              Sign in successful! Redirecting...
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-[#143e2b]" />}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-[#143e2b]" />}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d5ded8] text-[#143e2b] focus:ring-[#22c55e] cursor-pointer accent-[#143e2b]"
                />
                <span className="text-xs font-bold text-[#4a554e]">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-[#143e2b] hover:underline cursor-pointer">
                Forgot password?
              </button>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full shadow-lg shadow-[#143e2b]/25" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Sign In
            </Button>
          </form>

          <div className="mt-7 p-4 rounded-2xl bg-white/70 border border-[#eaeae4]">
            <p className="text-xs text-[#556358] text-center font-medium">
              Demo Credentials: <span className="font-mono text-[#143e2b] font-bold">vijay@ecodrop.in</span> / <span className="font-mono text-[#143e2b] font-bold">password</span>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#556358] mt-8 font-semibold">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#143e2b] hover:underline font-extrabold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

