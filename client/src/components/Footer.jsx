import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Phone, Mail, MapPin, Clock, ShieldCheck, 
  Heart, ArrowRight, Github, Twitter, Linkedin, Facebook 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5841] to-[#C53678] flex items-center justify-center text-white shadow-lg shadow-[#FF5841]/25">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">Medi<span className="text-[#FF5841]">Sense</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The AI-driven healthcare intelligence and minimum-queue hospital platform designed to streamline clinical workflows, eliminate waiting room congestion, and empower patient health journeys.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://github.com/AJ9900/MediSense" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center text-slate-300 hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center text-slate-300 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center text-slate-300 hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center text-slate-300 hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-sky-400 transition">Public Homepage</Link></li>
              <li><Link to="/doctors" className="hover:text-sky-400 transition">Find Doctors</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition">Clinical Services</Link></li>
              <li><Link to="/about" className="hover:text-sky-400 transition">About MediSense</Link></li>
              <li><Link to="/queue-display" target="_blank" className="hover:text-teal-400 transition flex items-center gap-1">Live Queue TV <span className="text-[10px] bg-teal-900/80 text-teal-300 px-1.5 py-0.2 rounded border border-teal-700">Display</span></Link></li>
            </ul>
          </div>

          {/* Hospital Specialties */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Specialties</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/doctors?dept=Cardiology" className="hover:text-sky-400 transition">Cardiology & Heart Care</Link></li>
              <li><Link to="/doctors?dept=Neurology" className="hover:text-sky-400 transition">Neurology & Brain Sciences</Link></li>
              <li><Link to="/doctors?dept=General Medicine" className="hover:text-sky-400 transition">General Medicine & Diabetology</Link></li>
              <li><Link to="/doctors?dept=Pediatrics" className="hover:text-sky-400 transition">Pediatrics & Child Health</Link></li>
              <li><Link to="/doctors?dept=Orthopedics" className="hover:text-sky-400 transition">Orthopedics & Joint Care</Link></li>
              <li><Link to="/doctors?dept=Dermatology" className="hover:text-sky-400 transition">Dermatology & Skin Care</Link></li>
            </ul>
          </div>

          {/* Contact & Emergency info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Emergency & Care</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-rose-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">24/7 Emergency Line</p>
                  <p className="text-white font-semibold">+91 (080) 4567-8900</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-sky-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">General Inquiries</p>
                  <p className="text-white font-medium">contact@medisense.health</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Main Campus</p>
                  <p className="text-slate-300">MediSense Smart Hospital, Sector 4, Tech City</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} MediSense Healthcare Intelligence. All rights reserved. Built for B.Tech CSE Mini Project.
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Demo & Educational Platform
            </span>
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-300">Support Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
