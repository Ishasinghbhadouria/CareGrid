import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Droplet,
  Plus,
  Download,
  CheckCircle2,
  Syringe,
  Scale
} from 'lucide-react';

export default function MyHealthView() {
  const [allergies, setAllergies] = useState([
    { id: 1, allergen: 'Penicillin', severity: 'Severe (Anaphylaxis Risk)', date: 'Logged 2021' },
    { id: 2, allergen: 'Sulfa Drugs', severity: 'Moderate (Urticaria)', date: 'Logged 2023' }
  ]);

  const [newAllergen, setNewAllergen] = useState('');
  const [isAddingAllergy, setIsAddingAllergy] = useState(false);

  const handleAddAllergy = (e) => {
    e.preventDefault();
    if (!newAllergen) return;
    setAllergies([
      ...allergies,
      {
        id: Date.now(),
        allergen: newAllergen,
        severity: 'Patient Reported',
        date: 'Today'
      }
    ]);
    setNewAllergen('');
    setIsAddingAllergy(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              My Health Profile & Vitals Telemetry
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ABHA Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete biographical health record, baseline vitals, and immunization ledger.
          </p>
        </div>

        <button
          onClick={() => alert('Generating standardized CareGrid Emergency Medical Pass PDF...')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4" />
          Export Emergency Pass
        </button>
      </div>

      {/* Patient Bio & ID Card */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white rounded-3xl p-6 lg:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black ring-4 ring-white/10 shrink-0">
              IS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">Isha Singh</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-400 text-slate-900">
                  Verified Patient
                </span>
              </div>
              <p className="text-teal-200 text-xs mt-0.5">
                CareGrid Health ID: <strong className="text-white font-mono">CG-9104-5821-IN</strong>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-teal-100/90 mt-2">
                <span>Age: <strong>24 Yrs</strong></span>
                <span>•</span>
                <span>Gender: <strong>Female</strong></span>
                <span>•</span>
                <span>Blood Group: <strong className="text-white bg-rose-600/80 px-2 py-0.5 rounded">O+</strong></span>
                <span>•</span>
                <span>Primary Care: <strong>Dr. Sharma</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-1.5 md:w-64 shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-200">
              Emergency Contact Proxy
            </div>
            <div className="text-white font-bold">Rajesh Singh (Father)</div>
            <div className="text-teal-200 font-mono text-[11px]">+91 98110-12345</div>
            <div className="text-emerald-300 text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Auto-Alert Trigger Enabled
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Vitals Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Resting Pulse
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            72 <span className="text-xs font-normal text-slate-500">bpm</span>
          </div>
          <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit font-medium">
            Optimal sinus rhythm
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Blood Pressure
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            120/80 <span className="text-xs font-normal text-slate-500">mmHg</span>
          </div>
          <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit font-medium">
            Ideal normotensive
          </div>
        </div>

        {/* Fasting Sugar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Blood Sugar (Fasting)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            95 <span className="text-xs font-normal text-slate-500">mg/dL</span>
          </div>
          <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit font-medium">
            Within healthy threshold
          </div>
        </div>

        {/* BMI & Weight */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              BMI & Body Mass
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            22.0 <span className="text-xs font-normal text-slate-500">BMI (62 kg)</span>
          </div>
          <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit font-medium">
            Healthy weight category
          </div>
        </div>
      </div>

      {/* Allergies & Immunizations Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allergies & Reactions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Known Drug & Environmental Allergies
              </h3>
              <p className="text-xs text-slate-500">
                Shared with emergency paramedics and prescribing doctors.
              </p>
            </div>
            <button
              onClick={() => setIsAddingAllergy(true)}
              className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
              title="Add Allergy"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {allergies.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70"
              >
                <div>
                  <div className="text-xs font-bold text-rose-950">{item.allergen}</div>
                  <div className="text-[11px] text-rose-700 font-semibold">{item.severity}</div>
                </div>
                <span className="text-[10px] text-rose-500 font-medium">{item.date}</span>
              </div>
            ))}

            {isAddingAllergy && (
              <form onSubmit={handleAddAllergy} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Aspirin or Peanuts"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAllergy(false)}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Immunizations Record */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Verified Immunization Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Official vaccination history and booster records.
              </p>
            </div>
            <Syringe className="w-5 h-5 text-teal-600" />
          </div>

          <div className="space-y-3">
            {[
              {
                vaccine: 'COVID-19 Spikevax mRNA Booster',
                batch: 'Dose 3 • Batch #CV-8991',
                date: 'Nov 2024 • Verified',
                valid: true
              },
              {
                vaccine: 'Hepatitis B Recombinant',
                batch: '3-Dose Completed Series',
                date: 'Lifetime Immunity',
                valid: true
              },
              {
                vaccine: 'Tetanus & Diphtheria (Td)',
                batch: 'Toxoid Booster #TT-2024',
                date: 'Valid through Oct 2029',
                valid: true
              }
            ].map((v, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{v.vaccine}</div>
                  <div className="text-[11px] text-slate-500">{v.batch}</div>
                </div>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {v.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
