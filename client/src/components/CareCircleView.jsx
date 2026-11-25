import React, { useState } from 'react';
import {
  UserPlus,
  Phone,
  X
} from 'lucide-react';

export default function CareCircleView() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRelation, setInviteRelation] = useState('Family');
  const [inviteAccess, setInviteAccess] = useState('Vitals & Appointments');

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Rajesh Singh',
      relation: 'Father',
      role: 'Primary Guardian & Emergency Proxy',
      access: 'Full Access (Records, Prescriptions, SOS)',
      avatar: 'RS',
      phone: '+91 98110-12345',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Aditya Vyas',
      relation: 'Co-Caregiver',
      role: 'Daily Adherence Coordinator',
      access: 'Medications & Vitals Sync',
      avatar: 'AV',
      phone: '+91 98220-67890',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Dr. Sharma',
      relation: 'Specialist',
      role: 'Primary Cardiologist',
      access: 'Clinical Records & E-Prescription Signing',
      avatar: 'DS',
      phone: '+91 98330-99887',
      status: 'Verified Clinician'
    },
    {
      id: 4,
      name: 'Priya Singh',
      relation: 'Sister',
      role: 'Family Ally',
      access: 'View Appointments & Daily Vitals',
      avatar: 'PS',
      phone: '+91 98440-11223',
      status: 'Active'
    }
  ]);

  const activities = [
    {
      id: 1,
      author: 'Aditya Vyas',
      action: 'marked Morning Metformin 500mg as taken',
      time: 'Today, 08:32 AM',
      type: 'med'
    },
    {
      id: 2,
      author: 'Dr. Sharma',
      action: 'uploaded 12-lead ECG review and scheduled follow-up',
      time: 'Yesterday, 04:15 PM',
      type: 'clinical'
    },
    {
      id: 3,
      author: 'Rajesh Singh',
      action: 'confirmed OPD consultation at CarePlus Hospital for Oct 15',
      time: 'Oct 11, 02:40 PM',
      type: 'appointment'
    },
    {
      id: 4,
      author: 'CareGrid System',
      action: 'synced resting heart rate 72 bpm to CareCircle dashboard',
      time: 'Oct 10, 09:00 AM',
      type: 'vitals'
    }
  ];

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!inviteName) return;
    const initials = inviteName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    const newMember = {
      id: Date.now(),
      name: inviteName,
      relation: inviteRelation,
      role: `${inviteRelation} Member`,
      access: inviteAccess,
      avatar: initials || 'CM',
      phone: '+91 98990-00000',
      status: 'Invitation Sent'
    };
    setMembers([newMember, ...members]);
    setIsInviteOpen(false);
    setInviteName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              CareCircle Collaborative Network
            </h2>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {members.length} Connected Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Keep family members, trusted caregivers, and attending physicians synchronized on your health journey.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Invite CareCircle Member
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700">{member.role}</p>
                    <p className="text-[11px] text-slate-400">{member.relation}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === 'Verified Clinician'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : member.status === 'Invitation Sent'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {/* Permissions pill */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider mb-0.5">
                  Permissions Granted:
                </span>
                {member.access}
              </div>
            </div>

            {/* Quick action footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{member.phone}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Calling ${member.name} (${member.phone})...`)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Call Member"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => alert(`Opening encrypted CareCircle chat with ${member.name}...`)}
                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold rounded-lg text-[11px] transition-colors"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared CareCircle Activity Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Shared Care Timeline & Feed
            </h3>
            <p className="text-xs text-slate-500">
              Audit trail of actions, vitals updates, and medication logs by your circle.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Live Audit Trail</span>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-slate-900">{act.author} </span>
                <span className="text-slate-600">{act.action}.</span>
                <div className="text-[11px] text-slate-400 mt-0.5">{act.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Invite New CareCircle Member
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Priya Sen or Ramesh Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Relationship / Role
                </label>
                <select
                  value={inviteRelation}
                  onChange={(e) => setInviteRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
                >
                  <option value="Family">Family Member</option>
                  <option value="Caregiver">Caregiver / Nurse</option>
                  <option value="Specialist">Attending Doctor / Specialist</option>
                  <option value="Emergency Contact">Emergency Proxy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Access Level
                </label>
                <select
                  value={inviteAccess}
                  onChange={(e) => setInviteAccess(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
                >
                  <option value="Vitals & Appointments">View Vitals & Appointments Only</option>
                  <option value="Medications & Vitals Sync">Medications & Vitals Sync</option>
                  <option value="Full Access (Records, Prescriptions, SOS)">Full Access (Records, Prescriptions, SOS)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
