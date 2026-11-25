import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  Lightbulb,
  Building2,
  Stethoscope,
  Activity,
  Bed,
  Ambulance,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function AiAssistantView({
  currentUser = { name: 'Dr. Kedar Dharmatti', role: 'admin' }
}) {
  const getInitialGreeting = () => {
    if (currentUser?.role === 'admin') {
      return {
        text: `Hello ${currentUser.name}! I am your CareGrid Hospital Operations & Clinical Copilot. I have real-time telemetry across your 400 inpatient beds (88% occupied), 45 ICU beds (3 ventilators free), 4 active OPD chambers, and 8 GPS-connected ResQCare ambulances.\n\nHow can I assist hospital administration and triage management today?`,
        prompts: [
          'Forecast ICU bed surge for next 12 hours',
          'Summarize OPD wait times across chambers',
          'Analyze ResQCare ambulance fleet deployment',
          'Review trauma ER bay protocol and surgical OT'
        ]
      };
    }
    if (currentUser?.role === 'doctor') {
      return {
        text: `Hello ${currentUser.name}! I am your Clinical Decision Support AI. I am synchronized with your Chamber 3B OPD queue (#GEN-39 now in consultation), today's 24 scheduled consultations, and ABDM drug interaction protocols.\n\nHow can I support your clinical diagnostics today?`,
        prompts: [
          'Check drug interactions: Metformin + Atorvastatin',
          'Differential diagnosis for atypical exertional chest pain',
          'ICMR guideline: Stage-2 hypertension in senior patients',
          'Summarize patient Isha Singh (CG-PAT-9021) vitals'
        ]
      };
    }
    // Patient / Caretaker
    return {
      text: `Hello ${currentUser.name}! I am your CareGrid Personal AI Health Assistant. I have context on your verified medical records, active prescriptions (Metformin 500mg, Vitamin D3), and upcoming consultation with Dr. Sharma on Oct 15.\n\nHow can I help you today?`,
      prompts: [
        'Summarize my latest lipid panel report',
        'What should I ask Dr. Sharma on Oct 15?',
        'Explain the dosing directions for Metformin',
        'Are my resting vitals in the normal range?'
      ]
    };
  };

  const initialConfig = getInitialGreeting();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: initialConfig.text,
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const msgIdRef = useRef(100);
  const messagesEndRef = useRef(null);

  const quickPrompts = initialConfig.prompts;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (userText) => {
    const textToSend = userText || inputValue;
    if (!textToSend.trim()) return;

    msgIdRef.current += 1;
    const currentId = msgIdRef.current;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: currentId,
      sender: 'user',
      text: textToSend,
      time: nowTime
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userText) setInputValue('');
    setIsTyping(true);

    // Contextual responses based on Role and Query
    setTimeout(() => {
      let botResponse = '';
      const lower = textToSend.toLowerCase();

      // ADMIN QUERIES
      if (currentUser?.role === 'admin') {
        if (lower.includes('icu') || lower.includes('bed') || lower.includes('surge') || lower.includes('occupancy')) {
          botResponse =
            '**Hospital Bed Telemetry & Surge Forecast (Next 12 Hours):**\n\n' +
            '- **ICU Occupancy:** 42 of 45 beds (93.3% • Critical Surge threshold)\n' +
            '- **Ventilator Availability:** 3 units available on 3rd Floor (Hamilton-T1 & Servo-air)\n' +
            '- **General Wards:** 187 of 200 beds (93.5%)\n' +
            '- **High Dependency Unit (HDU):** 28 of 30 beds (93.3%)\n' +
            '- **Trauma ER Bays:** 8 of 10 bays active (Bay #01 reserved for inbound Unit #108)\n\n' +
            '**Operational Recommendation:** Recommend expediting step-down transfers for 4 stable post-CABG patients from ICU to HDU Ward to buffer 4 additional emergency beds for evening intake.';
        } else if (lower.includes('opd') || lower.includes('wait') || lower.includes('queue') || lower.includes('chamber')) {
          botResponse =
            '**OPD Footfall & Chamber Load Summary:**\n\n' +
            '- **Total Registered Today:** 142 Patients across 4 Specialty Chambers\n' +
            '- **Chamber 3B (General Medicine):** Dr. Rajesh Gupta • Serving #GEN-39 • 5 in line (Avg: 6m/pt)\n' +
            '- **Chamber 4A (Cardiology):** Dr. Arvind Sharma • Serving #CARD-18 • 6 in line (Avg: 9m/pt)\n' +
            '- **Chamber 2A (Pediatrics):** Dr. Meenakshi Sundaram • Serving #PED-27 • 3 in line (Avg: 7m/pt)\n' +
            '- **Chamber 1B (Orthopedics):** Dr. Vikramaditya Rathore • Serving #ORTH-14 • 4 in line (Avg: 8m/pt)\n\n' +
            '**Queue Health:** Smooth velocity. Zero chamber backlogs exceeding 30 minutes.';
        } else if (lower.includes('ambulance') || lower.includes('fleet') || lower.includes('resqcare') || lower.includes('dispatch')) {
          botResponse =
            '**ResQCare Ambulance Fleet Status:**\n\n' +
            '- **Total Fleet:** 8 Units deployed with live GPS telemetry\n' +
            '- **Unit #108 (ACLS):** En route to Vijay Nagar scene (ETA: ~4.5 mins, Speed: 52 km/h, Green Corridor signal priority active)\n' +
            '- **Unit #104 (ACLS):** Currently at CarePlus ER Bay 2 performing patient handoff\n' +
            '- **Units #101, #102, #103, #105, #106, #107:** 6 units on active base standby with 100% medical oxygen reservoirs\n\n' +
            '**Fleet Readiness:** 100% operational capability.';
        } else {
          botResponse =
            `**Hospital Command Telemetry Analysis:**\n\nRegarding "${textToSend}": All hospital systems are operating normally. Hospital emergency trauma teams are mobilized, bed capacity is at 88%, and digital ABDM FHIR synchronizations are verified with 0 dropped packets.\n\nWould you like me to generate a printable executive shift report for the Director's desk?`;
        }
      }
      // DOCTOR QUERIES
      else if (currentUser?.role === 'doctor') {
        if (lower.includes('interaction') || lower.includes('metformin') || lower.includes('atorvastatin') || lower.includes('drug')) {
          botResponse =
            '**ABDM Clinical Drug Interaction Analysis:**\n\n' +
            '- **Pair:** Metformin 500mg + Atorvastatin 10mg\n' +
            '- **Severity Level:** Minor / Safe (No clinically significant pharmacokinetic interactions)\n' +
            '- **Mechanism:** Metformin operates on hepatic gluconeogenesis and peripheral insulin sensitivity via AMPK; Atorvastatin inhibits HMG-CoA reductase. Pathways do not compete for primary CYP3A4 clearance.\n' +
            '- **Monitoring:** Periodic HbA1c and baseline liver transaminases (ALT/AST). Patient’s latest liver panel from Oct 01 was normal (ALT 24 U/L, AST 21 U/L).\n\n' +
            '**Recommendation:** Safe to prescribe concurrently as targeted for dyslipidemia and metabolic control.';
        } else if (lower.includes('differential') || lower.includes('chest pain') || lower.includes('angina')) {
          botResponse =
            '**Differential Diagnosis Protocol for Atypical Exertional Chest Pain:**\n\n' +
            '1. **Unstable Angina / Non-STEMI:** Evaluate serial Troponin-I at 0 and 3 hours, 12-lead ECG for dynamic ST-T wave changes.\n' +
            '2. **Microvascular Angina:** Consider stress echocardiography or CT coronary angiography if resting ECG is unremarkable.\n' +
            '3. **Gastroesophageal Reflux Disease (GERD) / Esophageal Spasm:** Rule out post-prandial correlation, especially when concurrent with biguanide therapy.\n' +
            '4. **Musculoskeletal (Costochondritis):** Palpate parasternal costochondral junctions.\n\n' +
            '**Patient Context:** Patient has no history of smoking, normal resting ECG from Sep 18, and LDL at 98 mg/dL.';
        } else {
          botResponse =
            `**Clinical Decision Support Note:**\n\nRegarding your query on "${textToSend}": Correlating this with current ICMR and ACC/AHA clinical protocols. Patient records, recent ECG traces, and lab panels are accessible in the Medical Records Vault.\n\nWould you like me to draft an E-Prescription template for this case?`;
        }
      }
      // PATIENT QUERIES
      else {
        if (lower.includes('lipid') || lower.includes('cholesterol') || lower.includes('blood test')) {
          botResponse =
            '**Summary of your Lipid Profile (01 Oct 2026):**\n\n' +
            '- **Total Cholesterol:** 185 mg/dL (Desirable: < 200 mg/dL)\n' +
            '- **HDL ("Good"):** 54 mg/dL (Healthy: > 50 mg/dL)\n' +
            '- **LDL ("Bad"):** 98 mg/dL (Optimal: < 100 mg/dL)\n' +
            '- **Triglycerides:** 130 mg/dL (Normal: < 150 mg/dL)\n\n' +
            '**Clinical Takeaway:** Your lipid levels have improved significantly compared to last year. Your regular brisk walking and dietary adjustments are yielding positive cardiovascular biomarkers.';
        } else if (lower.includes('sharma') || lower.includes('ask') || lower.includes('oct 15') || lower.includes('appointment')) {
          botResponse =
            'Here are 3 recommended questions for your cardiology follow-up with **Dr. Sharma on Oct 15 at 10:30 AM**:\n\n' +
            '1. *"Given that my resting heart rate (72 bpm) and ECG are normal, should I continue the same Metformin dose?"*\n' +
            '2. *"My latest lipid report shows LDL at 98 mg/dL. Does this meet our primary cardiovascular target?"*\n' +
            '3. *"Are there any specific aerobic heart-rate zones I should target during my morning workouts?"*';
        } else if (lower.includes('metformin') || lower.includes('dose') || lower.includes('medicine')) {
          botResponse =
            '**Metformin 500mg Guidance:**\n\n' +
            '- **Prescribed Regimen:** Twice daily (Morning & Night) taken with or immediately after meals to minimize gastrointestinal discomfort.\n' +
            '- **Storage:** Room temperature, away from moisture.\n' +
            '- **Allergy Check:** No contraindications found with your logged Penicillin allergy.\n\n' +
            '*Note: Always notify Dr. Sharma if you experience sustained nausea or unusual fatigue.*';
        } else if (lower.includes('vital') || lower.includes('bp') || lower.includes('heart rate')) {
          botResponse =
            '**Current Vitals Status:**\n\n' +
            '- **Heart Rate:** 72 bpm (Resting normal is 60–100 bpm)\n' +
            '- **Blood Pressure:** 120/80 mmHg (Normal physiological baseline)\n' +
            '- **SpO2:** 99% (Optimal oxygen saturation)\n' +
            '- **Fasting Glucose:** 92 mg/dL (Normal fasting range: 70–99 mg/dL)\n\n' +
            'All metrics are well within safe thresholds.';
        } else {
          botResponse =
            `Thank you for asking about that. Based on your CareGrid profile, your general wellness biomarkers remain stable. \n\nI have logged your query in your personal health journal. For specific medical diagnosis, medication adjustments, or acute symptoms, please consult Dr. Sharma during your consultation or use the ResQCare emergency service.`;
        }
      }

      msgIdRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: msgIdRef.current,
          sender: 'assistant',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {currentUser?.role === 'admin'
                  ? 'CareGrid Hospital Operations AI Copilot'
                  : currentUser?.role === 'doctor'
                  ? 'CareGrid Clinical Decision Support AI'
                  : 'CareGrid Personal Health AI Assistant'}
              </h1>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Cpu className="w-3 h-3 inline mr-1 text-amber-600" />
                EHR & Telemetry Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.role === 'admin'
                ? 'Real-time bed surge forecasting, ambulance CAD routing, and hospital queue load analytics.'
                : currentUser?.role === 'doctor'
                ? 'Clinical guidelines, drug-drug interaction screening, and differential diagnostic assistance.'
                : 'Intelligent health record summarization, medication explanations, and visit preparation.'}
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-400 font-medium">Context Horizon</span>
          <div className="text-xs font-bold text-slate-800">
            {currentUser?.role === 'admin'
              ? '400 Beds • 8 Ambulances • 4 Chambers'
              : currentUser?.role === 'doctor'
              ? 'Chamber 3B • 24 Patients • Rx Vault'
              : '12 Records & Vitals Linked'}
          </div>
        </div>
      </div>

      {/* Clinical & Compliance Notice */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-amber-900 leading-relaxed">
          <strong>AI Copilot Advisory: </strong> CareGrid AI is an augmentation tool that analyzes live telemetry, structured electronic health records, and clinical guidelines. For acute medical emergencies, dispatch <strong>ResQCare SOS</strong> immediately.
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white font-bold text-xs'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 font-medium ${
                    msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 rounded-tl-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>CareGrid AI is analyzing EHR telemetry and medical knowledge base...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-800 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentUser?.role === 'admin'
                  ? 'Ask about ICU surge forecast, bed admissions, OPD load, or fleet routing...'
                  : currentUser?.role === 'doctor'
                  ? 'Ask about clinical guidelines, drug-drug interactions, or patient lab panels...'
                  : 'Ask about your lab reports, prescriptions, or doctor follow-up...'
              }
              className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-2xl shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
