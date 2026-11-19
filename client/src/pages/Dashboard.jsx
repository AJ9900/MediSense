import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DoctorSearch from './DoctorSearch';
import PatientAppointments from './PatientAppointments';
import DoctorDashboard from './DoctorDashboard';
import LiveTokenTracker from '../components/LiveTokenTracker';
import HospitalOperations from './HospitalOperations';
import AIChatbot from '../components/AIChatbot';
import AITriage from './AITriage';
import DigitalTwinTimeline from '../components/DigitalTwinTimeline';
import AdminCopilotDashboard from './AdminCopilotDashboard';
import IndoorNavigation from '../components/IndoorNavigation';
import { 
  Activity, User, Stethoscope, Building2, Shield, LogOut, 
  Clock, Calendar, Sparkles, HeartPulse, FileText, CheckCircle2,
  AlertTriangle, Package, Zap, Search, Monitor, Bot, Layers, Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [patientTab, setPatientTab] = useState('overview');

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Admin Command Center</span>;
      case 'doctor':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" /> Doctor Portal</span>;
      case 'staff':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Hospital Staff</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><User className="w-3.5 h-3.5" /> Patient Super App</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900">MediSense</span>
              <span className="ml-2 text-xs font-semibold text-sky-700">v1.0</span>
            </div>
          </div>

          {/* Patient Quick Navigation Tabs */}
          {user?.role === 'patient' && (
            <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPatientTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  patientTab === 'overview' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Token & Journey
              </button>
              <button
                onClick={() => setPatientTab('triage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  patientTab === 'triage' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Intake & Triage
              </button>
              <button
                onClick={() => setPatientTab('doctors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  patientTab === 'doctors' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Find Doctors
              </button>
              <button
                onClick={() => setPatientTab('appointments')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  patientTab === 'appointments' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Appointments
              </button>
              <button
                onClick={() => setPatientTab('navigation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  patientTab === 'navigation' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Indoor Navigation
              </button>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Link
              to="/queue-display"
              target="_blank"
              className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-sky-600 bg-slate-100 hover:bg-sky-50 px-3 py-1.5 rounded-xl border border-slate-200 transition"
              title="Open Hospital TV Lobby Display"
            >
              <Monitor className="w-4 h-4 text-sky-600" />
              <span>TV Lobby Display</span>
            </Link>
            <div className="hidden sm:flex items-center space-x-2 border-r border-slate-200 pr-4">
              {getRoleBadge(user?.role)}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* PATIENT VIEW */}
        {user?.role === 'patient' && (
          <>
            {patientTab === 'overview' && (
              <div className="space-y-8">
                <LiveTokenTracker />
                <DigitalTwinTimeline />
                <IndoorNavigation />
              </div>
            )}
            {patientTab === 'triage' && <AITriage onSelectDepartment={() => setPatientTab('doctors')} />}
            {patientTab === 'doctors' && <DoctorSearch />}
            {patientTab === 'appointments' && <PatientAppointments />}
            {patientTab === 'navigation' && <IndoorNavigation />}

            <AIChatbot />
          </>
        )}

        {/* DOCTOR VIEW */}
        {user?.role === 'doctor' && <DoctorDashboard />}

        {/* STAFF VIEW */}
        {user?.role === 'staff' && <HospitalOperations />}

        {/* ADMIN VIEW */}
        {user?.role === 'admin' && <AdminCopilotDashboard />}

      </main>
    </div>
  );
}
