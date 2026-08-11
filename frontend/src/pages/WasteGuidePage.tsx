import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Sparkles,
  Search,
  X,
  Monitor,
  Battery,
  Package,
  Cpu,
  Recycle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Info,
  MapPin,
  ChevronDown,
  ChevronUp,
  Zap,
  RotateCcw,
  Factory,
  Check,
  Flame,
  Compass,
  ArrowUpRight,
  Layers,
  Award,
  CheckSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import { wasteApi } from '../api/wasteApi';
import type { WasteCategory as APIWasteCategory } from '../types';
import { ParticleCard } from '../components/common/MagicBento';

// EcoDrop Design System Waste Category Detail Interface
interface WasteCategoryDetail {
  id: string;
  name: string;
  slug: string;
  icon: typeof Monitor;
  badgeBg: string;
  badgeText: string;
  border: string;
  glowColor: string;
  desc: string;
  recyclabilityRate: string;
  co2SavedPerKg: string;
  energySaved: string;
  landfillDiversion: string;
  materials: { name: string; status: 'Accepted' | 'Special Handling' | 'Clean Only'; detail: string }[];
  instructions: { title: string; text: string }[];
  donts: string[];
}

const CATEGORY_DETAILS: Record<string, WasteCategoryDetail> = {
  'e-waste': {
    id: 'E-Waste',
    name: 'E-Waste (Electronic Waste)',
    slug: 'e-waste',
    icon: Monitor,
    badgeBg: 'bg-[#4ade80]/10',
    badgeText: 'text-[#4ade80]',
    border: 'border-[#4ade80]/30',
    glowColor: 'rgba(74, 222, 128, 0.18)',
    desc: 'Smartphones, laptops, desktop computers, servers, circuit boards, and electronic peripherals containing valuable precious metals and hazardous heavy chemicals.',
    recyclabilityRate: '92% Material Recovery',
    co2SavedPerKg: '3.8 kg CO₂ / kg',
    energySaved: '85% Energy Saved',
    landfillDiversion: 'High Toxicity Prevention',
    materials: [
      { name: 'Smartphones & Mobile Devices', status: 'Accepted', detail: 'Perform factory reset, back up personal data & remove SIM / memory cards.' },
      { name: 'Laptops & Desktop Computers', status: 'Accepted', detail: 'Remove external battery modules & wipe internal hard drives.' },
      { name: 'Keyboards, Mice & Peripherals', status: 'Accepted', detail: 'Bundle cords neatly using reusable tie-wraps.' },
      { name: 'Printers & Desktop Scanners', status: 'Special Handling', detail: 'Remove ink & toner cartridges prior to drop-off.' },
      { name: 'Modems, Routers & Network Switches', status: 'Accepted', detail: 'Include original AC power adapters.' },
      { name: 'Computer Motherboards & RAM Chips', status: 'Accepted', detail: 'High gold, silver, and copper recovery yield.' },
    ],
    instructions: [
      { title: 'Complete Data Wipe & System Reset', text: 'Back up all personal files, photos, and accounts to cloud storage, then initiate a full factory device reset.' },
      { title: 'Detach Peripheral Accessories', text: 'Remove protective phone cases, screen covers, SIM card trays, and microSD memory cards.' },
      { title: 'Neat Cable Coiling & Taping', text: 'Neatly fold power cables and tape them directly to the device body to prevent tangling during transport.' },
      { title: 'Safe Padded Transportation', text: 'Place fragile display screens face-down inside sturdy cardboard boxes with protective padding.' },
    ],
    donts: [
      'Never discard electronic devices in household garbage bins or municipal trash dumpsters.',
      'Do not breach, crack, disassemble, or drill into lithium battery casings yourself.',
      'Never incinerate, melt, or burn circuit boards, PVC cables, or plastic housings.',
      'Do not bring wet or water-submerged electronics without allowing them to dry completely.',
    ],
  },
  battery: {
    id: 'Battery',
    name: 'Batteries & Energy Storage',
    slug: 'battery',
    icon: Battery,
    badgeBg: 'bg-amber-400/10',
    badgeText: 'text-amber-400',
    border: 'border-amber-400/30',
    glowColor: 'rgba(251, 191, 36, 0.18)',
    desc: 'Household alkaline AA/AAA batteries, lithium-ion rechargeable packs, laptop batteries, power banks, and automotive lead-acid cells.',
    recyclabilityRate: '98% Lead & Nickel Recovery',
    co2SavedPerKg: '2.5 kg CO₂ / kg',
    energySaved: '70% Energy Saved',
    landfillDiversion: 'Fire Hazard Risk Prevention',
    materials: [
      { name: 'Lithium-Ion Phone & Power Bank Cells', status: 'Special Handling', detail: 'Must tape positive (+) and negative (-) terminals with clear tape.' },
      { name: 'Alkaline AA / AAA / 9V Cells', status: 'Accepted', detail: 'Store in cool plastic container before drop-off.' },
      { name: 'Laptop Battery Modules', status: 'Special Handling', detail: 'Keep separated from loose metallic objects.' },
      { name: 'Automotive Lead-Acid Batteries', status: 'Special Handling', detail: 'Keep upright at all times to prevent acid leakage.' },
      { name: 'Button Cell Watch Batteries', status: 'Accepted', detail: 'Contains silver oxide and zinc compounds.' },
      { name: 'Industrial Power Storage Packs', status: 'Special Handling', detail: 'Contact center in advance for heavy power cell logistics.' },
    ],
    instructions: [
      { title: 'Terminal Taping Protocol', text: 'Cover terminal poles (+ and - poles) of lithium & 9-volt batteries with non-conductive clear tape.' },
      { title: 'Non-Metallic Dry Storage', text: 'Store spent batteries in a non-conductive plastic box in a dry, well-ventilated indoor space.' },
      { title: 'Acid Corrosion Inspection', text: 'Inspect lead-acid car batteries for casing cracks, swelling, or corrosive fluid residue before moving.' },
      { title: 'Separate Battery Chemistries', text: 'Keep rechargeable lithium cells physically separated from single-use alkaline dry cells.' },
    ],
    donts: [
      'Never crush, drop, strike, or puncture sealed battery cells.',
      'Never throw batteries into open fires, burn barrels, or high-temperature incinerators.',
      'Never store loose batteries in metal pockets, toolboxes, or next to loose coins.',
      'Do not mix corroded leaking batteries with clean, dry battery cells.',
    ],
  },
  plastic: {
    id: 'Plastic',
    name: 'Plastics & Polymer Packaging',
    slug: 'plastic',
    icon: Package,
    badgeBg: 'bg-sky-400/10',
    badgeText: 'text-sky-400',
    border: 'border-sky-400/30',
    glowColor: 'rgba(56, 189, 248, 0.18)',
    desc: 'Rigid plastic containers, PET beverage bottles, HDPE milk jugs, shampoo bottles, clean food packaging, and industrial polymer films.',
    recyclabilityRate: '88% Polyethylene Re-use',
    co2SavedPerKg: '1.9 kg CO₂ / kg',
    energySaved: '65% Energy Saved',
    landfillDiversion: 'Ocean Plastic Reduction',
    materials: [
      { name: 'PET Beverage Bottles (#1)', status: 'Clean Only', detail: 'Rinse out liquids, flatten bottle, screw cap back on.' },
      { name: 'HDPE Milk & Shampoo Jugs (#2)', status: 'Accepted', detail: 'Rinse thoroughly and remove pump dispensers.' },
      { name: 'Rigid Food Containers (#5 PP)', status: 'Clean Only', detail: 'Wash off food oils and organic residue.' },
      { name: 'Clean Plastic Wrap & Film', status: 'Accepted', detail: 'Must be completely dry & free of tape residue.' },
      { name: 'LDPE Grocery Bags (#4)', status: 'Accepted', detail: 'Bundle clean bags into a single compressed ball.' },
      { name: 'Polystyrene Packaging (#6 EPS)', status: 'Special Handling', detail: 'Check if target collection center accepts foam packaging.' },
    ],
    instructions: [
      { title: 'Thorough Rinsing & Washing', text: 'Rinse out food remnants, sugars, and oils using warm water to avoid pest attraction.' },
      { title: 'Flatten & Compress Volume', text: 'Crush beverage bottles and rigid containers to maximize storage and transport density.' },
      { title: 'Cap & Dispenser Separation', text: 'Remove metal springs from spray pumps or detach non-matching material lids.' },
      { title: 'Resin Code Identification', text: 'Locate the resin identification triangle (#1 to #7) stamped on the bottom of the container.' },
    ],
    donts: [
      'Do not send heavily oil-saturated food packaging or greasy takeout boxes.',
      'Do not include plastics contaminated with industrial paints, solvents, or motor oil.',
      'Avoid mixing non-recyclable PVC construction pipes (#3) with PET drink bottles.',
      'Never attempt to melt or burn plastics at home under any circumstances.',
    ],
  },
  electronics: {
    id: 'Electronics',
    name: 'Home Appliances & Major Tech',
    slug: 'electronics',
    icon: Cpu,
    badgeBg: 'bg-purple-400/10',
    badgeText: 'text-purple-400',
    border: 'border-purple-400/30',
    glowColor: 'rgba(192, 132, 252, 0.18)',
    desc: 'Refrigerators, washing machines, microwave ovens, air conditioners, audio equipment, smart home devices, and small kitchen electronics.',
    recyclabilityRate: '94% Metal & Scrap Yield',
    co2SavedPerKg: '4.2 kg CO₂ / kg',
    energySaved: '90% Energy Saved',
    landfillDiversion: 'Freon & Metal Recovery',
    materials: [
      { name: 'Microwave Ovens & Toasters', status: 'Accepted', detail: 'Remove glass turntable trays and clean internal cavity.' },
      { name: 'Refrigerators & Freezers', status: 'Special Handling', detail: 'Requires professional refrigerant gas degassing.' },
      { name: 'Washing Machines & Dryers', status: 'Accepted', detail: 'Drain water hoses completely before loading.' },
      { name: 'Audio Systems & Televisions', status: 'Accepted', detail: 'Keep glass display screens intact and uncracked.' },
      { name: 'Air Conditioning Units', status: 'Special Handling', detail: 'Certified technicians must capture freon coolant.' },
      { name: 'Electric Kettles & Mixers', status: 'Accepted', detail: 'Wrap power cords securely around the appliance base.' },
    ],
    instructions: [
      { title: 'Disconnect Power 24 Hours Prior', text: 'Unplug high-voltage appliances 24 hours in advance to discharge internal capacitors.' },
      { title: 'Complete Freezer Defrosting', text: 'Defrost refrigerator and freezer compartments completely and dry interior moisture.' },
      { title: 'Drain Residual Fluid Hoses', text: 'Completely drain leftover water from washing machine hoses, dishwashers, and irons.' },
      { title: 'Secure Moving Parts & Doors', text: 'Tape doors, glass trays, and loose accessories firmly to avoid transit damage.' },
    ],
    donts: [
      'Never puncture, cut, or vent compressor copper lines containing refrigerant gas.',
      'Do not disassemble CRT monitor glass due to high internal vacuum and lead content.',
      'Never leave wet appliance doors closed tight for extended periods to prevent mold.',
      'Do not strip internal copper wiring using open flames.',
    ],
  },
  other: {
    id: 'Other',
    name: 'Glass, Metal & Cardboard Recyclables',
    slug: 'other',
    icon: Recycle,
    badgeBg: 'bg-emerald-400/10',
    badgeText: 'text-emerald-400',
    border: 'border-emerald-400/30',
    glowColor: 'rgba(52, 211, 153, 0.18)',
    desc: 'Corrugated shipping boxes, aluminum soda cans, steel food tins, glass food jars, sorted office paper, and newsprint.',
    recyclabilityRate: '96% Unlimited Glass/Metal Cycle',
    co2SavedPerKg: '2.1 kg CO₂ / kg',
    energySaved: '95% Aluminum Energy Saved',
    landfillDiversion: 'Circular Resource Cycle',
    materials: [
      { name: 'Corrugated Cardboard Boxes', status: 'Clean Only', detail: 'Flatten completely and remove plastic tape strips.' },
      { name: 'Aluminum Soda & Beverage Cans', status: 'Accepted', detail: 'Rinse out liquids and crush flat.' },
      { name: 'Steel & Tin Food Cans', status: 'Clean Only', detail: 'Rinse food residue & place lid inside can.' },
      { name: 'Glass Beverage Bottles & Jars', status: 'Accepted', detail: 'Separate by clear (flint), green, and amber glass.' },
      { name: 'Sorted Office Paper & Magazines', status: 'Clean Only', detail: 'Keep completely dry and bundle together.' },
      { name: 'Copper, Brass & Aluminum Scrap', status: 'Accepted', detail: 'High recycled scrap commodity value.' },
    ],
    instructions: [
      { title: 'Flatten Cardboard Boxes', text: 'Break down corrugated boxes completely flat to optimize transportation and storage.' },
      { title: 'Rinse Food & Drink Containers', text: 'Rinse aluminum cans, food tins, and glass jars clean of organic food residue.' },
      { title: 'Maintain Dry Paper Storage', text: 'Store paper, cardboard, and newsprint in dry indoor areas to prevent fiber degradation.' },
      { title: 'Glass Color Segregation', text: 'Separate clear, green, and brown (amber) glass containers where facilities require it.' },
    ],
    donts: [
      'Do not mix broken window glass, mirrors, or Pyrex cookware with food bottle glass.',
      'Do not include wax-coated beverage cartons or grease-stained pizza box bottoms.',
      'Do not leave unwashed food cans with sharp lids exposed.',
      'Do not bind paper stacks with non-recyclable plastic strapping.',
    ],
  },
};

