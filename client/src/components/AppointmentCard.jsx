import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';

export default function AppointmentCard({ onReschedule, onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header & Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Upcoming Appointment
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        </div>

        {/* Doctor Details */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0 shadow-2xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 leading-tight">
              Dr. Sharma
            </h4>
            <p className="text-xs font-semibold text-teal-700">Cardiology Specialist</p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              CarePlus Medical Center • OPD Clinic
            </p>
          </div>
        </div>

        {/* Date & Time Info Pills */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
              <p className="text-xs font-bold text-slate-800">15 Oct 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Time Slot</p>
              <p className="text-xs font-bold text-slate-800">10:30 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onViewDetails}
          className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReschedule}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
        >
          Reschedule
        </button>
      </div>
    </div>
  );
}
