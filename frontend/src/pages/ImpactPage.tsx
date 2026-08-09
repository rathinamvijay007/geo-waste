import { useState, useEffect } from 'react';
import {
  TreePine, Droplets, Wind, Recycle, Package, Battery, Monitor,
  TrendingUp, Award, Calculator
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { ecoImpactApi } from '../api/ecoImpactApi';
import type { EcoImpact } from '../types';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const monthlyTrends = [
  { month: 'Jan', plastic: 2.1, ewaste: 0.5, batteries: 1 },
  { month: 'Feb', plastic: 3.4, ewaste: 1.0, batteries: 1 },
  { month: 'Mar', plastic: 4.8, ewaste: 1.2, batteries: 2 },
  { month: 'Apr', plastic: 2.1, ewaste: 0.5, batteries: 1 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

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
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-eco-50 border border-eco-200/60 text-eco-800 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-eco-600" />
            <span>COMMUNITY ENVIRONMENTAL FOOTPRINT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
            Environmental Impact & Eco Score
          </h1>
          <p className="text-base text-surface-500 leading-relaxed">
            Detailed metrics, CO₂ offset statistics, and interactive waste impact calculator.
          </p>
        </motion.div>

        {/* Top Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-2xs space-y-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-eco-50 border border-eco-100 flex items-center justify-center text-eco-700 mb-4">
              <TreePine className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">{impact.wasteDiverted} kg</p>
            <p className="text-xs font-bold uppercase tracking-wider text-surface-500">Total Waste Diverted</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-2xs space-y-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">{impact.co2Avoided} kg</p>
            <p className="text-xs font-bold uppercase tracking-wider text-surface-500">CO₂ Emissions Avoided</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-2xs space-y-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Recycle className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">{impact.plasticRecycled} kg</p>
            <p className="text-xs font-bold uppercase tracking-wider text-surface-500">Plastic Processed</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-2xs space-y-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">{impact.ecoScore}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-surface-500">Overall Eco Score</p>
          </motion.div>
        </div>

        {/* Charts & Breakdown Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Monthly Recycling Trends Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="lg:col-span-8 bg-white rounded-3xl border border-surface-200/80 p-8 shadow-2xs space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-surface-100">
              <div>
                <h3 className="font-bold text-surface-900 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-eco-700" /> Monthly Recycling Activity
                </h3>
                <p className="text-xs text-surface-500 mt-0.5 font-medium">Recorded drop-offs by waste material category (kg)</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f5f5f4' }} />
                  <Bar dataKey="plastic" fill="#2563eb" radius={[6, 6, 0, 0]} name="Plastic (kg)" />
                  <Bar dataKey="ewaste" fill="#10b981" radius={[6, 6, 0, 0]} name="E-Waste (kg)" />
                  <Bar dataKey="batteries" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Batteries (units)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Share Donut Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-4 bg-white rounded-3xl border border-surface-200/80 p-8 shadow-2xs space-y-6 flex flex-col justify-between"
          >
            <h3 className="font-bold text-surface-900 text-lg pb-4 border-b border-surface-100">Material Distribution</h3>
            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-extrabold text-surface-900">{impact.wasteDiverted}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Total KG</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-surface-100">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-surface-600">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="text-surface-900">{item.value.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Environmental Impact Calculator Feature #35 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 shadow-2xs space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-100">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-surface-900 flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-eco-700" /> Interactive Impact Calculator
              </h3>
              <p className="text-sm text-surface-500 font-medium">Estimate your CO₂ savings before bringing your waste to a drop-off center.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6">
              <Input
                label="Plastic Materials (kg)"
                type="number"
                value={calcPlastic}
                onChange={e => setCalcPlastic(Number(e.target.value))}
                icon={<Package className="w-4 h-4 text-blue-600" />}
              />
              <Input
                label="E-Waste & Electronics (kg)"
                type="number"
                value={calcEwaste}
                onChange={e => setCalcEwaste(Number(e.target.value))}
                icon={<Monitor className="w-4 h-4 text-emerald-600" />}
              />
              <Input
                label="Spent Batteries (units)"
                type="number"
                value={calcBatteries}
                onChange={e => setCalcBatteries(Number(e.target.value))}
                icon={<Battery className="w-4 h-4 text-amber-600" />}
              />
            </div>

            <div className="md:col-span-5 bg-gradient-to-br from-eco-950 via-eco-900 to-eco-950 rounded-3xl p-8 text-white text-center space-y-5 border border-eco-900 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto border border-white/15">
                <Wind className="w-7 h-7 text-eco-300" />
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white tracking-tight">{calculatedCo2} kg</p>
                <p className="text-xs font-semibold text-eco-200/80 uppercase tracking-widest mt-1">Estimated CO₂ Avoided</p>
              </div>
              <p className="text-xs text-eco-100/70 leading-relaxed font-normal">Equivalent to planting ~{(calculatedCo2 * 0.05).toFixed(1)} trees this year.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
