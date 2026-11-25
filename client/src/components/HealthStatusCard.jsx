import React from 'react';
import { ShieldCheck, FileCheck, Clock, Lock } from 'lucide-react';

export default function HealthStatusCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Health Information
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Verified Profile
          </span>
        </div>

        {/* Card Title */}
        <div className="mb-4">
          <h4 className="text-lg font-bold text-slate-900 leading-tight">
            Your Care Records Status
          </h4>
          <p className="text-xs text-slate-500">
            Centralized management of health history and prescriptions.
          </p>
        </div>

        {/* Status List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-semibold text-slate-700">Medical Records</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Up to date
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-semibold text-slate-700">Last Record Updated</span>
            </div>
            <span className="text-xs font-bold text-slate-800">Today, 08:30 AM</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-semibold text-slate-700">Privacy Control</span>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Patient Controlled
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>12 documents available</span>
        <span className="text-slate-400 font-semibold">Secure Health Storage</span>
      </div>
    </div>
  );
}
