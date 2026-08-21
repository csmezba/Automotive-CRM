import React, { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";
import { 
  CalendarDays, 
  Car, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Cpu, 
  ShieldAlert, 
  Clock,
  Sparkles,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { ServiceBooking, SparePart, Mechanic, Warranty } from "../types";

interface DashboardProps {
  bookings: ServiceBooking[];
  parts: SparePart[];
  mechanics: Mechanic[];
  warranties: Warranty[];
  revenueData: any;
  onNavigate: (tab: string) => void;
  onUpdateBooking: (updated: ServiceBooking) => void;
  onSelectBooking: (booking: ServiceBooking) => void;
}

export default function Dashboard({
  bookings,
  parts,
  mechanics,
  warranties,
  revenueData,
  onNavigate,
  onUpdateBooking,
  onSelectBooking
}: DashboardProps) {
  // Compute metrics
  const activeBookings = bookings.filter(b => b.status === "In Progress" || b.status === "Inspection");
  const completedToday = bookings.filter(b => b.status === "Completed").length;
  const readyForPickup = bookings.filter(b => b.status === "Ready").length;
  const lowStockParts = parts.filter(p => p.stock < p.minStock);
  const totalRevenue = bookings.filter(b => b.status === "Completed" || b.invoiceId).reduce((sum, b) => sum + b.estimatedCost, 0);

  // Active garage bay mappings (Interactive Bay Status)
  const bays = [
    { id: "bay-1", name: "Service Bay A (General Lift)", type: "General Repair" },
    { id: "bay-2", name: "Service Bay B (Hydraulic Post)", type: "Brake Service" },
    { id: "bay-3", name: "Service Bay C (Precision Align)", type: "Oil Change" },
    { id: "bay-4", name: "Electric Grid Lab (E-Lift)", type: "Full Service" },
  ];

  // Map bookings to bays based on active states
  const activeJobs = bookings.filter(b => b.status === "In Progress" || b.status === "Inspection").slice(0, 4);

  const handleToggleChecklist = (booking: ServiceBooking, checklistIdx: number) => {
    const updatedChecklist = [...booking.checklist];
    updatedChecklist[checklistIdx] = {
      ...updatedChecklist[checklistIdx],
      checked: !updatedChecklist[checklistIdx].checked
    };

    // Calculate progress
    const checkedCount = updatedChecklist.filter(c => c.checked).length;
    let nextStatus = booking.status;
    if (checkedCount === updatedChecklist.length && booking.status === "In Progress") {
      nextStatus = "Ready";
    }

    const updatedBooking = {
      ...booking,
      checklist: updatedChecklist,
      status: nextStatus
    };
    onUpdateBooking(updatedBooking);
  };

  return (
    <div className="space-y-6" id="dashboard-tab-view">
      {/* Welcome Hero Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
              Enterprise Suite v4.2
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-400">All systems operational</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Apex Command Center
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl">
            Real-time workshop diagnostics, parts forecasting, and predictive customer communications synchronized across branches.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button 
            onClick={() => onNavigate("ai")}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 border border-blue-500/30 transition-all scale-100 hover:scale-102 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-300 animate-bounce" />
            <span>AI Predictive Health Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl hover:border-slate-700/60 transition-all group relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Today's Jobs</span>
              <div className="text-2xl font-bold text-white">{bookings.length}</div>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{bookings.filter(b => b.status === "Pending").length} pending confirmed</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl hover:border-slate-700/60 transition-all group relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">In Service</span>
              <div className="text-2xl font-bold text-white">{activeBookings.length}</div>
            </div>
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            <span>Currently on active lifts</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl hover:border-slate-700/60 transition-all group relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Completed</span>
              <div className="text-2xl font-bold text-white">{completedToday + readyForPickup}</div>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-green-400 mt-4 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-green-500" />
            <span>{readyForPickup} waiting pickup</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl hover:border-slate-700/60 transition-all group relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Low Stock Parts</span>
              <div className="text-2xl font-bold text-white">{lowStockParts.length}</div>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-red-400 mt-4 flex items-center gap-1.5 font-semibold">
            <span>Requires instant reorder</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl hover:border-slate-700/60 transition-all group relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Estimated Revenue</span>
              <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span>18% MoM gain</span>
          </div>
        </div>
      </div>

      {/* Main Core Dashboard Layout - Visual Graphs & Garage Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Operational Revenue Area Chart */}
        <div className="lg:col-span-2 p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Revenue & Operations Index</h3>
              <p className="text-[11px] text-slate-400">Aggregated billing values and booking volumes across branches.</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded" />
                <span className="text-slate-300 font-medium">Revenue (Left axis)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded" />
                <span className="text-slate-300 font-medium">Volume (Right axis)</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData?.monthlyServiceTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#6366f1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ fontSize: "11px", borderRadius: "12px", background: "#020617", border: "1px solid #1e293b", color: "#e2e8f0" }}
                  formatter={(value: any, name: string) => [name === "revenue" ? `$${value}` : `${value} jobs`, name === "revenue" ? "Revenue" : "Bookings"]}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6 }} />
                <Area yAxisId="right" type="monotone" dataKey="bookings" name="bookings" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Services Demand Breakdown Bar Chart */}
        <div className="p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-white">Demand Category Volume</h3>
            <p className="text-[11px] text-slate-400">Total bookings split by specific service category.</p>
          </div>
          <div className="flex-1 w-full min-h-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData?.topServices || []} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ fontSize: "11px", borderRadius: "12px", background: "#020617", border: "1px solid #1e293b", color: "#e2e8f0" }}
                  formatter={(value: any) => [`${value} service requests`, "Count"]}
                />
                <Bar dataKey="value" name="Service Requests" radius={[6, 6, 0, 0]}>
                  {(revenueData?.topServices || []).map((entry: any, index: number) => {
                    const colors = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Garage Floor Status Section */}
      <div className="p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Interactive Garage Floor Status</h3>
              <p className="text-xs text-slate-400">Current lift allocation and real-time technician checklist synchronization.</p>
            </div>
            <span className="text-xs font-semibold bg-slate-950/40 text-slate-400 px-3 py-1 rounded-full border border-slate-800">
              Live Feed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="garage-floor-bays">
          {bays.map((bay, idx) => {
            const activeJob = activeJobs[idx];
            
            return (
              <div 
                key={bay.id} 
                className={`p-4 rounded-xl border transition-all flex flex-col h-[210px] justify-between relative ${
                  activeJob 
                    ? "bg-slate-950/40 border-blue-500/30" 
                    : "bg-dashed bg-slate-950/10 border-slate-800/60"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{bay.name}</span>
                  {activeJob ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Empty Bay</span>
                  )}
                </div>

                {activeJob ? (
                  <div className="my-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div 
                        onClick={() => onSelectBooking(activeJob)}
                        className="font-bold text-xs text-blue-400 hover:underline cursor-pointer truncate"
                      >
                        {activeJob.vehicleName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        Tech: {activeJob.mechanicName || "Assigned"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Task: <span className="font-semibold">{activeJob.serviceType}</span>
                      </div>
                    </div>

                    {/* Checklist Sync Block */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-medium">Checklist Tasks</span>
                        <span className="font-bold text-blue-400">
                          {activeJob.checklist.filter(c => c.checked).length}/{activeJob.checklist.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full transition-all duration-300"
                          style={{ width: `${(activeJob.checklist.filter(c => c.checked).length / activeJob.checklist.length) * 100}%` }}
                        />
                      </div>
                      {/* Live Actions */}
                      <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
                        {activeJob.checklist.map((item, cIdx) => (
                          <button
                            key={item.id}
                            onClick={() => handleToggleChecklist(activeJob, cIdx)}
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 cursor-pointer border ${
                              item.checked 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : "bg-slate-900/50 text-slate-500 border-slate-800 hover:bg-slate-800/40"
                            }`}
                          >
                            Step {cIdx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-center py-6">
                    <span className="text-xs text-slate-500">Ready for incoming lift</span>
                    <button 
                      onClick={() => onNavigate("bookings")}
                      className="mt-3 text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Assign Booked Car</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Dashboard row - Warranty alerts & activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Warranty Expiring Alerts */}
        <div className="p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-white">Expiring Warranties</h3>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Alerts</span>
          </div>
          <div className="space-y-3">
            {warranties.map((w) => {
              const daysLeft = Math.round((new Date(w.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              
              return (
                <div key={w.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">{w.vehicleName}</div>
                    <div className="text-[10px] text-slate-400">Coverage: {w.coverageType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">Expires {w.endDate}</div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${daysLeft < 180 ? "text-orange-400" : "text-slate-500"}`}>
                      {daysLeft} days remaining
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Activity logs / alerts feed */}
        <div className="lg:col-span-2 p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-white">Recent Service Activity Logs</h3>
            <button 
              onClick={() => onNavigate("admin")} 
              className="text-xs text-blue-400 hover:underline"
            >
              View System Logs
            </button>
          </div>
          <div className="divide-y divide-slate-850 max-h-[190px] overflow-y-auto pr-1">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    b.status === "Completed" ? "bg-emerald-500" :
                    b.status === "Ready" ? "bg-blue-500" :
                    b.status === "In Progress" ? "bg-amber-400" : "bg-slate-500"
                  }`} />
                  <div>
                    <div className="font-bold text-slate-200">{b.customerName}</div>
                    <div className="text-[10px] text-slate-400">{b.serviceType} for {b.vehicleName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-300">${b.estimatedCost}</div>
                  <div className="text-[10px] text-slate-500">{b.bookingDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
