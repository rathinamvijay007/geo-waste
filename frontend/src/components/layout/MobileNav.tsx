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
    <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-full p-1.5 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
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
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#143e2b] text-white shadow-md'
                  : 'text-[#556358] hover:text-[#143e2b]'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

