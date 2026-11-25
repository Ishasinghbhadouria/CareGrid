import React, { useState, useEffect } from 'react';
import {
  Ambulance,
  PhoneCall,
  ShieldCheck,
  Navigation,
  XCircle,
  Radio,
  Activity,
  Heart,
  Volume2,
  VolumeX,
  CheckCircle2,
  Zap,
  Share2,
  Check,
  Crosshair,
  AlertTriangle,
  ClipboardCheck
} from 'lucide-react';
import { emergencyApi } from '../services/api';

// Quadratic Bezier interpolation so ambulance sits directly on the SVG route curve
function getPointOnQuadBezier(p0, ctrl, p2, t) {
  const inv = 1 - t;
  return {
    x: inv * inv * p0.x + 2 * inv * t * ctrl.x + t * t * p2.x,
    y: inv * inv * p0.y + 2 * inv * t * ctrl.y + t * t * p2.y
  };
}

// Web Audio API Emergency Siren Synthesizer
function playAmbulanceSiren(durationSeconds = 2.2) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.55);
    osc.frequency.linearRampToValueAtTime(640, now + 1.1);
    osc.frequency.linearRampToValueAtTime(900, now + 1.65);
    osc.frequency.linearRampToValueAtTime(640, now + 2.2);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSeconds);
  } catch {
    // Audio unavailable or blocked
  }
}

const HOSPITAL_COORDS = { x: 645, y: 105, name: 'CarePlus Trauma Center' };
const DEFAULT_SCENE_COORDS = { x: 175, y: 265 };

const INITIAL_FLEET = [
  {
    id: 'AMB-108',
    callSign: 'Unit #108',
    tier: 'ACLS',
    type: 'Advanced Cardiac Life Support',
    driver: 'Ramesh Solanki',
    paramedic: 'Officer Suresh Verma (EMT-P)',
    phone: '+91 98260-11223',
    status: 'standby',
    location: 'Vijay Nagar Hub (1.8 km)',
    baseCoords: { x: 470, y: 85 },
    oxygen: '100% (Dual 40L)',
    ventilator: 'Hamilton-T1 ICU'
  },
  {
    id: 'AMB-101',
    callSign: 'Unit #101',
    tier: 'BLS',
    type: 'Basic Life Support',
    driver: 'Mohan Lal',
    paramedic: 'Pooja Tiwari (EMT-B)',
    phone: '+91 98260-22114',
    status: 'standby',
    location: 'Palasia Sector 4',
    baseCoords: { x: 350, y: 315 },
    oxygen: '96%',
    ventilator: 'AED + Bag-Valve'
  },
  {
    id: 'AMB-102',
    callSign: 'Unit #102',
    tier: 'NICU',
    type: 'Neonatal & Pediatric ICU',
    driver: 'Abdul Rahim',
    paramedic: 'Dr. Neha Kapoor',
    phone: '+91 98260-33118',
    status: 'standby',
    location: 'CarePlus Hospital Bay',
    baseCoords: { x: 605, y: 145 },
    oxygen: '100%',
    ventilator: 'Dräger BabyLog'
  },
  {
    id: 'AMB-103',
    callSign: 'Unit #103',
    tier: 'TRAUMA',
    type: 'Rapid Trauma Unit',
    driver: 'Kishore Dave',
    paramedic: 'Dinesh Joshi (EMT-P)',
    phone: '+91 98260-44551',
    status: 'standby',
    location: 'Super Corridor Link',
    baseCoords: { x: 130, y: 120 },
    oxygen: '100%',
    ventilator: 'LTV 1200 Transport'
  },
  {
    id: 'AMB-104',
    callSign: 'Unit #104',
    tier: 'ACLS',
    type: 'Advanced Cardiac Life Support',
    driver: 'Vinod Nair',
    paramedic: 'Anil Saxena (EMT-P)',
    phone: '+91 98260-55901',
    status: 'handoff',
    location: 'ER Bay #2 Handoff',
    baseCoords: { x: 685, y: 150 },
    oxygen: '88%',
    ventilator: 'Hamilton-T1'
  },
  {
    id: 'AMB-105',
    callSign: 'Unit #105',
    tier: 'BLS',
    type: 'Basic Life Support',
    driver: 'Satish Pandey',
    paramedic: 'Komal Rao (EMT-B)',
    phone: '+91 98260-66202',
    status: 'standby',
    location: 'North Ring Road',
    baseCoords: { x: 540, y: 270 },
    oxygen: '94%',
    ventilator: 'Portable O2'
  },
  {
    id: 'AMB-106',
    callSign: 'Unit #106',
    tier: 'CCT',
    type: 'Critical Care ICU Van',
    driver: 'Harish Mehta',
    paramedic: 'Dr. Vivek Soni',
    phone: '+91 98260-77412',
    status: 'standby',
    location: 'South Wing Outpost',
    baseCoords: { x: 465, y: 310 },
    oxygen: '100%',
    ventilator: 'Servo-air ICU'
  },
  {
    id: 'AMB-107',
    callSign: 'Unit #107',
    tier: 'RAPID',
    type: 'Paramedic First Responder',
    driver: 'Govind Rao',
    paramedic: 'Sunil Shinde (EMT-P)',
    phone: '+91 98260-88309',
    status: 'standby',
    location: 'West Highway Gate',
    baseCoords: { x: 95, y: 295 },
    oxygen: '98%',
    ventilator: 'Compact AED'
  }
];

