import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, Users, Star, Flag, BarChart3, Leaf, ChevronLeft
} from 'lucide-react';

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/centers', label: 'Centers', icon: MapPin },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-72 bg-[#070e0b] text-white flex flex-col min-h-screen shrink-0 border-r border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#22c55e] flex items-center justify-center shadow-lg shadow-[#22c55e]/30">
            <Leaf className="w-5 h-5 text-[#070e0b]" />
          </div>
          <div>
            <span className="font-black font-display text-base tracking-tight block leading-none">EcoDrop</span>
            <span className="text-[10px] font-extrabold text-[#4ade80] uppercase tracking-widest">ADMIN PORTAL</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-5 space-y-2.5 relative z-10">
        {adminNavItems.map(item => {
          const isActive = item.to === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-[#22c55e] text-[#070e0b] shadow-lg shadow-[#22c55e]/25 font-black scale-102'
                  : 'text-[#c3ded0]/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Back to App */}
      <div className="p-5 border-t border-white/10 relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-xs font-bold text-[#c3ded0]/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#4ade80]" />
          <span>Back to EcoDrop</span>
        </Link>
      </div>
    </aside>
  );
}

