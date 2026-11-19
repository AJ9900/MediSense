import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Lock, Mail, UserCheck, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
            <Activity className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to MediSense
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Minimum-Queue Healthcare Intelligence Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200">
          
          {/* Quick Viva Demo Presets */}
          <div className="mb-6 bg-sky-50 border border-sky-200 rounded-xl p-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Viva Demo Quick-Fill Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('patient@medisense.com', 'Patient')}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 transition"
              >
                👤 Patient Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('doctor@medisense.com', 'Doctor')}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 transition"
              >
                🩺 Doctor Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('staff@medisense.com', 'Staff')}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 transition"
              >
                🏥 Staff Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('admin@medisense.com', 'Admin')}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white border border-sky-200 hover:border-sky-400 text-xs font-medium text-slate-700 transition"
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

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
                Register New User
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
