import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Heart,
  MessageSquare,
  LogOut,
  Save,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { showToast } from '../components/common/Toast';
import { userApi } from '../api/userApi';

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  // Change password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile({ name, phone });
      await refreshUser();
      showToast('success', 'Profile updated successfully!');
      setEditing(false);
    } catch {
      showToast('error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setChangingPassword(true);
    try {
      await userApi.changePassword(currentPassword, newPassword);
      showToast('success', 'Password changed successfully!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Failed to change password.'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="pt-32 sm:pt-40 pb-40 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 space-y-16 lg:space-y-20">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-[#4ade80]/20 p-8 sm:p-12 text-center shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#22c55e] to-[#16a34a] border-4 border-[#06090a] flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black font-display text-[#052e16]">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#4ade80] border-2 border-[#06090a] ring-4 ring-[#4ade80]/20" />
            </div>
            <div>
              <div className="eyebrow mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>USER DASHBOARD</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#edf7ee]">
                {user?.name || 'Member'}
              </h1>
              <p className="text-sm font-medium text-[#edf7ee]/60 mt-1">
                {user?.email}
              </p>
              <p className="text-xs font-mono font-bold text-[#4ade80] bg-[#4ade80]/10 px-5 py-2 rounded-full inline-block mt-4 border border-[#4ade80]/20">
                Member since{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 shadow-lg space-y-9"
        >
          <div className="flex items-center justify-between pb-7 border-b border-white/10">
            <h2 className="font-extrabold font-display text-2xl text-[#edf7ee]">
              Personal Information
            </h2>
            {!editing ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  isLoading={saving}
                  onClick={handleSaveProfile}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-7">
            {editing ? (
              <>
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  icon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
                />
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-5 py-4 border-b border-white/10">
                  <User className="w-5 h-5 text-[#4ade80] shrink-0" />
                  <div>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#edf7ee]/50">
                      Full Name
                    </p>
                    <p className="text-base font-bold text-[#edf7ee] mt-0.5">
                      {user?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 py-4 border-b border-white/10">
                  <Mail className="w-5 h-5 text-[#4ade80] shrink-0" />
                  <div>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#edf7ee]/50">
                      Email Address
                    </p>
                    <p className="text-base font-bold text-[#edf7ee] mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 py-4">
                  <Phone className="w-5 h-5 text-[#4ade80] shrink-0" />
                  <div>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#edf7ee]/50">
                      Phone Number
                    </p>
                    <p className="text-base font-bold text-[#edf7ee] mt-0.5">
                      {user?.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 shadow-lg space-y-9"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold font-display text-2xl text-[#edf7ee] flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#4ade80]" /> Security & Password
            </h2>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowPasswordForm((p) => !p)}
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          {showPasswordForm && (
            <div className="space-y-7 pt-7 border-t border-white/10">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                isLoading={changingPassword}
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword}
              >
                Update Password
              </Button>
            </div>
          )}
        </motion.div>

        {/* Quick Links Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg"
        >
          <Link
            to="/favorites"
            className="flex items-center gap-5 px-8 sm:px-10 py-5.5 hover:bg-white/5 transition-colors border-b border-white/10"
          >
            <Heart className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-base font-bold text-[#edf7ee]">
              My Saved Favorites
            </span>
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-5 px-8 sm:px-10 py-5.5 hover:bg-white/5 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-sky-400 shrink-0" />
            <span className="text-base font-bold text-[#edf7ee]">
              Search History
            </span>
          </Link>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button
            variant="outline"
            className="w-full text-rose-400 border-rose-500/20 hover:bg-rose-500/10 py-4 shadow-md text-base font-extrabold"
            leftIcon={<LogOut className="w-5 h-5" />}
            onClick={logout}
          >
            Logout Account
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