const DISPATCH_STAGES = [
  { id: 'en-route', label: '1. Unit En Route', desc: 'Responding to pickup location' },
  { id: 'on-scene', label: '2. On Scene', desc: 'Paramedic stabilizing patient' },
  { id: 'transporting', label: '3. To Trauma ER', desc: 'Green corridor hospital return' },
  { id: 'arrived', label: '4. ER Bay Handoff', desc: 'Trauma team assuming care' }
];

export default function ResQCareView({
  isEmergencyActive,
  setIsEmergencyActive,
  currentUser = { name: 'Isha Singh', role: 'patient' }
}) {
  const role = currentUser?.role || 'patient';

  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [assignedUnitId, setAssignedUnitId] = useState('AMB-108');
  const [dispatchStage, setDispatchStage] = useState('en-route'); // 'en-route' | 'on-scene' | 'transporting' | 'arrived'
  const [pickupAddress, setPickupAddress] = useState('Scheme 54, Vijay Nagar, Indore (22.7533° N, 75.8937° E)');
  const [emergencyCategory, setEmergencyCategory] = useState('Cardiac / Chest Pain');
  const [selectedBay, setSelectedBay] = useState('Bay #01');
  const [doctorConfirmedEr, setDoctorConfirmedEr] = useState(false);

  const [routeProgress, setRouteProgress] = useState(0.32); // 0 to 1
  const [etaSeconds, setEtaSeconds] = useState(310);
  const [currentSpeed, setCurrentSpeed] = useState(54);
  const [distanceKm, setDistanceKm] = useState(1.7);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [greenCorridorActive, setGreenCorridorActive] = useState(true);

  const [linkCopied, setLinkCopied] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState('');
  const [fleetFilter, setFleetFilter] = useState('all'); // 'all' | 'standby' | 'active'
  const [callBanner, setCallBanner] = useState(null);

  const [ecgHeartRate, setEcgHeartRate] = useState(78);
  const [spo2, setSpo2] = useState(98);
  const [bpReading] = useState('124/82');

  const activeUnit = fleet.find((u) => u.id === assignedUnitId) || fleet[0];

  // Sync status from server on mount cleanly
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await emergencyApi.getStatus();
      if (!mounted || !res?.ok || !res.data?.data) return;
      const latest = res.data.data;
      if (res.data.active) {
        setIsEmergencyActive(true);
        if (latest.location?.address) setPickupAddress(latest.location.address);
        if (latest.stage) setDispatchStage(latest.stage);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setIsEmergencyActive]);

  // Real-time reliable telemetry loop while emergency is active
  useEffect(() => {
    if (!isEmergencyActive) return;

    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 5 ? prev - 1 : 5));
      setEcgHeartRate(Math.floor(76 + Math.random() * 5));
      setSpo2(97 + Math.floor(Math.random() * 3));

      if (dispatchStage === 'en-route' || dispatchStage === 'transporting') {
        setCurrentSpeed(Math.floor(46 + Math.random() * 14));
        setRouteProgress((prev) => {
          const next = Math.min(0.96, +(prev + 0.012).toFixed(3));
          return next;
        });
        setDistanceKm((prev) => Math.max(0.1, +(prev - 0.02).toFixed(2)));
      } else {
        setCurrentSpeed(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isEmergencyActive, dispatchStage]);

  const handleStartDispatch = async (unitId = assignedUnitId) => {
    setAssignedUnitId(unitId);
    setDispatchStage('en-route');
    setRouteProgress(0.15);
    setEtaSeconds(320);
    setDistanceKm(1.8);
    setIsEmergencyActive(true);

    setFleet((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? { ...u, status: 'en-route' }
          : u.status === 'en-route'
          ? { ...u, status: 'standby' }
          : u
      )
    );

    if (soundEnabled) playAmbulanceSiren(2.0);

    await emergencyApi.triggerSos({
      address: pickupAddress,
      emergencyType: emergencyCategory,
      ambulanceUnit: `ResQCare ${unitId}`,
      traumaBay: selectedBay
    });
  };

  const handleAdvanceStage = async (nextStage) => {
    setDispatchStage(nextStage);
    if (nextStage === 'en-route') {
      setRouteProgress(0.2);
      setEtaSeconds(300);
      setDistanceKm(1.6);
    } else if (nextStage === 'on-scene') {
      setRouteProgress(1);
      setEtaSeconds(0);
      setDistanceKm(0);
    } else if (nextStage === 'transporting') {
      setRouteProgress(0.15);
      setEtaSeconds(240);
      setDistanceKm(1.9);
    } else if (nextStage === 'arrived') {
      setRouteProgress(1);
      setEtaSeconds(0);
      setDistanceKm(0);
    }

    await emergencyApi.updateStage({
      stage: nextStage,
      ambulanceUnit: activeUnit.callSign,
      traumaBay: selectedBay
    });
  };

  const handleCancelEmergency = async () => {
    setIsEmergencyActive(false);
    setDispatchStage('en-route');
    setDoctorConfirmedEr(false);
    setFleet((prev) => prev.map((u) => (u.id === assignedUnitId ? { ...u, status: 'standby' } : u)));
    await emergencyApi.updateStage({ stage: 'resolved' });
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsStatusMsg('Using verified district landmark coordinates.');
      return;
    }
    setGpsStatusMsg('Acquiring GPS lock...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setPickupAddress(`Live GPS Pin (${lat}° N, ${lng}° E)`);
        setGpsStatusMsg('GPS coordinates locked (±10m)');
      },
      () => {
        setGpsStatusMsg('Browser location denied — manual address active.');
      },
      { timeout: 3500 }
    );
  };

  const handleCopyTrackLink = async () => {
    const shareText = `CareGrid ResQCare Live Tracker — ${activeUnit.callSign} (${dispatchStage.toUpperCase()}) • Pickup: ${pickupAddress} • Hospital: CarePlus Trauma ${selectedBay}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      setGpsStatusMsg('Share ready: Unit #108 tracking active.');
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Exact aligned SVG Route Calculation
  const routeP0 = dispatchStage === 'transporting' || dispatchStage === 'arrived'
    ? DEFAULT_SCENE_COORDS
    : activeUnit.baseCoords;
  const routeCtrl = dispatchStage === 'transporting' || dispatchStage === 'arrived'
    ? { x: 430, y: 280 }
    : { x: 350, y: 120 };
  const routeP2 = dispatchStage === 'transporting' || dispatchStage === 'arrived'
    ? HOSPITAL_COORDS
    : DEFAULT_SCENE_COORDS;

  const activeAmbPoint = !isEmergencyActive
    ? activeUnit.baseCoords
    : dispatchStage === 'on-scene'
    ? DEFAULT_SCENE_COORDS
    : dispatchStage === 'arrived'
    ? HOSPITAL_COORDS
    : getPointOnQuadBezier(routeP0, routeCtrl, routeP2, routeProgress);

  const visibleFleet = fleet.filter((u) => {
    if (fleetFilter === 'standby') return u.status === 'standby';
    if (fleetFilter === 'active') return u.status !== 'standby';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Unified Header Strip */}
      <div className="clinical-card p-5 sm:p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 shrink-0">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-extrabold text-slate-900">
                ResQCare Ambulance Dispatch & GPS Tracking
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <Radio className="w-3 h-3 animate-pulse" />
                {role === 'admin'
                  ? 'Hospital CAD Console'
                  : role === 'doctor'
                  ? 'Trauma Physician Triage'
                  : '24/7 Live Ambulance Tracker'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {role === 'admin'
                ? 'Manage the 8-unit fleet, assign standby vehicles, and monitor hospital ER trauma bay staging.'
                : role === 'doctor'
                ? 'Live incoming trauma vitals, allergy alerts, ECG waveform, and ER bay readiness confirmation.'
                : 'Track your ambulance step-by-step with direct driver contact, verified pickup pin, and auto-shared medical pass.'}
            </p>
          </div>
        </div>

        {/* Action Strip */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? 'Mute Siren Audio' : 'Enable Siren Audio'}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Audio On' : 'Audio Muted'}</span>
          </button>

          {isEmergencyActive ? (
            <button
              type="button"
              onClick={handleCancelEmergency}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              End / Resolve Dispatch
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleStartDispatch('AMB-108')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Ambulance className="w-4 h-4" />
              Dispatch Emergency SOS
            </button>
          )}
        </div>
      </div>

      {/* Inline Call / Communication Feedback Banner (replaces window.alert) */}
      {callBanner && (
        <div role="status" className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            <span>{callBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setCallBanner(null)}
            className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Standby Setup Card for Patient / Admin Before SOS Dispatch */}
      {!isEmergencyActive && (
        <div className="clinical-card rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-[#0f3443] text-white border-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-display text-xl font-bold text-white">
                Instant One-Tap Emergency Ambulance Request
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Confirm your pickup landmark and emergency type. CareGrid automatically routes the nearest ACLS ambulance and alerts CarePlus Trauma ER.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pickup-address" className="block text-[11px] font-bold uppercase tracking-wider text-teal-200 mb-1">
                    Pickup Location / Landmark
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="pickup-address"
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs font-medium border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={handleDetectGps}
                      title="Use current GPS"
                      className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      GPS
                    </button>
                  </div>
                  {gpsStatusMsg && (
                    <p className="text-[11px] text-emerald-300 mt-1">{gpsStatusMsg}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="emergency-category" className="block text-[11px] font-bold uppercase tracking-wider text-teal-200 mb-1">
                    Emergency Condition
                  </label>
                  <select
                    id="emergency-category"
                    value={emergencyCategory}
                    onChange={(e) => setEmergencyCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300"
                  >
                    <option value="Cardiac / Chest Pain">Cardiac / Severe Chest Pain</option>
                    <option value="Accident / Polytrauma">Road Accident / Trauma</option>
                    <option value="Respiratory Distress">Acute Breathing Distress</option>
                    <option value="Stroke / Neurological">Suspected Stroke / Seizure</option>
                    <option value="Critical ICU Transfer">Inter-Hospital ICU Transfer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Nearest Unit Ready
              </div>
              <div className="font-display text-2xl font-extrabold text-white">
                {activeUnit.callSign} ({activeUnit.tier})
              </div>
              <div className="text-xs text-slate-300">
                Est. Dispatch Arrival: <strong className="text-white font-mono">~5 mins</strong>
              </div>
              <button
                type="button"
                onClick={() => handleStartDispatch(activeUnit.id)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ambulance className="w-4 h-4" />
                Confirm & Track Live Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Dispatch Milestone & Easy Actions Bar */}
      {isEmergencyActive && (
        <div
          role="region"
          aria-live="polite"
          aria-label="Active Emergency Dispatch Status"
          className="bg-gradient-to-r from-rose-700 via-rose-800 to-[#7f1d1d] text-white rounded-3xl p-6 shadow-xl space-y-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>ACTIVE SOS • {emergencyCategory.toUpperCase()}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {dispatchStage === 'en-route'
                  ? `${activeUnit.callSign} (${activeUnit.tier}) On The Way`
                  : dispatchStage === 'on-scene'
                  ? `${activeUnit.callSign} Arrived at Scene`
                  : dispatchStage === 'transporting'
                  ? `En Route to ${HOSPITAL_COORDS.name}`
                  : `Arrived at Trauma ${selectedBay}`}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100">
                Pickup: <strong className="text-white">{pickupAddress}</strong> • Paramedic Lead: <strong className="text-white">{activeUnit.paramedic}</strong>
              </p>

              {/* Clear Role-Friendly Immediate Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setCallBanner(`Voice channel open with ${activeUnit.paramedic} (${activeUnit.phone}) • Connected on ResQCare Hotline.`)
                  }
                  className="px-4 py-2 bg-white text-rose-950 hover:bg-rose-50 rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  Call Paramedic ({activeUnit.phone})
                </button>

                <button
                  type="button"
                  onClick={handleCopyTrackLink}
                  className="px-4 py-2 bg-rose-950/50 hover:bg-rose-950/80 text-white border border-white/20 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                  {linkCopied ? 'Live Details Copied' : 'Share Live Tracker'}
                </button>

                {role === 'doctor' && (
                  <button
                    type="button"
                    onClick={() => setDoctorConfirmedEr((v) => !v)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer border transition-colors ${
                      doctorConfirmedEr
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                        : 'bg-amber-400 text-slate-950 border-amber-200 hover:bg-amber-300'
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    {doctorConfirmedEr ? `ER ${selectedBay} Team Confirmed ✓` : `Confirm ER ${selectedBay} Team Ready`}
                  </button>
                )}
              </div>
            </div>

            {/* Clean Live Telemetry ETA Box */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:w-64 text-center shrink-0 tabular-nums">
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-200">
                {dispatchStage === 'on-scene' || dispatchStage === 'arrived' ? 'Status' : 'Live Countdown ETA'}
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-white my-1.5">
                {dispatchStage === 'on-scene'
                  ? 'ON SITE'
                  : dispatchStage === 'arrived'
                  ? 'IN ER'
                  : formatTimer(etaSeconds)}
              </div>
              <div className="text-xs text-rose-100 flex items-center justify-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-rose-200" />
                <span>{distanceKm} km • {currentSpeed} km/h</span>
              </div>
            </div>
          </div>

          {/* 4-Stage Visual Progress Milestones */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-white/15">
            {DISPATCH_STAGES.map((stage, idx) => {
              const currentIndex = DISPATCH_STAGES.findIndex((s) => s.id === dispatchStage);
              const isDone = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={stage.id}
                  type="button"
                  disabled={role === 'patient' || role === 'caretaker'}
                  onClick={() => (role === 'admin' || role === 'doctor') && handleAdvanceStage(stage.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-white text-slate-900 border-white shadow-md'
                      : isDone
                      ? 'bg-emerald-500/25 border-emerald-300/40 text-white'
                      : 'bg-black/20 border-white/15 text-rose-100/80'
                  } ${role === 'admin' || role === 'doctor' ? 'cursor-pointer hover:opacity-95' : 'cursor-default'}`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>{stage.label}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isCurrent ? 'text-slate-600' : 'opacity-80'}`}>
                    {stage.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Split: Mathematically Aligned Live GPS Map + Role Telemetry Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG GPS Route Canvas (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-display text-xs font-bold text-teal-300 uppercase tracking-wider">
                Synced GPS Route Canvas • Precision Route Lock
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGreenCorridorActive(!greenCorridorActive)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  greenCorridorActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Zap className="w-3 h-3" />
                {greenCorridorActive ? 'Green Corridor ON' : 'Green Corridor OFF'}
              </button>
            </div>
          </div>

          {/* Pure Unified SVG Coordinate Space (800 x 360) */}
          <div className="my-4 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <svg
              role="img"
              aria-label="Live Ambulance GPS Route Map showing fleet vehicles, patient pickup point, and hospital destination"
              viewBox="0 0 800 360"
              className="w-full h-auto block select-none"
            >
              <defs>
                <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Grid backdrop */}
              <rect width="800" height="360" fill="url(#city-grid)" />

              {/* Major Arterial Roads */}
              <path d="M 30 95 L 770 110" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
              <path d="M 80 305 Q 380 285 730 140" fill="none" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
              <path d="M 190 40 L 170 330" fill="none" stroke="#1e293b" strokeWidth="6" />
              <path d="M 465 35 L 470 335" fill="none" stroke="#1e293b" strokeWidth="6" />
              <path d="M 645 30 L 650 325" fill="none" stroke="#1e293b" strokeWidth="6" />

              {/* District Labels */}
              <text x="55" y="75" fill="#64748b" fontSize="11" fontWeight="600">SUPER CORRIDOR</text>
              <text x="110" y="340" fill="#64748b" fontSize="11" fontWeight="600">VIJAY NAGAR PICKUP ZONE</text>
              <text x="555" y="75" fill="#64748b" fontSize="11" fontWeight="600">HOSPITAL MEDICAL HUB</text>

              {/* Planned / Active Corridor Bézier Path */}
              <path
                d={`M ${routeP0.x} ${routeP0.y} Q ${routeCtrl.x} ${routeCtrl.y} ${routeP2.x} ${routeP2.y}`}
                fill="none"
                stroke={isEmergencyActive ? (greenCorridorActive ? '#10b981' : '#f43f5e') : '#475569'}
                strokeWidth={isEmergencyActive ? 14 : 4}
                opacity={isEmergencyActive ? 0.2 : 0.4}
                strokeLinecap="round"
              />
              <path
                d={`M ${routeP0.x} ${routeP0.y} Q ${routeCtrl.x} ${routeCtrl.y} ${routeP2.x} ${routeP2.y}`}
                fill="none"
                stroke={isEmergencyActive ? (greenCorridorActive ? '#10b981' : '#fb7185') : '#64748b'}
                strokeWidth={isEmergencyActive ? 4 : 2}
                strokeDasharray="10 6"
                strokeLinecap="round"
              />

              {/* CarePlus Hospital Marker */}
              <g transform={`translate(${HOSPITAL_COORDS.x}, ${HOSPITAL_COORDS.y})`}>
                <circle r="18" fill="#0284c7" stroke="#bae6fd" strokeWidth="3" />
                <path d="M -5 0 H 5 M 0 -5 V 5" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <rect x="-86" y="24" width="172" height="22" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="39" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontWeight="700">
                  CarePlus Trauma ER ({selectedBay})
                </text>
              </g>

              {/* Patient Pickup Scene Marker */}
              <g transform={`translate(${DEFAULT_SCENE_COORDS.x}, ${DEFAULT_SCENE_COORDS.y})`}>
                {isEmergencyActive && (
                  <circle r="24" fill="#e11d48" opacity="0.25" className="animate-ping" />
                )}
                <circle r="14" fill="#e11d48" stroke="#ffffff" strokeWidth="2.5" />
                <circle r="4" fill="#ffffff" />
                <rect x="-72" y="20" width="144" height="22" rx="6" fill="#4c0519" stroke="#fb7185" strokeWidth="1" />
                <text x="0" y="35" textAnchor="middle" fill="#ffe4e6" fontSize="10" fontWeight="700">
                  Patient Pickup Pin
                </text>
              </g>

              {/* Standby Fleet Units */}
              {fleet
                .filter((u) => u.id !== assignedUnitId || !isEmergencyActive)
                .map((u) => (
                  <g
                    key={u.id}
                    transform={`translate(${u.baseCoords.x}, ${u.baseCoords.y})`}
                    onClick={() => setAssignedUnitId(u.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r="12"
                      fill={u.id === assignedUnitId ? '#0d9488' : '#1e293b'}
                      stroke={u.status === 'handoff' ? '#f59e0b' : '#10b981'}
                      strokeWidth="2"
                    />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                      {u.id.replace('AMB-', '')}
                    </text>
                    <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      {u.id}
                    </text>
                  </g>
                ))}

              {/* Active En-Route / Dispatched Ambulance Driving Exactly on Bézier Path */}
              {isEmergencyActive && (
                <g transform={`translate(${activeAmbPoint.x}, ${activeAmbPoint.y})`}>
                  <circle r="22" fill="#e11d48" opacity="0.3" className="animate-ping" />
                  <circle r="15" fill="#e11d48" stroke="#ffffff" strokeWidth="3" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800" fontFamily="monospace">
                    {activeUnit.id.replace('AMB-', '')}
                  </text>
                  <rect x="-54" y="-34" width="108" height="20" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
                  <text x="0" y="-20" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="monospace">
                    {activeUnit.id} • {currentSpeed} km/h
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Corridor Lock Active
              </span>
              <span className="inline-flex items-center gap-1.5 text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Hospital ER Synced
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              GPS Precision: ±1.2m • Assigned: {activeUnit.callSign}
            </span>
          </div>
        </div>

        {/* Right Column: Role-Focused Utility (Patient Safety / Doctor Triage / Unit Specs) */}
        <div className="space-y-5">
          {/* Role-Specific Primary Card */}
          {role === 'doctor' ? (
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Pre-Hospital Triage Feed
                </span>
                <span className="font-mono text-[11px] text-slate-400">Lead II • 25mm/s</span>
              </div>

              {/* Critical Doctor Triage Alert */}
              <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-xs space-y-1">
                <div className="font-bold text-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  Critical Allergies: Penicillin (Anaphylaxis), Sulfa
                </div>
                <p className="text-rose-100/80">
                  Patient Blood Group: <strong>B Positive (B+)</strong> • Category: <strong>{emergencyCategory}</strong>
                </p>
              </div>

              {/* ECG Readout */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-slate-400 font-mono">Telemetry Rhythm</span>
                  <span className="font-mono font-bold text-emerald-400 inline-flex items-center gap-1 tabular-nums">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                    {ecgHeartRate} BPM
                  </span>
                </div>
                <svg aria-hidden="true" className="w-full h-14" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <path
                    d="M 0 30 L 30 30 L 35 25 L 40 30 L 50 30 L 55 10 L 60 55 L 65 20 L 70 30 L 90 30 L 95 24 L 100 30 L 140 30 L 145 25 L 150 30 L 160 30 L 165 10 L 170 55 L 175 20 L 180 30 L 200 30 L 205 24 L 210 30 L 250 30 L 255 10 L 260 55 L 265 20 L 270 30 L 300 30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center tabular-nums">
                <div className="p-2.5 rounded-xl bg-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">SpO2</div>
                  <div className="font-mono font-bold text-cyan-300">{spo2}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">BP</div>
                  <div className="font-mono font-bold text-amber-300">{bpReading}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">GCS</div>
                  <div className="font-mono font-bold text-emerald-300">15/15</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">Crew Interventions Logged:</strong>
                IV 18G Left Antecubital • High-flow O2 6L/min • ER {selectedBay} Requested
              </div>
            </div>
          ) : (
            /* Patient / Caretaker / Admin Active Unit Telemetry Card */
            <div className="clinical-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Assigned Ambulance
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {activeUnit.callSign} • {activeUnit.tier}
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {activeUnit.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Medical Spec:</span>
                  <strong className="text-slate-800">{activeUnit.type}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Pilot / Driver:</span>
                  <strong className="text-slate-800">{activeUnit.driver}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Paramedic Officer:</span>
                  <strong className="text-slate-800">{activeUnit.paramedic}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Equipment:</span>
                  <strong className="text-teal-700">{activeUnit.ventilator}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Hospital Destination:</span>
                  <strong className="text-slate-800">CarePlus ER ({selectedBay})</strong>
                </div>
              </div>

              {/* Compact Paramedic Live Vitals Preview when Active */}
              {isEmergencyActive && (
                <div className="p-3 rounded-xl bg-slate-900 text-white grid grid-cols-3 gap-2 text-center tabular-nums">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">{ecgHeartRate} bpm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <span className="font-mono text-xs font-bold text-cyan-300">{spo2}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">BP</span>
                    <span className="font-mono text-xs font-bold text-amber-300">{bpReading}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auto-Shared Critical Emergency Pass & Family Notify Card */}
          <div className="clinical-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Auto-Transmitted Medical ID
              </h3>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Synced
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Blood Type</span>
                <strong className="text-rose-600 font-extrabold">B Positive (B+)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-[10px] uppercase text-rose-500 font-bold block">Critical Allergy</span>
                <strong className="text-rose-900 font-extrabold">Penicillin</strong>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Emergency Contacts (Rajesh S., Aditya V.)</span>
              <span className={`font-bold ${isEmergencyActive ? 'text-rose-600' : 'text-emerald-700'}`}>
                {isEmergencyActive ? 'Live GPS Sent ✓' : 'Auto-Alert Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Bottom Operations Panel: Admin CAD Fleet Assignment / Doctor ER Staging */}
      {(role === 'admin' || role === 'doctor') && (
        <div className="clinical-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Fleet CAD Allocation & Trauma ER Staging
              </h2>
              <p className="text-xs text-slate-500">
                Click any unit below to inspect or reassign emergency dispatch & ER bay allocation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs font-bold">
                {['all', 'standby', 'active'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFleetFilter(f)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      fleetFilter === f ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <label htmlFor="trauma-bay-select" className="visually-hidden">
                Select Trauma ER Bay
              </label>
              <select
                id="trauma-bay-select"
                value={selectedBay}
                onChange={(e) => setSelectedBay(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="Bay #01">ER Bay #01 (Cardiac)</option>
                <option value="Bay #02">ER Bay #02 (Polytrauma)</option>
                <option value="Bay #03">ER Bay #03 (Resuscitation)</option>
                <option value="Bay #04">ER Bay #04 (Acute Med)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <caption className="visually-hidden">ResQCare 8-Unit Ambulance Fleet Roster</caption>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3 px-3">Unit ID</th>
                  <th scope="col" className="py-3 px-3">Classification</th>
                  <th scope="col" className="py-3 px-3">Crew & Paramedic</th>
                  <th scope="col" className="py-3 px-3">Station / Sector</th>
                  <th scope="col" className="py-3 px-3">Status</th>
                  <th scope="col" className="py-3 px-3 text-right">CAD Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleFleet.map((u) => {
                  const isAssigned = u.id === assignedUnitId && isEmergencyActive;
                  return (
                    <tr
                      key={u.id}
                      className={isAssigned ? 'bg-rose-50/70 font-medium' : 'hover:bg-slate-50/70'}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {u.id} <span className="text-[10px] text-teal-700 font-semibold">({u.tier})</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{u.type}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{u.paramedic}</div>
                        <div className="text-[11px] text-slate-500">Driver: {u.driver}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{u.location}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isAssigned
                              ? 'bg-rose-100 text-rose-800'
                              : u.status === 'handoff'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isAssigned ? 'Active Route' : u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleStartDispatch(u.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            isAssigned
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          {isAssigned ? 'Active Unit' : 'Assign & Dispatch'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
