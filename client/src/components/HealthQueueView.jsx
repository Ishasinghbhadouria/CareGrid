import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  UserCheck,
  RefreshCw,
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Users,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Printer,
  Sparkles,
  Search,
  Building2,
  Stethoscope,
  Activity,
  ArrowUpRight,
  Radio,
  X,
  QrCode,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

// Web Audio API Hospital Chime Synthesizer
function playHospitalChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;

    // First note: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.28, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Second note: C5 (523.25 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.35);
    gain2.gain.setValueAtTime(0.32, now + 0.35);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.35);
    osc2.stop(now + 1.2);
  } catch (err) {
    console.warn('Audio chime unavailable:', err);
  }
}

// Browser Speech Synthesis Announcement
function announceTokenVoice(token, patientName, chamber) {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const text = `Token number ${token}. ${patientName}. Please proceed to ${chamber}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 650);
    } catch (e) {
      // Graceful fallback
    }
  }
}

const INITIAL_DEPARTMENTS = {
  general: {
    id: 'general',
    name: 'General Medicine & Diabetology',
    shortName: 'General OPD',
    code: 'GEN',
    chamber: 'Chamber 3B',
    floor: '2nd Floor, West Wing (Elevator C)',
    doctor: 'Dr. Rajesh Gupta',
    qualifications: 'MBBS, MD (Internal Medicine)',
    doctorInitials: 'RG',
    avgConsultMins: 6,
    totalToday: 48,
    patients: [
      {
        token: 'GEN-39',
        tokenNum: 39,
        name: 'Kavita Rathore',
        uhid: 'CG-PAT-7712',
        age: '48 / F',
        checkIn: '09:05 AM',
        status: 'in-chamber',
        priority: 'General',
        reason: 'Uncontrolled Glycemia & Fatigue'
      },
      {
        token: 'GEN-40',
        tokenNum: 40,
        name: 'Devendra Sharma',
        uhid: 'CG-PAT-8041',
        age: '64 / M',
        checkIn: '09:12 AM',
        status: 'calling',
        priority: 'Senior Citizen',
        reason: 'Hypertension Review & ECG'
      },
      {
        token: 'GEN-41',
        tokenNum: 41,
        name: 'Pooja Mishra',
        uhid: 'CG-PAT-9102',
        age: '31 / F',
        checkIn: '09:18 AM',
        status: 'waiting',
        priority: 'General',
        reason: 'Viral Fever & Cough'
      },
      {
        token: 'GEN-42',
        tokenNum: 42,
        name: 'Isha Singh',
        uhid: 'CG-PAT-9021',
        age: '22 / F',
        checkIn: '09:25 AM',
        status: 'waiting',
        priority: 'General',
        reason: 'Preventive Health Checkup',
        isCurrentUser: true
      },
      {
        token: 'GEN-43',
        tokenNum: 43,
        name: 'Aakash Verma',
        uhid: 'CG-PAT-9450',
        age: '39 / M',
        checkIn: '09:32 AM',
        status: 'waiting',
        priority: 'General',
        reason: 'Chronic Migraine Assessment'
      },
      {
        token: 'GEN-44',
        tokenNum: 44,
        name: 'Sunita Joshi',
        uhid: 'CG-PAT-9821',
        age: '71 / F',
        checkIn: '09:40 AM',
        status: 'waiting',
        priority: 'Senior Citizen',
        reason: 'Osteoarthritis Knee Pain'
      }
    ]
  },
  cardiology: {
    id: 'cardiology',
    name: 'Cardiology & Cardiac Sciences',
    shortName: 'Cardiology',
    code: 'CARD',
    chamber: 'Chamber 4A',
    floor: '3rd Floor, Heart Institute (Elevator A)',
    doctor: 'Dr. Arvind Sharma',
    qualifications: 'MBBS, MD, DM (Cardiology)',
    doctorInitials: 'AS',
    avgConsultMins: 9,
    totalToday: 34,
    patients: [
      {
        token: 'CARD-18',
        tokenNum: 18,
        name: 'Harish Chandra',
        uhid: 'CG-PAT-4321',
        age: '62 / M',
        checkIn: '09:10 AM',
        status: 'in-chamber',
        priority: 'Senior Citizen',
        reason: 'Post-Angioplasty Stent Follow-up'
      },
      {
        token: 'CARD-19',
        tokenNum: 19,
        name: 'Meena Saxena',
        uhid: 'CG-PAT-5532',
        age: '54 / F',
        checkIn: '09:20 AM',
        status: 'calling',
        priority: 'General',
        reason: 'Exertional Palpitations & Echo'
      },
      {
        token: 'CARD-20',
        tokenNum: 20,
        name: 'Rajendra Patel',
        uhid: 'CG-PAT-6120',
        age: '59 / M',
        checkIn: '09:30 AM',
        status: 'waiting',
        priority: 'General',
        reason: 'Lipid Abnormalities & Chest Tightness'
      },
      {
        token: 'CARD-21',
        tokenNum: 21,
        name: 'Geeta Sen',
        uhid: 'CG-PAT-6981',
        age: '68 / F',
        checkIn: '09:45 AM',
        status: 'waiting',
        priority: 'Senior Citizen',
        reason: 'Echocardiography Follow-up'
      }
    ]
  },
  pediatrics: {
    id: 'pediatrics',
    name: 'Pediatrics & Child Wellness',
    shortName: 'Pediatrics',
    code: 'PED',
    chamber: 'Chamber 2A',
    floor: '1st Floor, Maternal & Child Wing',
    doctor: 'Dr. Meenakshi Sundaram',
    qualifications: 'MBBS, MD (Pediatrics), DCH',
    doctorInitials: 'MS',
    avgConsultMins: 7,
    totalToday: 41,
    patients: [
      {
        token: 'PED-27',
        tokenNum: 27,
        name: 'Aarav Choudhary',
        uhid: 'CG-PAT-1082',
        age: '4 yrs / M',
        checkIn: '09:15 AM',
        status: 'in-chamber',
        priority: 'Pediatric',
        reason: 'MMR Booster & Milestones Check'
      },
      {
        token: 'PED-28',
        tokenNum: 28,
        name: 'Ananya Deshmukh',
        uhid: 'CG-PAT-1194',
        age: '2 yrs / F',
        checkIn: '09:25 AM',
        status: 'calling',
        priority: 'Pediatric',
        reason: 'Wheezing & Allergic Rhinitis'
      },
      {
        token: 'PED-29',
        tokenNum: 29,
        name: 'Vivaan Kapoor',
        uhid: 'CG-PAT-1340',
        age: '6 mos / M',
        checkIn: '09:35 AM',
        status: 'waiting',
        priority: 'Pediatric',
        reason: '6-Month Routine Immunization'
      }
    ]
  },
  orthopedics: {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Clinic',
    shortName: 'Orthopedics',
    code: 'ORTH',
    chamber: 'Chamber 1B',
    floor: 'Ground Floor, Trauma & Bone Center',
    doctor: 'Dr. Vikramaditya Rathore',
    qualifications: 'MBBS, MS (Orthopedics), MCh',
    doctorInitials: 'VR',
    avgConsultMins: 8,
    totalToday: 36,
    patients: [
      {
        token: 'ORTH-14',
        tokenNum: 14,
        name: 'Balwant Singh',
        uhid: 'CG-PAT-3211',
        age: '52 / M',
        checkIn: '09:00 AM',
        status: 'in-chamber',
        priority: 'General',
        reason: 'Bilateral Knee Osteoarthritis'
      },
      {
        token: 'ORTH-15',
        tokenNum: 15,
        name: 'Preeti Nair',
        uhid: 'CG-PAT-3490',
        age: '28 / F',
        checkIn: '09:15 AM',
        status: 'calling',
        priority: 'General',
        reason: 'Lateral Ankle Ligament Sprain'
      },
      {
        token: 'ORTH-16',
        tokenNum: 16,
        name: 'Dinesh Shukla',
        uhid: 'CG-PAT-3822',
        age: '66 / M',
        checkIn: '09:30 AM',
        status: 'waiting',
        priority: 'Senior Citizen',
        reason: 'Lumbar Spondylosis & Sciatica'
      }
    ]
  }
};

export default function HealthQueueView({
  currentUser = { name: 'Dr. Kedar Dharmatti', role: 'admin' }
}) {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState('general');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notifyAhead, setNotifyAhead] = useState(true);
  const [viewMode, setViewMode] = useState('chamber'); // 'chamber' | 'central-board'
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [callAlert, setCallAlert] = useState(null);

  // Live timer for currently served patient in seconds
  const [inChamberSeconds, setInChamberSeconds] = useState(245);

  // New Walk-in Token Form State
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenAge, setNewTokenAge] = useState('');
  const [newTokenGender, setNewTokenGender] = useState('Female');
  const [newTokenDept, setNewTokenDept] = useState('general');
  const [newTokenPriority, setNewTokenPriority] = useState('General');
  const [newTokenReason, setNewTokenReason] = useState('');
  const [issuedTicket, setIssuedTicket] = useState(null);

  const currentDept = departments[selectedDeptId] || departments.general;

  // Find currently serving patient and calling patient
  const inChamberPatient = currentDept.patients.find((p) => p.status === 'in-chamber');
  const callingPatient = currentDept.patients.find((p) => p.status === 'calling');
  const waitingPatients = currentDept.patients.filter((p) => p.status === 'waiting');

  // Find logged in user's token in this or other department
  const userPatientInDept = currentDept.patients.find((p) => p.isCurrentUser);
  const userTokenNum = userPatientInDept?.tokenNum || 42;
  const userToken = userPatientInDept?.token || 'GEN-42';

  // Calculate position ahead of user
  const patientsAhead = userPatientInDept
    ? Math.max(
        0,
        currentDept.patients
          .filter((p) => p.status === 'waiting' || p.status === 'calling')
          .findIndex((p) => p.isCurrentUser)
      )
    : 2;

  const estimatedWaitMins = userPatientInDept
    ? Math.max(0, patientsAhead * currentDept.avgConsultMins)
    : 12;

  // Real-time ticking timer for ongoing consultation
  useEffect(() => {
    const timer = setInterval(() => {
      setInChamberSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Call Next Patient in current department
  const handleCallNextPatient = () => {
    setDepartments((prev) => {
      const dept = { ...prev[selectedDeptId] };
      const pts = [...dept.patients];

      const currentInChamberIdx = pts.findIndex((p) => p.status === 'in-chamber');
      const currentCallingIdx = pts.findIndex((p) => p.status === 'calling');
      const firstWaitingIdx = pts.findIndex((p) => p.status === 'waiting');

      let nextServingPatient = null;

      if (currentCallingIdx !== -1) {
        // Move calling to in-chamber
        if (currentInChamberIdx !== -1) {
          pts[currentInChamberIdx] = { ...pts[currentInChamberIdx], status: 'completed' };
        }
        pts[currentCallingIdx] = { ...pts[currentCallingIdx], status: 'in-chamber' };
        nextServingPatient = pts[currentCallingIdx];

        // Pick next waiting to become calling
        if (firstWaitingIdx !== -1) {
          pts[firstWaitingIdx] = { ...pts[firstWaitingIdx], status: 'calling' };
        }
      } else if (firstWaitingIdx !== -1) {
        if (currentInChamberIdx !== -1) {
          pts[currentInChamberIdx] = { ...pts[currentInChamberIdx], status: 'completed' };
        }
        pts[firstWaitingIdx] = { ...pts[firstWaitingIdx], status: 'in-chamber' };
        nextServingPatient = pts[firstWaitingIdx];

        const nextWaitingIdx = pts.findIndex((p, idx) => p.status === 'waiting' && idx > firstWaitingIdx);
        if (nextWaitingIdx !== -1) {
          pts[nextWaitingIdx] = { ...pts[nextWaitingIdx], status: 'calling' };
        }
      }

      if (nextServingPatient) {
        // Trigger Audio Chime & Speech
        if (soundEnabled) playHospitalChime();
        if (voiceEnabled) {
          announceTokenVoice(nextServingPatient.token, nextServingPatient.name, dept.chamber);
        }

        // Show visual call alert banner
        setCallAlert({
          token: nextServingPatient.token,
          patientName: nextServingPatient.name,
          chamber: dept.chamber,
          doctor: dept.doctor,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        setTimeout(() => {
          setCallAlert(null);
        }, 8000);
      }

      dept.patients = pts;
      return { ...prev, [selectedDeptId]: dept };
    });

    setInChamberSeconds(0);
  };

  // Re-announce Current Serving Patient
  const handleReannounceToken = () => {
    if (!inChamberPatient) return;
    if (soundEnabled) playHospitalChime();
    if (voiceEnabled) {
      announceTokenVoice(inChamberPatient.token, inChamberPatient.name, currentDept.chamber);
    }
    setCallAlert({
      token: inChamberPatient.token,
      patientName: inChamberPatient.name,
      chamber: currentDept.chamber,
      doctor: currentDept.doctor,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setTimeout(() => {
      setCallAlert(null);
    }, 6000);
  };

  // Fast-track a waiting patient
  const handleFastTrack = (tokenToFastTrack) => {
    setDepartments((prev) => {
      const dept = { ...prev[selectedDeptId] };
      const pts = [...dept.patients];
      const targetIdx = pts.findIndex((p) => p.token === tokenToFastTrack);
      if (targetIdx === -1) return prev;

      const target = { ...pts[targetIdx], priority: 'Emergency / Fast-Track', status: 'calling' };
      pts.splice(targetIdx, 1);

      // Insert immediately after in-chamber patient
      const inChamberIdx = pts.findIndex((p) => p.status === 'in-chamber');
      pts.splice(inChamberIdx + 1, 0, target);

      dept.patients = pts;
      return { ...prev, [selectedDeptId]: dept };
    });

    if (soundEnabled) playHospitalChime();
  };

  // Handle Issuing a New Walk-in OPD Token
  const handleIssueTokenSubmit = (e) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;

    const targetDeptKey = newTokenDept;
    const targetDept = departments[targetDeptKey];
    const newSeq = targetDept.totalToday + 1;
    const newTokenStr = `${targetDept.code}-${newSeq}`;

    const newPatient = {
      token: newTokenStr,
      tokenNum: newSeq,
      name: newTokenName.trim(),
      uhid: `CG-PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      age: `${newTokenAge || '30'} / ${newTokenGender[0]}`,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting',
      priority: newTokenPriority,
      reason: newTokenReason.trim() || 'General Consultation'
    };

    setDepartments((prev) => {
      const dept = { ...prev[targetDeptKey] };
      dept.totalToday += 1;
      dept.patients = [...dept.patients, newPatient];
      return { ...prev, [targetDeptKey]: dept };
    });

    setIssuedTicket({
      ...newPatient,
      departmentName: targetDept.name,
      chamber: targetDept.chamber,
      floor: targetDept.floor,
      doctor: targetDept.doctor
    });

    // Reset Form
    setNewTokenName('');
    setNewTokenAge('');
    setNewTokenReason('');
  };

  return (
    <div className="space-y-6">
      {/* Visual Hospital Call Alert Banner (Pop-up when token is called) */}
      {callAlert && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white rounded-2xl p-4 shadow-xl border-2 border-amber-300 animate-in slide-in-from-top-3 duration-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 animate-bounce">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded-md">
                  PUBLIC OPD ANNOUNCEMENT
                </span>
                <span className="text-xs opacity-90">{callAlert.time}</span>
              </div>
              <h3 className="text-xl font-black mt-0.5 tracking-tight">
                Now Calling Token #{callAlert.token} • {callAlert.patientName}
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Please proceed to <strong className="text-white underline">{callAlert.chamber}</strong> ({callAlert.doctor}).
              </p>
            </div>
          </div>

          <button
            onClick={() => setCallAlert(null)}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Hospital Outpatient OPD Queue Console
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-chamber patient queuing, digital token calling, and reception desk issuance.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Issuance Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs font-bold">
            <button
              onClick={() => setViewMode('chamber')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'chamber'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chamber View
            </button>
            <button
              onClick={() => setViewMode('central-board')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'central-board'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Central Display Board
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Hospital Chime Muted' : 'Hospital Chime Enabled'}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1 ${
              soundEnabled
                ? 'bg-teal-50 border-teal-200 text-teal-700'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Issue New Walk-in Token Button */}
          <button
            onClick={() => {
              setIssuedTicket(null);
              setIsIssueModalOpen(true);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Issue OPD Walk-In Token
          </button>
        </div>
      </div>

      {/* Multi-Department Chamber Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.values(departments).map((dept) => {
          const isSelected = dept.id === selectedDeptId;
          const activeInDept = dept.patients.find((p) => p.status === 'in-chamber');
          const waitingInDept = dept.patients.filter((p) => p.status === 'waiting').length;

          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">
                  {dept.code} • {dept.chamber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {waitingInDept} waiting
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">{dept.shortName}</div>
              <div className="text-xs text-slate-500 truncate mt-0.5">{dept.doctor}</div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Serving:</span>
                <span className="font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  #{activeInDept?.token || 'None'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* View Mode 1: Central Digital LED Display Board (Like Hospital Waiting Lobby LED Wall) */}
      {viewMode === 'central-board' && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 lg:p-8 shadow-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xl font-black tracking-tight text-white uppercase">
                  CarePlus Central Hospital • Central OPD Digital Display Board
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Hospital Lobby Live Telemetry • Floor 1 to Floor 3 OPD Wings
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-amber-400">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-slate-400">Cloud Sync: 120ms Latency</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {Object.values(departments).map((dept) => {
              const inRoom = dept.patients.find((p) => p.status === 'in-chamber');
              const nextUp = dept.patients.find((p) => p.status === 'calling');
              const waitList = dept.patients.filter((p) => p.status === 'waiting');

              return (
                <div
                  key={dept.id}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                        {dept.chamber}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {dept.code}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="text-sm font-bold text-white truncate">{dept.shortName}</div>
                      <div className="text-xs text-slate-400 truncate">{dept.doctor}</div>
                    </div>

                    {/* Serving Token Banner */}
                    <div className="my-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                      <span className="text-[11px] font-bold uppercase text-amber-300 tracking-wider">
                        NOW SERVING
                      </span>
                      <div className="text-4xl font-black font-mono text-amber-300 tracking-tight mt-1">
                        #{inRoom?.token || '---'}
                      </div>
                      <div className="text-xs text-amber-100 truncate mt-1">
                        {inRoom ? inRoom.name : 'Waiting for next patient'}
                      </div>
                    </div>

                    {/* Next Calling */}
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Next In Line:</span>
                      <strong className="text-teal-300 font-mono font-bold">
                        #{nextUp?.token || 'None'}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>In Queue: {waitList.length}</span>
                    <button
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        setViewMode('chamber');
                      }}
                      className="text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
                    >
                      Manage Chamber →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode 2: Chamber Operational Console & Live Patient Queue */}
      {viewMode === 'chamber' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chamber Display (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Chamber Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    {currentDept.name} • {currentDept.chamber}
                  </span>
                </div>
                <div className="text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
                  <span>{currentDept.doctor} ({currentDept.qualifications})</span>
                </div>
              </div>

              {/* 2 Big Glowing Telemetry Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {/* Now In Doctor Chamber */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-amber-400/30 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                      Currently Inside Chamber
                    </span>
                    <span className="text-[11px] font-mono text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-md">
                      ⏱ {formatTimer(inChamberSeconds)}
                    </span>
                  </div>

                  <div className="text-5xl font-black tracking-tight text-amber-300 mt-2 font-mono">
                    #{inChamberPatient?.token || '---'}
                  </div>

                  <div className="text-xs text-slate-200 mt-2.5 space-y-0.5">
                    <div className="font-bold text-sm text-white">
                      {inChamberPatient?.name || 'Chamber Available'}
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      {inChamberPatient ? `${inChamberPatient.age} • ${inChamberPatient.reason}` : 'No active consultation'}
                    </div>
                  </div>
                </div>

                {/* Next Up / Calling */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-teal-400/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">
                      Now Calling / Next Up
                    </span>
                    <span className="text-[11px] font-bold text-teal-200 bg-teal-500/20 px-2 py-0.5 rounded-md">
                      Prepare Entry
                    </span>
                  </div>

                  <div className="text-5xl font-black tracking-tight text-teal-300 mt-2 font-mono">
                    #{callingPatient?.token || '---'}
                  </div>

                  <div className="text-xs text-slate-200 mt-2.5 space-y-0.5">
                    <div className="font-bold text-sm text-white">
                      {callingPatient?.name || 'Queue Empty'}
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      {callingPatient ? `${callingPatient.age} • ${callingPatient.priority}` : 'All caught up'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Speed & Queue Health Metrics */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-[11px] text-teal-200 font-medium">Patients in Queue</div>
                  <div className="text-2xl font-bold text-white mt-0.5">{waitingPatients.length + (callingPatient ? 1 : 0)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-teal-200 font-medium">Avg. Consult Pace</div>
                  <div className="text-2xl font-bold text-teal-300 mt-0.5">~{currentDept.avgConsultMins} min/pt</div>
                </div>
                <div>
                  <div className="text-[11px] text-teal-200 font-medium">Today Completed</div>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    {currentDept.patients.filter((p) => p.status === 'completed').length + 38}
                  </div>
                </div>
              </div>

              {/* Doctor / Receptionist Operational Controls Bar */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCallNextPatient}
                    disabled={waitingPatients.length === 0 && !callingPatient}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Call Next Patient (Chime & Announce)
                  </button>

                  <button
                    onClick={handleReannounceToken}
                    disabled={!inChamberPatient}
                    className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Re-Call Token
                  </button>
                </div>

                <div className="text-xs text-teal-200 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentDept.floor}</span>
                </div>
              </div>
            </div>

            {/* Department Live Patients Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Live Queue Roster • {currentDept.shortName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time check-in ledger, priority triage, and chamber advancement.
                  </p>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Total Today: <strong className="text-slate-800">{currentDept.patients.length}</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Token #</th>
                      <th className="py-3 px-3">Patient Name</th>
                      <th className="py-3 px-3">Age / Gender</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3">Check-in</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentDept.patients.map((pt) => {
                      const isInChamber = pt.status === 'in-chamber';
                      const isCalling = pt.status === 'calling';
                      const isCompleted = pt.status === 'completed';

                      return (
                        <tr
                          key={pt.token}
                          className={`transition-colors ${
                            isInChamber
                              ? 'bg-amber-50/60 font-medium'
                              : isCalling
                              ? 'bg-teal-50/60 font-medium'
                              : pt.isCurrentUser
                              ? 'bg-blue-50/40 ring-1 ring-blue-300'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <span
                              className={`font-mono font-black text-xs px-2 py-1 rounded-lg ${
                                isInChamber
                                  ? 'bg-amber-200/80 text-amber-900'
                                  : isCalling
                                  ? 'bg-teal-200/80 text-teal-900'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              #{pt.token}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {pt.name}
                              {pt.isCurrentUser && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{pt.uhid}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{pt.age}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                pt.priority.includes('Emergency') || pt.priority.includes('Fast')
                                  ? 'bg-rose-100 text-rose-800'
                                  : pt.priority.includes('Senior')
                                  ? 'bg-purple-100 text-purple-800'
                                  : pt.priority.includes('Pediatric')
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {pt.priority}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono">{pt.checkIn}</td>
                          <td className="py-3 px-3">
                            {isInChamber ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                In Chamber
                              </span>
                            ) : isCalling ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                                <Volume2 className="w-3 h-3 text-teal-600" />
                                Calling
                              </span>
                            ) : isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Completed
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-500">
                                Waiting
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {pt.status === 'waiting' && (
                              <button
                                onClick={() => handleFastTrack(pt.token)}
                                className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                                title="Fast-Track this patient next"
                              >
                                Fast-Track
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side Column (Personal Token Pass & Hospital Location Guide) */}
          <div className="space-y-6">
            {/* Digital OPD Ticket Pass for Logged-In User */}
            <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-teal-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                  CareGrid Digital OPD Pass
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  ABDM Verified Token
                </span>
              </div>

              <div className="text-center my-5">
                <div className="text-xs text-teal-200 uppercase font-semibold">Your Assigned Token</div>
                <div className="text-5xl font-black text-white tracking-tight mt-1 font-mono">
                  #{userToken}
                </div>
                <div className="text-xs text-teal-100 mt-2 font-medium">
                  Patient: {currentUser.name} (General OPD)
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 my-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-teal-200">Current Serving:</span>
                  <strong className="text-amber-300 font-bold font-mono">
                    #{inChamberPatient?.token || '---'}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-teal-200">Patients Ahead:</span>
                  <strong className="text-white font-bold">{patientsAhead} Patients</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-200">Est. Waiting Time:</span>
                  <strong className="text-emerald-300 font-bold">~{estimatedWaitMins} mins</strong>
                </div>
              </div>

              {/* QR / Barcode Graphic */}
              <div className="bg-white rounded-xl p-3 text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-8 h-8 text-slate-800 shrink-0" />
                  <div>
                    <div className="text-xs font-bold leading-tight">Digital Scan Verification</div>
                    <div className="text-[10px] text-slate-400 font-mono">UHID: CG-PAT-9021</div>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Print Token Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {/* Live SMS & Notification Sync Toggle */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-teal-100 text-[11px]">Notify 2 patients ahead (SMS):</span>
                <input
                  type="checkbox"
                  checked={notifyAhead}
                  onChange={(e) => setNotifyAhead(e.target.checked)}
                  className="w-4 h-4 accent-teal-400 rounded"
                />
              </div>
            </div>

            {/* OPD Chamber Location & Direction Guide */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Chamber Directions & Navigation
              </h3>

              <div className="flex items-start gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 text-sm block">
                    {currentDept.chamber} • {currentDept.shortName}
                  </strong>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    {currentDept.floor}. Please present your digital token pass or SMS to the triage desk nurse.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Pharmacy & Phlebotomy Proximity:</div>
                <div>• Central Pharmacy: 1st Floor, Near Elevator B</div>
                <div>• Path Lab / Blood Collection: Room 104, Ground Floor</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Step Real Hospital Visit Pipeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          End-to-End Hospital OPD Workflow Pipeline
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Synchronized clinical milestones from token registration to encrypted e-prescription.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '1',
              title: 'Check-in & Token Issued',
              desc: 'Completed at 09:15 AM (Desk B)',
              status: 'done'
            },
            {
              step: '2',
              title: 'Vitals & Triage Screening',
              desc: 'BP 120/80 • SpO2 99% Logged',
              status: 'done'
            },
            {
              step: '3',
              title: 'Virtual Live Queue',
              desc: inChamberPatient?.isCurrentUser ? 'Now in Chamber!' : `In queue (#${userToken})`,
              status: 'active'
            },
            {
              step: '4',
              title: 'Doctor Consultation',
              desc: `${currentDept.chamber} • ${currentDept.doctor}`,
              status: 'upcoming'
            },
            {
              step: '5',
              title: 'E-Prescription & Pharmacy',
              desc: 'Direct sync to CareGrid Health Vault',
              status: 'upcoming'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border relative transition-all ${
                item.status === 'done'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : item.status === 'active'
                  ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-500/20 text-teal-950'
                  : 'bg-slate-50/60 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.status === 'done'
                      ? 'bg-emerald-600 text-white'
                      : item.status === 'active'
                      ? 'bg-teal-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.status === 'done' ? '✓' : item.step}
                </div>
                <div className="text-xs font-bold">{item.title}</div>
              </div>
              <div className="text-[11px] opacity-80">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Issue Walk-In OPD Token */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Issue Walk-in OPD Token
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hospital Reception Desk & Patient Self-Service Kiosk
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {issuedTicket ? (
              <div className="my-6 space-y-4 text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  OPD Token Issued Successfully!
                </h4>
                <div className="bg-slate-900 text-white rounded-2xl p-5 text-center">
                  <div className="text-xs text-teal-300 uppercase tracking-widest font-bold">
                    {issuedTicket.departmentName}
                  </div>
                  <div className="text-5xl font-black font-mono text-amber-300 my-2">
                    #{issuedTicket.token}
                  </div>
                  <div className="text-sm font-semibold">{issuedTicket.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{issuedTicket.chamber} • {issuedTicket.doctor}</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    Print Ticket Slip
                  </button>
                  <button
                    onClick={() => {
                      setIsIssueModalOpen(false);
                      setIssuedTicket(null);
                    }}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
                  >
                    Done & View Queue
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIssueTokenSubmit} className="space-y-4 my-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTokenName}
                    onChange={(e) => setNewTokenName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={newTokenAge}
                      onChange={(e) => setNewTokenAge(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={newTokenGender}
                      onChange={(e) => setNewTokenGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      OPD Department *
                    </label>
                    <select
                      value={newTokenDept}
                      onChange={(e) => setNewTokenDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    >
                      <option value="general">General Medicine (Room 3B)</option>
                      <option value="cardiology">Cardiology (Room 4A)</option>
                      <option value="pediatrics">Pediatrics (Room 2A)</option>
                      <option value="orthopedics">Orthopedics (Room 1B)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Priority Category
                    </label>
                    <select
                      value={newTokenPriority}
                      onChange={(e) => setNewTokenPriority(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    >
                      <option value="General">General</option>
                      <option value="Senior Citizen">Senior Citizen (65+)</option>
                      <option value="Pediatric">Pediatric (&lt;5 yrs)</option>
                      <option value="Emergency / Fast-Track">Emergency / Fast-Track</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chief Complaint / Reason for Visit
                  </label>
                  <input
                    type="text"
                    value={newTokenReason}
                    onChange={(e) => setNewTokenReason(e.target.value)}
                    placeholder="e.g. Chest discomfort, high blood sugar, viral fever"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsIssueModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Generate Live Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
