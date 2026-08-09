import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
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
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Create your account</h1>
          <p className="text-sm text-surface-500 mt-1">Join EcoDrop and start recycling responsibly</p>
        </div>

        <div className="bg-white rounded-3xl border border-surface-200/80 p-8 shadow-2xs">
          {success && (
            <div className="mb-5 p-3.5 rounded-2xl bg-eco-50 border border-eco-200 text-sm font-semibold text-eco-800">
              Account created! Redirecting...
            </div>
          )}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-normal">
            <Input
              label="Full Name"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              error={errors.name}
              required
              autoComplete="name"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              error={errors.email}
              required
              autoComplete="email"
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
              error={errors.phone}
              required
              autoComplete="tel"
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                error={errors.password}
                required
                autoComplete="new-password"
              />
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i <= passwordStrength.score ? passwordStrength.color : 'bg-surface-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-surface-500">Password strength: <span className="font-semibold text-surface-700">{passwordStrength.label}</span></p>
                </div>
              )}
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Button type="submit" isLoading={isLoading} className="w-full shadow-sm mt-2" size="lg">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-8 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-eco-700 hover:text-eco-900 font-bold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
