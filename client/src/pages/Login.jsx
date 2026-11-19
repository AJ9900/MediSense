import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Activity, Lock, Mail, UserCheck, ShieldAlert, Sparkles, 
  ArrowRight, ArrowLeft, Calendar, Info 
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from a protected route or doctor booking
  const redirectTarget = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      // If there was an intended redirect target (e.g. /doctors), navigate there
      if (typeof redirectTarget === 'string') {
        navigate(redirectTarget);
      } else if (redirectTarget?.pathname) {
        navigate(redirectTarget.pathname);
      } else {
        // Otherwise route to the appropriate role dashboard
        const role = result.data.role;
        if (role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'staff') {
          navigate('/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }
    } else {
      setError(result.message);
    }
  };

  // Preset demo accounts for quick testing during Viva presentation
  const handleQuickPreset = (presetEmail, presetRole) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Top Back to Home Navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-sky-600 transition group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Public Homepage</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5841] to-[#C53678] flex items-center justify-center text-white shadow-lg shadow-[#FF5841]/30">
            <Activity className="w-7 h-7" />
          </Link>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to MediSense
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Healthcare Intelligence & Minimum-Queue Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200">
          
          {/* Notification if redirected for protected action */}
          {redirectTarget && (
            <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3.5 rounded-2xl flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Please sign in to proceed with your protected clinical action or appointment booking.</span>
            </div>
          )}

          {/* Quick Viva Demo Presets */}
          <div className="mb-6 bg-sky-50 border border-sky-200 rounded-2xl p-3.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-800 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Viva Demo Quick-Fill Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('patient@medisense.com', 'Patient')}
                className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 hover:text-sky-600 transition shadow-xs"
              >
                👤 Patient Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('doctor@medisense.com', 'Doctor')}
                className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 hover:text-sky-600 transition shadow-xs"
              >
                🩺 Doctor Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('staff@medisense.com', 'Staff')}
                className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 hover:text-sky-600 transition shadow-xs"
              >
                🏥 Staff Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('admin@medisense.com', 'Admin')}
                className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 hover:text-sky-600 transition shadow-xs"
              >
                👑 Admin Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  placeholder="name@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none transition disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" state={{ from: redirectTarget }} className="font-semibold text-sky-600 hover:text-sky-700">
                Register New User
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
