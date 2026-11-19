import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Layers, CheckCircle2, Clock, MapPin, ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';

export default function DigitalTwinTimeline() {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJourney();
  }, []);

  const fetchJourney = async () => {
    try {
      const res = await API.get('/journey/patient');
      setJourney(res.data.data);
    } catch (err) {
      console.error('Failed to fetch patient journey timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStep = async () => {
    if (!journey) return;
    try {
      const res = await API.put(`/journey/${journey._id}/advance`);
      setJourney(res.data.data);
    } catch (err) {
      console.error('Failed to advance journey step:', err);
    }
  };

  if (loading) {
    return <div className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-48"></div>;
  }

  if (!journey || !journey.steps) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Timeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase tracking-wide">
            Patient Journey Digital Twin
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            Live Hospital Orchestration Timeline
          </h2>
          <p className="text-xs text-slate-500">
            Journey ID: <strong className="font-mono text-slate-800">{journey.journeyId}</strong> • Estimated Exit Time: <strong className="text-emerald-600">{journey.estimatedExitTime}</strong>
          </p>
        </div>

        <button
          onClick={handleAdvanceStep}
          disabled={journey.isCompleted}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Advance Journey Step</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Step-by-Step Interactive Progression Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {journey.steps.map((step, idx) => {
            const isCurrent = idx === journey.currentStepIndex && !journey.isCompleted;
            const isDone = step.status === 'COMPLETED';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20 shadow-md'
                    : isDone
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">Step #{idx + 1}</span>
                    {isDone ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : isCurrent ? (
                      <span className="text-purple-700 text-xs font-bold flex items-center gap-1 animate-pulse">
                        <PlayCircle className="w-3.5 h-3.5" /> In Progress
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">Pending</span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{step.stepName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{step.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Est Time: <strong>{step.estimatedTime}</strong></span>
                  {step.actualTime && <span className="text-emerald-600 font-bold">Act: {step.actualTime}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
