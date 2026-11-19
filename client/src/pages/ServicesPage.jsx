import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Sparkles, Stethoscope, Clock, Compass, HeartPulse, 
  Building2, ArrowRight, ShieldCheck, CheckCircle2, Monitor 
} from 'lucide-react';

export default function ServicesPage() {
  const servicesList = [
    {
      title: 'AI Symptom Triage & Intake',
      icon: <Sparkles className="w-8 h-8 text-sky-600" />,
      tag: 'AI Healthcare',
      desc: 'Natural language symptom assessment evaluates clinical severity, suggests relevant departments, and flags emergency conditions before patients arrive at the hospital.',
      features: ['Emergency red flag detection', 'Automated specialty routing', 'Patient preliminary intake report']
    },
    {
      title: 'Specialist Doctor Consultations',
      icon: <Stethoscope className="w-8 h-8 text-teal-600" />,
      tag: 'Clinical Care',
      desc: 'Browse certified physicians across Cardiology, Neurology, Pediatrics, Orthopedics, and General Medicine. Direct calendar booking with live slot availability.',
      features: ['Verified medical credentials', 'Live slot availability', 'Digital consultation notes']
    },
    {
      title: 'Minimum-Queue Digital Tokens',
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      tag: 'Zero-Queue Flow',
      desc: 'Replaces physical corridor waiting lines with real-time digital tokens. Patients receive live wait-time updates powered by an AI Random Forest prediction engine.',
      features: ['Real-time token status updates', 'Predictive ML wait times', 'Automated room arrival alerts']
    },
    {
      title: 'Indoor Hospital Navigation',
      icon: <Compass className="w-8 h-8 text-amber-600" />,
      tag: 'Wayfinding',
      desc: 'Turn-by-turn indoor wayfinding directs patients from registration to their designated OPD consultation room, diagnostic laboratories, and pharmacy counters.',
      features: ['Floor-by-floor routing', 'Diagnostic lab markers', 'Pharmacy guidance']
    },
    {
      title: 'Digital Prescriptions & Records',
      icon: <HeartPulse className="w-8 h-8 text-emerald-600" />,
      tag: 'Electronic Health Records',
      desc: 'Secure, paperless prescription management. Doctors upload medication regimens and test orders that patients can access and download from their personal dashboard.',
      features: ['Encrypted medical history', 'Instant pharmacy dispensing integration', 'Downloadable digital prescriptions']
    },
    {
      title: 'Hospital Resource Command Center',
      icon: <Building2 className="w-8 h-8 text-purple-600" />,
      tag: 'Operations & Administration',
      desc: 'Executive command dashboard for hospital directors to monitor live ICU bed occupancy, emergency oxygen reserves, OPD queue pressure, and run crisis simulations.',
      features: ['What-If emergency surge simulation', 'Live bed & ICU allocation', 'Biomedical waste and oxygen tracking']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-gradient-to-r from-[#FF5841] via-[#E2455F] to-[#C53678] text-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-sky-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Clinical & Digital Portfolio</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Hospital Operations & Clinical Services
            </h1>
            <p className="text-base sm:text-lg text-sky-100 max-w-2xl leading-relaxed">
              Explore how MediSense transforms patient care delivery, hospital operations, and outpatient clinic flows with connected intelligence.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesList.map((srv, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        {srv.icon}
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-100/70 text-sky-800">
                        {srv.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{srv.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{srv.desc}</p>

                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      {srv.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4">
                    <Link
                      to="/doctors"
                      className="inline-flex items-center text-xs font-bold text-sky-600 hover:text-sky-700"
                    >
                      <span>Find Relevant Doctors</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live TV CTA Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-sky-900 to-teal-900 rounded-3xl p-8 sm:p-12 border border-sky-800/60 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center space-x-2 bg-teal-500/20 px-3 py-1 rounded-full text-xs font-bold text-teal-300">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Public Waiting Area Facility</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Hospital Waiting Room TV Display
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Designed for high-definition monitors mounted in hospital lobbies. Displays live token calls, active department queues, and emergency alerts.
                </p>
              </div>

              <Link
                to="/queue-display"
                target="_blank"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition"
              >
                Launch Live Queue Screen
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
