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
    <aside className="w-64 bg-eco-950 text-white flex flex-col min-h-screen shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-eco-900 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-eco-600 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">EcoDrop Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavItems.map(item => {
          const isActive = item.to === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-eco-700 text-white'
                  : 'text-eco-200/70 hover:bg-eco-900/60 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Back to App */}
      <div className="p-4 border-t border-eco-900">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-eco-200/60 hover:bg-eco-900/60 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to EcoDrop</span>
        </Link>
      </div>
    </aside>
  );
}
