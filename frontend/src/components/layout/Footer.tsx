import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#070e0b] text-white pt-20 pb-12 border-t border-[#22c55e]/15 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#16a34a]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-5 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#143e2b] border border-[#22c55e]/30 flex items-center justify-center shadow-md shadow-[#22c55e]/10 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-[#4ade80]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight font-display text-white">
                EcoDrop
              </span>
            </Link>
            <p className="text-xs text-[#a3b8ac] leading-relaxed font-normal">
              Discover verified recycling and waste drop-off centers near you, compare options, and dispose of waste responsibly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#4ade80]">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-[#c3ded0]">
              <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">Home</Link></li>
              <li><Link to="/explore" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">Explore Centers</Link></li>
              <li><Link to="/waste-guide" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">Waste Guide</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">Environmental Impact</Link></li>
            </ul>
          </div>

          {/* Waste Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#4ade80]">Waste Categories</h4>
            <ul className="space-y-2.5 text-xs text-[#c3ded0]">
              <li><Link to="/waste-guide/e-waste" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">E-Waste</Link></li>
              <li><Link to="/waste-guide/battery" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">Batteries</Link></li>
              <li><Link to="/waste-guide/plastic" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">Plastic</Link></li>
              <li><Link to="/waste-guide/electronics" className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">Electronics</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#4ade80]">Contact & Support</h4>
            <p className="text-xs text-[#c3ded0] leading-relaxed">
              Support & Inquiries:<br />
              <span className="text-white font-semibold">support@ecodrop.in</span>
            </p>
            <p className="text-xs text-[#a3b8ac]">
              Coimbatore, Tamil Nadu, India
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8ca094] gap-4">
          <p>© {new Date().getFullYear()} EcoDrop. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

