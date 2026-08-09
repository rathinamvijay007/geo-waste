import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Heart, MessageSquare, LogOut, Save } from 'lucide-react';
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
      showToast('error', err instanceof Error ? err.message : 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="py-24 sm:py-32 lg:py-40 min-h-screen bg-ambient-light">
      <div className="max-w-5xl lg:max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl border border-white/80 p-10 sm:p-14 text-center shadow-2xl space-y-6"
        >
          <div className="relative w-32 h-32 mx-auto">
            <div className="w-32 h-32 rounded-full bg-[#143e2b] border-4 border-white flex items-center justify-center shadow-2xl">
              <span className="text-5xl font-black font-display text-white">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#22c55e] border-2 border-white ring-4 ring-[#22c55e]/20" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-display text-[#1b251f] tracking-tight">{user?.name || 'User'}</h1>
            <p className="text-base font-medium text-[#556358] mt-1">{user?.email}</p>
            <p className="text-xs font-extrabold text-[#143e2b] bg-[#ebf5ed] px-5 py-2 rounded-full inline-block mt-4 border border-[#22c55e]/30 shadow-2xs">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
            </p>
          </div>
        </motion.div>

        {/* Profile Details Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl border border-white/80 p-10 sm:p-14 shadow-lg space-y-8"
        >
          <div className="flex items-center justify-between pb-6 border-b border-[#eaeae4]">
            <h2 className="font-extrabold font-display text-2xl text-[#1b251f]">Personal Information</h2>
            {!editing ? (
              <Button variant="outline" size="md" onClick={() => setEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="ghost" size="md" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="md" isLoading={saving} onClick={handleSaveProfile} leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {editing ? (
              <>
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={<User className="w-4 h-4" />} />
                <Input label="Email Address" value={user?.email || ''} disabled icon={<Mail className="w-4 h-4" />} />
                <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} icon={<Phone className="w-4 h-4" />} />
              </>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-5 py-4 border-b border-[#eaeae4]">
                  <User className="w-6 h-6 text-[#22c55e] shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#788a7e]">Full Name</p>
                    <p className="text-lg font-bold text-[#1b251f] mt-0.5">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 py-4 border-b border-[#eaeae4]">
                  <Mail className="w-6 h-6 text-[#22c55e] shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#788a7e]">Email Address</p>
                    <p className="text-lg font-bold text-[#1b251f] mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 py-4">
                  <Phone className="w-6 h-6 text-[#22c55e] shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#788a7e]">Phone Number</p>
                    <p className="text-lg font-bold text-[#1b251f] mt-0.5">{user?.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl border border-white/80 p-10 sm:p-14 shadow-lg space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold font-display text-2xl text-[#1b251f] flex items-center gap-3">
              <Lock className="w-6 h-6 text-[#22c55e]" /> Security & Password
            </h2>
            <Button variant="outline" size="md" onClick={() => setShowPasswordForm(p => !p)}>
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          {showPasswordForm && (
            <div className="space-y-6 pt-6 border-t border-[#eaeae4]">
              <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Button isLoading={changingPassword} onClick={handleChangePassword} disabled={!currentPassword || !newPassword}>
                Update Password
              </Button>
            </div>
          )}
        </motion.div>

        {/* Quick Links Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl border border-white/80 overflow-hidden shadow-lg"
        >
          <Link to="/favorites" className="flex items-center gap-5 px-9 py-6 hover:bg-[#ebf5ed] transition-colors border-b border-[#eaeae4]">
            <Heart className="w-6 h-6 text-rose-600 shrink-0" />
            <span className="text-base font-bold text-[#1b251f]">My Saved Favorites</span>
          </Link>
          <Link to="/history" className="flex items-center gap-5 px-9 py-6 hover:bg-[#ebf5ed] transition-colors">
            <MessageSquare className="w-6 h-6 text-blue-600 shrink-0" />
            <span className="text-base font-bold text-[#1b251f]">Search History</span>
          </Link>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Button variant="outline" className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 py-5 shadow-sm text-base font-extrabold"
            leftIcon={<LogOut className="w-5 h-5" />} onClick={logout}
          >
            Logout Account
          </Button>
        </motion.div>
      </div>
    </div>
  );
}


