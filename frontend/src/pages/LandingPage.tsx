import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, ArrowRight, ShieldCheck, Sparkles, Leaf, CheckCircle2,
  Monitor, Battery, Package, Cpu, Recycle, ChevronDown, Award, Globe
} from 'lucide-react';
import { centerApi } from '../api/centerApi';
import type { CollectionCenter } from '../types';
import CenterCard from '../components/center/CenterCard';

const howItWorks = [
  {
    step: '01',
    title: 'Select Waste Category',
    desc: 'Choose from certified categories including E-waste, rechargeable batteries, rigid polymers, or heavy appliances.',
    active: true
  },
  {
    step: '02',
    title: 'Share Location',
    desc: 'Enable GPS or enter your city to uncover CPCB-verified collection centers in your immediate vicinity.',
    active: false
  },
  {
    step: '03',
    title: 'Compare Verified Facilities',
    desc: 'Filter hubs by distance, operating schedule, verified CPCB status, and authentic community ratings.',
    active: false
  },
  {
    step: '04',
    title: 'Navigate & Drop-off',
    desc: 'Get turn-by-turn directions directly to the center and receive confirmation of responsible disposal.',
    active: false
  },
];

const wasteCategoriesShowcase = [
  { id: 'E-Waste', name: 'E-Waste & Computing', icon: Monitor, color: 'text-[#22c55e]', bg: 'bg-[#ebf5ed]', items: 'Smartphones, Laptops, Monitors' },
  { id: 'Battery', name: 'Batteries & Energy', icon: Battery, color: 'text-amber-600', bg: 'bg-amber-50', items: 'Lithium-Ion, AA/AAA, Power Banks' },
  { id: 'Plastic', name: 'Plastics & Polymers', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', items: 'PET Bottles, HDPE Packaging' },
  { id: 'Electronics', name: 'Appliances & Heavy', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50', items: 'Microwaves, AC Units, Audio' },
  { id: 'Other', name: 'Glass & Paper Metals', icon: Recycle, color: 'text-stone-600', bg: 'bg-stone-100', items: 'Cardboard, Aluminum, Glass Jars' },
];

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: '100% CPCB Certified Hubs',
    desc: 'Every center listed on EcoDrop undergoes rigorous verification against Central Pollution Control Board guidelines for ethical hazardous waste recycling.'
  },
  {
    icon: Globe,
    title: 'Real-Time Schedule Accuracy',
    desc: 'Live status indicators show open facilities in your city so you never travel to a closed drop-off point.'
  },
  {
    icon: Award,
    title: 'Community Verified Reviews',
    desc: 'Authentic feedback and photos submitted by local citizens ensuring transparent ratings for every facility.'
  }
];

const faqs = [
  {
    q: 'How does EcoDrop ensure collection centers are legitimate?',
    a: 'We cross-reference all collection hubs with official CPCB (Central Pollution Control Board) registries and conduct periodic community audits.'
  },
  {
    q: 'Is there any fee to find or drop off waste at certified centers?',
    a: 'EcoDrop is completely free for citizens to discover centers. Drop-off terms depend on the facility — many centers accept recyclables free of charge or offer buyback credits.'
  },
  {
    q: 'What should I do before dropping off electronic devices?',
    a: 'Back up your personal data, perform a full factory reset, remove SIM/memory cards, and tie loose power cables together.'
  },
  {
    q: 'Can I suggest a new drop-off center in my locality?',
    a: 'Yes! Users can submit new facility details or flag outdated information, which our admin team verifies within 24 hours.'
  }
];

