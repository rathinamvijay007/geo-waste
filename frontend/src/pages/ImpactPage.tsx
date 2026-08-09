import { useState, useEffect } from 'react';
import {
  TreePine, Droplets, Wind, Recycle,
  Award, Calculator
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { ecoImpactApi } from '../api/ecoImpactApi';
import type { EcoImpact } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const monthlyTrends = [
  { month: 'Jan', plastic: 2.1, ewaste: 0.5, batteries: 1 },
  { month: 'Feb', plastic: 3.4, ewaste: 1.0, batteries: 1 },
  { month: 'Mar', plastic: 4.8, ewaste: 1.2, batteries: 2 },
  { month: 'Apr', plastic: 2.1, ewaste: 0.5, batteries: 1 },
];

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#8b5cf6'];

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
          calcPlastic > 0 ? ecoImpactApi.calculateImpactSingle('Plastic', calcPlastic) : Promise.resolve({ co2_saved_kg: 0 }),
          calcEwaste > 0 ? ecoImpactApi.calculateImpactSingle('E-Waste', calcEwaste) : Promise.resolve({ co2_saved_kg: 0 }),
          calcBatteries > 0 ? ecoImpactApi.calculateImpactSingle('Battery', calcBatteries) : Promise.resolve({ co2_saved_kg: 0 }),
        ]);
        if (active) {
          const total = pRes.co2_saved_kg + eRes.co2_saved_kg + bRes.co2_saved_kg;
          setCalculatedCo2(parseFloat(total.toFixed(1)));
        }
      } catch {
        if (active) {
          const co2 = (calcPlastic * 1.5) + (calcEwaste * 2.2) + (calcBatteries * 0.3);
          setCalculatedCo2(parseFloat(co2.toFixed(1)));
        }
      }
    }
    runCalc();
    return () => { active = false; };
  }, [calcPlastic, calcEwaste, calcBatteries]);

  if (loading || !impact) {
    return <div className="pt-28"><LoadingSpinner text="Calculating environmental metrics..." size="lg" /></div>;
  }

  const pieData = [
    { name: 'Plastic Materials', value: impact.plasticRecycled },
    { name: 'E-Waste Processed', value: impact.ewasteRecycled },
    { name: 'Batteries Disposed', value: impact.batteriesRecycled * 0.2 },
  ];

  return (
    <div className="py-24 sm:py-32 lg:py-44 min-h-screen bg-ambient-light">
      <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16 space-y-16 lg:space-y-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#ebf5ed] border border-[#22c55e]/30 text-[#143e2b] text-xs font-bold uppercase tracking-widest shadow-2xs">
            <Award className="w-4 h-4 text-[#22c55e]" />
            <span>COMMUNITY ENVIRONMENTAL FOOTPRINT</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#1b251f] tracking-tight">
            Environmental Impact & Eco Score
          </h1>
          <p className="text-lg text-[#556358] leading-relaxed font-medium">
            Detailed metrics, CO₂ offset statistics, and interactive waste impact calculator.
          </p>
        </motion.div>

        {/* Top Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="glass-card rounded-3xl p-8 lg:p-10 border border-white/80 shadow-lg space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ebf5ed] border border-[#22c55e]/30 flex items-center justify-center text-[#143e2b]">
              <TreePine className="w-7 h-7 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black font-display text-[#1b251f] tracking-tight">{impact.wasteDiverted} kg</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#556358] mt-2">Total Waste Diverted</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-8 lg:p-10 border border-white/80 shadow-lg space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ebf5ed] border border-[#22c55e]/30 flex items-center justify-center text-[#143e2b]">
              <Wind className="w-7 h-7 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black font-display text-[#1b251f] tracking-tight">{impact.co2Avoided} kg</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#556358] mt-2">CO₂ Emissions Avoided</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-8 lg:p-10 border border-white/80 shadow-lg space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ebf5ed] border border-[#22c55e]/30 flex items-center justify-center text-[#143e2b]">
              <Droplets className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black font-display text-[#1b251f] tracking-tight">{Math.round(impact.co2Avoided * 14.5)}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#556358] mt-2">Gallons Water Saved</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-8 lg:p-10 border border-white/80 shadow-lg space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ebf5ed] border border-[#22c55e]/30 flex items-center justify-center text-[#143e2b]">
              <Recycle className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black font-display text-[#1b251f] tracking-tight">{Math.round(impact.co2Avoided * 0.08)}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#556358] mt-2">Trees Preserved</p>
            </div>
          </motion.div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Monthly Trend Bar Chart */}
          <div className="lg:col-span-7 glass-panel rounded-3xl border border-white/80 p-9 sm:p-12 shadow-xl space-y-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-1">RECYCLING HISTORY</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1b251f]">Monthly Drop-off Volume (kg)</h2>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaeae4" />
                  <XAxis dataKey="month" stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#ebf5ed' }} />
                  <Bar dataKey="plastic" name="Plastic" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="ewaste" name="E-Waste" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="batteries" name="Batteries" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Type Distribution Pie Chart */}
          <div className="lg:col-span-5 glass-panel rounded-3xl border border-white/80 p-9 sm:p-12 shadow-xl space-y-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-1">MATERIAL BREAKDOWN</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1b251f]">Category Share</h2>
            </div>

            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#eaeae4]">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-bold text-[#4a554e]">
                  <span className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="font-extrabold text-[#1b251f]">{item.value.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Impact Calculator */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel rounded-3xl border border-white/80 p-10 sm:p-14 lg:p-16 shadow-2xl space-y-10"
        >
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#22c55e]" /> INTERACTIVE SIMULATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1b251f]">Calculate Your CO₂ Savings</h2>
            <p className="text-base text-[#556358] font-medium">Input your estimated recycling quantities to project your environmental contribution.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-2">Plastic Materials (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={calcPlastic}
                  onChange={e => setCalcPlastic(Number(e.target.value))}
                  className="w-full px-5 py-4 rounded-2xl border border-[#d5ded8] bg-white text-base font-bold text-[#1b251f] focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-2">E-Waste (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={calcEwaste}
                  onChange={e => setCalcEwaste(Number(e.target.value))}
                  className="w-full px-5 py-4 rounded-2xl border border-[#d5ded8] bg-white text-base font-bold text-[#1b251f] focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-2">Batteries (units)</label>
                <input
                  type="number"
                  min="0"
                  value={calcBatteries}
                  onChange={e => setCalcBatteries(Number(e.target.value))}
                  className="w-full px-5 py-4 rounded-2xl border border-[#d5ded8] bg-white text-base font-bold text-[#1b251f] focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] outline-none"
                />
              </div>
            </div>

            {/* Projected Result Box */}
            <div className="lg:col-span-5">
              <div className="bg-ambient-dark rounded-3xl p-10 text-white text-center space-y-6 shadow-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#4ade80]">ESTIMATED CO₂ SAVED</span>
                  <p className="text-6xl sm:text-7xl font-black font-display text-[#4ade80] tracking-tight">{calculatedCo2} <span className="text-2xl font-bold text-white">kg</span></p>
                </div>
                <p className="text-xs text-[#c3ded0] leading-relaxed font-medium relative z-10">
                  Equivalent to driving <span className="font-extrabold text-white">{(calculatedCo2 * 4.2).toFixed(0)} km</span> less in a standard petrol vehicle.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
