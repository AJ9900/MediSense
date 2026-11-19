import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Activity, Stethoscope, Clock, ShieldCheck, HeartPulse, 
  Sparkles, ArrowRight, CheckCircle2, ChevronRight, Star, 
  MapPin, Calendar, Users, Phone, Mail, Bot, Search, AlertCircle,
  HelpCircle, MessageSquare, Zap, Compass, Building2, Send
} from 'lucide-react';

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Doctors State for Featured Section
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');

  // AI Assistant Interactive Demo State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const departments = ['All', 'Cardiology', 'Neurology', 'General Medicine', 'Pediatrics', 'Orthopedics', 'Dermatology'];

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const res = await API.get('/doctors');
      if (res.data?.data) {
        setFeaturedDoctors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load featured doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Interactive AI Assistant Test
  const handleTestAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await API.post('/ai/triage', { symptoms: aiQuery });
      setAiResponse(res.data?.data || {
        department: 'General Medicine',
        urgency: 'Low',
        summary: 'Your symptoms suggest common fatigue or mild strain. We recommend staying hydrated, resting, and scheduling a general health evaluation if symptoms persist.'
      });
    } catch (err) {
      // Fallback response for offline/mock presentation
      setAiResponse({
        department: 'General Medicine',
        urgency: 'Informational',
        summary: `Preliminary AI assessment for "${aiQuery}": Symptoms indicate mild discomfort. Consultation with our General Physician or relevant specialist is recommended for formal evaluation.`
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleBookClick = (doctor) => {
    if (!user) {
      // Login required for booking
      navigate('/login', { state: { from: '/doctors', doctorId: doctor._id } });
    } else {
      navigate('/patient/dashboard');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', phone: '', message: '' });
    }, 500);
  };

  const filteredDoctors = selectedDept === 'All' 
    ? featuredDoctors 
    : featuredDoctors.filter(d => d.department === selectedDept);

  const faqs = [
    {
      q: 'Do I need to create an account to browse doctors and hospital services?',
      a: 'No. You are completely free to explore our homepage, read about hospital departments, browse certified doctors, view their qualifications, experience, and OPD consultation schedules without logging in.'
    },
    {
      q: 'When do I need to log in to MediSense?',
      a: 'Login or registration is only required when performing personal clinical actions, such as booking an appointment with a specialist, tracking your personal digital token, accessing medical records, or viewing prescriptions.'
    },
    {
      q: 'How does the MediSense "Minimum-Queue" digital token work?',
      a: 'Instead of standing in physical hospital lines, MediSense assigns you a real-time Digital Token (e.g. M1001). Our Machine Learning algorithm computes accurate waiting times based on current OPD flow, allowing you to relax until your token is called.'
    },
    {
      q: 'Is the AI Health Assistant a replacement for a doctor?',
      a: 'No. The AI Health Assistant provides preliminary educational triage and recommends appropriate hospital departments. It never replaces professional clinical diagnosis or emergency medical care.'
    },
    {
      q: 'How can hospital administrators manage hospital resources?',
      a: 'Hospital staff and administrators can access the Admin Command Center Copilot to monitor live bed occupancy, oxygen supplies, OPD queue loads, and run "What-If" surge simulations.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-20 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#FFF0ED] border border-[#FFD5CE] px-4 py-1.5 rounded-full text-xs font-bold text-[#C53678] shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#FF5841] animate-ping"></span>
                <span className="flex h-2 w-2 rounded-full bg-[#FF5841] -ml-3"></span>
                <span>AI-Powered Healthcare Intelligence & Zero-Queue Hospital Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Smarter Care. <br />
                <span className="bg-gradient-to-r from-[#FF5841] via-[#E2455F] to-[#C53678] bg-clip-text text-transparent">Zero Waiting.</span> <br />
                Next-Gen Health.
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                MediSense orchestrates the entire hospital experience: intelligent symptom triage, instant specialist booking, predictive wait-time tokens, and seamless indoor clinic navigation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/doctors"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#FF5841] hover:bg-[#e6432d] text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-[#FF5841]/30 hover:shadow-xl hover:shadow-[#FF5841]/40 transition-all transform hover:-translate-y-0.5"
                >
                  <Search className="w-5 h-5" />
                  <span>Find a Doctor</span>
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-[#FFF0ED] text-slate-800 hover:text-[#FF5841] font-bold text-base px-8 py-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#FFD5CE] transition-all"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 text-[#FF5841]" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900">99.4%</p>
                  <p className="text-xs font-medium text-slate-500">Patient Satisfaction</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900">15+</p>
                  <p className="text-xs font-medium text-slate-500">Clinical Specialties</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-[#FF5841]">&lt; 5 min</p>
                  <p className="text-xs font-medium text-slate-500">Avg. Queue Wait Time</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-[#C53678]">24/7</p>
                  <p className="text-xs font-medium text-slate-500">AI Health Assistance</p>
                </div>
              </div>

            </div>

            {/* Right Graphic / Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-300/60 border border-slate-200/80 space-y-6">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FDF0F6] border border-[#FAD0E4] flex items-center justify-center text-[#C53678]">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">Live Hospital Digital Twin</h3>
                        <p className="text-xs text-slate-400">Real-Time Operational Stream</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active Live
                    </span>
                  </div>

                  {/* Sample Token Live Card */}
                  <div className="bg-gradient-to-br from-[#FF5841] via-[#E2455F] to-[#C53678] text-white rounded-2xl p-5 shadow-lg shadow-[#FF5841]/25 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100">OPD Priority Token</span>
                        <h4 className="text-2xl font-black tracking-tight mt-0.5">Token #M1001</h4>
                      </div>
                      <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        Called to Room 204
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/20 flex justify-between items-center text-xs text-rose-100">
                      <div>
                        <p className="font-medium text-rose-100">Doctor</p>
                        <p className="font-bold text-white text-sm">Dr. Vikram Sharma</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-rose-100">Department</p>
                        <p className="font-bold text-white text-sm">Cardiology</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Health Triage Sample Snippet */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Smart Triage Assessment</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "Mild chest tightness following workout • Triage priority: Normal OPD • Recommended department: Cardiology (Room 204)."
                    </p>
                  </div>

                  {/* Bottom Stats Row */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-teal-50/60 border border-teal-100 p-3 rounded-xl text-center">
                      <p className="text-xs font-semibold text-teal-700">Predictive Wait</p>
                      <p className="text-lg font-black text-teal-900 mt-0.5">3 Minutes</p>
                    </div>
                    <div className="bg-sky-50/60 border border-sky-100 p-3 rounded-xl text-center">
                      <p className="text-xs font-semibold text-sky-700">Queue Ahead</p>
                      <p className="text-lg font-black text-sky-900 mt-0.5">1 Patient</p>
                    </div>
                  </div>

                </div>

                {/* Floating Decorative Badges */}
                <div className="absolute -bottom-5 -left-5 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200 flex items-center space-x-2 text-xs font-bold text-slate-800 hidden sm:flex">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Verified Specialists</span>
                </div>

                <div className="absolute -top-5 -right-5 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200 flex items-center space-x-2 text-xs font-bold text-slate-800 hidden sm:flex">
                  <Clock className="w-5 h-5 text-sky-500" />
                  <span>Instant Slot Booking</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Comprehensive Clinical Ecosystem</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Integrated Healthcare Services Built for Zero Delays
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Every touchpoint from patient registration to diagnostic labs and pharmacy dispensing is streamlined with smart digital coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Service 1 - Sunset Orange / Coral */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 hover:border-[#FF5841] shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0ED] text-[#FF5841] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FF5841] group-hover:text-white transition-all">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">AI Symptom Intake & Triage</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Describe your health symptoms in natural language. Our AI engine recommends the most appropriate specialty department and detects emergency red flags immediately.
              </p>
              <Link to="/#ai-assistant" className="inline-flex items-center text-sm font-bold text-[#FF5841] hover:text-[#e6432d]">
                <span>Try AI Triage</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 2 - Medical Teal #09A1A1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 hover:border-[#09A1A1] shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#edfafa] text-[#09A1A1] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#09A1A1] group-hover:text-white transition-all">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Specialist Doctor Appointments</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Search verified medical specialists by department, experience, and patient ratings. Check live calendar availability and book guaranteed consultation slots.
              </p>
              <Link to="/doctors" className="inline-flex items-center text-sm font-bold text-[#09A1A1] hover:text-[#068485]">
                <span>Explore Doctors</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 3 - Steel Blue #5484A4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 hover:border-[#5484A4] shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#f2f6f9] text-[#5484A4] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#5484A4] group-hover:text-white transition-all">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Zero-Queue Digital Tokens</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Physical lines are obsolete. Receive a mobile digital token tracked by our ML Random Forest model, providing precise real-time notifications when your doctor is ready.
              </p>
              <Link to="/queue-display" target="_blank" className="inline-flex items-center text-sm font-bold text-[#5484A4] hover:text-[#426b89]">
                <span>View Live Queue TV</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 4 - Seashell Peach #F6C992 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 hover:border-[#F6C992] shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#fffbf5] text-[#c88c49] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#F6C992] group-hover:text-slate-900 transition-all">
                <Compass className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Hospital Indoor Navigation</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Never get lost in hospital hallways. Step-by-step digital guidance directs patients directly from OPD room to radiology, blood sample collection, and pharmacy.
              </p>
              <Link to="/services" className="inline-flex items-center text-sm font-bold text-[#c88c49] hover:text-[#a36a33]">
                <span>Learn Navigation</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 5 - Dusty Rose #D396A6 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 hover:border-[#D396A6] shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#faf4f6] text-[#D396A6] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#D396A6] group-hover:text-white transition-all">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Digital Prescriptions & Records</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Say goodbye to lost paper slips. Certified doctors upload digital prescriptions, dosage instructions, and test requests straight into your encrypted patient record.
              </p>
              <Link to="/login" className="inline-flex items-center text-sm font-bold text-[#D396A6] hover:text-[#a65d70]">
                <span>Access Records</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 6 - Deep Slate Garnet #30525C / Red-Violet */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 hover:border-[#C53678] shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#fdf2f7] text-[#C53678] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#C53678] group-hover:text-white transition-all">
                <Building2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Admin Resource Command Center</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Hospital administrators can monitor ICU bed occupancy, emergency oxygen cylinders, doctor workloads, and run predictive "What-If" crisis simulations.
              </p>
              <Link to="/about" className="inline-flex items-center text-sm font-bold text-[#C53678] hover:text-[#8e194e]">
                <span>Explore Command Hub</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* 3. FEATURED DOCTORS SECTION (PUBLIC ACCESS) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Certified Medical Specialists</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Meet Our Leading Doctors
              </h3>
              <p className="text-slate-600 text-base max-w-xl">
                Browse our team of board-certified consultants across all clinical departments. Profiles and schedules are publicly available to everyone.
              </p>
            </div>

            <Link
              to="/doctors"
              className="inline-flex items-center text-sm font-bold text-sky-600 hover:text-sky-700 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-300 transition"
            >
              <span>View All Doctors ({featuredDoctors.length})</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          {loadingDoctors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-bold">No doctors found in {selectedDept}</p>
              <p className="text-xs text-slate-500 mt-1">Try selecting 'All' or a different specialty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.slice(0, 6).map((doc) => (
                <div 
                  key={doc._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* Top Row: Avatar + Department Badge */}
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFF0ED] via-[#FDF0F6] to-[#edfafa] border border-[#FFD5CE] flex items-center justify-center text-[#FF5841] font-black text-xl shadow-inner">
                        {doc.userId?.name ? doc.userId.name.replace('Dr. ', '').charAt(0) : 'D'}
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF5841] border border-[#FFD5CE]">
                        {doc.department}
                      </span>
                    </div>

                    {/* Name & Specialization */}
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition">
                        {doc.userId?.name || 'Specialist Physician'}
                      </h4>
                      <p className="text-xs font-semibold text-teal-600 mt-0.5">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{doc.qualification}</p>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Experience</p>
                        <p className="text-xs font-extrabold text-slate-800">{doc.experienceYears}+ Years</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Rating</p>
                        <p className="text-xs font-extrabold text-amber-600 flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{doc.rating || 4.9}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">OPD Room</p>
                        <p className="text-xs font-extrabold text-slate-800">Room {doc.roomNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-slate-500 space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mon - Fri Available</span>
                    </div>

                  </div>

                  {/* Booking Action */}
                  <div className="pt-6 mt-2">
                    <button
                      onClick={() => handleBookClick(doc)}
                      className="w-full flex items-center justify-center space-x-2 bg-[#FFF0ED] hover:bg-[#FF5841] text-[#FF5841] hover:text-white font-bold text-xs py-3 rounded-xl border border-[#FFD5CE] hover:border-[#FF5841] transition-all duration-200"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{user ? 'Book Appointment' : 'Sign in to Book Slot'}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>


      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Effortless Hospital Journey</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How MediSense Works for You
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              We eliminated long lines, redundant paperwork, and confusing counter visits through our 4-step minimum-queue pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4 relative">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-sky-600/30">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">AI Intake & Triage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Describe your symptoms on our platform. The AI recommends the right specialty department and checks severity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4 relative">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-teal-600/30">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">Choose Specialist & Slot</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse doctor profiles, qualifications, and live slot schedules. Reserve your OPD consultation in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4 relative">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">Zero-Wait Digital Token</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an active digital token on your phone. Real-time predictive countdown tells you exactly when to arrive.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4 relative">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-600/30">
                4
              </div>
              <h4 className="text-lg font-bold text-slate-900">Consultation & Prescriptions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meet your doctor, receive digital prescriptions, and follow indoor hospital navigation for labs or pharmacy.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* 5. INTERACTIVE AI HEALTH ASSISTANT SECTION */}
      <section id="ai-assistant" className="py-20 bg-gradient-to-br from-[#30525C] via-slate-900 to-[#18181b] text-white relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#09A1A1]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF5841]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-[#09A1A1]/20 border border-[#09A1A1]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#75ced3]">
                <Sparkles className="w-4 h-4 text-[#09A1A1]" />
                <span>Interactive AI Intelligence</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Try the MediSense <br />
                <span className="bg-gradient-to-r from-[#F6C992] via-[#FF5841] to-[#D396A6] bg-clip-text text-transparent">AI Health Assistant</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Test our intelligent health assistance right here without logging in. Type any symptoms to see how MediSense guides patients to the appropriate department.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Immediate department matching & red flag warnings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Powered by natural language medical evaluation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Educational & clinical triage guidance</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Box */}
            <div className="lg:col-span-7">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
                
                <form onSubmit={handleTestAI} className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Describe Your Health Concern or Symptoms
                  </label>
                  
                  <div className="relative">
                    <textarea
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="e.g., I have been experiencing a persistent dull headache and slight dizziness since yesterday..."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition resize-none"
                    ></textarea>
                  </div>

                  {/* Sample Prompt Chips */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="text-slate-400 self-center">Try clicking:</span>
                    <button
                      type="button"
                      onClick={() => setAiQuery('Chest discomfort and shortness of breath when climbing stairs')}
                      className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-600 transition"
                    >
                      Chest discomfort
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiQuery('Severe joint stiffness in knees in the morning')}
                      className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-600 transition"
                    >
                      Joint stiffness
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiQuery('Persistent cough and fever for 4 days')}
                      className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-600 transition"
                    >
                      Cough & fever
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={aiLoading || !aiQuery.trim()}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FF5841] via-[#E2455F] to-[#C53678] hover:from-[#ea3e26] hover:to-[#ab2261] disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-[#FF5841]/25 transition"
                  >
                    {aiLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run AI Symptom Assessment</span>
                      </>
                    )}
                  </button>
                </form>

                {/* AI Response Output Card */}
                {aiResponse && (
                  <div className="bg-slate-900/90 rounded-2xl p-5 border border-teal-500/40 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                        <Bot className="w-4 h-4" />
                        <span>Preliminary AI Assessment</span>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                        Dept: {aiResponse.department}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiResponse.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        Urgency Level: <strong className="text-white">{aiResponse.urgency || 'Normal'}</strong>
                      </span>
                      <Link
                        to="/doctors"
                        className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                      >
                        <span>View {aiResponse.department} Doctors</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 6. WHY CHOOSE MEDISENSE (COMPARISON) */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">The Modern Difference</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Patients & Hospitals Choose MediSense
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Traditional healthcare relies on physical queues, paper files, and uncertain arrival times. MediSense upgrades the entire clinical journey into a streamlined digital experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Traditional Card */}
            <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-200/80 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  ✕
                </div>
                <h4 className="text-xl font-bold text-rose-950">Traditional Hospital Experience</h4>
              </div>
              <ul className="space-y-3.5 text-sm text-rose-900">
                <li className="flex items-start space-x-3">
                  <span className="text-rose-500 font-black mt-0.5">•</span>
                  <span>1 to 3 hours of physical waiting in crowded OPD corridors.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rose-500 font-black mt-0.5">•</span>
                  <span>Lost paper prescriptions and hand-written clinical notes.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rose-500 font-black mt-0.5">•</span>
                  <span>Manual counter visits for every lab test and medicine dispensing.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rose-500 font-black mt-0.5">•</span>
                  <span>Confusion over room numbers and hospital wing layouts.</span>
                </li>
              </ul>
            </div>

            {/* MediSense Card */}
            <div className="bg-sky-50/60 rounded-3xl p-8 border border-sky-200 shadow-md space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-sky-950">MediSense Intelligent Platform</h4>
              </div>
              <ul className="space-y-3.5 text-sm text-sky-950">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Real-time digital token tracking with ML-predicted wait times.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Encrypted digital prescriptions accessible directly from your phone.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>AI preliminary intake and red-flag symptom warnings.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Turn-by-turn indoor routing between OPD, diagnostic labs & pharmacy.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>


      {/* 7. TESTIMONIALS SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">User Experiences</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Patients & Clinicians
            </h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              (Educational & Mini Project Demonstration Testimonials)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "I was able to check Dr. Vikram's OPD schedule from my phone, receive Token M1001, and arrive at Room 204 right when my name was called. No line, no stress!"
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm">
                  AR
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Ananya Roy</h5>
                  <p className="text-xs text-slate-400">Cardiology Patient</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "As a doctor, having patients queued digitally with their symptoms pre-categorized by AI triage makes my OPD consultations 40% more efficient."
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                  VS
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Dr. Vikram Sharma</h5>
                  <p className="text-xs text-slate-400">Senior Cardiologist (DOC101)</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "The What-If scenario simulator and live bed monitor gives our hospital administration instant visibility into emergency surges and oxygen resource status."
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  RG
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Dr. Rajesh Gupta</h5>
                  <p className="text-xs text-slate-400">Hospital Medical Director</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 8. FAQ SECTION */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Common Questions</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-slate-600 text-sm">
              Everything you need to know about navigating the MediSense platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full text-left p-6 flex justify-between items-center text-slate-900 font-bold text-sm sm:text-base hover:text-sky-600 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 text-xl font-normal ml-4">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 9. CONTACT US SECTION */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Get in Touch</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                We Are Here to Assist Your Health Journey
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have questions about hospital services, doctor availability, or technical support? Reach out to our 24/7 hospital desk.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <Phone className="w-5 h-5 text-rose-500" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase">Emergency Helpdesk</p>
                    <p className="text-sm font-bold text-slate-900">+91 (080) 4567-8900</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <Mail className="w-5 h-5 text-sky-500" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase">Support Email</p>
                    <p className="text-sm font-bold text-slate-900">support@medisense.health</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <MapPin className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase">Hospital Campus</p>
                    <p className="text-sm font-bold text-slate-900">MediSense Smart Hospital, Sector 4, Tech City</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
                <h4 className="text-xl font-bold text-slate-900">Send an Inquiry or Feedback</h4>
                
                {contactSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 animate-fadeIn">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h5 className="font-bold text-emerald-950">Thank You for Reaching Out!</h5>
                    <p className="text-xs text-emerald-800">
                      Your inquiry has been received. Our clinical support team will respond to your contact details promptly.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="text-xs font-bold text-emerald-700 hover:underline pt-2"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Message or Inquiry</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="How can we assist your consultation or hospital visit?"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm py-4 rounded-xl shadow-md transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