export default function LandingPage() {
  const [popularCenters, setPopularCenters] = useState<CollectionCenter[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    centerApi.getPopularCenters().then(setPopularCenters).catch(() => {});
  }, []);

  return (
    <div className="bg-ambient-light text-[#1b251f] overflow-x-hidden min-h-screen">
      
      {/* 1. Ultra-Spacious Hero Section with Full Video Background */}
      <section className="relative py-36 sm:py-48 lg:py-60 overflow-hidden min-h-[90vh] flex items-center bg-[#070e0b]">
        {/* Full Visibility Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-90 scale-105"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Minimal Dark Overlay for Text Legibility (No Green Blockers) */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] z-0 pointer-events-none" />

        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-12"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#070e0b]/80 backdrop-blur-md border border-[#4ade80]/40 text-xs font-extrabold uppercase tracking-widest text-[#4ade80] shadow-lg">
                <Sparkles className="w-4 h-4 text-[#22c55e]" />
                <span>CPCB-CERTIFIED RECYCLING DISCOVERY</span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black font-display text-white tracking-tight leading-[1.04] drop-shadow-md">
                Find the right place for your waste.
              </h1>

              <p className="text-xl sm:text-2xl text-[#e2ece6] max-w-3xl leading-relaxed font-medium drop-shadow-sm">
                Discover verified recycling hubs and certified waste drop-off centers near you. Compare options, view real-time operating hours, and dispose of materials responsibly.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-6">
                <Link
                  to="/explore"
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-[#070e0b] text-lg font-extrabold px-11 py-5 rounded-full transition-all duration-300 shadow-2xl shadow-[#22c55e]/40 hover:scale-[1.03] inline-flex items-center justify-center gap-3.5 group cursor-pointer"
                >
                  <span>Find Drop-off Centers</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
                <Link
                  to="/waste-guide"
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 text-lg font-extrabold px-11 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center cursor-pointer"
                >
                  Explore Waste Guide
                </Link>
              </div>

              {/* Trust Micro Indicators */}
              <div className="pt-10 border-t border-white/20 flex flex-wrap items-center gap-8 text-xs font-extrabold text-[#c3ded0] uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> 100% CPCB Compliant
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> Live Operating Schedules
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> Verified Community Ratings
                </span>
              </div>
            </motion.div>

            {/* Right Visual Glass HUD Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative glass-panel rounded-3xl p-12 sm:p-16 lg:p-20 text-center min-h-[620px] flex flex-col items-center justify-center border border-white/80 shadow-2xl overflow-hidden space-y-10">
                {/* Background Pattern Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-[#143e2b] max-w-md mx-auto leading-snug relative z-10">
                  Verified collection points within your reach
                </h3>

                {/* Center Location Icon Badge */}
                <div className="relative z-10 w-28 h-28 rounded-3xl bg-[#143e2b] text-white flex items-center justify-center shadow-2xl shadow-[#143e2b]/40 mx-auto transform hover:scale-105 transition-transform">
                  <MapPin className="w-13 h-13 text-[#4ade80]" />
                </div>

                {/* Floating Glass Widgets */}
                <div className="space-y-5 relative z-10 w-full max-w-md mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-md border border-[#e5ebe7] flex items-center justify-between gap-5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-12 h-12 rounded-2xl bg-[#ebf5ed] flex items-center justify-center text-[#143e2b]">
                        <ShieldCheck className="w-7 h-7" />
                      </span>
                      <div className="text-left">
                        <span className="text-xs font-extrabold text-[#556358] uppercase tracking-wider block">Verified Hubs</span>
                        <span className="text-xs font-bold text-[#788a7e]">Active in your state</span>
                      </div>
                    </div>
                    <span className="text-4xl font-black font-display text-[#143e2b]">86</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-md border border-[#e5ebe7] flex items-center justify-between gap-5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-12 h-12 rounded-2xl bg-[#ebf5ed] flex items-center justify-center text-[#143e2b]">
                        <Leaf className="w-7 h-7 text-[#22c55e]" />
                      </span>
                      <div className="text-left">
                        <span className="text-xs font-extrabold text-[#556358] uppercase tracking-wider block">Average Satisfaction</span>
                        <span className="text-xs font-bold text-[#788a7e]">Based on 1,400+ reviews</span>
                      </div>
                    </div>
                    <span className="text-4xl font-black font-display text-[#143e2b]">4.9 ★</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Expansive Waste Category Showcase Section */}
      <section className="py-32 sm:py-44 lg:py-52 border-t border-[#eaeae4]/70 relative bg-white/40">
        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
            <div className="space-y-4 max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block">SUPPORTED MATERIALS</span>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-[#1b251f] tracking-tight leading-tight">
                What would you like to recycle today?
              </h2>
            </div>
            <p className="text-lg text-[#556358] max-w-lg font-medium leading-relaxed">
              Explore specialized drop-off guidelines and locate nearby collection centers tailored to your specific material category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {wasteCategoriesShowcase.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Link
                  to={`/waste-guide/${cat.id.toLowerCase()}`}
                  className="glass-card rounded-3xl p-10 sm:p-12 border border-white/80 flex flex-col justify-between h-full space-y-8 hover:border-[#22c55e]/40 shadow-lg group block"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center shadow-xs`}>
                      <cat.icon className={`w-8 h-8 ${cat.color}`} />
                    </div>
                    <span className="w-10 h-10 rounded-full bg-[#ebf5ed] group-hover:bg-[#143e2b] text-[#143e2b] group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1b251f]">{cat.name}</h3>
                    <p className="text-sm font-semibold text-[#556358] leading-relaxed">{cat.items}</p>
                  </div>

                  <div className="pt-4 border-t border-[#eaeae4] text-xs font-extrabold uppercase tracking-widest text-[#143e2b] group-hover:underline">
                    View Disposal Guidelines →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Ultra-Spacious Process Walkthrough */}
      <section className="py-36 sm:py-48 lg:py-56 relative">
        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-3xl mb-24 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block">SIMPLE & SEAMLESS</span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-[#1b251f] tracking-tight leading-tight">
              Recycle smarter in four simple steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {howItWorks.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`glass-card rounded-3xl p-10 sm:p-12 border transition-all duration-300 flex flex-col justify-between min-h-[360px] shadow-lg ${
                  item.active
                    ? 'bg-[#ebf5ed]/90 border-[#22c55e]/40 shadow-xl shadow-[#22c55e]/15'
                    : 'bg-white/85 border-[#eaeae4]'
                }`}
              >
                <div>
                  <span className="text-4xl font-black font-display text-[#143e2b] block mb-10">
                    {item.step}
                  </span>
                  <h3 className="font-extrabold font-display text-[#1b251f] text-2xl sm:text-3xl mb-5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-base text-[#556358] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. State-of-the-Art Environmental Footprint HUD Section */}
      <section className="py-36 sm:py-48 lg:py-60 bg-ambient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none" />
        
        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="max-w-3xl mb-24 space-y-5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#4ade80] block">COMMUNITY METRICS</span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-white tracking-tight mb-5 leading-tight">
              Together, we’re making a measurable impact.
            </h2>
            <p className="text-xl sm:text-2xl text-[#c3ded0] leading-relaxed font-medium">
              Every thoughtful drop-off keeps valuable materials in active economic use and out of landfills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-14">
            <motion.div
              whileHover={{ y: -8 }}
              className="glass-card-dark rounded-3xl p-12 sm:p-14 border border-white/10 space-y-6 shadow-2xl"
            >
              <p className="text-5xl sm:text-7xl lg:text-8xl font-black font-display text-[#4ade80] tracking-tight">12,400+</p>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#c3ded0]">kg total waste diverted</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="glass-card-dark rounded-3xl p-12 sm:p-14 border border-white/10 space-y-6 shadow-2xl"
            >
              <p className="text-5xl sm:text-7xl lg:text-8xl font-black font-display text-[#4ade80] tracking-tight">8,200+</p>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#c3ded0]">kg CO₂ emissions avoided</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="glass-card-dark rounded-3xl p-12 sm:p-14 border border-white/10 space-y-6 shadow-2xl"
            >
              <p className="text-5xl sm:text-7xl lg:text-8xl font-black font-display text-[#4ade80] tracking-tight">86</p>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#c3ded0]">verified CPCB collection hubs</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CPCB Verification & Trust Protocol Section */}
      <section className="py-36 sm:py-48 lg:py-56 relative bg-white/40">
        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-3xl mb-24 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block">TRUST & ACCURACY</span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-[#1b251f] tracking-tight leading-tight">
              Why citizens trust EcoDrop.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {trustFeatures.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="glass-card rounded-3xl p-10 sm:p-14 border border-white/80 space-y-6 shadow-lg"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#ebf5ed] border border-[#22c55e]/30 flex items-center justify-center text-[#143e2b]">
                  <feat.icon className="w-8 h-8 text-[#22c55e]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1b251f]">{feat.title}</h3>
                <p className="text-base text-[#556358] leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Popular Drop-off Centers */}
      <section className="py-32 sm:py-44 lg:py-52">
        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block">FEATURED HUBS</span>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-[#1b251f] tracking-tight leading-tight">
                Popular drop-off centers
              </h2>
            </div>
            <p className="text-lg text-[#556358] max-w-md font-medium leading-relaxed">
              Discover highly rated recycling centers trusted by the EcoDrop community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {popularCenters.slice(0, 3).map((center, idx) => (
              <CenterCard key={center.id} center={center} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Community FAQ Accordion Section */}
      <section className="py-36 sm:py-48 lg:py-56 border-t border-[#eaeae4]/70 relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#1b251f] tracking-tight">
              Everything you need to know
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card rounded-3xl border border-white/80 overflow-hidden shadow-md">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-8 sm:p-10 text-left flex items-center justify-between gap-6 cursor-pointer font-extrabold font-display text-xl sm:text-2xl text-[#1b251f]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-[#143e2b] transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-8 sm:px-10 sm:pb-10 pt-0 text-base sm:text-lg text-[#556358] leading-relaxed font-medium border-t border-[#eaeae4]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final Hero CTA Banner */}
      <section className="py-36 sm:py-48 lg:py-60 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="glass-panel rounded-3xl p-14 sm:p-24 lg:p-28 text-center border border-white/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22c55e]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-[#143e2b] tracking-tight leading-tight">
                Ready to make your next drop-off count?
              </h2>
              <p className="text-xl sm:text-2xl text-[#4a6352] leading-relaxed font-medium max-w-3xl mx-auto">
                Find a verified waste collection center near you and take the next step toward responsible disposal.
              </p>
              <div className="pt-6">
                <Link
                  to="/explore"
                  className="bg-[#143e2b] hover:bg-[#0e2c1f] text-white text-xl font-extrabold px-12 py-6 rounded-full transition-all duration-300 shadow-2xl shadow-[#143e2b]/35 hover:scale-105 inline-flex items-center gap-4 group cursor-pointer"
                >
                  <span>Find a Drop-off Center</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



