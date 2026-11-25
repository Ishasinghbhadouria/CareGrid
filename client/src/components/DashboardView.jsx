import React, { useState } from 'react';
import {
  Calendar,
  Users,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Ambulance,
  Stethoscope,
  Bed,
  AlertTriangle,
  Activity,
  BarChart3,
  HeartPulse,
  ArrowUpRight
} from 'lucide-react';
import StatCard from './StatCard';

export default function DashboardView({
  setActiveTab,
  onOpenEmergencyModal,
  currentUser = { name: 'Dr. Kedar Dharmatti', role: 'admin', roleTitle: 'Hospital Administrator' }
}) {
  const [nextMedTaken, setNextMedTaken] = useState(false);

  const getHeaderMeta = () => {
    switch (currentUser.role) {
      case 'admin':
        return {
          title: currentUser.details?.hospitalName || 'CarePlus Super-Speciality Hospital',
          subtitle: 'Institutional Command Summary • Level-1 Trauma & Inpatient Care',
          badge: 'Hospital Operations Live',
          badgeClass: 'bg-sky-400/15 text-sky-100 border-sky-300/30'
        };
      case 'doctor':
        return {
          title: `${currentUser.name} • ${currentUser.details?.specialization || 'Cardiology'}`,
          subtitle: `OPD Chamber 3B • Clinical Shift Summary`,
          badge: 'NMC Verified Physician',
          badgeClass: 'bg-teal-400/15 text-teal-100 border-teal-300/30'
        };
      case 'caretaker':
        return {
          title: `CareCircle Overview • ${currentUser.name}`,
          subtitle: `Primary Linked Patient: ${currentUser.details?.caretakerPatientId || 'Isha Singh (CG-PAT-9021)'}`,
          badge: 'Caregiver Portal Synced',
          badgeClass: 'bg-indigo-400/15 text-indigo-100 border-indigo-300/30'
        };
      default:
        return {
          title: `Welcome back, ${currentUser.name}`,
          subtitle: 'Personal Health Summary • ABHA Encrypted Ecosystem',
          badge: 'Patient Care Active',
          badgeClass: 'bg-emerald-400/15 text-emerald-100 border-emerald-300/30'
        };
    }
  };

  const meta = getHeaderMeta();

  return (
    <div className="space-y-6">
      {/* Executive Header Banner (Precise High-Level Status Only) */}
      <section
        aria-label="Clinical Overview Summary"
        className="bg-gradient-to-br from-[#0b2538] via-[#0f3847] to-[#0f766e] rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute -right-14 -bottom-14 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${meta.badgeClass}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{meta.badge}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {meta.title}
            </h1>
            <p className="text-teal-100/85 text-sm mt-1.5">
              {meta.subtitle}
            </p>

            {/* Only the highest-priority contextual CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {currentUser.role === 'admin' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('resqcare')}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-950/30 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Ambulance className="w-4 h-4" />
                  Open Emergency CAD Dispatch
                </button>
              ) : currentUser.role === 'doctor' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('health-queue')}
                  className="px-4 py-2.5 rounded-xl bg-white text-teal-950 hover:bg-teal-50 text-xs font-bold shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  Resume OPD Chamber (#GEN-39)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenEmergencyModal}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-950/30 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Ambulance className="w-4 h-4" />
                  Trigger Emergency SOS
                </button>
              )}
            </div>
          </div>

          {/* Compact 2x2 Essential Readout Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:w-64 shrink-0">
            {currentUser.role === 'admin' ? (
              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div>
                  <span className="text-[11px] text-teal-200 block">Total Beds</span>
                  <span className="font-display text-lg font-bold">350 / 400</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">ICU Occupied</span>
                  <span className="font-display text-lg font-bold text-amber-300">42 / 45</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">Doctors On Duty</span>
                  <span className="font-display text-lg font-bold">28 Active</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">ResQCare Fleet</span>
                  <span className="font-display text-lg font-bold text-emerald-300">8 Ready</span>
                </div>
              </div>
            ) : currentUser.role === 'doctor' ? (
              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div>
                  <span className="text-[11px] text-teal-200 block">Now Serving</span>
                  <span className="font-mono text-lg font-bold text-amber-300">#GEN-39</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">In Queue</span>
                  <span className="font-display text-lg font-bold">5 Patients</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">Consults Today</span>
                  <span className="font-display text-lg font-bold">18</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">Telehealth</span>
                  <span className="font-display text-lg font-bold text-emerald-300">4 Slots</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div>
                  <span className="text-[11px] text-teal-200 block">Heart Rate</span>
                  <span className="font-mono text-lg font-bold">72 bpm</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">Blood Pressure</span>
                  <span className="font-mono text-lg font-bold">120/80</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">SpO2</span>
                  <span className="font-mono text-lg font-bold text-emerald-300">99%</span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-200 block">Fasting Glucose</span>
                  <span className="font-mono text-lg font-bold">95 mg/dL</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 Key Top-Level KPI Cards Routing to Dedicated Modules */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentUser.role === 'admin' ? (
          <>
            <StatCard
              title="OPD Outpatient Throughput"
              value="142 Visits"
              subtitle="4 chambers open • Avg wait 8m"
              icon={Users}
              accentColor="teal"
              onClick={() => setActiveTab('health-queue')}
            />
            <StatCard
              title="ResQCare Ambulance Fleet"
              value="8 GPS Units"
              subtitle="1 dispatched • Bay #1 staged"
              icon={Ambulance}
              accentColor="rose"
              onClick={() => setActiveTab('resqcare')}
            />
            <StatCard
              title="Hospital Operations Copilot"
              value="93% ICU Surge"
              subtitle="AI bed forecast & shift analytics"
              icon={Sparkles}
              accentColor="blue"
              onClick={() => setActiveTab('ai-assistant')}
            />
          </>
        ) : currentUser.role === 'doctor' ? (
          <>
            <StatCard
              title="Chamber 3B Live Queue"
              value="#GEN-39"
              subtitle="Next up: #GEN-40 Devendra S."
              icon={Clock}
              accentColor="teal"
              onClick={() => setActiveTab('health-queue')}
            />
            <StatCard
              title="Today's Consult Schedule"
              value="18 Booked"
              subtitle="14 in-clinic • 4 telehealth"
              icon={Calendar}
              accentColor="blue"
              onClick={() => setActiveTab('appointments')}
            />
            <StatCard
              title="Lab & E-Rx Vault"
              value="3 To Review"
              subtitle="Verified ABDM diagnostic panels"
              icon={FileText}
              accentColor="cyan"
              onClick={() => setActiveTab('medical-records')}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Your Active OPD Token"
              value="#GEN-42"
              subtitle="2 ahead • ~12 min est. wait"
              icon={Clock}
              accentColor="teal"
              onClick={() => setActiveTab('health-queue')}
            />
            <StatCard
              title="Upcoming Consultation"
              value="15 Oct"
              subtitle="10:30 AM • Dr. Sharma (Cardiology)"
              icon={Calendar}
              accentColor="blue"
              onClick={() => setActiveTab('appointments')}
            />
            <StatCard
              title="Encrypted Health Vault"
              value="12 Records"
              subtitle="Latest: Lipid Panel (Normal)"
              icon={FileText}
              accentColor="emerald"
              onClick={() => setActiveTab('medical-records')}
            />
          </>
        )}
      </section>

      {/* Two Focused Home Panels (Zero Duplication of Dedicated Tabs) */}
      <section aria-label="Immediate Priorities" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentUser.role === 'admin' ? (
          <>
            {/* Admin Panel 1: Critical Wing Utilization */}
            <div className="clinical-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Critical Bed Utilization
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time occupancy across inpatient priority wings.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Bed className="w-3.5 h-3.5" />
                  88% Total
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'prog-icu', label: 'Intensive Care Unit (ICU)', occupied: 42, total: 45, tone: 'critical' },
                  { id: 'prog-trauma', label: 'Emergency Trauma Bays', occupied: 8, total: 10, tone: 'warning' },
                  { id: 'prog-wards', label: 'General Inpatient Wards', occupied: 187, total: 200, tone: 'healthy' }
                ].map((wing) => {
                  const pct = Math.round((wing.occupied / wing.total) * 100);
                  return (
                    <div key={wing.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label htmlFor={wing.id} className="font-semibold text-slate-800">
                          {wing.label}
                        </label>
                        <span className="font-mono font-bold text-slate-700 tabular-nums">
                          {wing.occupied}/{wing.total} ({pct}%)
                        </span>
                      </div>
                      <progress
                        id={wing.id}
                        value={wing.occupied}
                        max={wing.total}
                        data-tone={wing.tone}
                        className="clinical-progress"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Panel 2: Shift Escalations & Observability */}
            <div className="clinical-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    System Health & Immediate Actions
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Infrastructure telemetry and high-priority administrative flags.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Monitored
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ICU Step-Down Review Due
                    </div>
                    <p className="text-amber-800 mt-0.5">
                      ICU at 93% capacity (3 ventilators open). 4 post-op patients cleared for HDU transfer.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      Prometheus & Grafana Stack
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      API metrics exported at <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded border border-slate-200">/metrics</code> • Dashboards on <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded border border-slate-200">:3001</code>
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>
          </>
        ) : currentUser.role === 'doctor' ? (
          <>
            {/* Doctor Panel 1: Immediate Next Patient Handoff */}
            <div className="clinical-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-slate-900">
                  Next Patient Handoff Brief
                </h2>
                <span className="font-mono text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  #GEN-40 Calling
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-slate-900">Devendra Sharma (64 / M)</span>
                  <span className="text-slate-500 font-mono">UHID: CG-PAT-8041</span>
                </div>
                <p className="text-slate-700">
                  <strong>Chief Complaint:</strong> Hypertension review & resting 12-lead ECG follow-up.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Allergy Screening: No known drug allergies logged.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('health-queue')}
                className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Open Live OPD Queue Console
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Doctor Panel 2: Clinical Escalations */}
            <div className="clinical-card rounded-2xl p-6 flex flex-col justify-between">
              <h2 className="font-display text-base font-bold text-slate-900 mb-3">
                Clinical Alerts & Priorities
              </h2>
              <div className="space-y-3 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('resqcare')}
                  className="w-full text-left p-3.5 rounded-xl bg-rose-50/70 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-rose-950 flex items-center justify-between">
                    <span>Trauma Bay #01 Inbound Standby</span>
                    <ArrowUpRight className="w-4 h-4 text-rose-600" />
                  </div>
                  <p className="text-rose-800 mt-0.5">
                    Review incoming ACLS pre-hospital vitals and confirm ER surgical readiness.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-assistant')}
                  className="w-full text-left p-3.5 rounded-xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-amber-950 flex items-center justify-between">
                    <span>Clinical Drug Interaction Copilot</span>
                    <ArrowUpRight className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-amber-800 mt-0.5">
                    Check ICMR protocol guidelines and metabolic interactions before signing E-Rx.
                  </p>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Patient Panel 1: Next Due Dose & Critical Safety */}
            <div className="clinical-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Next Scheduled Dose
                  </h2>
                  <p className="text-xs text-slate-500">Immediate daily adherence action.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('my-health')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-0.5 cursor-pointer"
                >
                  All Vitals
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setNextMedTaken((v) => !v)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    nextMedTaken
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-bold ${nextMedTaken ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      Vitamin D3 60k IU
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Afternoon • Weekly Regimen</div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      nextMedTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {nextMedTaken ? 'Completed ✓' : 'Mark Taken'}
                  </span>
                </button>

                <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-xs flex items-center justify-between">
                  <span className="font-bold text-rose-900">Allergy Flag: Penicillin</span>
                  <span className="text-[11px] font-semibold text-rose-700">Synced to Emergency SOS</span>
                </div>
              </div>
            </div>

            {/* Patient Panel 2: Latest Health & Circle Highlight */}
            <div className="clinical-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Recent Clinical Update
                  </h2>
                  <p className="text-xs text-slate-500">Summary from your latest verified diagnostic report.</p>
                </div>
                <HeartPulse className="w-5 h-5 text-teal-600" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Lipid Profile & Metabolic Panel</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Optimal
                  </span>
                </div>
                <p className="text-slate-600">
                  LDL 98 mg/dL • Total Cholesterol 185 mg/dL • Fasting Glucose 92 mg/dL (01 Oct 2026).
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-assistant')}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Ask CareGrid AI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('carecircle')}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  CareCircle (3 Allies)
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
