import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Monitor, Battery, Package, Cpu, Recycle, ArrowRight, ShieldCheck,
  CheckCircle2, Info, ChevronRight, Sparkles
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
    color: 'text-emerald-700',
    border: 'border-emerald-200/80',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
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
    color: 'text-amber-700',
    border: 'border-amber-200/80',
    badgeBg: 'bg-amber-50',
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
    color: 'text-blue-700',
    border: 'border-blue-200/80',
    badgeBg: 'bg-blue-50',
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
    color: 'text-purple-700',
    border: 'border-purple-200/80',
    badgeBg: 'bg-purple-50',
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
    color: 'text-stone-700',
    border: 'border-stone-200/80',
    badgeBg: 'bg-stone-50',
    badgeText: 'text-stone-800',
    desc: 'Glass bottles, aluminum beverage cans, scrap steel, corrugated cardboard boxes, books, and clean paper waste.',
    materials: ['Cardboard Shipping Boxes', 'Aluminum & Tin Cans', 'Glass Jars & Bottles', 'Scrap Metal Parts'],
    instructions: [
      'Collapse cardboard boxes flat.',
      'Rinse glass jars and metal cans clean.',
      'Bundle newspapers and scrap paper together.'
    ],
    donts: ['Do not include broken mirror or window glass.', 'Avoid wet or food-soiled cardboard.']
  }
];

export default function WasteGuidePage() {
  const { category: activeCategoryParam } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState<string>(activeCategoryParam || categoriesData[0].id);

  const selectedCategory = categoriesData.find(c => c.id.toLowerCase() === selectedCatId.toLowerCase()) || categoriesData[0];

  return (
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-eco-50 border border-eco-200/60 text-eco-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-eco-600" />
            <span>RESPONSIBLE DISPOSAL KNOWLEDGE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight mb-4">
            Waste Category & Disposal Guide
          </h1>
          <p className="text-base text-surface-500 leading-relaxed font-normal">
            Learn how to sort, handle, and safely dispose of specialized waste materials before dropping them off at certified collection hubs.
          </p>
        </motion.div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start md:justify-center">
          {categoriesData.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                navigate(`/waste-guide/${cat.id.toLowerCase()}`, { replace: true });
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 shrink-0 cursor-pointer ${
                selectedCategory.id === cat.id
                  ? 'bg-eco-900 text-white border-eco-900 shadow-md'
                  : 'bg-white text-surface-700 border-surface-200 hover:border-eco-300 hover:bg-surface-50'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span>{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Category Detail Card */}
        <motion.div
          key={selectedCategory.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 shadow-2xs space-y-8 mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-surface-100">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl ${selectedCategory.badgeBg} ${selectedCategory.border} border flex items-center justify-center shrink-0`}>
                <selectedCategory.icon className={`w-8 h-8 ${selectedCategory.color}`} />
              </div>
              <div className="space-y-1">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${selectedCategory.badgeText} ${selectedCategory.badgeBg} px-3 py-1 rounded-full inline-block border ${selectedCategory.border}`}>
                  {selectedCategory.id} Recycling
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">{selectedCategory.name}</h2>
                <p className="text-sm text-surface-500 max-w-2xl leading-relaxed mt-2">{selectedCategory.desc}</p>
              </div>
            </div>
            <Link to={`/explore?waste=${selectedCategory.id}`}>
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Find {selectedCategory.id} Centers
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Accepted Materials */}
            <div className="bg-surface-50/70 rounded-2xl border border-surface-200/60 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Accepted Materials
              </h3>
              <ul className="space-y-2.5">
                {selectedCategory.materials.map(m => (
                  <li key={m} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-surface-800">
                    <ChevronRight className="w-4 h-4 text-eco-700 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Instructions */}
            <div className="bg-surface-50/70 rounded-2xl border border-surface-200/60 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-eco-700" /> Drop-off Preparation
              </h3>
              <ul className="space-y-2.5">
                {selectedCategory.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-surface-600 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-eco-100 text-eco-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Warnings */}
            <div className="bg-rose-50/50 rounded-2xl border border-rose-200/60 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-600" /> Safety Warnings
              </h3>
              <ul className="space-y-2.5">
                {selectedCategory.donts.map((dont, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{dont}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
