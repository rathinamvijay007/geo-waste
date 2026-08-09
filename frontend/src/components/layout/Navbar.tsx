import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isAuthenticated ? [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Waste Guide', path: '/waste-guide' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'History', path: '/history' },
    { label: 'Impact', path: '/impact' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Reports', path: '/reports' },
    { label: 'Profile', path: '/profile' },
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Waste Guide', path: '/waste-guide' },
    { label: 'Impact', path: '/impact' },
  ];

  return (
    <header className={`sticky top-0 z-40 h-20 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-2xl border-b border-[#22c55e]/15 shadow-sm' 
        : 'bg-white/60 backdrop-blur-md border-b border-[#eaeae4]/60'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#143e2b] flex items-center justify-center shadow-md shadow-[#143e2b]/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-[#4ade80]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight font-display text-[#143e2b]">
            EcoDrop
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#eaeae4]">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#143e2b] text-white shadow-xs'
                    : 'text-[#4a554e] hover:text-[#143e2b] hover:bg-[#ebf5ed]/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">
          {isAuthenticated ? (
            <div className="flex items-center gap-3.5">
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-xs font-bold text-[#143e2b] bg-[#ebf5ed] border border-[#22c55e]/30 px-4 py-2 rounded-full hover:bg-[#d8ebd9] transition-all flex items-center gap-1.5 shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-[#143e2b]" /> Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#eaeae4] bg-white/80 hover:border-[#143e2b]/30 transition-all">
                <div className="w-7 h-7 rounded-full bg-[#143e2b] text-white text-xs font-extrabold flex items-center justify-center ring-2 ring-[#4ade80]/40">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-bold text-[#143e2b] pr-1">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full text-[#556358] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-bold text-[#4a554e] hover:text-[#143e2b] px-4 py-2 rounded-full transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-[#143e2b] hover:bg-[#0e2c1f] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-[#143e2b]/20 hover:scale-105">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(p => !p)}
          className="lg:hidden p-2.5 rounded-2xl bg-white/80 border border-[#eaeae4] text-[#143e2b] cursor-pointer hover:bg-[#ebf5ed]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-2xl border-b border-[#eaeae4] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2.5">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all text-center ${
                    isActive ? 'bg-[#143e2b] text-white shadow-sm' : 'bg-stone-50/80 text-[#4a554e] border border-[#eaeae4]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#eaeae4] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="w-full text-center py-3 text-rose-600 font-bold text-xs border border-rose-200 bg-rose-50/50 rounded-full"
              >
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="w-full text-center py-3 text-[#143e2b] border border-[#143e2b] rounded-full text-xs font-bold">
                  Login
                </Link>
                <Link to="/register" className="w-full text-center py-3 bg-[#143e2b] text-white rounded-full text-xs font-bold shadow-md shadow-[#143e2b]/20">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

