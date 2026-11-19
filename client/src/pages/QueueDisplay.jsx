import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Ticket, Volume2, Monitor, MapPin, Users, Activity } from 'lucide-react';

export default function QueueDisplay() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [queueStatus, setQueueStatus] = useState(null);

  useEffect(() => {
    API.get('/doctors').then(res => {
      setDoctors(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedDoctorId(res.data.data[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDoctorId) return;
    fetchLiveQueue();
    const interval = setInterval(fetchLiveQueue, 5000);
    return () => clearInterval(interval);
  }, [selectedDoctorId]);

  const fetchLiveQueue = async () => {
    try {
      const response = await API.get(`/queue/live/${selectedDoctorId}`);
      setQueueStatus(response.data.data);
    } catch (err) {
      console.error('Failed to fetch live queue:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col justify-between font-sans">
      {/* Top TV Screen Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">MediSense Live Queue Monitor</h1>
            <p className="text-xs text-sky-400 font-medium">Lobby Display Screen • Room Token Callout System</p>
          </div>
        </div>

        {/* Doctor Selector for TV Screen */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Select Doctor Queue:</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs py-2 px-3 rounded-xl text-white focus:outline-none"
          >
            {doctors.map(doc => (
              <option key={doc._id} value={doc._id}>
                {doc.userId?.name} ({doc.department})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Display Screen */}
      <main className="my-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: NOW SERVING BIG DISPLAY */}
        <div className="lg:col-span-2 bg-gradient-to-tr from-sky-950 via-slate-900 to-slate-950 rounded-3xl p-8 border border-sky-500/30 shadow-2xl flex flex-col justify-between text-center space-y-6">
          <div className="flex items-center justify-between text-xs text-sky-300">
            <span className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Room Callout
            </span>
            <span>Department: <strong>{queueStatus?.department || 'OPD'}</strong></span>
          </div>

          <div className="py-8 space-y-4">
            <div className="text-sm uppercase tracking-widest text-slate-400 font-bold">Now Calling Token</div>
            <div className="text-7xl sm:text-9xl font-black text-emerald-400 font-mono tracking-wider drop-shadow-lg">
              {queueStatus?.currentToken?.tokenId || '---'}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-sky-400" />
              <span>Please Proceed to Room #{queueStatus?.roomNumber || '101'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Doctor: <strong className="text-white">{queueStatus?.doctorName}</strong></span>
            <span>Total Patients Waiting: <strong className="text-white">{queueStatus?.totalWaiting || 0}</strong></span>
          </div>
        </div>

        {/* Right Column: UPCOMING QUEUE LIST */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" /> Next In Line
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Priority Sorted</span>
          </div>

          <div className="space-y-3">
            {queueStatus?.upcomingTokens?.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No waiting tokens in line.</p>
            ) : (
              queueStatus?.upcomingTokens?.map((t, idx) => (
                <div key={t._id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-mono font-bold text-lg text-white">{t.tokenId}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.priorityLevel === 'CRITICAL' ? 'bg-rose-900/50 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.priorityLevel}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
        MediSense Minimum-Queue Hospital Ecosystem • Auto-refreshing every 5s
      </footer>
    </div>
  );
}
