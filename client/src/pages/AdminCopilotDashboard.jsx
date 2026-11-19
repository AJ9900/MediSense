import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar 
} from 'recharts';
import { 
  Shield, AlertTriangle, Search, Bot, Activity, Sparkles, TrendingUp, Cpu, CheckCircle2 
} from 'lucide-react';
import WhatIfSimulator from '../components/WhatIfSimulator';

export default function AdminCopilotDashboard() {
  const [forecastData, setForecastData] = useState([]);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [loadingCopilot, setLoadingCopilot] = useState(false);

  useEffect(() => {
    API.get('/intelligence/forecast').then(res => setForecastData(res.data.data));
    API.get('/intelligence/bottlenecks').then(res => setBottlenecks(res.data.data));
  }, []);

  const handleCopilotSubmit = async (e) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;

    setLoadingCopilot(true);
    setCopilotResponse(null);

    try {
      const res = await API.post('/intelligence/copilot', { query: copilotQuery });
      setCopilotResponse(res.data.data);
    } catch (err) {
      console.error('Copilot query failed:', err);
    } finally {
      setLoadingCopilot(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-600" />
          Admin Command Center & AI Intelligence Layer
        </h1>
        <p className="text-xs text-slate-500">
          Hospital Demand Forecasting, Real-time Bottleneck Detection, and Controlled AI Copilot Database Querying.
        </p>
      </div>

      {/* 1. HOSPITAL COPILOT NATURAL LANGUAGE QUERY BAR */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
          <h2 className="text-lg font-bold">Hospital AI Copilot</h2>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold border border-purple-400/30">
            Controlled DB Aggregator
          </span>
        </div>

        <form onSubmit={handleCopilotSubmit} className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Ask Copilot: 'How many ICU beds are available?', 'What is the average waiting time?'..."
            value={copilotQuery}
            onChange={(e) => setCopilotQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loadingCopilot || !copilotQuery.trim()}
            className="absolute right-2 top-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
          >
            {loadingCopilot ? 'Querying...' : 'Ask Copilot'}
          </button>
        </form>

        {copilotResponse && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2 text-xs animate-in fade-in">
            <div className="text-purple-300 font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-400" /> Copilot Answer:
            </div>
            <p className="text-white text-sm leading-relaxed">{copilotResponse.answer}</p>
            <div className="text-[10px] text-slate-400 italic pt-1 border-t border-white/10">
              {copilotResponse.disclaimer}
            </div>
          </div>
        )}
      </div>

      {/* 2. WHAT-IF HOSPITAL SIMULATOR */}
      <WhatIfSimulator />

      {/* 3. DEMAND FORECASTING RECHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* OPD Patient Count Forecast */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              OPD Patient Volume Trend & Forecast
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">Recharts ML</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="opdPatients" stroke="#0284c7" fillOpacity={1} fill="url(#colorOpd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Oxygen & Bed Capacity Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Bed Occupancy % Projection
            </h3>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">Analytics</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="bedOccupancy" fill="#9333ea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. AI BOTTLENECK DETECTION ALERTS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Real-Time Operational Bottleneck Alerts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bottlenecks.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl border bg-slate-50 border-slate-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {b.department}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    b.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.severity}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mt-2">{b.message}</h4>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                💡 <strong>AI Suggestion:</strong> {b.suggestion}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
