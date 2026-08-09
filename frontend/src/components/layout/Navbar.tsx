import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <header className="sticky top-0 z-40 bg-[#f9f9f6] border-b border-[#eaeae4]/80 h-20 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold tracking-tight text-[#143e2b]">
            EcoDrop
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#143e2b] font-bold underline underline-offset-8 decoration-2'
                    : 'text-[#4a554e] hover:text-[#143e2b]'
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
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-xs font-semibold text-[#143e2b] bg-[#eaf4eb] px-3.5 py-2 rounded-full hover:bg-[#d8ebd9] transition-colors">
                  <Shield className="w-3.5 h-3.5 inline mr-1" /> Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-[#143e2b]">
                <div className="w-8 h-8 rounded-full bg-[#143e2b] text-white text-xs font-bold flex items-center justify-center">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-semibold text-[#4a554e] hover:text-red-600 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-[#4a554e] hover:text-[#143e2b]">
                Login
              </Link>
              <Link to="/register" className="bg-[#143e2b] hover:bg-[#0e2c1f] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-xs">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(p => !p)}
          className="lg:hidden p-2 rounded-xl text-[#143e2b] cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-[#f9f9f6] border-b border-[#eaeae4] p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive ? 'bg-[#143e2b] text-white' : 'bg-white text-[#4a554e] border border-[#eaeae4]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#eaeae4] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="w-full text-center py-3 text-red-600 font-semibold text-xs border border-red-200 rounded-full"
              >
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="w-full text-center py-2.5 text-[#143e2b] border border-[#143e2b] rounded-full text-sm font-semibold">
                  Login
                </Link>
                <Link to="/register" className="w-full text-center py-2.5 bg-[#143e2b] text-white rounded-full text-sm font-semibold">
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
