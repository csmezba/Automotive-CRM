"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Car, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  FileText, 
  LayoutDashboard, 
  BrainCircuit,
  Bell,
  Search,
} from "lucide-react";

// Components
import Dashboard from "@/components/Dashboard";
import CustomerManagement from "@/components/CustomerManagement";
import VehicleManagement from "@/components/VehicleManagement";
import ServiceBookings from "@/components/ServiceBookings";
import SpareParts from "@/components/SpareParts";
import AICenter from "@/components/AICenter";
import WarrantyManagement from "@/components/WarrantyManagement";
import Invoices from "@/components/Invoices";

// Data Types
import { 
  Customer, 
  Vehicle, 
  ServiceBooking, 
  SparePart, 
  WarrantyPolicy, 
  Invoice, 
  Mechanic, 
  DashboardStats 
} from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeRole, setActiveRole] = useState<"advisor" | "mechanic" | "manager" | "admin">("manager");
  const [selectedBranch, setSelectedBranch] = useState<string>("Seattle Central");
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // DB States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [parts, setParts] = useState<SparePart[]>([]);
  const [policies, setPolicies] = useState<WarrantyPolicy[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, text: "High priority brake caliper parts level is below 15% safety limit.", time: "10 mins ago", type: "alert" },
    { id: 2, text: "Valet booking scheduled for Samantha Reed (Honda Accord APX-901).", time: "1 hr ago", type: "info" },
    { id: 3, text: "Gemini AI diagnostic scan completed for BMW 3 Series model.", time: "2 hrs ago", type: "ai" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch initial database structures from Next.js API Route Handler
  const loadAllData = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
        setVehicles(data.vehicles || []);
        setBookings(data.bookings || []);
        setParts(data.parts || []);
        setPolicies(data.policies || []);
        setInvoices(data.invoices || []);
        setMechanics(data.mechanics || []);
        setStats(data.stats || null);
      } else {
        console.error("Failed to load dashboard data from backend.");
      }
    } catch (err) {
      console.error("Backend fetch error:", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);


  const loadMockData = () => {
    const mockCustomers: Customer[] = [
      {
        id: "CUST-1",
        name: "Samantha Reed",
        email: "samantha.reed@example.com",
        phone: "206-555-0192",
        status: "Active",
        tags: ["VIP", "Fleet-Owner"],
        group: "Premium",
        loyaltyPoints: 340,
        createdAt: "2025-01-10T10:00:00Z",
        notes: [
          { id: "N1", author: "Advisor Greg", text: "Customer prefers direct text messaging and standard synthetic oil formula.", createdAt: "2026-07-02T14:20:00Z" }
        ],
        documents: [
          { id: "D1", name: "Registration_Accord.pdf", type: "pdf", size: "1.2 MB", url: "#", uploadedAt: "2025-01-10T10:05:00Z" }
        ]
      },
      {
        id: "CUST-2",
        name: "Marcus Vance",
        email: "marcus.vance@example.com",
        phone: "415-555-9012",
        status: "Active",
        tags: [],
        group: "Retail",
        loyaltyPoints: 85,
        createdAt: "2025-03-22T11:00:00Z",
        notes: [],
        documents: []
      },
      {
        id: "CUST-3",
        name: "Dr. Elena Rostova",
        email: "elena.rostova@example.com",
        phone: "206-555-7821",
        status: "Active",
        tags: ["VIP"],
        group: "Premium",
        loyaltyPoints: 1200,
        createdAt: "2024-11-15T09:00:00Z",
        notes: [
          { id: "N2", author: "Advisor Sarah", text: "Requires executive valet pick-up directly from Swedish Hospital.", createdAt: "2026-06-18T08:30:00Z" }
        ],
        documents: []
      }
    ];

    const mockVehicles: Vehicle[] = [
      {
        id: "VEH-1",
        customerId: "CUST-1",
        customerName: "Samantha Reed",
        brand: "Honda",
        model: "Accord",
        variant: "Touring 2.0T",
        year: 2021,
        color: "Platinum White",
        licensePlate: "APX-901",
        vin: "1HGCR2F81MA00281",
        mileage: 41200,
        fuelType: "Petrol",
        transmission: "Automatic",
        images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400"],
        status: "In Service",
        insuranceExpiry: "2027-01-10",
        warrantyExpiry: "2026-07-01",
        accidentHistory: []
      },
      {
        id: "VEH-2",
        customerId: "CUST-2",
        customerName: "Marcus Vance",
        brand: "BMW",
        model: "3 Series",
        variant: "330i M Sport",
        year: 2022,
        color: "Mineral Grey",
        licensePlate: "BMW-330",
        vin: "WBA8A9C02NF02910",
        mileage: 28500,
        fuelType: "Petrol",
        transmission: "Automatic",
        images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400"],
        status: "Ready for Pickup",
        insuranceExpiry: "2027-04-15",
        warrantyExpiry: "2025-04-15",
        accidentHistory: [
          { id: "A1", severity: "Minor", date: "2023-11-04", description: "Fender bender repair on passenger door casing. Sourced original BMW panels." }
        ]
      }
    ];

    const mockBookings: ServiceBooking[] = [
      {
        id: "BOOK-101",
        customerId: "CUST-1",
        customerName: "Samantha Reed",
        customerPhone: "206-555-0192",
        vehicleId: "VEH-1",
        vehicleName: "Honda Accord (APX-901)",
        licensePlate: "APX-901",
        mechanicId: "MECH-1",
        mechanicName: "Greg Forester",
        serviceType: "Oil Change",
        bookingDate: "2026-07-18",
        bookingTime: "09:00",
        status: "In Progress",
        estimatedCost: 120,
        estimatedTimeHours: 1.5,
        pickupRequired: true,
        dropRequired: false,
        customerNotes: "Regular mileage oil change. Please inspect brakes.",
        checklist: [
          { id: "CK1", item: "Drain existing engine oil formulas", checked: true },
          { id: "CK2", item: "Install original manufacturer filter gaskets", checked: true },
          { id: "CK3", item: "Replenish full synthetic 5W-30 oil", checked: false },
          { id: "CK4", item: "Conduct electronic diagnostic reset", checked: false }
        ]
      }
    ];

    const mockParts: SparePart[] = [
      {
        id: "PART-1",
        name: "Synthetic Oil 5W-30",
        sku: "OIL-5W30-SYN",
        category: "Fluids",
        stock: 45,
        minStock: 20,
        purchasePrice: 15,
        sellingPrice: 35,
        supplier: "Valvoline Wholesale Corp",
        warehouseLocation: "Aisle 3, Shelf D",
        compatibleVehicles: ["Universal"]
      }
    ];

    const mockPolicies: WarrantyPolicy[] = [
      {
        id: "WAR-101",
        vehicleId: "VEH-1",
        vehicleName: "Honda Accord",
        licensePlate: "APX-901",
        customerId: "CUST-1",
        customerName: "Samantha Reed",
        policyNumber: "W-781-AERO",
        policyType: "Standard Manufacturer",
        startDate: "2024-01-10",
        durationMonths: 36,
        coverageCapPrice: 3000,
        deductible: 50,
        status: "Active",
        claims: []
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: "INV-90201",
        bookingId: "BOOK-101",
        customerId: "CUST-1",
        customerName: "Samantha Reed",
        customerPhone: "206-555-0192",
        vehicleId: "VEH-1",
        vehicleName: "Honda Accord",
        licensePlate: "APX-901",
        subtotal: 120,
        tax: 12,
        discount: 10,
        totalAmount: 122,
        status: "Unpaid",
        dueDate: "2026-07-25",
        paymentMethod: "Credit Card",
        items: [
          { id: "I1", description: "Full Synthetic Oil Refill & Filter", quantity: 1, unitPrice: 120, totalPrice: 120 }
        ]
      }
    ];

    const mockMechanics: Mechanic[] = [
      { id: "MECH-1", name: "Greg Forester", email: "greg@example.com", skills: ["Engine Tuning"], status: "Busy", rating: 4.8, completedJobs: 142, workingHours: "08:00 - 17:00", attendanceStatus: "Present", efficiencyScore: 94, activeJobsCount: 1 }
    ];

    const mockStats: DashboardStats = {
      todayBookingsCount: 8,
      vehiclesInServiceCount: 3,
      completedServicesCount: 14,
      revenuePaid: 12450,
      monthlyRevenue: [
        { month: "Jan", revenue: 8400, bookings: 42 },
        { month: "Feb", revenue: 9900, bookings: 51 },
        { month: "Mar", revenue: 11200, bookings: 58 }
      ],
      serviceTrend: [
        { type: "Oil Change", count: 48 },
        { type: "Brake Service", count: 32 }
      ]
    };

    setCustomers(mockCustomers);
    setVehicles(mockVehicles);
    setBookings(mockBookings);
    setParts(mockParts);
    setPolicies(mockPolicies);
    setInvoices(mockInvoices);
    setMechanics(mockMechanics);
    setStats(mockStats);
  };

  // CRUD API Post Operations
  const handleAddCustomer = async (cust: any) => {
    const newCust: Customer = {
      id: `CUST-${Date.now()}`,
      createdAt: new Date().toISOString(),
      notes: [],
      documents: [],
      ...cust
    };
    
    setCustomers([newCust, ...customers]);
    
    try {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCust)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleUpdateCustomer = async (id: string, updatedFields: any) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    try {
      await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    try {
      await fetch(`/api/customers/${id}`, { method: "DELETE" });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleAddVehicle = async (veh: any) => {
    const newVeh: Vehicle = {
      id: `VEH-${Date.now()}`,
      images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400"],
      ...veh
    };
    
    setVehicles([newVeh, ...vehicles]);

    try {
      await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVeh)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleUpdateVehicle = async (id: string, updatedFields: any) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...updatedFields } : v));
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    try {
      await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleAddBooking = async (b: any) => {
    const newB: ServiceBooking = {
      id: `BOOK-${Date.now().toString().substring(8)}`,
      ...b
    };

    setBookings([newB, ...bookings]);

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newB)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleUpdateBooking = async (updated: ServiceBooking) => {
    setBookings(bookings.map(b => b.id === updated.id ? updated : b));
    try {
      await fetch(`/api/bookings/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleAddPart = async (p: any) => {
    const newP: SparePart = {
      id: `PART-${Date.now().toString().substring(10)}`,
      ...p
    };

    setParts([newP, ...parts]);
    try {
      await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newP)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleUpdatePart = async (id: string, updatedFields: any) => {
    setParts(parts.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    try {
      await fetch(`/api/parts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleAddPolicy = async (p: any) => {
    const newP: WarrantyPolicy = {
      id: `WAR-${Date.now().toString().substring(10)}`,
      ...p
    };

    setPolicies([newP, ...policies]);
    try {
      await fetch("/api/warranties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newP)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleAddClaim = async (policyId: string, claim: any) => {
    const newClaims = [
      ...(policies.find(p => p.id === policyId)?.claims || []),
      { id: `CLM-${Date.now()}`, ...claim }
    ];
    setPolicies(policies.map(p => p.id === policyId ? { ...p, claims: newClaims } : p));
    try {
      await fetch("/api/warranties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId, claim })
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleAddInvoice = async (inv: any) => {
    const newInv: Invoice = {
      id: `INV-${Date.now().toString().substring(8)}`,
      ...inv
    };

    setInvoices([newInv, ...invoices]);
    try {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInv)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const handleUpdateInvoice = async (id: string, updatedFields: any) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, ...updatedFields } : i));
    try {
      await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      await loadAllData();
    } catch (e) {
      console.warn("Backend Sync error", e);
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Executive Desk", icon: LayoutDashboard },
    { id: "customers", label: "Client Database", icon: Users },
    { id: "vehicles", label: "Fleet & Cars", icon: Car },
    { id: "bookings", label: "Service Schedulers", icon: Calendar },
    { id: "parts", label: "Warehouse Inventory", icon: Wrench },
    { id: "ai", label: "AI Diagnostic Deck", icon: BrainCircuit },
    { id: "warranty", label: "Claims & Policies", icon: ShieldCheck },
    { id: "invoices", label: "Invoices & Ledger", icon: FileText }
  ];

  return (
    <div className="min-h-screen font-sans bg-[#0f172a] text-slate-200 flex overflow-hidden select-none relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#020617] shrink-0 p-5 flex flex-col justify-between hidden md:flex z-10">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">DriveSync</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Automotive CRM App Router</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile role switcher */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs uppercase text-white shrink-0">
              JD
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-slate-200 truncate">John Doe</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{activeRole} profile</p>
            </div>
          </div>

          <div className="space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Simulator role Switch</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as any)}
              className="w-full text-[10px] font-semibold text-slate-300 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="advisor" className="bg-[#020617] text-slate-300">Service Advisor</option>
              <option value="mechanic" className="bg-[#020617] text-slate-300">Technician/Mechanic</option>
              <option value="manager" className="bg-[#020617] text-slate-300">Service Manager</option>
              <option value="admin" className="bg-[#020617] text-slate-300">Administrator</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Dynamic Glassmorphic Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/30 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <span className="text-slate-500">Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-slate-300 cursor-pointer"
              >
                <option value="Seattle Central" className="bg-[#020617] text-slate-300">Seattle Central</option>
                <option value="Bellevue East" className="bg-[#020617] text-slate-300">Bellevue East</option>
                <option value="Portland North" className="bg-[#020617] text-slate-300">Portland North</option>
              </select>
            </div>

            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search database globally..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900/50 text-slate-200 border border-slate-800 rounded-full focus:outline-none placeholder:text-slate-600 focus:border-slate-700 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-900/50 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer relative"
                title="System Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <span className="font-extrabold text-slate-200">System Bulletins</span>
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-blue-400 font-semibold hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-500">All caught up!</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800 flex flex-col gap-1">
                          <p className="text-slate-300 leading-normal">{n.text}</p>
                          <span className="text-[9px] text-slate-500 font-bold">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content View */}
        <section className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {activeTab === "dashboard" && (
            <Dashboard 
              bookings={bookings}
              parts={parts}
              mechanics={mechanics}
              warranties={policies as any}
              revenueData={{
                monthlyServiceTrends: stats?.monthlyRevenue || [],
                topServices: stats?.serviceTrend?.map(t => ({ name: t.type, value: t.count })) || []
              }}
              onNavigate={(tab) => setActiveTab(tab)}
              onUpdateBooking={handleUpdateBooking}
              onSelectBooking={() => {
                setActiveTab("bookings");
              }}
            />
          )}

          {activeTab === "customers" && (
            <CustomerManagement 
              customers={customers}
              vehicles={vehicles}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeTab === "vehicles" && (
            <VehicleManagement 
              vehicles={vehicles}
              customers={customers}
              onAddVehicle={handleAddVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />
          )}

          {activeTab === "bookings" && (
            <ServiceBookings 
              bookings={bookings}
              customers={customers}
              vehicles={vehicles}
              mechanics={mechanics}
              onAddBooking={handleAddBooking}
              onUpdateBooking={handleUpdateBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          )}

          {activeTab === "parts" && (
            <SpareParts 
              parts={parts}
              onAddPart={handleAddPart}
              onUpdatePart={handleUpdatePart}
            />
          )}

          {activeTab === "ai" && (
            <AICenter />
          )}

          {activeTab === "warranty" && (
            <WarrantyManagement 
              policies={policies}
              vehicles={vehicles}
              onAddClaim={handleAddClaim}
              onAddPolicy={handleAddPolicy}
            />
          )}

          {activeTab === "invoices" && (
            <Invoices 
              invoices={invoices}
              customers={customers}
              vehicles={vehicles}
              bookings={bookings}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoice={handleUpdateInvoice}
            />
          )}
        </section>
      </main>
    </div>
  );
}
