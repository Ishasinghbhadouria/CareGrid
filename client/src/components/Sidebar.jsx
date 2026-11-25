import React from 'react';
import {
  LayoutDashboard,
  HeartPulse,
  Calendar,
  FileText,
  Users,
  Ambulance,
  UserCheck,
  Sparkles,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  UserPlus,
  Building2,
  Stethoscope,
  HeartHandshake,
  User,
  LogOut
} from 'lucide-react';

function getRoleIcon(role) {
  switch (role) {
    case 'admin':
      return Building2;
    case 'doctor':
      return Stethoscope;
    case 'caretaker':
      return HeartHandshake;
    default:
      return User;
  }
}

function UserRoleIcon({ role, className = 'w-4 h-4' }) {
  const Icon = getRoleIcon(role);
  return <Icon className={className} />;
}

function getNavItemsForRole(role) {
  if (role === 'admin') {
    return [
      { id: 'dashboard', label: 'Hospital Operations', icon: LayoutDashboard },
      { id: 'health-queue', label: 'Hospital OPD Queue', icon: Users, badge: 'Active' },
      { id: 'resqcare', label: 'ResQCare Ambulances', icon: Ambulance, isEmergency: true, badge: '8 Units' },
      { id: 'ai-assistant', label: 'Hospital AI Copilot', icon: Sparkles, isAi: true },
      { id: 'notifications', label: 'Hospital Alerts', icon: Bell, badge: '3' },
    ];
  }
  if (role === 'doctor') {
    return [
      { id: 'dashboard', label: 'Clinical Chamber 3B', icon: LayoutDashboard },
      { id: 'appointments', label: 'Patient Consults', icon: Calendar, badge: '24' },
      { id: 'health-queue', label: 'Doctor OPD Queue', icon: Users, badge: '#39' },
      { id: 'medical-records', label: 'Patient Records Vault', icon: FileText, badge: '12' },
      { id: 'ai-assistant', label: 'Clinical AI Assistant', icon: Sparkles, isAi: true },
      { id: 'notifications', label: 'Clinical Alerts', icon: Bell, badge: '2' },
    ];
  }
  if (role === 'caretaker') {
    return [
      { id: 'dashboard', label: 'Caregiver Hub', icon: LayoutDashboard },
      { id: 'carecircle', label: 'CareCircle Tasks', icon: UserCheck, badge: '4' },
      { id: 'my-health', label: 'Linked Patient Vitals', icon: HeartPulse },
      { id: 'appointments', label: 'Appointments', icon: Calendar, badge: '2' },
      { id: 'medical-records', label: 'Medical Records', icon: FileText, badge: '12' },
      { id: 'health-queue', label: 'OPD Queue', icon: Users, badge: '#42' },
      { id: 'resqcare', label: 'ResQCare SOS', icon: Ambulance, isEmergency: true },
      { id: 'ai-assistant', label: 'AI Health Guide', icon: Sparkles, isAi: true },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    ];
  }
  // Default: Patient
  return [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-health', label: 'My Health Vitals', icon: HeartPulse },
    { id: 'appointments', label: 'My Appointments', icon: Calendar, badge: '2' },
    { id: 'medical-records', label: 'Medical Records Vault', icon: FileText, badge: '12' },
    { id: 'health-queue', label: 'Health Queue', icon: Users, badge: '#42' },
    { id: 'resqcare', label: 'ResQCare SOS', icon: Ambulance, isEmergency: true },
    { id: 'carecircle', label: 'CareCircle Family', icon: UserCheck },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, isAi: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
  ];
}

const bottomNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  currentUser = { name: 'Isha Singh', role: 'patient', initials: 'IS' },
  onOpenSignUp,
  onSignOut
}) {
  const navItems = getNavItemsForRole(currentUser?.role);

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
                <HeartPulse className="w-6 h-6 stroke-[2.5]" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                    CAREGRID
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/70">
                      MED-OPS
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Clinical Care Platform</span>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Primary" className="p-3 space-y-1 clinical-scroll max-h-[calc(100vh-14rem)]">
            <div className={`px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'visually-hidden' : ''}`}>
              Clinical Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-700 border border-teal-500/20 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-teal-600'
                        : item.isEmergency
                        ? 'text-rose-500 group-hover:text-rose-600'
                        : item.isAi
                        ? 'text-amber-500 group-hover:text-amber-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {/* Badge */}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Indicator Pip for Active State */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-600 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section & Role Card & Collapse Toggle */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* Active Role Card & Switch Role Button */}
          {currentUser && (
            <div className={`p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 transition-all ${isCollapsed ? 'flex flex-col items-center justify-center text-center' : ''}`}>
              {!isCollapsed ? (
                <div>
                  <div className="flex items-center gap-2.5 overflow-hidden mb-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <UserRoleIcon role={currentUser?.role} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider">
                        {currentUser.roleTitle || currentUser.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    {onOpenSignUp && (
                      <button
                        type="button"
                        onClick={onOpenSignUp}
                        className="flex-1 py-1.5 px-2 text-[11px] font-bold text-teal-700 bg-white hover:bg-teal-50 border border-teal-200 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        title="Switch Role Portal"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Switch</span>
                      </button>
                    )}
                    {onSignOut && (
                      <button
                        type="button"
                        onClick={onSignOut}
                        className="py-1.5 px-2 text-[11px] font-bold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        title="Log Out Session"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 items-center">
                  {onOpenSignUp && (
                    <button
                      type="button"
                      onClick={onOpenSignUp}
                      title="Switch Role Portal"
                      className="p-2 rounded-xl text-teal-700 hover:bg-teal-50 transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  )}
                  {onSignOut && (
                    <button
                      type="button"
                      onClick={onSignOut}
                      title="Log Out Session"
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border border-teal-200/60 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}

          {/* Desktop Sidebar Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 p-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200/60"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-600" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-600" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
