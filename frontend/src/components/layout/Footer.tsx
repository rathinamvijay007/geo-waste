import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#143e2b] text-white pt-16 pb-12 border-t border-[#1f573f]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1f573f]">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white inline-block">
              EcoDrop
            </Link>
            <p className="text-xs text-[#c3ded0] leading-relaxed font-normal">
              Discover verified recycling and waste drop-off centers near you, compare options, and dispose responsibly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs text-[#c3ded0]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore Centers</Link></li>
              <li><Link to="/waste-guide" className="hover:text-white transition-colors">Waste Guide</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors">Environmental Impact</Link></li>
            </ul>
          </div>

          {/* Waste Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Waste Categories</h4>
            <ul className="space-y-2 text-xs text-[#c3ded0]">
              <li><Link to="/waste-guide/e-waste" className="hover:text-white transition-colors">E-Waste</Link></li>
              <li><Link to="/waste-guide/battery" className="hover:text-white transition-colors">Batteries</Link></li>
              <li><Link to="/waste-guide/plastic" className="hover:text-white transition-colors">Plastic</Link></li>
              <li><Link to="/waste-guide/electronics" className="hover:text-white transition-colors">Electronics</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <p className="text-xs text-[#c3ded0] leading-relaxed">
              Support & Inquiries:<br />
              <span className="text-white font-medium">support@ecodrop.in</span>
            </p>
            <p className="text-xs text-[#c3ded0]">
              Coimbatore, Tamil Nadu, India
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#c3ded0] gap-4">
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
