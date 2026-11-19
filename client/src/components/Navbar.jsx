import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Activity, Stethoscope, User, LogOut, Menu, X, 
  Sparkles, Shield, Monitor, ChevronDown, ArrowRight 
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'doctor') return '/doctor/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'staff') return '/dashboard';
    return '/patient/dashboard';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'AI Assistant', path: '/#ai-assistant' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(elementId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Medi<span className="text-sky-600">Sense</span></span>
                <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">AI Care</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5 hidden sm:block">Intelligent Hospital & Clinical Ecosystem</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            {/* Live TV Waiting Room Display */}
            <Link
              to="/queue-display"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100/80 rounded-xl border border-teal-200 transition ml-2"
              title="Open Hospital Live Waiting Room TV Display"
            >
              <Monitor className="w-4 h-4 text-teal-600 animate-pulse" />
              <span>Live Queue TV</span>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition-all hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-sky-600 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  location.pathname === link.path
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/queue-display"
              target="_blank"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-teal-700 bg-teal-50"
            >
              <Monitor className="w-4 h-4 text-teal-600" />
              <span>Hospital Waiting Room TV Display</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl shadow-sm"
                >
                  Go to {user.role ? user.role.toUpperCase() : 'USER'} Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-rose-600 hover:bg-rose-50 font-bold py-2.5 rounded-xl transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-slate-700 hover:bg-slate-100 font-bold py-2.5 rounded-xl border border-slate-200 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl shadow-md transition"
                >
                  Create Patient Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
