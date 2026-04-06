"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Trophy, TrendingUp, Calendar, CheckCircle2, User, HardHat, Building2, MapPin, Plus, Edit2, Trash2, X, Phone, ChevronDown, Banknote, Users, FileText, Receipt
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { useAuth } from "@/components/auth/auth-provider";
import { fetchWorkerIntelligence, fetchClients, WorkerIntelligenceData, Client, createResource, updateResource, deleteResource, payWorker } from "@/lib/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fallback: WorkerIntelligenceData = {
  summary: { totalWorkers: 0, bestWorker: null },
  workers: []
};

const defaultData = {
  summary: {
    totalWorkers: 5,
    bestWorker: { id: 1, name: "Tariq Ali", score: 98 }
  },
  workers: [
    {
      id: 1, name: "Tariq Ali", role: "Site Supervisor", dailyWage: 5000,
      attendance: { present: 22, half: 0, absent: 0 },
      earnedSalary: 110000, productivityScore: 98,
      assignedProjects: [
        { project_id: 1, project_name: "Lake View Villas" },
        { project_id: 2, project_name: "Riverside Plaza" }
      ]
    },
    {
      id: 2, name: "Usman Khan", role: "Electrician", dailyWage: 3500,
      attendance: { present: 19, half: 2, absent: 1 },
      earnedSalary: 70000, productivityScore: 85,
      assignedProjects: [
        { project_id: 1, project_name: "Lake View Villas" }
      ]
    },
    {
      id: 3, name: "Bilal Ahmad", role: "Mason", dailyWage: 2500,
      attendance: { present: 20, half: 1, absent: 1 },
      earnedSalary: 51250, productivityScore: 88,
      assignedProjects: [
        { project_id: 3, project_name: "Green Homes Block C" }
      ]
    }
  ]
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, transition: { duration: 0.3 } }}
    className={cn(
      "relative overflow-hidden rounded-3xl p-6",
      "bg-white/40 backdrop-blur-xl border border-white/40",
      "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),inset_0__1px_0_rgba(255,255,255,0.6)]",
      "transition-all duration-300",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export function WorkerManagement() {
  const { session } = useAuth();
  const [data, setData] = useState<WorkerIntelligenceData>(fallback);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "", daily_wage: 0, phone: "" });

  const [clients, setClients] = useState<Client[]>([]);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payWorkerTarget, setPayWorkerTarget] = useState<any>(null);
  const [payFormData, setPayFormData] = useState({
    amount: 0,
    projectId: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    clientId: 0,
    invoiceDescription: "",
  });

  const load = async () => {
    if (!session?.token) return;
    setLoading(true);
    setError("");

    try {
      const [next, clientList] = await Promise.all([
        fetchWorkerIntelligence(session.token),
        fetchClients(session.token).catch(() => [] as Client[]),
      ]);
      if (next.workers.length === 0) {
        setData(defaultData);
      } else {
        setData(next);
      }
      setClients(clientList);
    } catch (loadError) {
      console.error(loadError);
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [session?.token]);

  const handleOpenModal = (worker?: any) => {
    if (worker) {
      setEditingId(worker.id);
      setFormData({
        name: worker.name,
        role: worker.role,
        daily_wage: worker.dailyWage,
        phone: worker.phone || "", // If available
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", role: "", daily_wage: 0, phone: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.token) return;
    try {
      if (editingId) {
        await updateResource("/workers", editingId, session.token, formData);
      } else {
        await createResource("/workers", session.token, formData);
      }
      setIsModalOpen(false);
      void load();
    } catch (error: any) {
      alert("Error saving worker: " + error.message);
    }
  };

  const handleOpenPayModal = (worker: any) => {
    setPayWorkerTarget(worker);
    setPayFormData({
      amount: worker.earnedSalary || worker.dailyWage || 0,
      projectId: worker.assignedProjects?.[0]?.project_id || 0,
      paymentDate: new Date().toISOString().split("T")[0],
      clientId: 0,
      invoiceDescription: `Labour payment — ${worker.name} (${worker.role})`,
    });
    setIsPayModalOpen(true);
  };

  const handlePaySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.token || !payWorkerTarget) return;
    try {
      await payWorker(payWorkerTarget.id, session.token, payFormData);
      setIsPayModalOpen(false);
      void load();
      alert("Worker paid successfully! Invoice and Expense records generated.");
    } catch (error: any) {
      alert("Error processing payment: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.token) return;
    if (!confirm("Are you sure you want to delete this worker?")) return;
    try {
      await deleteResource("/workers", id, session.token);
      void load();
    } catch (error: any) {
      alert("Error deleting worker: " + error.message);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8" style={{ perspective: "1000px" }}>
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 mb-4 shadow-sm">
              <HardHat className="w-4 h-4 text-ink/70" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-ink/70">Resource Manager</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-display text-ink font-bold tracking-tight">
                Smart Worker Management
              </h1>
              <button 
                onClick={() => handleOpenModal()}
                className="hidden md:flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-full font-semibold hover:bg-moss/90 transition shadow-[0_0_15px_rgba(54,88,71,0.4)]"
              >
                <Plus className="w-4 h-4" /> Add Worker
              </button>
            </div>
            <p className="text-ink/60 mt-3 text-lg max-w-2xl">
              Track attendance, monitor productivity scores, overview multi-project assignments, and auto-calculate salaries based on presence.
            </p>
            <button 
              onClick={() => handleOpenModal()}
              className="mt-4 md:hidden flex w-full justify-center items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-full font-semibold hover:bg-moss/90 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Worker
            </button>
          </div>
        </motion.div>

        {/* Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="md:col-span-2 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(54,88,71,0.8))] text-white border-none">
            <div className="flex flex-col md:flex-row gap-6 relative">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Trophy className="w-32 h-32" />
              </div>
              <div className="flex-1 z-10">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-emerald-200">Best Performing Worker</span>
                <h3 className="text-4xl font-display font-semibold mt-2 text-white">
                  {data.summary.bestWorker?.name || "Pending..."}
                </h3>
                <p className="text-white/70 mt-2 text-sm leading-relaxed max-w-sm">
                  Achieved the highest productivity score this period through consistent attendance and successful multi-project mobilization.
                </p>
              </div>
              <div className="flex items-center justify-center z-10 border-l border-white/10 pl-6 md:min-w-[150px]">
                <div className="text-center">
                  <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-white">
                    {data.summary.bestWorker?.score || 0}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-widest text-emerald-100/70 mt-1">Prod Score</div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
             <div className="p-2 bg-ink/5 rounded-2xl w-fit mb-4">
                <User className="w-6 h-6 text-ink" />
             </div>
             <p className="text-sm font-medium text-ink/60">Total Workforce</p>
             <h3 className="text-4xl font-display font-semibold mt-1 text-ink">{data.summary.totalWorkers}</h3>
          </GlassCard>
        </div>

        {/* Worker Table / List */}
        <div className="grid gap-4 mt-8">
          {data.workers.map((worker) => (
            <GlassCard key={worker.id} className="p-0 group relative cursor-default">
              <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                
                {/* Worker Identity */}
                <div className="flex items-start gap-4 lg:w-1/4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-moss to-ink flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-moss/20 shrink-0">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink">{worker.name}</h3>
                    <p className="text-sm font-medium text-ink/50 uppercase tracking-widest mt-1">{worker.role}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-ink/40 bg-ink/5 px-2.5 py-1 rounded-md w-fit">
                      <TrendingUp className="w-3.5 h-3.5" /> PKR {worker.dailyWage.toLocaleString()}/day
                    </div>
                  </div>
                </div>

                {/* Assignments */}
                <div className="lg:w-1/4">
                   <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-3">Mobilization</p>
                   {worker.assignedProjects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {worker.assignedProjects.map(p => (
                          <span key={p.project_id} className="flex items-center gap-1.5 text-xs font-semibold text-ink/70 bg-white/60 border border-white backdrop-blur rounded-full px-3 py-1 shadow-sm">
                            <MapPin className="w-3 h-3 text-moss" />
                            {p.project_name}
                          </span>
                        ))}
                      </div>
                   ) : (
                     <span className="text-xs text-ink/50 font-medium">Unassigned</span>
                   )}
                </div>

                {/* Attendance */}
                <div className="lg:w-1/4">
                  <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Validated Attendance
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2 text-center">
                      <span className="block text-lg font-bold text-emerald-700">{worker.attendance.present}</span>
                      <span className="block text-[10px] uppercase font-bold text-emerald-600/70 tracking-wider">Pres</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-2 text-center">
                      <span className="block text-lg font-bold text-amber-700">{worker.attendance.half}</span>
                      <span className="block text-[10px] uppercase font-bold text-amber-600/70 tracking-wider">Half</span>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-2 text-center">
                      <span className="block text-lg font-bold text-red-700">{worker.attendance.absent}</span>
                      <span className="block text-[10px] uppercase font-bold text-red-600/70 tracking-wider">Abs</span>
                    </div>
                  </div>
                </div>

                {/* Auto Salary & Productivity */}
                <div className="flex gap-4 lg:w-1/4 lg:justify-end">
                   <div className="flex-1 text-right">
                      <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-1">Computed Salary</p>
                      <p className="text-2xl font-display font-bold text-moss">
                        PKR {worker.earnedSalary.toLocaleString()}
                      </p>
                   </div>
                   <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                     <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                       <path
                         className="text-ink/10"
                         strokeDasharray="100, 100"
                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         strokeWidth="3" fill="none" stroke="currentColor"
                       />
                       <path
                         className={worker.productivityScore > 90 ? "text-emerald-500" : "text-amber-500"}
                         strokeDasharray={`${worker.productivityScore}, 100`}
                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         strokeWidth="3" fill="none" stroke="currentColor" strokeLinecap="round"
                       />
                     </svg>
                     <span className="absolute font-bold text-sm text-ink">{worker.productivityScore}</span>
                   </div>
                </div>

              </div>

              {/* CRUD Actions */}
              <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenPayModal(worker)} 
                  className="p-2 text-ink/40 hover:text-emerald-500 bg-white/50 hover:bg-white rounded-full transition"
                  title="Pay Worker"
                >
                  <Banknote className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleOpenModal(worker)} 
                  className="p-2 text-ink/40 hover:text-moss bg-white/50 hover:bg-white rounded-full transition"
                  title="Edit Worker"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(worker.id)} 
                  className="p-2 text-ink/40 hover:text-red-500 bg-white/50 hover:bg-white rounded-full transition"
                  title="Delete Worker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </GlassCard>
          ))}
        </div>
      </motion.main>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/40"
            >
              <div className="p-6 relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 p-2 text-ink/40 hover:bg-ink/5 rounded-full"
                >
                  <X className="w-5 h-5"/>
                </button>
                
                <h3 className="text-2xl font-display font-semibold mb-6">
                  {editingId ? "Edit Worker" : "Add Worker"}
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink/70 mb-1">Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition"
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="E.g. Tariq Ali"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink/70 mb-1">Role</label>
                    <div className="relative">
                      <HardHat className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                      <select
                        required
                        className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-11 pr-10 py-3 outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition appearance-none"
                        value={formData.role}
                        onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                      >
                        <option value="" disabled>Select a role...</option>
                        <option value="Site Supervisor">Site Supervisor</option>
                        <option value="Foreman">Foreman</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Mason">Mason</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Laborer">Laborer</option>
                        <option value="Equipment Operator">Equipment Operator</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-ink/50" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink/70 mb-1">Daily Wage (PKR)</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                      <input
                        required
                        type="number"
                        className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition"
                        value={formData.daily_wage || ""}
                        onChange={(e) => setFormData(p => ({ ...p, daily_wage: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink/70 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                      <input
                        type="tel"
                        className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition"
                        value={formData.phone}
                        onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-ink/5 flex justify-end">
                    <button type="submit" className="bg-moss text-white px-6 py-3 rounded-xl font-semibold hover:bg-moss/90 transition shadow-lg shadow-moss/20 w-full">
                      {editingId ? "Save Changes" : "Create Worker"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay Worker Modal */}
      <AnimatePresence>
        {isPayModalOpen && payWorkerTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/40"
            >
              {/* Modal header — worker identity strip */}
              <div className="bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(54,88,71,0.88))] px-6 pt-6 pb-5 text-white relative">
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="absolute right-4 top-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-display font-bold text-xl shrink-0">
                    {payWorkerTarget.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold">Process Payment</p>
                    <h3 className="text-xl font-display font-semibold mt-0.5">{payWorkerTarget.name}</h3>
                    <p className="text-sm text-white/60 mt-0.5">{payWorkerTarget.role}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-white/50 uppercase tracking-widest">Computed Salary</p>
                    <p className="text-2xl font-display font-bold text-emerald-300 mt-0.5">
                      PKR {(payWorkerTarget.earnedSalary || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <form onSubmit={handlePaySave} className="p-6 space-y-4">

                {/* Row: Amount + Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-ink/50 mb-1.5">Amount (PKR)</label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                      <input
                        required
                        type="number"
                        className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition font-semibold"
                        value={payFormData.amount || ""}
                        onChange={(e) => setPayFormData(p => ({ ...p, amount: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-ink/50 mb-1.5">Payment Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                      <input
                        required
                        type="date"
                        className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition"
                        value={payFormData.paymentDate}
                        onChange={(e) => setPayFormData(p => ({ ...p, paymentDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Project selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink/50 mb-1.5">Charge to Project</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                    <select
                      required
                      className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-10 pr-8 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition appearance-none"
                      value={payFormData.projectId}
                      onChange={(e) => setPayFormData(p => ({ ...p, projectId: parseInt(e.target.value) || 0 }))}
                    >
                      <option value={0} disabled>Select project…</option>
                      {payWorkerTarget.assignedProjects?.map((proj: any) => (
                        <option key={proj.project_id} value={proj.project_id}>{proj.project_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none" />
                  </div>
                </div>

                {/* Client selector — invoice billing target */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink/50 mb-1.5">
                    Bill Invoice To (Client)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                    <select
                      required
                      className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-10 pr-8 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition appearance-none"
                      value={payFormData.clientId}
                      onChange={(e) => setPayFormData(p => ({ ...p, clientId: parseInt(e.target.value) || 0 }))}
                    >
                      <option value={0} disabled>Select client…</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none" />
                  </div>
                  {clients.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1.5 font-medium">No clients loaded — add clients first to generate an invoice.</p>
                  )}
                </div>

                {/* Invoice description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink/50 mb-1.5">
                    Invoice Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-ink/40" />
                    <textarea
                      required
                      rows={2}
                      className="w-full bg-ink/5 border border-ink/10 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss/40 transition resize-none"
                      value={payFormData.invoiceDescription}
                      onChange={(e) => setPayFormData(p => ({ ...p, invoiceDescription: e.target.value }))}
                      placeholder="e.g. Labour payment — site supervision, week of April 6"
                    />
                  </div>
                </div>

                {/* Receipt preview strip */}
                {payFormData.amount > 0 && payFormData.projectId > 0 && payFormData.clientId > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-dashed border-moss/30 bg-moss/5 p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Receipt className="w-4 h-4 text-moss" />
                      <span className="text-xs font-bold uppercase tracking-widest text-moss">Invoice Preview</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/50">Worker</span>
                      <span className="font-semibold text-ink">{payWorkerTarget.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/50">Project</span>
                      <span className="font-semibold text-ink">
                        {payWorkerTarget.assignedProjects?.find((p: any) => p.project_id === payFormData.projectId)?.project_name ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/50">Client</span>
                      <span className="font-semibold text-ink">
                        {clients.find(c => c.id === payFormData.clientId)?.name ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-moss/20 pt-2 mt-2">
                      <span className="text-ink/50">Total Billed</span>
                      <span className="font-display font-bold text-moss text-base">
                        PKR {payFormData.amount.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#0f172a] text-white px-6 py-3 rounded-xl font-semibold hover:bg-moss transition shadow-lg w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Banknote className="w-4 h-4" />
                    Process Payment &amp; Generate Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
