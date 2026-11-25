import React, { useState } from 'react';
import {
  Shield,
  Phone,
  FileQuestion
} from 'lucide-react';

export default function SettingsHelpView({ initialMode = 'settings' }) {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [autoSms, setAutoSms] = useState(true);
  const [queueAlerts, setQueueAlerts] = useState(true);
  const [shareRecordsWithDoc, setShareRecordsWithDoc] = useState(true);

  const faqs = [
    {
      q: 'How does the CareGrid Virtual OPD Queue work?',
      a: 'When you check into an affiliated hospital OPD, CareGrid issues a digital token. Our system tracks doctor consultation speed and alerts you when your turn approaches, allowing you to wait anywhere comfortably.'
    },
    {
      q: 'What happens when I press ResQCare SOS?',
      a: 'ResQCare immediately broadcasts your high-accuracy GPS coordinates to the nearest available emergency response unit, transmits your allergy and critical medical pass to paramedics, and reserves an acute trauma bed at the designated hospital.'
    },
    {
      q: 'Is my health data private and encrypted?',
      a: 'Yes. CareGrid utilizes AES-256 encryption at rest and TLS 1.3 in transit. You maintain granular control over which records are shared with your doctors and CareCircle members.'
    },
    {
      q: 'Can CareGrid AI replace my attending physician?',
      a: 'No. CareGrid AI is strictly an assistive decision-support and educational tool. It summarizes complex lab reports and suggests clinical questions, but all medical diagnosis and prescriptions remain under the care of certified physicians.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System & Privacy Settings
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'help'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Help Center & FAQs
        </button>
      </div>

      {activeTab === 'settings' ? (
        <div className="space-y-6">
          {/* Privacy & Consent */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Data Privacy & Health Information Exchange
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage how your clinical records and telemetry are shared across hospitals and family.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Consent-Based Doctor Record Sharing
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Allow attending physicians to view past lab reports during active consultations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={shareRecordsWithDoc}
                  onChange={(e) => setShareRecordsWithDoc(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    ResQCare Emergency Telemetry Broadcast
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Automatically transmit allergy flags and blood group to paramedics on SOS.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSms}
                  onChange={(e) => setAutoSms(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Real-time OPD Queue Push Alerts
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Receive instant vibration and sound chime when 2 patients remain ahead.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={queueAlerts}
                  onChange={(e) => setQueueAlerts(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Account & ABHA Credentials */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              National Health Account (ABHA Linked)
            </h3>
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-teal-900">
                  ABHA Address: isha.singh@abdm
                </span>
                <p className="text-[11px] text-teal-700">
                  CareGrid Verified Gateway • SHA-256 Cryptographic Signature
                </p>
              </div>
              <span className="px-3 py-1 bg-white text-teal-800 text-xs font-bold rounded-lg border border-teal-200 shadow-2xs self-start sm:self-auto">
                Connected & Synchronized
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Help Center View */
        <div className="space-y-6">
          {/* Emergency Hotline Banner */}
          <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold">Need Immediate Healthcare Support?</h3>
              <p className="text-xs text-teal-100 mt-0.5">
                CareGrid 24/7 Clinical & Emergency Helpline is always active.
              </p>
            </div>
            <button
              onClick={() => alert('Dialing CareGrid 24/7 Healthcare Helpline: 1800-CARE-GRID...')}
              className="px-4 py-2.5 bg-white text-teal-900 rounded-xl text-xs font-bold shadow-sm hover:bg-teal-50 transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Phone className="w-4 h-4" />
              Call Helpline (1800-CARE-GRID)
            </button>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-teal-600" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                >
                  <h4 className="text-xs font-bold text-slate-900">{faq.q}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
