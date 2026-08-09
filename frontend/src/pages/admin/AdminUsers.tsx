import { useEffect, useState } from 'react';
import { Search, UserCheck, UserX } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import type { User } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showToast } from '../../components/common/Toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.status === 'active') {
        await adminApi.deactivateUser(user.id);
        showToast('info', `${user.name} has been deactivated.`);
      }
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    } catch {
      showToast('error', 'Failed to change user status.');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="User Management" description="View and manage registered EcoDrop users">
      {/* Search Bar */}
      <div className="glass-card rounded-3xl border border-white/80 p-5 mb-8 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#788a7e]" />
          <input
            type="text"
            placeholder="Search user name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#eaeae4] text-xs font-semibold bg-white/80 text-[#1b251f] focus:outline-none focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e]"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <div className="glass-panel rounded-3xl border border-white/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eaeae4] bg-white/90 text-xs font-extrabold text-[#143e2b] uppercase tracking-widest">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeae4] text-xs font-semibold">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#ebf5ed]/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-2xl bg-[#143e2b] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1b251f]">{user.name}</p>
                          <p className="text-xs text-[#556358] font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#556358] font-medium">{user.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-800 border border-purple-500/30' : 'bg-stone-100 text-stone-700 border border-[#eaeae4]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#788a7e] font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={user.status === 'active' ? 'open' : 'closed'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          user.status === 'active' ? 'text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white' : 'text-[#22c55e] bg-[#ebf5ed] hover:bg-[#22c55e] hover:text-white'
                        }`}
                        title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

