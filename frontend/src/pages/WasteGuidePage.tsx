import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Monitor, Battery, Package, Cpu, Recycle, ArrowRight, ShieldCheck,
  CheckCircle2, Info, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

interface WasteCategoryDetail {
  id: string;
  name: string;
  icon: typeof Monitor;
  color: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  desc: string;
  materials: string[];
  instructions: string[];
  donts: string[];
}

const categoriesData: WasteCategoryDetail[] = [
  {
    id: 'E-Waste',
    name: 'E-Waste (Electronic Waste)',
    icon: Monitor,
    color: 'text-[#22c55e]',
    border: 'border-[#22c55e]/30',
    badgeBg: 'bg-[#ebf5ed]',
    badgeText: 'text-[#143e2b]',
    desc: 'Laptops, mobile phones, desktop computers, tablets, servers, and computer peripherals containing metals and hazardous chemicals.',
    materials: ['Smartphones & Tablets', 'Laptops & Monitors', 'Keyboards & Mice', 'Printers & Scanners', 'Modems & Routers'],
    instructions: [
      'Back up all personal data and perform a factory reset.',
      'Remove SIM cards and external memory cards.',
      'Keep cords and adapters tied neatly with the device.',
      'Do not breach battery casings or crush components.'
    ],
    donts: ['Do not throw e-waste into household garbage bins.', 'Do not burn plastic casings or circuit boards.']
  },
  {
    id: 'Battery',
    name: 'Batteries & Energy Storage',
    icon: Battery,
    color: 'text-amber-600',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-800',
    desc: 'Household alkaline AA/AAA batteries, lithium-ion rechargeable batteries, laptop batteries, power banks, and car lead-acid batteries.',
    materials: ['Lithium-Ion Phone Batteries', 'Alkaline AA / AAA / 9V', 'Power Banks & UPS Units', 'Car Lead-Acid Batteries'],
    instructions: [
      'Tape terminals of lithium batteries with clear tape to prevent short circuits.',
      'Store spent batteries in a cool, dry plastic container prior to drop-off.',
      'Keep lead-acid batteries upright to avoid acid leakage.'
    ],
    donts: ['Never puncture or expose batteries to fire.', 'Never store corroding batteries near flammable liquids.']
  },
  {
    id: 'Plastic',
    name: 'Plastics & Polymers',
    icon: Package,
    color: 'text-blue-600',
    border: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-800',
    desc: 'Rigid plastic containers, PET beverage bottles, HDPE milk jugs, clean food packaging, and industrial polymer sheets.',
    materials: ['PET Bottles (#1)', 'HDPE Containers (#2)', 'Rigid Packaging (#5 PP)', 'Clean Plastic Wraps'],
    instructions: [
      'Rinse out food residue and liquids before recycling.',
      'Flatten PET bottles to save space.',
      'Separate bottle caps if specified by the facility.'
    ],
    donts: ['Do not send heavily contaminated oily plastics.', 'Avoid single-use styrofoam cups (#6 EPS).']
  },
  {
    id: 'Electronics',
    name: 'Home Appliances & Electronics',
    icon: Cpu,
    color: 'text-purple-600',
    border: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-800',
    desc: 'Refrigerators, washing machines, microwave ovens, air conditioners, audio systems, and small kitchen appliances.',
    materials: ['Microwaves & Ovens', 'Refrigerators & ACs', 'Washing Machines', 'Audio Systems & TVs'],
    instructions: [
      'Unplug 24 hours prior to transportation.',
      'Defrost refrigerators completely.',
      'Secure loose cables and doors with tape.'
    ],
    donts: ['Do not vent refrigerant gases manually.', 'Do not dismantle compressor units yourself.']
  },
  {
    id: 'Other',
    name: 'Glass, Metal & Paper Recyclables',
    icon: Recycle,
    color: 'text-stone-600',
    border: 'border-stone-400/30',
    badgeBg: 'bg-stone-500/10',
    badgeText: 'text-stone-800',
    desc: 'Clean cardboard boxes, aluminum beverage cans, steel food tins, glass bottles, and sorted office paper.',
    materials: ['Cardboard Containers', 'Aluminum & Steel Cans', 'Glass Bottles & Jars', 'Sorted Paper & Books'],
    instructions: [
      'Flatten all cardboard boxes.',
      'Rinse glass jars and remove metal caps.',
      'Ensure paper materials remain dry.'
    ],
    donts: ['Do not mix broken window glass with bottle recyclables.', 'Do not include wax-coated paper packaging.']
  }
];

