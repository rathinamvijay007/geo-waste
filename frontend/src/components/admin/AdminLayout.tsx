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
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-72 bg-eco-950 text-white min-h-screen flex flex-col">
            <div className="p-5 flex items-center justify-between border-b border-eco-900">
              <span className="font-bold text-base flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-eco-400" /> Admin Portal
              </span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-eco-200 cursor-pointer">
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
        <header className="bg-white border-b border-surface-200/80 px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">{title}</h1>
              {description && <p className="text-xs sm:text-sm font-medium text-surface-500 mt-0.5">{description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {action}
            <Link to="/profile" className="w-10 h-10 rounded-2xl bg-eco-100 border border-eco-200 flex items-center justify-center font-bold text-eco-900 text-sm">
              A
            </Link>
          </div>
        </header>

        {/* Content Body — Spacious p-6 sm:p-10 */}
        <main className="p-6 sm:p-10 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
