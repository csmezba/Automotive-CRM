import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  CalendarDays, 
  Wrench, 
  Settings, 
  ShieldCheck, 
  FileSpreadsheet, 
  Sparkles, 
  Bell, 
  Database,
  ChevronLeft,
  ChevronRight,
  Receipt
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (col: boolean) => void;
  role: string;
}

export default function Sidebar({ currentTab, setCurrentTab, collapsed, setCollapsed, role }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Service Advisor", "Mechanic", "Inventory Manager", "Receptionist"] },
    { id: "customers", label: "Customers", icon: Users, roles: ["Admin", "Manager", "Service Advisor", "Receptionist"] },
    { id: "vehicles", label: "Vehicles", icon: Car, roles: ["Admin", "Manager", "Service Advisor", "Mechanic", "Receptionist"] },
    { id: "bookings", label: "Bookings", icon: CalendarDays, roles: ["Admin", "Manager", "Service Advisor", "Mechanic", "Receptionist"] },
    { id: "parts", label: "Spare Parts", icon: Wrench, roles: ["Admin", "Manager", "Inventory Manager", "Service Advisor", "Mechanic"] },
    { id: "warranty", label: "Warranty", icon: ShieldCheck, roles: ["Admin", "Manager", "Service Advisor"] },
    { id: "invoices", label: "Invoices", icon: Receipt, roles: ["Admin", "Manager", "Service Advisor", "Receptionist"] },
    { id: "ai", label: "AI Diagnostic Center", icon: Sparkles, roles: ["Admin", "Manager", "Service Advisor", "Mechanic"] },
    { id: "reports", label: "Reports", icon: FileSpreadsheet, roles: ["Admin", "Manager"] },
    { id: "admin", label: "Admin Panel", icon: Database, roles: ["Admin"] },
    { id: "settings", label: "Settings", icon: Settings, roles: ["Admin", "Manager", "Service Advisor", "Mechanic", "Inventory Manager", "Receptionist", "Customer"] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div 
      className={`relative h-screen bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
      id="sidebar-container"
    >
      {/* Header Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800 gap-3">
        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30 flex items-center justify-center shrink-0">
          <Wrench className="w-5 h-5 animate-pulse" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent tracking-wider">
            APEX CRM
          </span>
        )}
      </div>

      {/* Role Indicator Card */}
      {!collapsed && (
        <div className="mx-4 my-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Session</div>
          <div className="font-semibold text-sm text-slate-200 mt-0.5 truncate">{role}</div>
        </div>
      )}

      {/* Navigation menu */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 shrink-0 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.id === "ai" && (
                <span className="ml-auto text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse border border-indigo-500/30">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapsed toggle */}
      <button
        id="sidebar-collapse-button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 right-[-14px] bg-slate-800 text-slate-400 hover:text-white border border-slate-700 w-7 h-7 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-50 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
