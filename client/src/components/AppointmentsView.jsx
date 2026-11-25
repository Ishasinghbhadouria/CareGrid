import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function AppointmentsView({
  onOpenBookAppointment,
  appointments,
  setAppointments
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'upcoming' && apt.status === 'confirmed') ||
      (filter === 'completed' && apt.status === 'completed') ||
      (filter === 'cancelled' && apt.status === 'cancelled');

    const matchesSearch =
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.clinic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Consultations & Appointments
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your in-person hospital visits and virtual telehealth consultations.
          </p>
        </div>

        <button
          onClick={onOpenBookAppointment}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Book New Consultation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Consultations' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Past / Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor, clinic or specialty..."
            className="w-full pl-9 pr-3 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No appointments found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no appointments matching your current filter criteria.
            </p>
            <button
              onClick={onOpenBookAppointment}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with Type & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      apt.type === 'video'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                  >
                    {apt.type === 'video' ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        Telehealth Video
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        Hospital In-Person
                      </>
                    )}
                  </span>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : apt.status === 'completed'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {apt.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {apt.status === 'cancelled' && <XCircle className="w-3 h-3 text-rose-600" />}
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>

                {/* Doctor Info */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                    {apt.doctor
                      .replace('Dr. ', '')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {apt.doctor}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700">{apt.specialty}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {apt.clinic}
                    </p>
                  </div>
                </div>

                {/* Date & Time pill */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Date</div>
                      <div className="text-xs font-bold text-slate-800">{apt.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Time</div>
                      <div className="text-xs font-bold text-slate-800">{apt.time}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {apt.status === 'confirmed' ? (
                  <>
                    {apt.type === 'video' ? (
                      <button
                        onClick={() => alert(`Starting video consultation with ${apt.doctor}...`)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Call
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Directions to ${apt.clinic}: Room 3B, CarePlus OPD Clinic.`)}
                        className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Get Directions
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onOpenBookAppointment}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Rebook Consultation
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Featured Department Specialists */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Top Available Hospital Specialists
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Instant slot verification with automated EHR coordination.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              name: 'Dr. Rajesh Gupta',
              specialty: 'Internal Medicine',
              exp: '14 yrs exp',
              rating: '4.9 ★',
              slot: 'Today, 2:30 PM'
            },
            {
              name: 'Dr. Ananya Sen',
              specialty: 'Dermatology & Allergy',
              exp: '9 yrs exp',
              rating: '4.8 ★',
              slot: 'Tomorrow, 11:00 AM'
            },
            {
              name: 'Dr. Vikram Mehra',
              specialty: 'Orthopedic Surgery',
              exp: '18 yrs exp',
              rating: '4.9 ★',
              slot: 'Wed, 4:00 PM'
            }
          ].map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {doc.rating}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{doc.exp}</span>
                </div>
                <div className="text-sm font-bold text-slate-900">{doc.name}</div>
                <div className="text-xs text-teal-700 font-semibold">{doc.specialty}</div>
                <div className="text-[11px] text-slate-500 mt-2">Available: {doc.slot}</div>
              </div>
              <button
                onClick={onOpenBookAppointment}
                className="mt-3 w-full py-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-teal-800 text-xs font-bold rounded-lg transition-colors"
              >
                Select Slot
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
