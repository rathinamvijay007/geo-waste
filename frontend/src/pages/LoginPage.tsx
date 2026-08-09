import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 bg-surface-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-eco-800 flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-eco-950 tracking-tight">Eco<span className="text-eco-600">Drop</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-surface-500 mt-1">Sign in to your EcoDrop account to continue</p>
        </div>

        <div className="bg-white rounded-3xl border border-surface-200/80 p-8 shadow-2xs">
          {success && (
            <div className="mb-5 p-3.5 rounded-2xl bg-eco-50 border border-eco-200 text-sm font-semibold text-eco-800">
              Sign in successful! Redirecting...
            </div>
          )}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-300 text-eco-700 focus:ring-eco-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-surface-600">Remember me</span>
              </label>
              <button type="button" className="text-xs font-semibold text-eco-700 hover:text-eco-900 cursor-pointer">
                Forgot password?
              </button>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full shadow-sm" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-2xl bg-surface-50 border border-surface-200/60">
            <p className="text-xs text-surface-500 text-center font-medium">
              Demo Credentials: <span className="font-mono text-surface-800 font-bold">vijay@ecodrop.in</span> / <span className="font-mono text-surface-800 font-bold">password</span>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-surface-500 mt-8 font-medium">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-eco-700 hover:text-eco-900 font-bold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
