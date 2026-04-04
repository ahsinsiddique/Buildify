"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, Wallet, 
  TrendingUp, Activity, PieChart as PieChartIcon, Target
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const cashFlowData = [
  { month: "Jan", income: 45000, expenses: 32000 },
  { month: "Feb", income: 52000, expenses: 34000 },
  { month: "Mar", income: 48000, expenses: 38000 },
  { month: "Apr", income: 61000, expenses: 40000 },
  { month: "May", income: 59000, expenses: 37000 },
  { month: "Jun", income: 68000, expenses: 42000 },
  { month: "Jul", income: 75000, expenses: 45000 },
];

const expenseBreakdown = [
  { name: "Labor", value: 45000, color: "#365847" }, // moss
  { name: "Materials", value: 35000, color: "#bb6b3f" }, // clay
  { name: "Transport", value: 12000, color: "#c79b42" }, // brass
  { name: "Overhead", value: 8000, color: "#0f172a" }, // ink
];

const projectProfitData = [
  { name: "Hudson Reno", profit: 24000, loss: 0 },
  { name: "Skyview Apt", profit: 18500, loss: 0 },
  { name: "Main St Build", profit: 0, loss: -5200 },
  { name: "Downtown Office", profit: 32000, loss: 0 },
  { name: "Westside Dev", profit: 0, loss: -1800 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
    className={cn(
      "relative overflow-hidden rounded-3xl p-6",
      "bg-white/40 backdrop-blur-xl border border-white/40",
      "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),inset_0__1px_0_rgba(255,255,255,0.6)]",
      "transition-all duration-300",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
    <div className="relative z-10 h-full w-full">{children}</div>
  </motion.div>
);

export function FinancialDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 md:p-12 w-full pt-20" style={{ perspective: "1000px" }}>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display text-ink font-semibold tracking-tight">
              Financial Overview
            </h1>
            <p className="text-ink/60 mt-2 text-lg">Real-time tracking, profit/loss, and expense insights.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-ink shadow-sm hover:shadow-md transition-all font-medium">
              Export PDF
            </button>
            <button className="px-6 py-3 rounded-full bg-ink text-sand shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(15,23,42,0.6)] hover:-translate-y-0.5 transition-all font-medium">
              New Transaction
            </button>
          </div>
        </motion.div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-moss/10 rounded-2xl text-moss">
                <Wallet size={24} />
              </div>
              <span className="flex items-center text-moss font-semibold text-sm bg-moss/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" />
                +12.5%
              </span>
            </div>
            <p className="text-ink/60 font-medium mb-1">Total Cash Flow</p>
            <h3 className="text-3xl font-display font-semibold text-ink">$148,000</h3>
          </GlassCard>

          <GlassCard>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brass/10 rounded-2xl text-brass">
                <DollarSign size={24} />
              </div>
              <span className="flex items-center text-moss font-semibold text-sm bg-moss/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" />
                +8.2%
              </span>
            </div>
            <p className="text-ink/60 font-medium mb-1">Net Profit</p>
            <h3 className="text-3xl font-display font-semibold text-ink">$67,500</h3>
          </GlassCard>

          <GlassCard>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-clay/10 rounded-2xl text-clay">
                <Activity size={24} />
              </div>
              <span className="flex items-center text-clay font-semibold text-sm bg-clay/10 px-2 py-1 rounded-full">
                <ArrowDownRight size={14} className="mr-1" />
                -2.4%
              </span>
            </div>
            <p className="text-ink/60 font-medium mb-1">Total Expenses</p>
            <h3 className="text-3xl font-display font-semibold text-ink">$100,000</h3>
          </GlassCard>

          <GlassCard>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-ink/5 rounded-2xl text-ink">
                <Target size={24} />
              </div>
            </div>
            <p className="text-ink/60 font-medium mb-1">Burn Rate</p>
            <h3 className="text-3xl font-display font-semibold text-ink">$14,285 /mo</h3>
          </GlassCard>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart - Cash Flow */}
          <GlassCard className="lg:col-span-2 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                  <TrendingUp size={20} className="text-moss" />
                  Cash Flow Tracking
                </h3>
                <p className="text-sm text-ink/60 mt-1">Income vs Expenses over time</p>
              </div>
              <select className="bg-white/50 border border-ink/10 rounded-xl px-4 py-2 text-sm text-ink font-medium outline-none cursor-pointer">
                <option>Last 7 Months</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#365847" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#365847" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bb6b3f" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#bb6b3f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,23,42,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: "rgba(15,23,42,0.5)", fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: "rgba(15,23,42,0.5)", fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#365847" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#bb6b3f" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Expense Breakdown */}
          <GlassCard className="flex flex-col min-h-[400px]">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                <PieChartIcon size={20} className="text-brass" />
                Where Money Goes
              </h3>
              <p className="text-sm text-ink/60 mt-1">Expense distribution by category</p>
            </div>
            <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {expenseBreakdown.map((ext, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ext.color }} />
                  <div className="flex flex-col">
                    <span className="text-xs text-ink/60 font-medium">{ext.name}</span>
                    <span className="text-sm font-semibold text-ink">${ext.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Profit / Loss per Project */}
          <GlassCard className="lg:col-span-3 min-h-[400px]">
             <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                  <Activity size={20} className="text-ink" />
                  Profit & Loss per Project
                </h3>
                <p className="text-sm text-ink/60 mt-1">Real-time performance metrics</p>
              </div>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProfitData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,23,42,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "rgba(15,23,42,0.7)", fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: "rgba(15,23,42,0.5)", fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(15,23,42,0.02)'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="profit" name="Profit" fill="#365847" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="loss" name="Loss" fill="#bb6b3f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
