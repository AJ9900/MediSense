import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Sliders, Activity, Clock, Bed, Gauge, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function WhatIfSimulator() {
  const [loadPercent, setLoadPercent] = useState(20); // Default +20%
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runSimulation(loadPercent);
  }, [loadPercent]);

  const runSimulation = async (pct) => {
    setLoading(true);
    try {
      const res = await API.post('/intelligence/simulator', { loadIncreasePercent: pct });
      setSimResult(res.data.data);
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase tracking-wide">
            Parametric Stress Testing
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600" />
            What-If Hospital Load Simulator
          </h2>
          <p className="text-xs text-slate-500">
            Simulate operational impact on Beds, Oxygen, and Waiting Times if tomorrow's patient surge increases.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-purple-900">Surge Factor: +{loadPercent}%</span>
        </div>
      </div>

      {/* Interactive Slider Bar */}
      <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Baseline Load (0%)</span>
          <span className="text-purple-700 text-sm">Simulating +{loadPercent}% Patient Surge</span>
          <span>Max Surge (+50%)</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={loadPercent}
          onChange={(e) => setLoadPercent(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Simulation Output Metrics Grid */}
      {simResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">OPD Patient Load</span>
              <div className="text-2xl font-black text-slate-900">{simResult.simulatedOpd}</div>
              <div className="text-[11px] text-slate-500">Base: {simResult.baseOpd} patients (+{simResult.simulatedOpd - simResult.baseOpd})</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Waiting Time</span>
              <div className="text-2xl font-black text-amber-600">{simResult.simulatedWaitMinutes} mins</div>
              <div className="text-[11px] text-slate-500">Base: {simResult.baseWaitMinutes} mins (+{simResult.simulatedWaitMinutes - simResult.baseWaitMinutes}m)</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bed Occupancy %</span>
              <div className="text-2xl font-black text-purple-600">{simResult.simulatedBedOccupancy}%</div>
              <div className="text-[11px] text-slate-500">Base: {simResult.baseBedOccupancy}% occupancy</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Oxygen Consumption</span>
              <div className="text-2xl font-black text-sky-600">{simResult.simulatedOxygenConsumption} L/m</div>
              <div className="text-[11px] text-slate-500">Base: {simResult.baseOxygenConsumption} Liters/min</div>
            </div>

          </div>

          {/* AI Operational Preparation Advice */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-purple-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Recommended Operational Preparations for +{loadPercent}% Surge:</span>
            </div>
            <ul className="list-disc list-inside text-purple-800 space-y-1 pl-1">
              {simResult.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