// Plastic Resin Identification Matrix (#1 to #7)
const RESIN_CODES = [
  { code: '#1 PET', name: 'Polyethylene Terephthalate', example: 'Water bottles, soda bottles, salad dressing jars', status: 'Highly Recyclable', color: 'text-[#4ade80]' },
  { code: '#2 HDPE', name: 'High-Density Polyethylene', example: 'Milk jugs, detergent bottles, shampoo containers', status: 'Highly Recyclable', color: 'text-[#4ade80]' },
  { code: '#3 PVC', name: 'Polyvinyl Chloride', example: 'Pipes, window frames, medical tubing', status: 'Special Handling', color: 'text-amber-400' },
  { code: '#4 LDPE', name: 'Low-Density Polyethylene', example: 'Grocery bags, squeeze bottles, bread bags', status: 'Recyclable at Drop-offs', color: 'text-sky-400' },
  { code: '#5 PP', name: 'Polypropylene', example: 'Yogurt tubs, medicine bottles, bottle caps', status: 'Widely Recyclable', color: 'text-[#4ade80]' },
  { code: '#6 PS', name: 'Polystyrene / Styrofoam', example: 'Disposable coffee cups, takeout trays, foam packaging', status: 'Special Facility Only', color: 'text-rose-400' },
  { code: '#7 OTHER', name: 'Other Mixed Resins / Polycarbonate', example: 'Baby bottles, sunglasses, multi-layer plastics', status: 'Rarely Recyclable', color: 'text-rose-400' },
];

