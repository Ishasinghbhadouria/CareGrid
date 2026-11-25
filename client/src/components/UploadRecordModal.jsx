import React, { useState } from 'react';
import { Upload, X, Sparkles } from 'lucide-react';

export default function UploadRecordModal({ isOpen, onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('lab');
  const [doctor, setDoctor] = useState('Dr. Sharma');
  const [hospital, setHospital] = useState('CarePlus Diagnostics');
  const [enableAiSummary, setEnableAiSummary] = useState(true);
  const [fileName] = useState('CBC_Lipid_Panel_Report.pdf');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onUploadSuccess({
      title,
      category,
      doctor,
      hospital,
      fileName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Upload Health Record or Scan
            </h3>
            <p className="text-xs text-slate-500">
              Files are encrypted with AES-256 and stored in your private vault.
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
          {/* File Upload Drop Area */}
          <div className="border-2 border-dashed border-teal-200 rounded-2xl p-6 text-center bg-teal-50/40 hover:bg-teal-50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">
              {fileName ? fileName : 'Click to select or drag and drop files here'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Supports PDF, DICOM, JPG, PNG (Max 25 MB)
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Record / Test Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Thyroid Panel (TSH, Free T4) or Abdominal Ultrasound"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
              >
                <option value="lab">Lab Diagnostics</option>
                <option value="prescription">Prescription</option>
                <option value="imaging">Radiology / Imaging</option>
                <option value="discharge">Discharge Summary</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ordering Doctor
              </label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Healthcare Facility / Laboratory
            </label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
            />
          </div>

          {/* AI Extraction Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
            <input
              type="checkbox"
              id="ai-summary"
              checked={enableAiSummary}
              onChange={(e) => setEnableAiSummary(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
            />
            <label htmlFor="ai-summary" className="text-xs text-slate-700 cursor-pointer">
              <strong className="text-amber-900 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Enable CareGrid AI Extraction:
              </strong>
              Automatically extract biomarkers, reference ranges, and plain-language summary.
            </label>
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
              Upload & Secure File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