export default function WasteGuidePage() {
  const { category: activeCategoryParam } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState<string>(activeCategoryParam || categoriesData[0].id);

  const selectedCategory = categoriesData.find(c => c.id.toLowerCase() === selectedCatId.toLowerCase()) || categoriesData[0];

  return (
    <div className="py-24 sm:py-32 lg:py-40 min-h-screen bg-ambient-light">
      <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#ebf5ed] border border-[#22c55e]/30 text-[#143e2b] text-xs font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#22c55e]" />
            <span>RESPONSIBLE DISPOSAL KNOWLEDGE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#1b251f] tracking-tight">
            Waste Category & Disposal Guide
          </h1>
          <p className="text-lg text-[#556358] leading-relaxed font-medium">
            Learn how to sort, handle, and safely dispose of specialized waste materials before dropping them off at certified collection hubs.
          </p>
        </motion.div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-16 scrollbar-none justify-start md:justify-center">
          {categoriesData.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                navigate(`/waste-guide/${cat.id.toLowerCase()}`, { replace: true });
              }}
              className={`flex items-center gap-3.5 px-7 py-4 rounded-2xl text-sm font-extrabold border transition-all duration-300 shrink-0 cursor-pointer ${
                selectedCategory.id === cat.id
                  ? 'bg-[#143e2b] text-white border-[#143e2b] shadow-xl shadow-[#143e2b]/30 scale-105'
                  : 'bg-white/80 backdrop-blur-md text-[#4a554e] border-[#eaeae4] hover:border-[#22c55e]/40 hover:bg-[#ebf5ed]'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <span>{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Category Detail Card */}
        <motion.div
          key={selectedCategory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel rounded-3xl border border-white/80 p-10 sm:p-14 lg:p-16 shadow-2xl space-y-12 mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-[#eaeae4]">
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-3xl ${selectedCategory.badgeBg} ${selectedCategory.border} border flex items-center justify-center shrink-0 shadow-md`}>
                <selectedCategory.icon className={`w-10 h-10 ${selectedCategory.color}`} />
              </div>
              <div className="space-y-3">
                <span className={`text-xs font-extrabold uppercase tracking-widest ${selectedCategory.badgeText} ${selectedCategory.badgeBg} px-4 py-1.5 rounded-full inline-block border ${selectedCategory.border}`}>
                  {selectedCategory.id} Recycling
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-[#1b251f] tracking-tight">{selectedCategory.name}</h2>
                <p className="text-base text-[#556358] max-w-2xl leading-relaxed font-medium mt-2">{selectedCategory.desc}</p>
              </div>
            </div>
            <Link to={`/explore?waste=${selectedCategory.id}`}>
              <Button size="lg" className="shadow-lg shadow-[#143e2b]/25 px-8 py-4" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Find {selectedCategory.id} Centers
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Accepted Materials List */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> Accepted Material Examples
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCategory.materials.map(m => (
                  <div key={m} className="p-4 rounded-2xl bg-white/90 border border-[#eaeae4] text-sm font-bold text-[#1b251f] shadow-2xs flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shrink-0" />
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Steps */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" /> Preparation & Handling Guidelines
              </h3>
              <div className="space-y-3">
                {selectedCategory.instructions.map((step, idx) => (
                  <div key={idx} className="p-4.5 rounded-2xl bg-white/90 border border-[#eaeae4] text-sm text-[#4a554e] font-medium leading-relaxed shadow-2xs flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-xl bg-[#ebf5ed] text-[#143e2b] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Safety Warnings & Prohibited Practices */}
          <div className="p-8 sm:p-10 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 text-amber-800">
              <Info className="w-4 h-4 text-amber-600" /> Critical Safety Warnings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCategory.donts.map((d, i) => (
                <p key={i} className="text-sm font-semibold text-amber-900 leading-relaxed flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>{d}</span>
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
