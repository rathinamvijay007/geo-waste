import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-surface-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);

          // Only show auth-required items when authenticated
          if (!isAuthenticated && ['/favorites', '/dashboard', '/profile'].includes(item.to)) {
            return null;
          }

          return (
            <Link
              key={item.to}
              to={isAuthenticated ? item.to : (item.to === '/favorites' || item.to === '/dashboard' || item.to === '/profile') ? '/login' : item.to}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? 'text-eco-600'
                  : 'text-surface-400 hover:text-surface-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
