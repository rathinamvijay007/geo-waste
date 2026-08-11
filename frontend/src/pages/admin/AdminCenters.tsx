import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import type { CollectionCenter } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { showToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminCenters() {
  const [centers, setCenters] = useState<CollectionCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWaste, setSelectedWaste] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] =
    useState<CollectionCenter | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('Coimbatore');
  const [formPhone, setFormPhone] = useState('');
  const [formWaste, setFormWaste] = useState<string[]>(['E-Waste']);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = () => {
    setLoading(true);
    adminApi
      .getAllCenters()
      .then(setCenters)
      .finally(() => setLoading(false));
  };

  const handleOpenAdd = () => {
    setEditingCenter(null);
    setFormName('');
    setFormAddress('');
    setFormCity('Coimbatore');
    setFormPhone('');
    setFormWaste(['E-Waste']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (center: CollectionCenter) => {
    setEditingCenter(center);
    setFormName(center.name);
    setFormAddress(center.address);
    setFormCity(center.city);
    setFormPhone(center.phone);
    setFormWaste(center.acceptedWaste);
    setIsModalOpen(true);
  };

  const handleToggleVerify = async (center: CollectionCenter) => {
    try {
      if (center.verified) {
        await adminApi.unverifyCenter(center.id);
        showToast('info', `${center.name} is now unverified.`);
      } else {
        await adminApi.verifyCenter(center.id);
        showToast('success', `${center.name} is now verified!`);
      }
      setCenters((prev) =>
        prev.map((c) =>
          c.id === center.id ? { ...c, verified: !c.verified } : c
        )
      );
    } catch {
      showToast('error', 'Failed to update verification state.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await adminApi.deleteCenter(id);
      setCenters((prev) => prev.filter((c) => c.id !== id));
      showToast('success', 'Center deleted successfully.');
    } catch {
      showToast('error', 'Failed to delete center.');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress) return;

    if (editingCenter) {
      setCenters((prev) =>
        prev.map((c) =>
          c.id === editingCenter.id
            ? {
                ...c,
                name: formName,
                address: formAddress,
                city: formCity,
                phone: formPhone,
                acceptedWaste: formWaste,
              }
            : c
        )
      );
      showToast('success', 'Center updated successfully.');
    } else {
      const newCenter: CollectionCenter = {
        id: 'c-' + Date.now(),
        name: formName,
        description: 'Newly added collection center.',
        address: formAddress,
        city: formCity,
        state: 'Tamil Nadu',
        phone: formPhone,
        latitude: 11.0168,
        longitude: 76.9558,
        rating: 5.0,
        reviewCount: 0,
        verified: true,
        acceptedWaste: formWaste,
        operatingHours: [
          { day: 'Monday', open: '09:00', close: '18:00', isClosed: false },
        ],
        images: [],
        distance: 1.0,
        isOpen: true,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      setCenters((prev) => [newCenter, ...prev]);
      showToast('success', 'New collection center added.');
    }
    setIsModalOpen(false);
  };

  const filteredCenters = centers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchesWaste =
      selectedWaste === 'All' || c.acceptedWaste.includes(selectedWaste);
    return matchesSearch && matchesWaste;
  });

  return (
    <AdminLayout
      title="Collection Centers"
      description="Manage, verify, and add waste collection centers"
      action={
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Add Center
        </Button>
      }
    >
      {/* Filters Bar */}
      <div className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-10 flex flex-col sm:flex-row gap-5 items-center justify-between shadow-lg">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#4ade80]" />
          <input
            type="text"
            placeholder="Search center name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-white/10 text-xs font-semibold bg-white/5 text-[#edf7ee] placeholder:text-[#edf7ee]/40 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80]"
          />
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto overflow-x-auto">
          {['All', 'E-Waste', 'Battery', 'Plastic', 'Electronics'].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWaste(w)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedWaste === w
                  ? 'bg-[#22c55e] text-[#052e16] shadow-md font-extrabold'
                  : 'bg-white/5 text-[#edf7ee]/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading centers..." />
      ) : (
        <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-mono font-bold text-[#4ade80] uppercase tracking-widest">
                  <th className="py-5 px-7">Center Name</th>
                  <th className="py-5 px-7">Location</th>
                  <th className="py-5 px-7">Accepted Waste</th>
                  <th className="py-5 px-7">Rating</th>
                  <th className="py-5 px-7">Status</th>
                  <th className="py-5 px-7 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs font-semibold text-[#edf7ee]">
                {filteredCenters.map((center) => (
                  <tr
                    key={center.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-5 px-7 font-bold text-[#edf7ee]">
                      <div className="flex items-center gap-2">
                        {center.name}
                        {center.verified && (
                          <Badge variant="verified">Verified Hub</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-7 text-[#edf7ee]/60 font-normal">
                      {center.address}, {center.city}
                    </td>
                    <td className="py-5 px-7">
                      <div className="flex flex-wrap gap-1.5">
                        {center.acceptedWaste.map((w) => (
                          <span
                            key={w}
                            className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-5 px-7 text-[#4ade80] font-bold">
                      {center.rating} ★
                    </td>
                    <td className="py-5 px-7">
                      <Badge variant={center.isOpen ? 'open' : 'closed'}>
                        {center.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </td>
                    <td className="py-5 px-7 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVerify(center)}
                          title={center.verified ? 'Unverify' : 'Verify'}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            center.verified
                              ? 'text-[#4ade80] bg-[#4ade80]/10 hover:bg-[#22c55e] hover:text-[#052e16]'
                              : 'text-amber-400 bg-amber-400/10 hover:bg-amber-400 hover:text-black'
                          }`}
                        >
                          {center.verified ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <ShieldAlert className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(center)}
                          className="p-2.5 rounded-xl text-[#edf7ee]/80 bg-white/5 hover:bg-white/10 transition-all border border-white/10 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(center.id, center.name)}
                          className="p-2.5 rounded-xl text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingCenter
            ? 'Edit Collection Center'
            : 'Add New Collection Center'
        }
      >
        <form onSubmit={handleSaveForm} className="space-y-5 text-[#edf7ee]">
          <Input
            label="Center Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <Input
            label="Address"
            value={formAddress}
            onChange={(e) => setFormAddress(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
              required
            />
            <Input
              label="Phone"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[#4ade80] uppercase tracking-widest mb-2">
              Accepted Waste Types
            </label>
            <div className="flex flex-wrap gap-2">
              {['E-Waste', 'Battery', 'Plastic', 'Electronics', 'Other'].map(
                (type) => {
                  const isSelected = formWaste.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        if (isSelected)
                          setFormWaste(formWaste.filter((w) => w !== type));
                        else setFormWaste([...formWaste, type]);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#22c55e] text-[#052e16] shadow-sm font-extrabold'
                          : 'bg-white/5 text-[#edf7ee]/70 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  );
                }
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Center</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
