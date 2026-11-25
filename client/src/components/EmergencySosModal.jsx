import React from 'react';
import { Ambulance, X } from 'lucide-react';

export default function EmergencySosModal({ isOpen, onClose, onConfirmSos }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Ambulance className="w-7 h-7" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Emergency Dispatch Protocol
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            Confirm ResQCare SOS Dispatch?
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Triggering this protocol activates immediate hospital emergency pipeline:
          </p>
        </div>

        <div className="space-y-2.5 bg-rose-50/60 border border-rose-100 rounded-2xl p-3.5 mb-5 text-xs text-rose-950">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>Transmits your live GPS coordinates to Ambulance #108.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>Pre-books an acute care bed at City Central Trauma ER.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>Sends emergency alerts with live tracker to your CareCircle.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onConfirmSos();
              onClose();
            }}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Ambulance className="w-4 h-4" />
            Confirm SOS & Dispatch Ambulance
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Cancel / False Alarm
          </button>
        </div>
      </div>
    </div>
  );
}
