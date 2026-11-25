import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Shield,
  LogOut,
  Sliders,
  CheckCircle2,
  UserPlus,
  Building2,
  Stethoscope,
  HeartHandshake,
  Activity
} from 'lucide-react';

export default function TopNavbar({
  activeTab,
  setIsMobileOpen,
  isNotificationsOpen,
  setIsNotificationsOpen,
  unreadCount = 3,
  currentUser = {
    name: 'Isha Singh',
    role: 'patient',
    roleTitle: 'Patient User',
    email: 'isha.singh@caregrid.health',
    initials: 'IS'
  },
  onOpenSignUp,
  onSignOut
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Hospital Admin',
          bg: 'bg-sky-50 text-sky-800 border-sky-200/80',
          icon: Building2
        };
      case 'doctor':
        return {
          label: 'Physician / Specialist',
          bg: 'bg-teal-50 text-teal-800 border-teal-200/80',
          icon: Stethoscope
        };
      case 'caretaker':
        return {
          label: 'Family Caregiver',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
          icon: HeartHandshake
        };
      default:
        return {
          label: 'Patient Portal',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          icon: User
        };
    }
  };

  const getPageTitle = (tab) => {
    const map = {
      dashboard: 'Clinical Overview',
      'health-queue': 'Hospital OPD Queue',
      resqcare: 'ResQCare Ambulance Dispatch',
      'ai-assistant': 'CareGrid AI Copilot',
      appointments: 'Consultations & Schedule',
      'medical-records': 'Medical Records Vault',
      'my-health': 'My Health Vitals',
      carecircle: 'CareCircle Family',
      notifications: 'Clinical Alerts',
      settings: 'Platform Settings',
      help: 'Help & Support'
    };
    return map[tab] || tab.replace('-', ' ');
  };

  const roleInfo = getRoleBadge(currentUser.role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-4 transition-all">
      {/* Left Section: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-display font-bold text-base text-slate-900 truncate">
            {getPageTitle(activeTab)}
          </span>
          <span className="hidden sm:inline-block text-slate-300" aria-hidden="true">
            •
          </span>
          <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${roleInfo.bg}`}>
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{roleInfo.label}</span>
          </span>
        </div>
      </div>

      {/* Center Section: Clinical Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" aria-hidden="true" />
          <label htmlFor="caregrid-global-search" className="visually-hidden">
            Search doctors, departments, or records
          </label>
          <input
            id="caregrid-global-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specialists, tokens, or records..."
            className="w-full pl-10 pr-12 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 rounded-xl border border-slate-200/70 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section: Telemetry Pill, Notification Bell & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800"
          title="Telemetry & FHIR Sync Online"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hospital Network Live</span>
        </div>

        {/* Notification Bell Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-expanded={isNotificationsOpen}
            aria-label={`View Notifications (${unreadCount} unread)`}
            className={`p-2.5 rounded-xl transition-all relative cursor-pointer ${
              isNotificationsOpen
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-teal-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block" aria-hidden="true" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-cyan-600 text-white font-display font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-white">
                {currentUser.initials || 'CG'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            <div className="text-left hidden sm:block max-w-[140px]">
              <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] font-medium text-slate-500 truncate">
                {currentUser.roleTitle || roleInfo.label}
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Menu Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full w-fit">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {roleInfo.label} • Verified
                </div>
              </div>

              <div className="space-y-0.5">
                {onOpenSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSignUp();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50/70 hover:bg-teal-100/80 rounded-xl transition-colors mb-1 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-teal-600" />
                    Switch Account / Portal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  Privacy & Access Logs
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  System Preferences
                </button>
              </div>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onSignOut) {
                      onSignOut();
                    } else if (onOpenSignUp) {
                      onOpenSignUp();
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
