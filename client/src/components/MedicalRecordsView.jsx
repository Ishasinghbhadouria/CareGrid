import React, { useState } from 'react';
import {
  FileText,
  Search,
  Upload,
  Download,
  Share2,
  Eye,
  ShieldCheck,
  Sparkles,
  Calendar,
  User,
  Building,
  X,
  Lock
} from 'lucide-react';

export default function MedicalRecordsView({ onOpenUploadRecord }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDocument, setPreviewDocument] = useState(null);

  const records = [
    {
      id: 1,
      title: 'Lipid Profile & Comprehensive Metabolic Panel',
      category: 'lab',
      date: '01 Oct 2026',
      doctor: 'Dr. Sharma',
      hospital: 'CarePlus Diagnostic Lab',
      fileType: 'PDF',
      fileSize: '1.4 MB',
      verified: true,
      aiSummary:
        'Cholesterol (185 mg/dL) and Triglycerides (130 mg/dL) within normal thresholds. Liver enzymes (ALT/AST) normal. Kidney creatinine stable at 0.9 mg/dL.',
      details: [
        { label: 'Total Cholesterol', val: '185 mg/dL', status: 'Normal' },
        { label: 'HDL (Good)', val: '54 mg/dL', status: 'Optimal' },
        { label: 'LDL (Bad)', val: '98 mg/dL', status: 'Normal' },
        { label: 'Fasting Glucose', val: '92 mg/dL', status: 'Normal' },
      ]
    },
    {
      id: 2,
      title: 'Digital 12-Lead Electrocardiogram (ECG)',
      category: 'imaging',
      date: '18 Sep 2026',
      doctor: 'Dr. Sharma',
      hospital: 'Metro Heart Institute',
      fileType: 'PDF',
      fileSize: '3.2 MB',
      verified: true,
      aiSummary:
        'Normal sinus rhythm at 72 bpm. PR interval (150ms) and QTc (410ms) within normal parameters. No evidence of ischemia or acute ST elevation.',
      details: [
        { label: 'Heart Rate', val: '72 bpm', status: 'Normal' },
        { label: 'Rhythm', val: 'Sinus Rhythm', status: 'Normal' },
        { label: 'PR Interval', val: '150 ms', status: 'Normal' },
        { label: 'Axis', val: 'Normal Axis', status: 'Normal' },
      ]
    },
    {
      id: 3,
      title: 'Clinical Prescription & Care Regimen',
      category: 'prescription',
      date: '15 Sep 2026',
      doctor: 'Dr. Rajesh Gupta',
      hospital: 'City CarePlus OPD',
      fileType: 'PDF',
      fileSize: '850 KB',
      verified: true,
      aiSummary:
        'Prescribed Metformin 500mg (twice daily with meals) and Vitamin D3 (60k IU weekly for 8 weeks). Follow-up recommended in 30 days.',
      details: [
        { label: 'Rx Item 1', val: 'Metformin 500mg BID', status: 'Active' },
        { label: 'Rx Item 2', val: 'Vitamin D3 60,000 IU', status: 'Active' },
        { label: 'Dietary Note', val: 'Low glycemic index', status: 'Advisory' },
        { label: 'Duration', val: '30 Days Refill', status: 'Active' },
      ]
    },
    {
      id: 4,
      title: 'High-Resolution Chest Radiograph (X-Ray PA View)',
      category: 'imaging',
      date: '02 Aug 2026',
      doctor: 'Dr. Mehra',
      hospital: 'City Central Radiology',
      fileType: 'DICOM/PDF',
      fileSize: '4.8 MB',
      verified: true,
      aiSummary:
        'Bilateral lung fields clear. Normal cardiothoracic ratio. No focal consolidation, pneumothorax, or pleural effusion noted.',
      details: [
        { label: 'Lung Fields', val: 'Clear Bilaterally', status: 'Normal' },
        { label: 'Cardiac Silhouette', val: 'Normal Size', status: 'Normal' },
        { label: 'Costophrenic Angles', val: 'Sharp / Clear', status: 'Normal' },
      ]
    },
    {
      id: 5,
      title: 'Annual Health Checkup & Discharge Summary',
      category: 'discharge',
      date: '10 May 2026',
      doctor: 'Dr. Ananya Sen',
      hospital: 'National Health Center',
      fileType: 'PDF',
      fileSize: '2.1 MB',
      verified: true,
      aiSummary:
        'Comprehensive baseline evaluation. Vitals normal, allergy profile updated for Penicillin. Patient cleared for routine aerobic exercise.',
      details: [
        { label: 'General Condition', val: 'Stable & Healthy', status: 'Normal' },
        { label: 'Allergies Logged', val: 'Penicillin Flagged', status: 'Alert' },
        { label: 'Physical Activity', val: 'Cleared (Aerobic)', status: 'Optimal' },
      ]
    }
  ];

  const filteredRecords = records.filter((rec) => {
    const matchesCategory =
      selectedCategory === 'all' || rec.category === selectedCategory;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Medical Records & EHR Vault
            </h2>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <Lock className="w-3 h-3 inline mr-1" />
              End-to-End Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized digital repository for your lab reports, prescriptions, scans, and AI summaries.
          </p>
        </div>

        <button
          onClick={onOpenUploadRecord}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Upload className="w-4 h-4" />
          Upload Health Record
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Records (5)' },
            { id: 'lab', label: 'Lab Reports' },
            { id: 'prescription', label: 'Prescriptions' },
            { id: 'imaging', label: 'Scans & X-Rays' },
            { id: 'discharge', label: 'Summaries' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, doctor, lab..."
            className="w-full pl-9 pr-3 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Records Grid */}
      <div className="space-y-3.5">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Icon and Details */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    {rec.title}
                  </h3>
                  {rec.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Hospital Verified
                    </span>
                  )}
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {rec.fileType} • {rec.fileSize}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {rec.doctor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {rec.hospital}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {rec.date}
                  </span>
                </div>

                {/* AI Summary Highlight Box */}
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 mt-2 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-amber-900 font-semibold">AI Insights: </strong>
                    {rec.aiSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:flex-col lg:flex-row shrink-0 self-end md:self-center">
              <button
                onClick={() => setPreviewDocument(rec)}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View Details
              </button>
              <button
                onClick={() => alert(`Downloading ${rec.title} (${rec.fileSize})...`)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Shared ${rec.title} with your registered CareCircle caregivers.`)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Share Document"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Details Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {previewDocument.fileType} Document Preview
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {previewDocument.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Issued by {previewDocument.doctor} • {previewDocument.hospital} on {previewDocument.date}
                </p>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Summary Highlight */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  CareGrid AI Clinical Interpretation
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {previewDocument.aiSummary}
              </p>
            </div>

            {/* Extracted Biomarkers / Key Findings */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Extracted Biomarkers & Test Parameters
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {previewDocument.details.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.label}</div>
                      <div className="text-xs font-bold text-slate-900">{item.val}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Alert'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>
                Cryptographically signed with SHA-256 by CarePlus Hospital Digital Health Authority.
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading original ${previewDocument.fileType}...`);
                  setPreviewDocument(null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download Original File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