// Material Transformation & Circular Yield Showcase
const TRANSFORMATION_FACTS = [
  { input: '1,000 PET Water Bottles', output: '150 Warm Synthetic Fleece Jackets', icon: Package, highlight: 'Prevents 2.5 kg CO₂' },
  { input: '1 Ton Recycled Aluminum Cans', output: '14,000 kWh Electricity Conserved', icon: Zap, highlight: 'Powers avg home for 1 year' },
  { input: '100 Recycled Smartphones', output: '2.5 Grams Pure Gold + 25g Silver', icon: Monitor, highlight: 'Avoids 500 kg raw mining' },
  { input: '1 Ton Recycled Cardboard', output: '17 Mature Forest Trees Saved', icon: Recycle, highlight: 'Saves 7,000 gal water' },
];

// Home Sorting Setup Checklist Steps
const HOME_SORTING_STEPS = [
  { title: 'Establish 3 Distinct Bin Stations', text: 'Set up clear containers for 1) General Dry Recyclables, 2) Clean Plastics/Glass, and 3) Battery/E-Waste Hazardous Box.' },
  { title: 'Keep a Roll of Clear Terminal Tape', text: 'Store non-conductive tape right next to your battery bin so positive (+ and -) terminals get taped immediately.' },
  { title: 'Pre-rinse Containers at Sink', text: 'Quickly rinse out milk jugs and food jars using leftover dishwashing water before tossing into your recycling bin.' },
  { title: 'Flatten Cardboard Promptly', text: 'Break down shipping boxes as soon as unpacked to prevent clutter and maximize container storage capacity.' },
  { title: 'Schedule Bi-weekly EcoDrop Hub Trips', text: 'Plan a quick drop-off at your nearest certified collection center when your e-waste box gets full.' },
];

// Everyday Item Lookup Database
interface LookupItem {
  name: string;
  category: string;
  binColor: string;
  handling: string;
  recyclable: 'Yes' | 'Special' | 'No';
  tip: string;
}

