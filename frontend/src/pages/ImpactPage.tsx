import { useState, useEffect } from 'react';
import {
  TreePine,
  Droplets,
  Wind,
  Recycle,
  Award,
  Calculator,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ecoImpactApi } from '../api/ecoImpactApi';
import type { EcoImpact } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const monthlyTrends = [
  { month: 'Jan', plastic: 2.1, ewaste: 0.5, batteries: 1 },
  { month: 'Feb', plastic: 3.4, ewaste: 1.0, batteries: 1 },
  { month: 'Mar', plastic: 4.8, ewaste: 1.2, batteries: 2 },
  { month: 'Apr', plastic: 2.1, ewaste: 0.5, batteries: 1 },
];

const COLORS = ['#4ade80', '#38bdf8', '#fbbf24', '#c084fc'];

export default function ImpactPage() {
  const [impact, setImpact] = useState<EcoImpact | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive calculator state
  const [calcPlastic, setCalcPlastic] = useState<number>(5);
  const [calcEwaste, setCalcEwaste] = useState<number>(2);
  const [calcBatteries, setCalcBatteries] = useState<number>(3);
  const [calculatedCo2, setCalculatedCo2] = useState<number>(0);

  useEffect(() => {
    ecoImpactApi.getEcoStats().then(setImpact).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    async function runCalc() {
      try {
        const [pRes, eRes, bRes] = await Promise.all([
          calcPlastic > 0
            ? ecoImpactApi.calculateImpactSingle('Plastic', calcPlastic)
            : Promise.resolve({ co2_saved_kg: 0 }),
          calcEwaste > 0
            ? ecoImpactApi.calculateImpactSingle('E-Waste', calcEwaste)
            : Promise.resolve({ co2_saved_kg: 0 }),
          calcBatteries > 0
            ? ecoImpactApi.calculateImpactSingle('Battery', calcBatteries)
            : Promise.resolve({ co2_saved_kg: 0 }),
        ]);
        if (active) {
          const total =
            pRes.co2_saved_kg + eRes.co2_saved_kg + bRes.co2_saved_kg;
          setCalculatedCo2(parseFloat(total.toFixed(1)));
        }
      } catch {
        if (active) {
          const co2 = calcPlastic * 1.5 + calcEwaste * 2.2 + calcBatteries * 0.3;
          setCalculatedCo2(parseFloat(co2.toFixed(1)));
        }
      }
    }
    runCalc();
    return () => {
      active = false;
    };
  }, [calcPlastic, calcEwaste, calcBatteries]);

  if (loading || !impact) {
    return (
      <div className="pt-36 min-h-screen">
        <LoadingSpinner
          text="Calculating environmental metrics..."
          size="lg"
        />
      </div>
    );
  }

  const pieData = [
    { name: 'Plastic Materials', value: impact.plasticRecycled },
    { name: 'E-Waste Processed', value: impact.ewasteRecycled },
    { name: 'Batteries Disposed', value: impact.batteriesRecycled * 0.2 },
  ];

  return (
    <div className="pt-32 sm:pt-40 pb-40 min-h-screen relative overflow-hidden">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[600px] bg-gradient-to-b from-[#4ade80]/12 via-[#16a34a]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 space-y-24 sm:space-y-32">
        {/* ─── 1. HERO HEADER ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="eyebrow mx-auto shadow-md py-2 px-5 text-xs">
            <Award className="w-4 h-4 text-[#4ade80]" />
            <span>COMMUNITY ENVIRONMENTAL FOOTPRINT</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-[#edf7ee] leading-[1.12]">
            Environmental Impact & <br className="hidden sm:inline" />
            <span className="gradient-text">Eco Metrics</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#edf7ee]/80 leading-relaxed max-w-2xl mx-auto font-normal">
            Real-time environmental statistics, CO₂ reduction metrics, and an interactive waste savings calculator.
          </p>
        </motion.div>

        {/* ─── 2. KEY METRICS SHOWCASE GRID ──────────────────────────── */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#4ade80]">
              Key Sustainability Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="liquid-glass-card p-8 sm:p-10 space-y-7 hover:border-[#4ade80]/60 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4ade80]/15 border border-[#4ade80]/30 flex items-center justify-center text-[#4ade80]">
                <TreePine className="w-7 h-7 text-[#4ade80]" />
              </div>
              <div className="space-y-3">
                <p className="text-4xl sm:text-5xl font-extrabold font-display text-[#edf7ee] tracking-tight">
                  {impact.wasteDiverted} <span className="text-lg font-bold text-[#4ade80]">kg</span>
                </p>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#edf7ee]/60">
                  Total Waste Diverted
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="liquid-glass-card p-8 sm:p-10 space-y-7 hover:border-[#4ade80]/60 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4ade80]/15 border border-[#4ade80]/30 flex items-center justify-center text-[#4ade80]">
                <Wind className="w-7 h-7 text-[#4ade80]" />
              </div>
              <div className="space-y-3">
                <p className="text-4xl sm:text-5xl font-extrabold font-display text-[#edf7ee] tracking-tight">
                  {impact.co2Avoided} <span className="text-lg font-bold text-[#4ade80]">kg</span>
                </p>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#edf7ee]/60">
                  CO₂ Emissions Avoided
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="liquid-glass-card p-8 sm:p-10 space-y-7 hover:border-[#4ade80]/60 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Droplets className="w-7 h-7 text-sky-400" />
              </div>
              <div className="space-y-3">
                <p className="text-4xl sm:text-5xl font-extrabold font-display text-[#edf7ee] tracking-tight">
                  {Math.round(impact.co2Avoided * 14.5)} <span className="text-lg font-bold text-sky-400">gal</span>
                </p>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#edf7ee]/60">
                  Gallons Water Preserved
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="liquid-glass-card p-8 sm:p-10 space-y-7 hover:border-[#4ade80]/60 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Recycle className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-3">
                <p className="text-4xl sm:text-5xl font-extrabold font-display text-[#edf7ee] tracking-tight">
                  {Math.round(impact.co2Avoided * 0.08)} <span className="text-lg font-bold text-emerald-400">trees</span>
                </p>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#edf7ee]/60">
                  Tree Offset Equivalent
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── 3. VISUAL CHARTS GRID ─────────────────────────────────── */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#4ade80]">
              Analytics & Material Share
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Monthly Trend Bar Chart */}
            <div className="lg:col-span-7 liquid-glass-card p-8 sm:p-12 space-y-8">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] block mb-2">
                  RECYCLING HISTORY
                </span>
                <h3 className="text-3xl font-extrabold font-display text-[#edf7ee]">
                  Monthly Drop-off Volume (kg)
                </h3>
              </div>

              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="#edf7ee" opacity={0.7} fontSize={13} tickLine={false} axisLine={false} />
                    <YAxis stroke="#edf7ee" opacity={0.7} fontSize={13} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d1611', borderColor: 'rgba(74,222,128,0.3)', borderRadius: '16px', color: '#edf7ee', padding: '12px 16px' }} />
                    <Bar dataKey="plastic" name="Plastic" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="ewaste" name="E-Waste" fill="#4ade80" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="batteries" name="Batteries" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Waste Type Distribution Pie Chart */}
            <div className="lg:col-span-5 liquid-glass-card p-8 sm:p-12 space-y-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] block mb-2">
                  MATERIAL BREAKDOWN
                </span>
                <h3 className="text-3xl font-extrabold font-display text-[#edf7ee]">
                  Category Share
                </h3>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0d1611', borderColor: 'rgba(74,222,128,0.3)', borderRadius: '16px', color: '#edf7ee', padding: '12px 16px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                {pieData.map((item, idx) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm font-semibold text-[#edf7ee]/80"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      {item.name}
                    </span>
                    <span className="font-extrabold text-[#edf7ee]">
                      {item.value.toFixed(1)} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4. INTERACTIVE IMPACT CALCULATOR ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass-card p-8 sm:p-14 lg:p-16 space-y-12"
        >
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow">
              <Calculator className="w-4 h-4 text-[#4ade80]" /> INTERACTIVE SIMULATOR
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-[#edf7ee]">
              Calculate Your CO₂ Savings
            </h2>
            <p className="text-base sm:text-lg text-[#edf7ee]/75 font-normal leading-relaxed">
              Adjust estimated recycling quantities to calculate your personal or organizational environmental contribution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80]">
                  Plastic Materials (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcPlastic}
                  onChange={(e) => setCalcPlastic(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-white/15 bg-white/5 text-lg font-bold text-[#edf7ee] focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80]">
                  E-Waste (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcEwaste}
                  onChange={(e) => setCalcEwaste(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-white/15 bg-white/5 text-lg font-bold text-[#edf7ee] focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80]">
                  Batteries (units)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcBatteries}
                  onChange={(e) => setCalcBatteries(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-white/15 bg-white/5 text-lg font-bold text-[#edf7ee] focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80] outline-none transition-all"
                />
              </div>
            </div>

            {/* Projected Result Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#052e16] rounded-3xl p-10 sm:p-12 text-center space-y-6 shadow-2xl border border-[#4ade80]/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#4ade80]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80]">
                    ESTIMATED CO₂ SAVED
                  </span>
                  <p className="text-6xl sm:text-7xl font-black font-display text-[#4ade80] tracking-tight">
                    {calculatedCo2}{' '}
                    <span className="text-2xl font-bold text-[#edf7ee]">kg</span>
                  </p>
                </div>
                <p className="text-sm text-[#edf7ee]/80 leading-relaxed font-normal relative z-10">
                  Equivalent to driving{' '}
                  <span className="font-extrabold text-[#4ade80]">
                    {(calculatedCo2 * 4.2).toFixed(0)} km
                  </span>{' '}
                  less in a standard vehicle.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
