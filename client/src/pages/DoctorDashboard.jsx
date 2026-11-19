import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Stethoscope, Calendar, Clock, User, CheckCircle2, AlertCircle, PlayCircle, ToggleLeft, ToggleRight, Ticket, Megaphone } from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [callStatus, setCallStatus] = useState('');
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      // Get current user doctor profile
      const userRes = await API.get('/auth/me');
      const docProf = userRes.data.data.profile;
      if (docProf) setDoctorId(docProf._id);

      const response = await API.get('/appointments/doctor');
      setAppointments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await API.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      fetchDoctorData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCallNextToken = async () => {
    if (!doctorId) return;
    try {
      const response = await API.put(`/queue/next/${doctorId}`);
      setCallStatus(response.data.message);
      fetchDoctorData();
      setTimeout(() => setCallStatus(''), 4000);
    } catch (err) {
      console.error('Failed to call next token:', err);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !isAvailable;
      setIsAvailable(newStatus);
      await API.put('/doctors/availability', { isAvailableToday: newStatus });
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            Doctor Consultation Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage daily appointments and trigger live priority digital token announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Call Next Token Action */}
          <button
            onClick={handleCallNextToken}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition"
          >
            <Megaphone className="w-4 h-4 animate-bounce" /> Call Next Token
          </button>

          {/* Availability Toggle */}
          <button
            onClick={toggleAvailability}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              isAvailable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {isAvailable ? (
              <>
                <ToggleRight className="w-5 h-5 text-emerald-600" />
                <span>Available</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-slate-400" />
                <span>Away</span>
              </>
            )}
          </button>
        </div>
      </div>

      {callStatus && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <Ticket className="w-4 h-4" />
          <span>{callStatus}</span>
        </div>
      )}

      {/* Appointment Queue Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-28"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Patient Consultations Scheduled Today</h3>
          <p className="text-xs text-slate-500">Your queue is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                    {apt.appointmentId}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    apt.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {apt.priority} Priority
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">• {apt.timeSlot}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {apt.patientId?.userId?.name || 'Patient'}
                </h3>
                <p className="text-xs text-slate-600">
                  Reason for visit: <strong className="text-slate-800">{apt.reasonForVisit}</strong>
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {apt.status === 'scheduled' && (
                  <button
                    onClick={() => handleStatusChange(apt._id, 'in_consultation')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Consultation
                  </button>
                )}

                {apt.status === 'in_consultation' && (
                  <button
                    onClick={() => handleStatusChange(apt._id, 'completed')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Completed
                  </button>
                )}

                {apt.status === 'completed' && (
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
