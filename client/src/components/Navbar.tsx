import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Plus, 
  MapPin, 
  ChevronDown, 
  LogOut, 
  User, 
  ShieldAlert, 
  Check, 
  Sparkles,
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";
import { CRMNotification, User as CRMUser } from "../types";

interface NavbarProps {
  currentUser: CRMUser;
  setCurrentUser: (u: CRMUser) => void;
  availableUsers: CRMUser[];
  notifications: CRMNotification[];
  onMarkAllRead: () => void;
  onQuickAction: (action: string) => void;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  currentBranch: string;
  setCurrentBranch: (bId: string) => void;
  branches: any[];
  darkMode: boolean;
  setDarkMode: (dm: boolean) => void;
}

export default function Navbar({
  currentUser,
  setCurrentUser,
  availableUsers,
  notifications,
  onMarkAllRead,
  onQuickAction,
  globalSearch,
  setGlobalSearch,
  currentBranch,
  setCurrentBranch,
  branches,
  darkMode,
  setDarkMode
}: NavbarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeBranch = branches.find(b => b.id === currentBranch) || branches[0];

  return (
    <div 
      className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200"
      id="navbar-container"
    >
      {/* Search Everywhere Box */}
      <div className="relative w-96 max-w-md">
        <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
        <input
          id="global-search-input"
          type="text"
          placeholder="Global Search (VIN, Customer, Invoice, Parts...)"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          className={`w-full pl-10 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
            searchFocused 
              ? "border-blue-500 ring-2 ring-blue-500/20 w-[420px]" 
              : "border-transparent dark:border-slate-700"
          }`}
        />
        {globalSearch && (
          <button 
            onClick={() => setGlobalSearch("")}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Navbar Section */}
      <div className="flex items-center gap-4">
        {/* Branch Selection */}
        <div className="relative">
          <button 
            id="branch-selector-btn"
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>{activeBranch?.name || "Select Branch"}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          
          {showBranchMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">Select Branch Office</div>
              {branches.map(br => (
                <button
                  key={br.id}
                  onClick={() => {
                    setCurrentBranch(br.id);
                    setShowBranchMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">{br.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{br.location}</div>
                  </div>
                  {currentBranch === br.id && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Launcher */}
        <div className="relative">
          <button
            id="quick-actions-launcher"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Action</span>
          </button>
          
          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50">
              <button
                onClick={() => { onQuickAction("new-booking"); setShowQuickMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Schedule New Booking
              </button>
              <button
                onClick={() => { onQuickAction("new-customer"); setShowQuickMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Register New Customer
              </button>
              <button
                onClick={() => { onQuickAction("ai-scan"); setShowQuickMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Instant AI Diagnostics</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Real-Time Notification Center */}
        <div className="relative">
          <button
            id="notifications-bell"
            onClick={() => { setShowNotifMenu(!showNotifMenu); if (showNotifMenu) onMarkAllRead(); }}
            className="p-2 relative bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="font-semibold text-xs text-slate-700 dark:text-slate-200">Alerts & Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button onClick={onMarkAllRead} className="text-[11px] text-blue-500 hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">No recent notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-xs text-slate-600 dark:text-slate-300 ${!notif.read ? "bg-blue-50/20 dark:bg-blue-500/5" : ""}`}
                    >
                      <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-100 mb-0.5">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-normal">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Session Switcher / Profile Card */}
        <div className="relative">
          <button
            id="user-profile-menu-trigger"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="text-left hidden md:block max-w-[120px]">
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{currentUser.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Switch Live Demo Role</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">SWAP ROLES to test customized dynamic permissions & dashboards instantly!</p>
              </div>
              <div className="max-h-60 overflow-y-auto border-b border-slate-100 dark:border-slate-700">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.role}</div>
                      </div>
                    </div>
                    {currentUser.role === u.role && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                ))}
              </div>
              <div className="px-2 pt-2 pb-1">
                <button
                  onClick={() => { setCurrentUser(availableUsers[0]); setShowRoleMenu(false); }}
                  className="w-full text-center py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Reset Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
