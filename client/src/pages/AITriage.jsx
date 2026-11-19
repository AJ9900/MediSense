import React, { useState } from 'react';
import API from '../services/api';
import { HeartPulse, AlertTriangle, ShieldCheck, ArrowRight, Activity, CheckCircle2, Stethoscope, Sparkles } from 'lucide-react';

export default function AITriage({ onSelectDepartment }) {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setTriageResult(null);

    try {
      const response = await API.post('/ai/triage', {
        symptoms,
        age: age ? parseInt(age) : undefined
      });
      setTriageResult(response.data.data);
    } catch (err) {
      console.error('Triage request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> 🔴 CRITICAL EMERGENCY</span>;
      case 'HIGH':
        return <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> 🟠 HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">🟡 MEDIUM PRIORITY</span>;
      default:
        return <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">🟢 NORMAL / OPD</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-sky-600" />
          AI Patient Intake & Triage Engine
        </h1>
        <p className="text-xs text-slate-500">
          Enter your current health symptoms for preliminary prioritization and automated department recommendation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleTriageSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Describe Your Symptoms</label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Severe chest pain, shortness of breath, dizziness..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Age (Optional)</label>
              <input
                type="number"
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !symptoms.trim()}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Analyzing Symptoms...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Run AI Triage Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Result Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          {!triageResult ? (
            <div className="my-auto text-center py-8 space-y-2">
              <HeartPulse className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Awaiting Symptom Input</h3>
              <p className="text-xs text-slate-500">Fill in your symptoms on the left to receive AI triage prioritization.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-400 font-semibold">Triage Classification</span>
                {getPriorityBadge(triageResult.priorityLevel)}
              </div>

              {triageResult.isEmergency && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 animate-bounce" />
                  <span>CRITICAL EMERGENCY: Please report immediately to the Emergency Room / Cardiology desk!</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-xs text-slate-500">Recommended Department:</div>
                <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-sky-600" />
                  <span>{triageResult.recommendedDepartment}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {triageResult.triageReason}
                </p>
              </div>

              {/* Non-diagnostic Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-tight italic flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{triageResult.disclaimer}</span>
              </div>

              {onSelectDepartment && (
                <button
                  onClick={() => onSelectDepartment(triageResult.recommendedDepartment)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2"
                >
                  <span>Book Doctor in {triageResult.recommendedDepartment}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
