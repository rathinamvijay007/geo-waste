import { Link, useLocation } from 'react-router-dom';
import { LogOut, Shield, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PillNav from '../common/PillNav';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navItems = isAuthenticated
    ? [
        { label: 'Home', href: '/' },
        { label: 'Explore', href: '/explore' },
        { label: 'Waste Guide', href: '/waste-guide' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Favorites', href: '/favorites' },
        { label: 'History', href: '/history' },
        { label: 'Impact', href: '/impact' },
        { label: 'Reviews', href: '/reviews' },
        { label: 'Reports', href: '/reports' },
        { label: 'Profile', href: '/profile' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Explore', href: '/explore' },
        { label: 'Waste Guide', href: '/waste-guide' },
        { label: 'Impact', href: '/impact' },
      ];

  const logoNode = (
    <div className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 rounded-full bg-[#143e2b] border border-[#4ade80]/40 flex items-center justify-center shadow-md shadow-[#22c55e]/20 group-hover:scale-105 transition-transform">
        <Leaf className="w-4 h-4 text-[#4ade80]" />
      </div>
      <span className="text-xl font-black font-display tracking-tight text-[#edf7ee]">
        EcoDrop
      </span>
    </div>
  );

  const rightActions = isAuthenticated ? (
    <div className="flex items-center gap-2.5">
      {user?.role === 'admin' && (
        <Link
          to="/admin"
          className="text-xs font-bold text-[#4ade80] bg-[#4ade80]/15 border border-[#4ade80]/40 px-3.5 py-1.5 rounded-full hover:bg-[#4ade80]/25 transition-all flex items-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        >
          <Shield className="w-3.5 h-3.5 text-[#4ade80]" /> Admin
        </Link>
      )}
      <Link
        to="/profile"
        className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:border-[#4ade80]/50 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
      >
        <div className="w-6 h-6 rounded-full bg-[#143e2b] text-[#4ade80] text-[11px] font-extrabold flex items-center justify-center ring-1 ring-[#4ade80]/50">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <span className="text-xs font-bold text-[#edf7ee] pr-1">{user?.name?.split(' ')[0]}</span>
      </Link>
      <button
        onClick={logout}
        className="p-1.5 rounded-full text-[#edf7ee]/70 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="text-xs font-bold text-[#edf7ee]/80 hover:text-white px-3.5 py-1.5 rounded-full transition-colors"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] hover:from-[#57f1db] hover:to-[#16a34a] text-[#052e16] text-xs font-extrabold px-4 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(74,222,128,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/40 hover:scale-105"
      >
        Get Started
      </Link>
    </div>
  );

  return (
    <header
      className="sticky top-0 z-50 w-full py-3 px-4 sm:px-8 border-b transition-all duration-300 shadow-2xl"
      style={{
        backgroundColor: 'rgba(6, 15, 10, 0.75)',
        backdropFilter: 'blur(20px) saturate(190%)',
        WebkitBackdropFilter: 'blur(20px) saturate(190%)',
        borderBottom: '1px solid rgba(74, 222, 128, 0.25)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <PillNav
          logoElement={logoNode}
          items={navItems}
          activeHref={location.pathname}
          baseColor="rgba(13, 22, 17, 0.88)"
          pillColor="rgba(74, 222, 128, 0.1)"
          hoveredPillTextColor="#052e16"
          pillTextColor="#edf7ee"
          ease="power3.easeOut"
          initialLoadAnimation={false}
          rightActions={rightActions}
        />
      </div>
    </header>
  );
}
