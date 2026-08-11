import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ElectricBorder from '../components/common/ElectricBorder';

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-400' };
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-sky-400' };
  return { score: 4, label: 'Strong', color: 'bg-[#4ade80]' };
}

export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Invalid email address';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await register(name, email, phone, password);
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
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-[#4ade80]/12 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10 flex flex-col gap-8"
        style={{ maxWidth: '32rem', width: '100%' }}
      >
        {/* Header Section */}
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
            Create your account
          </h1>

          <p className="text-sm sm:text-base text-[#edf7ee]/75 font-normal max-w-md mx-auto leading-relaxed">
            Join EcoDrop today to find certified collection hubs, track your waste diversion, and join our eco community.
          </p>
        </div>

        {/* Form Container Wrapped in ElectricBorder */}
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
              <span>Account created successfully! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs font-mono font-bold text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Full Name"
              type="text"
              placeholder="Vijay Rathinam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              icon={<User className="w-4.5 h-4.5 text-[#4ade80]" />}
              required
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4.5 h-4.5 text-[#4ade80]" />}
              required
              autoComplete="email"
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              icon={<Phone className="w-4.5 h-4.5 text-[#4ade80]" />}
              required
              autoComplete="tel"
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock className="w-4.5 h-4.5 text-[#4ade80]" />}
                required
                autoComplete="new-password"
              />

              {password && (
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-[#edf7ee]/60">Strength</span>
                    <span className={passwordStrength.score >= 3 ? 'text-[#4ade80]' : 'text-amber-400'}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="w-4.5 h-4.5 text-[#4ade80]" />}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 rounded-2xl shadow-xl shadow-[#22c55e]/25 text-base font-extrabold mt-2"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Create Account
            </Button>
          </form>
        </div>
      </ElectricBorder>

        {/* Footer Link */}
        <p className="text-center text-sm sm:text-base text-[#edf7ee]/75 font-normal">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#4ade80] hover:underline font-bold"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
