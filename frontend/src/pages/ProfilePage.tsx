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
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 text-center shadow-2xs space-y-4"
        >
          <div className="w-24 h-24 rounded-full bg-eco-100 border-2 border-eco-200 flex items-center justify-center mx-auto shadow-xs">
            <span className="text-3xl font-extrabold text-eco-900">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{user?.name || 'User'}</h1>
            <p className="text-sm font-medium text-surface-500 mt-0.5">{user?.email}</p>
            <p className="text-xs font-semibold text-eco-700 bg-eco-50 px-3 py-1 rounded-full inline-block mt-3 border border-eco-200/60">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
            </p>
          </div>
        </motion.div>

        {/* Profile Details Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 shadow-2xs space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-surface-100">
            <h2 className="font-bold text-lg text-surface-900">Personal Information</h2>
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

          <div className="space-y-5">
            {editing ? (
              <>
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={<User className="w-4 h-4" />} />
                <Input label="Email Address" value={user?.email || ''} disabled icon={<Mail className="w-4 h-4" />} />
                <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} icon={<Phone className="w-4 h-4" />} />
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 py-2 border-b border-surface-100/60">
                  <User className="w-5 h-5 text-eco-700 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Full Name</p>
                    <p className="text-base font-semibold text-surface-900 mt-0.5">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2 border-b border-surface-100/60">
                  <Mail className="w-5 h-5 text-eco-700 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Email Address</p>
                    <p className="text-base font-semibold text-surface-900 mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <Phone className="w-5 h-5 text-eco-700 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Phone Number</p>
                    <p className="text-base font-semibold text-surface-900 mt-0.5">{user?.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 shadow-2xs space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-surface-900 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-eco-700" /> Security & Password
            </h2>
            <Button variant="outline" size="md" onClick={() => setShowPasswordForm(p => !p)}>
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          {showPasswordForm && (
            <div className="space-y-5 pt-4 border-t border-surface-100">
              <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Button isLoading={changingPassword} onClick={handleChangePassword} disabled={!currentPassword || !newPassword}>
                Update Password
              </Button>
            </div>
          )}
        </motion.div>

        {/* Quick Links Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-surface-200/80 overflow-hidden shadow-2xs"
        >
          <Link to="/favorites" className="flex items-center gap-4 px-8 py-5 hover:bg-surface-50 transition-colors border-b border-surface-100">
            <Heart className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="text-sm font-semibold text-surface-800">My Saved Favorites</span>
          </Link>
          <Link to="/history" className="flex items-center gap-4 px-8 py-5 hover:bg-surface-50 transition-colors">
            <MessageSquare className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm font-semibold text-surface-800">Search History</span>
          </Link>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 py-3.5"
            leftIcon={<LogOut className="w-4 h-4" />} onClick={logout}
          >
            Logout Account
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
