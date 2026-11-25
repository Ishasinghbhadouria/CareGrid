import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { emergencyApi } from './services/api';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardView from './components/DashboardView';
import AppointmentsView from './components/AppointmentsView';
import MedicalRecordsView from './components/MedicalRecordsView';
import HealthQueueView from './components/HealthQueueView';
import ResQCareView from './components/ResQCareView';
import CareCircleView from './components/CareCircleView';
import AiAssistantView from './components/AiAssistantView';
import MyHealthView from './components/MyHealthView';
import SettingsHelpView from './components/SettingsHelpView';
import BookAppointmentModal from './components/BookAppointmentModal';
import EmergencySosModal from './components/EmergencySosModal';
import UploadRecordModal from './components/UploadRecordModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import SignUpView from './components/SignUpView';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // User Profile & Authentication Gateway State
  // By default, authentication is required before entering the dashboard
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleAuthSuccess = (profile) => {
    let roleTitle = 'Patient User';
    if (profile.role === 'admin') roleTitle = 'Hospital Administrator';
    else if (profile.role === 'doctor') roleTitle = 'Doctor / Specialist';
    else if (profile.role === 'caretaker') roleTitle = 'Family Caregiver';

    setCurrentUser({
      name: profile.name,
      role: profile.role,
      roleTitle,
      email: profile.email,
      initials: profile.initials || 'CG',
      details: profile.details || {}
    });

    setIsAuthenticated(true);
    setIsSignUpOpen(false);
    setActiveTab('dashboard');
    showToast(`Access granted! Authenticated as ${roleTitle} (${profile.name}).`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsSignUpOpen(false);
    setActiveTab('dashboard');
    showToast('Signed out safely. Session and RBAC data access terminated.');
  };

  const handleSwitchRole = (targetRole) => {
    switch (targetRole) {
      case 'admin':
        setCurrentUser({
          name: 'Dr. Kedar Dharmatti',
          role: 'admin',
          roleTitle: 'Hospital Administrator',
          email: 'admin.careplus@caregrid.health',
          initials: 'KD',
          details: {
            hospitalName: 'CarePlus Super-Speciality Hospital',
            hospitalRegNo: 'MOHFW-MP-2024-9982',
            adminDesignation: 'Medical Superintendent & Director',
            totalBeds: '500',
            icuBeds: '60',
            city: 'Indore',
            state: 'Madhya Pradesh',
            ambulanceCount: '8'
          }
        });
        showToast('Switched to Hospital Administrator view (Institutional Hub)');
        break;
      case 'doctor':
        setCurrentUser({
          name: 'Dr. Arvind Sharma',
          role: 'doctor',
          roleTitle: 'Doctor / Specialist',
          email: 'dr.sharma@caregrid.health',
          initials: 'AS',
          details: {
            medicalRegNo: 'NMC-CARD-88412-2018',
            specialization: 'Cardiology Specialist',
            hospitalAffiliation: 'CarePlus Multi-Speciality Medical Center',
            opdRoomNo: 'Chamber 3B',
            qualification: 'MBBS, MD (Cardiology), DM'
          }
        });
        showToast('Switched to Doctor / Specialist view (OPD & Rounds)');
        break;
      case 'caretaker':
        setCurrentUser({
          name: 'Aditya Vyas',
          role: 'caretaker',
          roleTitle: 'Family Caregiver',
          email: 'aditya.vyas@caregrid.health',
          initials: 'AV',
          details: {
            caretakerPatientId: 'Isha Singh (CG-PAT-9021)',
            patientSubtype: 'caretaker',
            emergencyContactPhone: '+91 98765 43210',
            relationship: 'Primary Caregiver'
          }
        });
        showToast('Switched to Caregiver / Caretaker view (CareCircle)');
        break;
      case 'patient':
      default:
        setCurrentUser({
          name: 'Isha Singh',
          role: 'patient',
          roleTitle: 'Patient User',
          email: 'isha.singh@caregrid.health',
          initials: 'IS',
          details: {
            uhid: 'CG-PAT-9021',
            bloodGroup: 'B+',
            dob: '2004-03-18',
            gender: 'Female',
            emergencyContactName: 'Aditya Vyas'
          }
        });
        showToast('Switched to Patient view (Health Portal)');
        break;
    }
  };

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Appointments State
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sharma',
      specialty: 'Cardiology Specialist',
      clinic: 'CarePlus Medical Center • OPD Clinic',
      date: '15 Oct 2026',
      time: '10:30 AM',
      type: 'in-person',
      status: 'confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Ananya Sen',
      specialty: 'Dermatologist & Allergy',
      clinic: 'Metro Health Telehealth Video Room',
      date: '22 Oct 2026',
      time: '03:00 PM',
      type: 'video',
      status: 'confirmed'
    },
    {
      id: 3,
      doctor: 'Dr. Rajesh Gupta',
      specialty: 'General Medicine & OPD',
      clinic: 'City CarePlus OPD Chamber 3B',
      date: '10 Sep 2026',
      time: '11:15 AM',
      type: 'in-person',
      status: 'completed'
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Consultation Reminder',
      message: 'Upcoming cardiology appointment with Dr. Sharma on 15 Oct at 10:30 AM.',
      time: '10 mins ago',
      read: false
    },
    {
      id: 2,
      type: 'queue',
      title: 'OPD Queue Active (#42)',
      message: 'Token #39 is currently in Room 3B with Dr. Rajesh Gupta. Est. wait ~12 mins.',
      time: '25 mins ago',
      read: false
    },
    {
      id: 3,
      type: 'record',
      title: 'Lab Report Verified',
      message: 'CarePlus Diagnostics uploaded your Lipid Profile & Metabolic Panel with SHA-256 seal.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 4,
      type: 'carecircle',
      title: 'CareCircle Update',
      message: 'Aditya Vyas synced your morning vitals to your family circle.',
      time: 'Yesterday',
      read: true
    }
  ]);

  const handleBookAppointment = (newApt) => {
    setAppointments([newApt, ...appointments]);
    setNotifications([
      {
        id: Date.now(),
        type: 'appointment',
        title: 'New Consultation Confirmed',
        message: `Appointment scheduled with ${newApt.doctor} for ${newApt.date} at ${newApt.time}.`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
    showToast(`Appointment confirmed with ${newApt.doctor}!`);
  };

  const handleUploadRecord = (recordData) => {
    setNotifications([
      {
        id: Date.now(),
        type: 'record',
        title: 'New Record Uploaded',
        message: `${recordData.title} was securely encrypted and added to your health vault.`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
    showToast(`Record "${recordData.title}" uploaded and encrypted successfully!`);
  };

  const handleTriggerSos = async () => {
    setIsEmergencyActive(true);
    setActiveTab('resqcare');
    setNotifications([
      {
        id: Date.now(),
        type: 'emergency',
        title: 'CRITICAL: ResQCare SOS Dispatched',
        message: 'Ambulance Unit #108 en route to your coordinates. Trauma ER bay reserved.',
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
    showToast('ResQCare Emergency Dispatch Protocol Activated!');
    await emergencyApi.triggerSos({
      address: 'Scheme 54, Vijay Nagar, Indore',
      emergencyType: 'Rapid Emergency SOS',
      ambulanceUnit: 'ResQCare AMB-108',
      traumaBay: 'Bay #01'
    });
  };

  useEffect(() => {
    const tabLabels = {
      dashboard: 'Clinical Overview',
      'health-queue': 'Hospital OPD Queue',
      resqcare: 'ResQCare Dispatch',
      'ai-assistant': 'AI Copilot',
      appointments: 'Appointments',
      'medical-records': 'Medical Vault',
      'my-health': 'My Health Vitals',
      carecircle: 'CareCircle Family',
      notifications: 'Alerts',
      settings: 'Settings',
      help: 'Help & Support'
    };
    const prefix = !isAuthenticated ? 'Sign In' : tabLabels[activeTab] || 'Portal';
    document.title = `${prefix} | CareGrid Clinical Platform`;
  }, [activeTab, isAuthenticated]);

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Unauthenticated Gateway: User must log in or sign up before entering the dashboard
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {toastMessage}
          </div>
        )}
        <SignUpView
          onSignUpSuccess={handleAuthSuccess}
          defaultRole="patient"
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--surface-canvas)] text-slate-900 font-sans selection:bg-teal-600 selection:text-white">
      <a
        href="#main-content"
        className="visually-hidden focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-teal-700 focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          {toastMessage}
        </div>
      )}

      {/* Main Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        currentUser={currentUser}
        onOpenSignUp={() => setIsSignUpOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Application Content Container */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Top Navbar */}
        <TopNavbar
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileOpen}
          isNotificationsOpen={isNotificationsOpen}
          setIsNotificationsOpen={setIsNotificationsOpen}
          unreadCount={unreadCount}
          currentUser={currentUser}
          onOpenSignUp={() => setIsSignUpOpen(true)}
          onSignOut={handleSignOut}
        />

        {/* View Router */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto outline-none">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenBookAppointment={() => setIsBookModalOpen(true)}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
              onOpenUploadRecord={() => setIsUploadModalOpen(true)}
              currentUser={currentUser}
              onOpenSignUp={() => setIsSignUpOpen(true)}
              onSwitchRole={handleSwitchRole}
            />
          )}

          {activeTab === 'signup' && (
            <div className="py-2">
              <SignUpView
                onSignUpSuccess={handleAuthSuccess}
                onCancel={() => setActiveTab('dashboard')}
                defaultRole={currentUser?.role || 'patient'}
              />
            </div>
          )}

          {/* RBAC Security Isolation: Hospital Admin cannot view personal patient vitals or private family care circle */}
          {currentUser.role === 'admin' && (activeTab === 'my-health' || activeTab === 'carecircle') ? (
            <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm max-w-xl mx-auto text-center space-y-4 my-12">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                  RBAC Data Privacy Guard
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Personal Patient Data Partition</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Hospital Administrators are strictly restricted from inspecting individual personal health vitals and private family care tasks under CareGrid Zero-Trust data privacy policies.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Return to Hospital Operations Hub
              </button>
            </div>
          ) : currentUser.role === 'doctor' && activeTab === 'carecircle' ? (
            /* RBAC Security Isolation: Doctor cannot view private family care circles */
            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm max-w-xl mx-auto text-center space-y-4 my-12">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                  Private Family CareCircle
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Family Caregiver Partition</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  CareCircle coordination is reserved for designated personal caregivers and family members. As a consulting physician, patient clinical notes and lab reports are accessible through the Medical Records Vault.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Return to Clinical Chamber
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'my-health' && <MyHealthView />}
              {activeTab === 'carecircle' && <CareCircleView />}
            </>
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              onOpenBookAppointment={() => setIsBookModalOpen(true)}
              appointments={appointments}
              setAppointments={setAppointments}
            />
          )}

          {activeTab === 'medical-records' && (
            <MedicalRecordsView
              onOpenUploadRecord={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeTab === 'health-queue' && <HealthQueueView currentUser={currentUser} />}

          {activeTab === 'resqcare' && (
            <ResQCareView
              isEmergencyActive={isEmergencyActive}
              setIsEmergencyActive={setIsEmergencyActive}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'ai-assistant' && <AiAssistantView currentUser={currentUser} />}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    All System Notifications
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live coordination feed for queue, appointments, and medical emergencies.
                  </p>
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition-colors"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border bg-white shadow-xs flex items-start justify-between gap-4 ${
                      !n.read ? 'border-teal-300 ring-1 ring-teal-500/10' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{n.title}</span>
                        {!n.read && (
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && <SettingsHelpView initialMode="settings" />}

          {activeTab === 'help' && <SettingsHelpView initialMode="help" />}
        </main>
      </div>

      {/* Notifications Side Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllNotificationsRead}
        onNotificationClick={(item) => {
          setIsNotificationsOpen(false);
          if (item.type === 'appointment') setActiveTab('appointments');
          if (item.type === 'queue') setActiveTab('health-queue');
          if (item.type === 'emergency') setActiveTab('resqcare');
          if (item.type === 'record') setActiveTab('medical-records');
          if (item.type === 'carecircle') setActiveTab('carecircle');
        }}
      />

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onBookAppointment={handleBookAppointment}
      />

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onConfirmSos={handleTriggerSos}
      />

      {/* Upload Health Record Modal */}
      <UploadRecordModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadRecord}
      />

      {/* Role-Based Authentication & Onboarding Modal */}
      {isSignUpOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto">
            <SignUpView
              onSignUpSuccess={handleAuthSuccess}
              onCancel={() => setIsSignUpOpen(false)}
              defaultRole={currentUser?.role || 'patient'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
