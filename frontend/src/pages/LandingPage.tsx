import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Check } from 'lucide-react';
import { centerApi } from '../api/centerApi';
import type { CollectionCenter } from '../types';

const howItWorks = [
  { step: '01', title: 'Select Category', desc: 'Choose the type of waste you want to dispose of.', active: true },
  { step: '02', title: 'Share Location', desc: 'Use your location to discover nearby centers.', active: false },
  { step: '03', title: 'Compare Verified Centers', desc: 'Compare distance, ratings, accepted waste and availability.', active: false },
  { step: '04', title: 'Get Direct Directions', desc: 'Choose a center and navigate there.', active: false },
];

export default function LandingPage() {
  const [popularCenters, setPopularCenters] = useState<CollectionCenter[]>([]);

  useEffect(() => {
    centerApi.getPopularCenters().then(setPopularCenters).catch(() => {});
  }, []);

  return (
    <div className="bg-[#f9f9f6] text-[#1b251f] overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#143e2b] block">
                SMARTER WASTE DISCOVERY
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1b251f] tracking-tight leading-[1.12]">
                Find the right place for your waste.
              </h1>

              <p className="text-base sm:text-lg text-[#556358] max-w-xl leading-relaxed font-normal">
                Discover verified recycling and waste drop-off centers near you, compare options, and find the right place to dispose of your waste responsibly.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/explore"
                  className="bg-[#143e2b] hover:bg-[#0e2c1f] text-white text-sm sm:text-base font-semibold px-7 py-3.5 rounded-full transition-colors shadow-xs inline-flex items-center justify-center"
                >
                  Find Drop-off Center
                </Link>
                <Link
                  to="/waste-guide"
                  className="bg-white hover:bg-[#f3f3ee] text-[#143e2b] border border-[#d5ded8] text-sm sm:text-base font-semibold px-7 py-3.5 rounded-full transition-colors inline-flex items-center justify-center"
                >
                  Explore Waste Guide
                </Link>
              </div>
            </motion.div>

            {/* Right Visual Container — Matching Screenshot 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-6"
            >
              <div className="relative bg-[#eaf4eb] rounded-3xl p-8 sm:p-12 text-center min-h-[420px] flex flex-col items-center justify-center border border-[#d8ebd9]">
                <h3 className="text-xl sm:text-2xl font-bold text-[#143e2b] max-w-xs mx-auto mb-8 leading-snug">
                  Verified collection points within your reach
                </h3>

                {/* Center Location Icon Badge */}
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mx-auto mb-8">
                  <MapPin className="w-8 h-8 text-[#143e2b]" />
                </div>

                {/* Floating Card 1 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5ebe7] inline-flex items-center gap-4 mb-3 min-w-[200px]">
                  <span className="text-2xl font-extrabold text-[#143e2b]">62</span>
                  <span className="text-xs font-semibold text-[#556358]">Verified hubs</span>
                </div>

                {/* Floating Card 2 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5ebe7] inline-flex items-center gap-4 min-w-[200px]">
                  <span className="text-2xl font-extrabold text-[#143e2b]">4.8</span>
                  <span className="text-xs font-semibold text-[#556358]">Community rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recycle Smarter in Four Simple Steps — Matching Screenshot 2 */}
      <section className="py-20 sm:py-24 bg-[#f9f9f6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1b251f] tracking-tight mb-12">
            Recycle smarter in four simple steps.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map(item => (
              <div
                key={item.step}
                className={`rounded-2xl p-7 border transition-all flex flex-col justify-between min-h-[220px] ${
                  item.active
                    ? 'bg-[#ebf5ed] border-[#cbe4cf]'
                    : 'bg-white border-[#eaeae4]'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#143e2b] block mb-4">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-[#1b251f] text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#556358] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Together, we're making an impact — Matching Screenshot 2 Bottom */}
      <section className="py-20 sm:py-24 bg-[#143e2b] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Together, we’re making an impact.
          </h2>
          <p className="text-sm sm:text-base text-[#c3ded0] max-w-xl mb-12 leading-relaxed">
            Every thoughtful drop-off keeps valuable materials in use and out of the wrong place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#1f573f] rounded-2xl p-8 border border-[#27664c] space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">12,400+</p>
              <p className="text-xs font-semibold text-[#c3ded0]">kg waste diverted</p>
            </div>
            <div className="bg-[#1f573f] rounded-2xl p-8 border border-[#27664c] space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">8,200+</p>
              <p className="text-xs font-semibold text-[#c3ded0]">kg CO₂ avoided</p>
            </div>
            <div className="bg-[#1f573f] rounded-2xl p-8 border border-[#27664c] space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">86</p>
              <p className="text-xs font-semibold text-[#c3ded0]">verified centers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Drop-off Centers — Matching Screenshot 3 */}
      <section className="py-20 sm:py-24 bg-[#f9f9f6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1b251f] tracking-tight mb-2">
              Popular drop-off centers
            </h2>
            <p className="text-sm text-[#556358]">
              Discover highly rated recycling centers trusted by the EcoDrop community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCenters.slice(0, 3).map(center => (
              <div key={center.id} className="bg-white rounded-2xl p-6 border border-[#eaeae4] shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#143e2b]">
                    <Check className="w-4 h-4 text-[#143e2b]" />
                    <span>Verified center</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1b251f] tracking-tight">{center.name}</h3>
                  <p className="text-xs text-[#556358]">{center.address}, {center.city}</p>
                  <div className="flex items-center gap-2 text-xs text-[#556358] font-medium pt-1">
                    <span>{center.distance} km</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#143e2b] text-[#143e2b]" /> {center.rating} ({center.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#556358] pt-1">
                    <span className="w-2 h-2 rounded-full bg-[#143e2b]" />
                    <span>Open now</span>
                  </div>
                  <p className="text-xs text-[#556358] pt-1 font-normal">
                    {center.acceptedWaste.join(' • ')}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/center/${center.id}`}
                    className="inline-block bg-[#ebf5ed] hover:bg-[#d8ebd9] text-[#143e2b] text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — Matching Screenshot 3 Bottom */}
      <section className="py-20 sm:py-24 bg-[#eaf4eb] text-center border-t border-[#d8ebd9]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143e2b] tracking-tight leading-tight">
            Ready to make your next drop-off count?
          </h2>
          <p className="text-sm sm:text-base text-[#4a6352] max-w-xl mx-auto leading-relaxed">
            Find a verified waste collection center near you and take the next step toward responsible disposal.
          </p>
          <div className="pt-4">
            <Link
              to="/explore"
              className="bg-[#143e2b] hover:bg-[#0e2c1f] text-white text-sm sm:text-base font-semibold px-8 py-4 rounded-full transition-colors shadow-xs inline-block"
            >
              Find a Drop-off Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