const COMMON_LOOKUP_ITEMS: LookupItem[] = [
  { name: 'Smartphone / iPhone', category: 'E-Waste', binColor: 'Green Eco Hub', handling: 'Factory Reset & Tape Battery', recyclable: 'Yes', tip: 'Recovers gold, silver, copper, and rare metals' },
  { name: 'AA / AAA Alkaline Battery', category: 'Battery', binColor: 'Amber Battery Box', handling: 'Tape terminal poles with clear tape', recyclable: 'Special', tip: 'Keep dry in non-metallic plastic bag' },
  { name: 'Lithium Laptop Battery Pack', category: 'Battery', binColor: 'Amber Battery Box', handling: 'Cover positive pole (+)', recyclable: 'Special', tip: 'High risk of short circuits if left untaped' },
  { name: 'PET Drinking Bottle (#1)', category: 'Plastic', binColor: 'Blue Plastic Bin', handling: 'Rinse, crush flat, replace cap', recyclable: 'Yes', tip: '100% recyclable into new synthetic fleece' },
  { name: 'HDPE Milk & Juice Jug (#2)', category: 'Plastic', binColor: 'Blue Plastic Bin', handling: 'Rinse out liquid residue', recyclable: 'Yes', tip: 'Transformed into durable outdoor furniture' },
  { name: 'Old Laptop / MacBook', category: 'E-Waste', binColor: 'Green Eco Hub', handling: 'Wipe drive, remove battery', recyclable: 'Yes', tip: 'Contains valuable copper & aluminum heat sinks' },
  { name: 'Microwave Oven', category: 'Electronics', binColor: 'Purple Drop Station', handling: 'Remove glass tray & wrap cord', recyclable: 'Yes', tip: 'High steel casing and copper transformer yield' },
  { name: 'Cardboard Shipping Box', category: 'Other', binColor: 'Yellow Paper Bin', handling: 'Flatten completely', recyclable: 'Yes', tip: 'Saves 17 trees per ton of recycled cardboard' },
  { name: 'Aluminum Soda Can', category: 'Other', binColor: 'Yellow Can Bin', handling: 'Rinse and crush flat', recyclable: 'Yes', tip: 'Returns to store shelves in as little as 60 days' },
  { name: 'Glass Food & Jam Jar', category: 'Other', binColor: 'Teal Glass Bin', handling: 'Rinse food, recycle metal lid separately', recyclable: 'Yes', tip: 'Glass can be recycled endlessly without quality loss' },
  { name: 'Fluorescent Light Tube', category: 'E-Waste', binColor: 'Hazardous Hub', handling: 'Do not break! Keep in protective sleeve', recyclable: 'Special', tip: 'Contains trace mercury vapor requiring containment' },
  { name: 'Spent Motor Oil Bottle', category: 'Hazardous', binColor: 'Specialty Center', handling: 'Seal cap tight, never pour down drains', recyclable: 'Special', tip: 'Never wash spent automotive oil into storm sewers' },
];

const FAQS = [
  {
    q: 'Why is taping battery terminals so important before drop-off?',
    a: 'Lithium-ion and 9-volt batteries can generate spark-producing short circuits if their positive and negative terminals come into contact with other metallic objects or battery poles during transport. Covering terminals with clear tape prevents electrical fires.',
  },
  {
    q: 'What happens to my personal data on dropped-off e-waste devices?',
    a: 'Certified EcoDrop partner centers perform automated magnetic degaussing and physical mechanical shredding on all hard drives and flash storage chips. However, for complete peace of mind, we strongly recommend performing a full factory reset before handing over devices.',
  },
  {
    q: 'How do I read plastic resin numbers (#1 to #7)?',
    a: '#1 (PET) and #2 (HDPE) are the most universally accepted plastics worldwide. #5 (PP) is widely accepted for clean food containers. #3 (PVC), #6 (Styrofoam), and #7 (Other mixed polymers) require specialized recycling facilities which you can locate via our Explore map filters.',
  },
  {
    q: 'Can I recycle broken window glass or Pyrex cookware with food bottles?',
    a: 'No. Window panes, mirror glass, optical lenses, and heat-resistant Pyrex cookware have different melting temperatures and chemical compositions than container bottle glass. Mixing them can contaminate an entire furnace batch of recycled glass.',
  },
];

