import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, X, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminLayout({ children, title, description, action }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ambient-light flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-72 bg-[#070e0b] text-white min-h-screen flex flex-col shadow-2xl">
            <div className="p-5 flex items-center justify-between border-b border-white/10">
              <span className="font-extrabold font-display text-sm flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-[#4ade80]" /> Admin Portal
              </span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-[#c3ded0] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setSidebarOpen(false)}>
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#eaeae4] px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#4a554e] hover:bg-[#ebf5ed] cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-display text-[#1b251f] tracking-tight">{title}</h1>
              {description && <p className="text-xs sm:text-sm font-medium text-[#556358] mt-0.5">{description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {action}
            <Link to="/profile" className="w-10 h-10 rounded-2xl bg-[#143e2b] text-white flex items-center justify-center font-extrabold text-sm shadow-sm hover:scale-105 transition-transform">
              A
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 sm:p-12 lg:p-16 max-w-8xl mx-auto w-full flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


