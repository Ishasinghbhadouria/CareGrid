import React, { useState } from 'react';
import {
  MapPin,
  Video,
  X
} from 'lucide-react';

export default function BookAppointmentModal({ isOpen, onClose, onBookAppointment }) {
  const [department, setDepartment] = useState('Cardiology');
  const [doctor, setDoctor] = useState('Dr. Sharma');
  const [type, setType] = useState('in-person');
  const [date, setDate] = useState('2026-10-20');
  const [time, setTime] = useState('11:00 AM');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      doctor,
      specialty: department,
      clinic: type === 'video' ? 'CareGrid Telehealth Video Room' : 'CarePlus Medical Center • OPD Clinic',
      date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time,
      type,
      status: 'confirmed'
    };
    onBookAppointment(newAppointment);
    onClose();
  };

  const doctorsByDept = {
    Cardiology: ['Dr. Sharma', 'Dr. Arvind Roy'],
    Dermatology: ['Dr. Ananya Sen'],
    'General Medicine': ['Dr. Rajesh Gupta', 'Dr. Sunita Rao'],
    Orthopedics: ['Dr. Vikram Mehra'],
    Pediatrics: ['Dr. Priya Nair']
  };

  const handleDeptChange = (dept) => {
    setDepartment(dept);
    const available = doctorsByDept[dept] || ['Dr. Specialist'];
    setDoctor(available[0]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Schedule Medical Consultation
            </h3>
            <p className="text-xs text-slate-500">
              Select your department, doctor, and convenient time slot.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Consultation Mode */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('in-person')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'in-person'
                    ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/10'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                Hospital In-Person
              </button>
              <button
                type="button"
                onClick={() => setType('video')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'video'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/10'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <Video className="w-4 h-4 text-blue-600" />
                Telehealth Video
              </button>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Medical Specialty / Department
            </label>
            <select
              value={department}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
            >
              <option value="Cardiology">Cardiology (Heart & Circulation)</option>
              <option value="General Medicine">General Medicine & OPD</option>
              <option value="Dermatology">Dermatology (Skin & Allergy)</option>
              <option value="Orthopedics">Orthopedics (Bones & Joints)</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Attending Physician
            </label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
            >
              {(doctorsByDept[department] || []).map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
              >
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Reason for Consultation (Optional)
            </label>
            <textarea
              rows="2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Regular 6-month blood pressure review or lab report analysis..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
