import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Activity, ShieldCheck, Heart, Users, Clock, 
  Award, Sparkles, Building2, Stethoscope, ArrowRight 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 text-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-sky-100">
              <Activity className="w-3.5 h-3.5" />
              <span>About MediSense Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Pioneering Minimum-Queue <br />
              Healthcare Intelligence
            </h1>
            <p className="text-base sm:text-lg text-sky-100 max-w-2xl leading-relaxed">
              MediSense was engineered to solve one of the greatest challenges in modern hospital operations: physical waiting room congestion, manual coordination delays, and lost patient time.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Our Core Vision</h2>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Less Waiting. Smarter Care. Better Health Outcomes.
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Traditional hospital visits involve standing in registration queues, waiting outside OPD rooms for hours, queueing again at diagnostic counters, and waiting yet again for pharmacy dispensing.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  MediSense models the hospital as an interconnected <strong>Digital Twin</strong>. With real-time machine learning queue prediction and mobile digital tokens, patients only proceed when their turn arrives.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                    <p className="text-2xl font-black text-sky-700">75%</p>
                    <p className="text-xs font-semibold text-slate-600 mt-1">Reduction in OPD corridor congestion</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                    <p className="text-2xl font-black text-teal-700">100%</p>
                    <p className="text-xs font-semibold text-slate-600 mt-1">Digital paperless prescription flow</p>
                  </div>
                </div>
              </div>

              {/* Graphical Card */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
                <h4 className="text-base font-bold text-slate-900">Platform Core Pillars</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">AI Health Intelligence</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Automated triage classification, emergency escalation, and medical report translation.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Predictive Waiting Times</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Scikit-Learn Random Forest regression model trained on clinical OPD throughput parameters.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Admin Hospital Copilot</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Real-time resource allocation, bed management, and "What-If" crisis simulation.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Link
                    to="/doctors"
                    className="inline-flex items-center text-xs font-bold text-sky-600 hover:text-sky-700"
                  >
                    <span>Browse Hospital Specialists</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Academic / B.Tech CSE Project Info */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Educational Engineering</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Designed as a Full-Stack Engineering Platform
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
              MediSense demonstrates full-stack software architecture: React 18 frontend with Vite and Tailwind CSS, Node.js Express REST API gateway with MongoDB/Mongoose, and a Python FastAPI AI microservice with Scikit-Learn.
            </p>
            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition"
              >
                <span>Get Started with MediSense</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
