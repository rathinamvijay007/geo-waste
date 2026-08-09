import { useEffect, useState } from 'react';
import { Search, Plus, Trash2, Edit2, ShieldCheck, ShieldAlert } from 'lucide-react';
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
  const [editingCenter, setEditingCenter] = useState<CollectionCenter | null>(null);

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
    adminApi.getAllCenters()
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
      setCenters(prev => prev.map(c => c.id === center.id ? { ...c, verified: !c.verified } : c));
    } catch {
      showToast('error', 'Failed to update verification state.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await adminApi.deleteCenter(id);
      setCenters(prev => prev.filter(c => c.id !== id));
      showToast('success', 'Center deleted successfully.');
    } catch {
      showToast('error', 'Failed to delete center.');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress) return;

    if (editingCenter) {
      setCenters(prev => prev.map(c => c.id === editingCenter.id ? {
        ...c,
        name: formName,
        address: formAddress,
        city: formCity,
        phone: formPhone,
        acceptedWaste: formWaste
      } : c));
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
        status: 'active'
      };
      setCenters(prev => [newCenter, ...prev]);
      showToast('success', 'New collection center added.');
    }
    setIsModalOpen(false);
  };

  const filteredCenters = centers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.address.toLowerCase().includes(search.toLowerCase()) ||
                          c.city.toLowerCase().includes(search.toLowerCase());
    const matchesWaste = selectedWaste === 'All' || c.acceptedWaste.includes(selectedWaste);
    return matchesSearch && matchesWaste;
  });

  return (
    <AdminLayout
      title="Collection Centers"
      description="Manage, verify, and add waste collection centers"
      action={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>Add Center</Button>}
    >
      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-surface-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search center name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-surface-300 text-sm bg-surface-50 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'E-Waste', 'Battery', 'Plastic', 'Electronics'].map(w => (
            <button
              key={w}
              onClick={() => setSelectedWaste(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedWaste === w ? 'bg-eco-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
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
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Center Name</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Accepted Waste</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 text-sm">
                {filteredCenters.map(center => (
                  <tr key={center.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-surface-900">
                      <div className="flex items-center gap-2">
                        {center.name}
                        {center.verified && <Badge variant="verified">Verified</Badge>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-surface-600">{center.address}, {center.city}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {center.acceptedWaste.map(w => (
                          <span key={w} className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-100 text-surface-700">
                            {w}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-surface-700 font-medium">{center.rating} ★</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={center.isOpen ? 'open' : 'closed'}>
                        {center.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleVerify(center)}
                          title={center.verified ? 'Unverify' : 'Verify'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            center.verified ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'
                          }`}
                        >
                          {center.verified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(center)}
                          className="p-1.5 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(center.id, center.name)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
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
        title={editingCenter ? 'Edit Collection Center' : 'Add New Collection Center'}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          <Input label="Center Name" value={formName} onChange={e => setFormName(e.target.value)} required />
          <Input label="Address" value={formAddress} onChange={e => setFormAddress(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={formCity} onChange={e => setFormCity(e.target.value)} required />
            <Input label="Phone" value={formPhone} onChange={e => setFormPhone(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">Accepted Waste Types</label>
            <div className="flex flex-wrap gap-2">
              {['E-Waste', 'Battery', 'Plastic', 'Electronics', 'Other'].map(type => {
                const isSelected = formWaste.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      if (isSelected) setFormWaste(formWaste.filter(w => w !== type));
                      else setFormWaste([...formWaste, type]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isSelected ? 'bg-eco-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surface-200">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Center</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
