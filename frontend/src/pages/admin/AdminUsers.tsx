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
    adminApi
      .getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.status === 'active') {
        await adminApi.deactivateUser(user.id);
        showToast('info', `${user.name} has been deactivated.`);
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
            : u
        )
      );
    } catch {
      showToast('error', 'Failed to change user status.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="User Management"
      description="View and manage registered EcoDrop users"
    >
      {/* Search Bar */}
      <div className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-10 shadow-lg">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#4ade80]" />
          <input
            type="text"
            placeholder="Search user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-white/10 text-xs font-semibold bg-white/5 text-[#edf7ee] placeholder:text-[#edf7ee]/40 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80]"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-mono font-bold text-[#4ade80] uppercase tracking-widest">
                  <th className="py-5 px-7">User</th>
                  <th className="py-5 px-7">Phone</th>
                  <th className="py-5 px-7">Role</th>
                  <th className="py-5 px-7">Joined Date</th>
                  <th className="py-5 px-7">Status</th>
                  <th className="py-5 px-7 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs font-semibold text-[#edf7ee]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-5 px-7">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#22c55e] to-[#16a34a] text-[#052e16] font-extrabold text-xs flex items-center justify-center shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#edf7ee]">{user.name}</p>
                          <p className="text-xs text-[#edf7ee]/50 font-normal">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-7 text-[#edf7ee]/70 font-normal">
                      {user.phone}
                    </td>
                    <td className="py-5 px-7">
                      <span
                        className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold uppercase tracking-widest ${
                          user.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                            : 'bg-white/5 text-[#edf7ee]/70 border border-white/10'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5 px-7 text-[#edf7ee]/50 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-7">
                      <Badge
                        variant={user.status === 'active' ? 'open' : 'closed'}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-5 px-7 text-right">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                          user.status === 'active'
                            ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white'
                            : 'text-[#4ade80] bg-[#4ade80]/10 hover:bg-[#22c55e] hover:text-[#052e16]'
                        }`}
                        title={
                          user.status === 'active'
                            ? 'Deactivate User'
                            : 'Activate User'
                        }
                      >
                        {user.status === 'active' ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
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
