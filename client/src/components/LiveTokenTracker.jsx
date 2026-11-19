import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Ticket, Clock, Users, Bell, MapPin, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LiveTokenTracker() {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientToken();
    // Poll queue status every 10 seconds for live token updates
    const interval = setInterval(fetchPatientToken, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPatientToken = async () => {
    try {
      const response = await API.get('/queue/patient');
      setTokenData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch patient token tracker:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-36"></div>;
  }

  if (!tokenData || !tokenData.token) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">No Active Waiting Token</h3>
            <p className="text-xs text-slate-500">Book an OPD appointment to generate your live digital queue token.</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">Status: Idle</span>
      </div>
    );
  }

  const { token, tokensAhead, estimatedWaitMinutes, currentServingTokenId } = tokenData;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex items-center justify-between relative z-10 border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5" /> Minimum-Queue Digital Token
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
            token.priorityLevel === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-200'
          }`}>
            {token.priorityLevel}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">ID: {token.tokenId}</span>
      </div>

      {/* Main Token Info Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
        
        {/* Token Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center space-y-1">
          <p className="text-xs text-sky-200 font-semibold uppercase tracking-wider">Your Digital Token</p>
          <div className="text-4xl font-extrabold text-white tracking-tight font-mono">{token.tokenId}</div>
          <p className="text-[10px] text-slate-300">No physical queue waiting required</p>
        </div>

        {/* Current Serving & Tokens Ahead */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Currently Serving:</span>
            <strong className="text-amber-300 font-mono text-sm">{currentServingTokenId}</strong>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
            <span>Patients Ahead:</span>
            <strong className="text-white text-base font-bold">{tokensAhead} Patients</strong>
          </div>
        </div>

        {/* Estimated Waiting Time */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs text-sky-300">
            <Clock className="w-4 h-4" />
            <span>Estimated Wait Time</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">
            {estimatedWaitMinutes} <span className="text-sm font-sans font-normal text-slate-300">mins</span>
          </div>
        </div>

      </div>

      {/* "What is my next step?" Guidance Card */}
      <div className="bg-sky-500/20 rounded-2xl p-4 border border-sky-400/30 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-sky-300 font-bold uppercase tracking-wider">What is my next step?</div>
            <div className="text-sm font-bold text-white">
              {tokensAhead === 0 
                ? `Proceed to Room #${token.doctorId?.roomNumber || '204'} — You are NEXT!`
                : `Relax in Waiting Lounge • Proceed to Room #${token.doctorId?.roomNumber || '204'} when notified`}
            </div>
          </div>
        </div>

        <button 
          onClick={fetchPatientToken}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