export default function WasteGuidePage() {
  const { category: activeCategoryParam } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  // Categories state (integrates API + fallback)
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Active category selection
  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    if (activeCategoryParam) return activeCategoryParam.toLowerCase();
    return 'e-waste';
  });

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItemFilter, setActiveItemFilter] = useState<'All' | 'E-Waste' | 'Battery' | 'Plastic' | 'Electronics' | 'Other'>('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Sync parameter with state
  useEffect(() => {
    if (activeCategoryParam) {
      setSelectedSlug(activeCategoryParam.toLowerCase());
    }
  }, [activeCategoryParam]);

  // Load categories from API on mount
  useEffect(() => {
    let isMounted = true;
    wasteApi
      .getCategories()
      .then((data: APIWasteCategory[]) => {
        if (isMounted && data && data.length > 0) {
          setCategoriesCount(data.length);
        }
      })
      .catch((err) => {
        console.warn('Backend categories API notice:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingCategories(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine active category details
  const activeDetail = useMemo(() => {
    const key = selectedSlug.toLowerCase();
    if (CATEGORY_DETAILS[key]) {
      return CATEGORY_DETAILS[key];
    }
    const foundKey = Object.keys(CATEGORY_DETAILS).find(
      (k) => k.includes(key) || CATEGORY_DETAILS[k].name.toLowerCase().includes(key)
    );
    return foundKey ? CATEGORY_DETAILS[foundKey] : CATEGORY_DETAILS['e-waste'];
  }, [selectedSlug]);

  const handleSelectCategory = (slug: string) => {
    const formattedSlug = slug.toLowerCase();
    setSelectedSlug(formattedSlug);
    navigate(`/waste-guide/${formattedSlug}`, { replace: true });
  };

  // Filtered Item Lookup Database
  const filteredLookupItems = useMemo(() => {
    return COMMON_LOOKUP_ITEMS.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.handling.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeItemFilter === 'All' ||
        item.category.toLowerCase() === activeItemFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeItemFilter]);

  const categoryKeys = Object.keys(CATEGORY_DETAILS);

  return (
    <div
      className="min-h-screen bg-[#06170d] text-[#edf7ee] relative overflow-hidden font-sans"
      style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '8rem' }}
    >
      {/* EcoDrop Background Ambient Glows & Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[900px] bg-gradient-to-b from-[#4ade80]/14 via-[#16a34a]/6 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-[#22d3ee]/6 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[700px] h-[700px] bg-[#22c55e]/6 blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none -z-10" />

      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col items-center gap-20">
        {/* ─── 1. ECODROP HERO SECTION (DEAD-CENTERED & SPACIOUS) ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center gap-8 mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/30 text-xs sm:text-sm font-mono font-bold text-[#4ade80] shadow-lg shadow-[#4ade80]/10 mx-auto">
            <Sparkles className="w-4 h-4 text-[#4ade80]" />
            <span>INTELLIGENT ECO-DISPOSAL KNOWLEDGE DIRECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-[#edf7ee] leading-[1.15] text-center w-full max-w-4xl mx-auto">
            Certified Waste Sorting & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#4ade80] via-[#57f1db] to-[#22c55e] bg-clip-text text-transparent font-black font-display">
              Disposal Guide
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#c2c9bb] leading-relaxed max-w-3xl mx-auto font-medium text-center">
            Master exact handling protocols, material segregation rules, and safety guidelines
            before bringing materials to certified EcoDrop collection centers.
          </p>

          {/* Search Box Container */}
          <div className="w-full max-w-4xl mx-auto mt-4 flex flex-col items-center justify-center gap-6">
            <div className="relative w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-3xl blur-md opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative flex items-center bg-[#121412] rounded-3xl border border-white/15 px-6 sm:px-8 py-4 sm:py-5 shadow-2xl">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-[#4ade80] shrink-0 mr-4" />
                <input
                  type="text"
                  placeholder="Search any item (e.g. iPhone, Lithium battery, PET bottle, Microwave, Cardboard)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-base sm:text-xl text-[#edf7ee] placeholder:text-[#c2c9bb]/50 focus:outline-none font-sans"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-[#c2c9bb] hover:text-[#4ade80] p-2 cursor-pointer transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Lookups Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#c2c9bb]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#4ade80] font-extrabold mr-2">
                Quick Lookups:
              </span>
              {['iPhone', 'Lithium Battery', 'PET Bottle', 'Microwave', 'Cardboard Box'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-5 py-2.5 rounded-2xl bg-[#1c1e1c] border border-white/12 hover:border-[#4ade80]/60 hover:bg-[#4ade80]/15 hover:text-white transition-all cursor-pointer font-bold text-xs shadow-md hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-6 flex flex-col items-center gap-2 text-xs font-mono text-[#c2c9bb]/60 animate-bounce mt-4">
            <span>SCROLL DOWN TO EXPLORE GUIDE</span>
            <ChevronDown className="w-4 h-4 text-[#4ade80]" />
          </div>
        </motion.div>

        {/* ─── 2. WASTE CATEGORIES SELECTOR SECTION ──────────────────────── */}
        <div className="w-full flex flex-col gap-6 mb-16">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-base font-mono font-bold uppercase tracking-widest text-[#4ade80] flex items-center gap-3">
              <Compass className="w-5 h-5 text-[#4ade80]" /> Browse Waste Categories
            </h2>
            {loadingCategories ? (
              <span className="text-xs font-mono text-[#edf7ee]/50 animate-pulse">
                Syncing backend categories...
              </span>
            ) : categoriesCount > 0 ? (
              <span className="text-xs font-mono text-[#4ade80] bg-[#4ade80]/10 px-4 py-2 rounded-full border border-[#4ade80]/20">
                {categoriesCount} Backend Categories Connected
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide justify-start lg:justify-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {categoryKeys.map((key) => {
              const detail = CATEGORY_DETAILS[key];
              const IconComp = detail.icon;
              const isActive = activeDetail.slug === detail.slug;

              return (
                <button
                  key={detail.slug}
                  onClick={() => handleSelectCategory(detail.slug)}
                  className={`relative flex items-center gap-4 px-7 py-4.5 rounded-2xl text-base sm:text-lg font-bold border transition-all duration-300 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-[#052e16] border-[#4ade80]/60 shadow-xl shadow-[#22c55e]/25 scale-[1.03] font-extrabold'
                      : 'bg-[#0d1611] backdrop-blur-md text-[#edf7ee]/80 border-white/12 hover:border-[#4ade80]/40 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ padding: '1rem 1.75rem', borderRadius: '1rem' }}
                >
                  <IconComp className={`w-6 h-6 ${isActive ? 'text-[#052e16]' : 'text-[#4ade80]'}`} />
                  <span>{detail.id}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 border-2 border-[#4ade80] rounded-2xl pointer-events-none"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. ACTIVE CATEGORY SHOWCASE HERO CARD ────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDetail.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '5rem' }}
          >
            <div
              className="relative liquid-glass-card p-10 sm:p-14 overflow-hidden flex flex-col gap-12"
              style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}
            >
              <div
                className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
                style={{ background: activeDetail.glowColor }}
              />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-white/10 pb-10 relative z-10">
                <div className="flex items-start sm:items-center gap-8">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${activeDetail.badgeBg} ${activeDetail.border} border flex items-center justify-center shrink-0 shadow-2xl`}
                  >
                    <activeDetail.icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#4ade80]" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold uppercase tracking-widest ${activeDetail.badgeText} ${activeDetail.badgeBg} px-4 py-2 rounded-full border ${activeDetail.border}`}
                      >
                        {activeDetail.id} Handling Rules
                      </span>
                      <span className="text-xs font-mono text-[#4ade80] bg-[#4ade80]/10 px-4 py-2 rounded-full border border-[#4ade80]/20 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> {activeDetail.recyclabilityRate}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal font-display text-[#edf7ee] tracking-tight">
                      {activeDetail.name}
                    </h2>

                    <p className="text-base sm:text-xl text-[#edf7ee]/85 max-w-3xl leading-relaxed font-normal">
                      {activeDetail.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pt-4 lg:pt-0">
                  <Link to={`/explore?waste=${encodeURIComponent(activeDetail.id)}`}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto shadow-2xl px-8 py-4 text-base sm:text-lg font-extrabold"
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Locate Nearby {activeDetail.id} Hubs
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Impact Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative z-10">
                <div className="p-7 rounded-3xl bg-white/5 border border-white/10 space-y-2" style={{ padding: '1.75rem', borderRadius: '1.25rem' }}>
                  <p className="text-xs font-mono text-[#edf7ee]/60 uppercase tracking-wider font-bold">CO₂ Avoided / kg</p>
                  <p className="text-2xl sm:text-4xl font-extrabold text-[#4ade80] font-display">{activeDetail.co2SavedPerKg}</p>
                </div>
                <div className="p-7 rounded-3xl bg-white/5 border border-white/10 space-y-2" style={{ padding: '1.75rem', borderRadius: '1.25rem' }}>
                  <p className="text-xs font-mono text-[#edf7ee]/60 uppercase tracking-wider font-bold">Energy Conserved</p>
                  <p className="text-2xl sm:text-4xl font-extrabold text-[#38bdf8] font-display">{activeDetail.energySaved}</p>
                </div>
                <div className="p-7 rounded-3xl bg-white/5 border border-white/10 space-y-2" style={{ padding: '1.75rem', borderRadius: '1.25rem' }}>
                  <p className="text-xs font-mono text-[#edf7ee]/60 uppercase tracking-wider font-bold">Landfill Impact</p>
                  <p className="text-2xl sm:text-4xl font-extrabold text-amber-300 font-display">{activeDetail.landfillDiversion}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── 4. PLASTIC RESIN CODES GUIDE (#1 to #7) ───────────────────── */}
        <div className="flex flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '5rem' }}>
          <div className="border-b border-white/10 pb-5">
            <div className="eyebrow mb-3">
              <Layers className="w-4 h-4 text-[#4ade80]" />
              <span>PLASTIC RESIN IDENTIFICATION CODES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal font-display text-[#edf7ee]">
              Understanding Plastic <span className="gradient-text font-extrabold font-display">Resin Symbols (#1 - #7)</span>
            </h2>
            <p className="text-base text-[#edf7ee]/80 leading-relaxed mt-3 max-w-3xl font-normal">
              Look for the triangle symbol stamped on the bottom of plastic items to determine recyclability and proper bin destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESIN_CODES.map((resin) => (
              <ParticleCard
                key={resin.code}
                glowColor="74, 222, 128"
                particleCount={8}
                clickEffect={true}
                className="bg-[#121412] border border-white/14 hover:border-[#4ade80]/40 rounded-3xl p-8 sm:p-10 space-y-5 shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-[#4ade80] bg-[#4ade80]/10 px-4 py-2 rounded-2xl border border-[#4ade80]/20">
                    {resin.code}
                  </span>
                  <span className={`text-xs sm:text-sm font-mono font-bold ${resin.color}`}>
                    {resin.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-[#edf7ee]">{resin.name}</h3>
                  <p className="text-sm text-[#edf7ee]/75 leading-relaxed font-normal">
                    <strong className="text-[#edf7ee]">Examples:</strong> {resin.example}
                  </p>
                </div>
              </ParticleCard>
            ))}
          </div>
        </div>

        {/* ─── 5. MATERIAL TRANSFORMATION & RECOVERY SHOWCASE ────────────── */}
        <div
          className="bg-[#0d1611] border border-white/14 rounded-3xl p-8 sm:p-16 lg:p-20 space-y-12 shadow-2xl"
          style={{ backgroundColor: '#0d1611', borderRadius: '1.5rem', padding: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '5rem' }}
        >
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="eyebrow mx-auto">
              <Award className="w-4 h-4 text-[#4ade80]" />
              <span>CIRCULAR MATERIAL YIELD</span>
            </div>
            <h2 className="text-3xl sm:text-6xl font-normal font-display text-[#edf7ee]">
              From Recyclable Waste to <span className="gradient-text font-extrabold font-display">New Resources</span>
            </h2>
            <p className="text-lg text-[#edf7ee]/80 leading-relaxed font-normal">
              Here is what happens when you dispose of your household recyclables at certified EcoDrop collection centers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRANSFORMATION_FACTS.map((tf, i) => {
              const TfIcon = tf.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-5 hover:border-[#4ade80]/40 transition-all"
                  style={{ padding: '2rem', borderRadius: '1.25rem' }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#4ade80]/15 border border-[#4ade80]/30 flex items-center justify-center text-[#4ade80]">
                    <TfIcon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-mono uppercase text-[#edf7ee]/50 font-bold">Input Material</p>
                    <p className="text-lg font-extrabold text-[#edf7ee]">{tf.input}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-1.5">
                    <p className="text-xs font-mono uppercase text-[#4ade80] font-bold">Yield Result</p>
                    <p className="text-base font-bold text-[#edf7ee]">{tf.output}</p>
                    <p className="text-xs font-mono text-[#38bdf8] pt-1">{tf.highlight}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 6. ACCEPTED MATERIALS INVENTORY GRID ───────────────────────── */}
        <div className="flex flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '5rem' }}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <div className="eyebrow mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                <span>ACCEPTANCE INVENTORY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-normal font-display text-[#edf7ee]">
                Accepted Materials & <span className="gradient-text font-extrabold font-display">Devices</span>
              </h2>
            </div>
            <span className="text-xs font-mono text-[#edf7ee]/70 bg-white/5 px-4 py-2 rounded-full border border-white/12">
              {activeDetail.materials.length} Items Qualified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeDetail.materials.map((m) => (
              <div
                key={m.name}
                className="p-8 sm:p-10 rounded-3xl bg-[#0d1611] border border-white/14 hover:border-[#4ade80]/40 transition-all space-y-4 shadow-lg group"
                style={{ padding: '2.5rem', borderRadius: '1.5rem', backgroundColor: '#0d1611' }}
              >
                <div className="flex items-center justify-between gap-5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#edf7ee] group-hover:text-[#4ade80] transition-colors flex items-center gap-3.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#4ade80] shrink-0" />
                    {m.name}
                  </h3>
                  <span
                    className={`text-xs font-mono font-bold px-4 py-1.5 rounded-full border shrink-0 ${
                      m.status === 'Accepted'
                        ? 'bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/30'
                        : m.status === 'Special Handling'
                        ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                        : 'bg-sky-400/15 text-sky-300 border-sky-400/30'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="text-base text-[#edf7ee]/80 leading-relaxed font-normal pl-7">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 7. STEP-BY-STEP PREPARATION & HANDLING GUIDE ──────────────── */}
        <div className="flex flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '5rem' }}>
          <div className="border-b border-white/10 pb-5">
            <div className="eyebrow mb-3">
              <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
              <span>STEP-BY-STEP HANDLING PROTOCOL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal font-display text-[#edf7ee]">
              Preparation & Handling <span className="gradient-text font-extrabold font-display">Guidelines</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeDetail.instructions.map((step, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-12 rounded-3xl bg-[#0d1611] border border-white/14 hover:border-[#4ade80]/40 transition-all flex items-start gap-8 shadow-lg"
                style={{ padding: '2.5rem', borderRadius: '1.5rem', backgroundColor: '#0d1611' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#4ade80]/20 border border-[#4ade80]/40 text-[#4ade80] font-black text-xl flex items-center justify-center shrink-0 mt-1">
                  0{idx + 1}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold text-[#edf7ee]">{step.title}</h3>
                  <p className="text-base sm:text-lg text-[#edf7ee]/80 leading-relaxed font-normal">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 8. CRITICAL SAFETY WARNINGS & HAZARDS ──────────────────────── */}
        <div style={{ marginBottom: '5rem' }}>
          <div
            className="p-8 sm:p-14 lg:p-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-10 shadow-2xl"
            style={{ padding: '3.5rem', borderRadius: '1.5rem' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                  CRITICAL SAFETY WARNINGS
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-amber-100">
                  Prohibited Practices & Hazards
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeDetail.donts.map((d, i) => (
                <div
                  key={i}
                  className="p-7 rounded-3xl bg-amber-950/30 border border-amber-500/20 text-base sm:text-lg font-medium text-amber-200/90 leading-relaxed flex items-start gap-5"
                  style={{ padding: '1.75rem', borderRadius: '1.25rem' }}
                >
                  <span className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── 9. HOME SORTING STATION CHECKLIST ──────────────────────────── */}
        <div
          className="bg-[#0d1611] border border-[#4ade80]/30 rounded-3xl p-8 sm:p-14 lg:p-16 space-y-10 shadow-2xl"
          style={{ backgroundColor: '#0d1611', borderRadius: '1.5rem', padding: '3.5rem', marginBottom: '5rem' }}
        >
          <div className="space-y-4">
            <div className="eyebrow">
              <CheckSquare className="w-4 h-4 text-[#4ade80]" />
              <span>HOME SORTING CHECKLIST</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal font-display text-[#edf7ee]">
              5 Steps to Set Up a Clean <span className="gradient-text font-extrabold font-display">Home Recycling Station</span>
            </h2>
          </div>

          <div className="space-y-5">
            {HOME_SORTING_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="p-7 sm:p-8 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-6 hover:border-[#4ade80]/30 transition-all"
                style={{ padding: '1.75rem', borderRadius: '1.25rem' }}
              >
                <div className="w-10 h-10 rounded-2xl bg-[#4ade80]/20 text-[#4ade80] font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#edf7ee]">{step.title}</h3>
                  <p className="text-sm sm:text-base text-[#edf7ee]/80 leading-relaxed font-normal">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 10. MATERIAL LOOKUP DATABASE DIRECTORY ────────────────────── */}
        <div className="flex flex-col gap-10" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '5rem' }}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-white/10 pb-8">
            <div>
              <div className="eyebrow mb-3">
                <Search className="w-4 h-4 text-[#4ade80]" />
                <span>MATERIAL LOOKUP DATABASE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-normal font-display text-[#edf7ee]">
                Can I Recycle This? <span className="gradient-text font-extrabold font-display">Item Finder</span>
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'E-Waste', 'Battery', 'Plastic', 'Electronics', 'Other'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveItemFilter(f as any)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeItemFilter === f
                      ? 'bg-[#22c55e] text-[#052e16] font-extrabold shadow-md'
                      : 'bg-white/5 border border-white/10 text-[#edf7ee]/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLookupItems.length > 0 ? (
              filteredLookupItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-[#0d1611] border border-white/14 hover:border-[#4ade80]/40 rounded-3xl p-8 sm:p-10 space-y-6 hover:translate-y-[-3px] transition-all shadow-xl group"
                  style={{ padding: '2.25rem', borderRadius: '1.5rem', backgroundColor: '#0d1611' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#4ade80]">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${
                        item.recyclable === 'Yes'
                          ? 'bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/30'
                          : item.recyclable === 'Special'
                          ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {item.recyclable === 'Yes' ? 'Recyclable' : 'Special Handling'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#edf7ee] group-hover:text-[#4ade80] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#edf7ee]/60 font-mono mt-1.5">Bin / Hub: {item.binColor}</p>
                  </div>

                  <div className="pt-5 border-t border-white/10 space-y-3 text-sm text-[#edf7ee]/85">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-4.5 h-4.5 text-[#4ade80] shrink-0 mt-0.5" />
                      <span>{item.handling}</span>
                    </div>
                    <div className="flex items-start gap-3 text-[#edf7ee]/70">
                      <Info className="w-4.5 h-4.5 text-[#38bdf8] shrink-0 mt-0.5" />
                      <span>{item.tip}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                <Info className="w-12 h-12 text-[#4ade80] mx-auto opacity-60" />
                <p className="text-lg font-bold text-[#edf7ee]">No materials match "{searchTerm}"</p>
                <p className="text-sm text-[#edf7ee]/60 max-w-md mx-auto">
                  Try searching for general item types like "battery", "phone", "bottle", "cardboard", or "microwave".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── 11. THE 4-STAGE CIRCULAR RECYCLING WORKFLOW ───────────────── */}
        <div
          className="bg-[#0d1611] border border-white/14 rounded-3xl p-8 sm:p-16 lg:p-20 space-y-12 shadow-2xl"
          style={{ backgroundColor: '#0d1611', borderRadius: '1.5rem', padding: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '5rem' }}
        >
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="eyebrow mx-auto">
              <RotateCcw className="w-4 h-4 text-[#4ade80]" />
              <span>THE RECYCLING JOURNEY</span>
            </div>
            <h2 className="text-3xl sm:text-6xl font-normal font-display text-[#edf7ee]">
              How Your Waste Re-enters the <span className="gradient-text font-extrabold font-display">Circular Economy</span>
            </h2>
            <p className="text-lg text-[#edf7ee]/80 leading-relaxed font-normal">
              Every material brought to an EcoDrop certified collection center undergoes strict 4-stage processing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Home Segregation',
                icon: Check,
                desc: 'Clean, wash, and tape hazardous battery terminals before storing.',
              },
              {
                step: '02',
                title: 'Certified Drop-off',
                icon: MapPin,
                desc: 'Bring materials to nearby verified collection hubs on our Explore map.',
              },
              {
                step: '03',
                title: 'Industrial Recovery',
                icon: Factory,
                desc: 'Automated magnetic separation, shredding, and chemical smelting.',
              },
              {
                step: '04',
                title: 'Circular Product',
                icon: Recycle,
                desc: 'Raw materials re-manufactured into new green devices and packaging.',
              },
            ].map((stage) => {
              const StageIcon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 space-y-5 hover:border-[#4ade80]/40 transition-all group"
                  style={{ padding: '2rem', borderRadius: '1.25rem' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black font-mono text-[#4ade80]/40 group-hover:text-[#4ade80] transition-colors">
                      {stage.step}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center text-[#4ade80]">
                      <StageIcon className="w-7 h-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#edf7ee]">{stage.title}</h3>
                  <p className="text-sm sm:text-base text-[#edf7ee]/75 leading-relaxed font-normal">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 12. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION ──────────── */}
        <div className="flex flex-col gap-10 max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '5rem' }}>
          <div className="text-center space-y-4">
            <div className="eyebrow mx-auto">
              <Info className="w-4 h-4 text-[#4ade80]" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal font-display text-[#edf7ee]">
              Disposal Guidelines <span className="gradient-text font-extrabold font-display">FAQ</span>
            </h2>
          </div>

          <div className="space-y-6">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0d1611] border border-white/14 rounded-3xl overflow-hidden transition-all shadow-md"
                  style={{ backgroundColor: '#0d1611', borderRadius: '1.5rem' }}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-8 sm:px-10 py-6 sm:py-7 text-left flex items-center justify-between gap-8 font-bold text-lg sm:text-xl text-[#edf7ee] hover:text-[#4ade80] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-7 h-7 text-[#4ade80] shrink-0" />
                    ) : (
                      <ChevronDown className="w-7 h-7 text-[#edf7ee]/50 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-8 sm:px-10 pb-8 sm:pb-10 text-base sm:text-lg text-[#edf7ee]/85 leading-relaxed border-t border-white/5 pt-6 font-normal"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 13. BOTTOM CALL-TO-ACTION (CTA BAND) ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative liquid-glass-card p-10 sm:p-16 lg:p-20 text-center overflow-hidden flex flex-col items-center gap-8"
          style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="eyebrow mx-auto">
            <Flame className="w-4 h-4 text-[#4ade80]" />
            <span>TAKE SUSTAINABLE ACTION TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal font-display text-[#edf7ee] tracking-tight max-w-4xl mx-auto leading-tight">
            Ready to Dispose of Your Waste <span className="gradient-text font-extrabold font-display">Responsibly?</span>
          </h2>

          <p className="text-base sm:text-xl text-[#edf7ee]/85 max-w-3xl mx-auto leading-relaxed font-normal">
            Locate certified collection centers near you in Coimbatore, filter by accepted waste categories, and track your environmental impact.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link to="/explore">
              <Button size="lg" className="w-full sm:w-auto shadow-2xl px-10 py-5 text-lg font-extrabold" rightIcon={<ArrowUpRight className="w-6 h-6" />}>
                Locate Nearby Collection Hubs
              </Button>
            </Link>

            <Link to="/impact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-5 text-lg">
                View Impact Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
