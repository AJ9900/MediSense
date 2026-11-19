import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, 
  MessageSquare, ShieldCheck, HeartPulse 
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: '', email: '', phone: '', subject: 'General', message: '' });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-gradient-to-r from-[#FF5841] via-[#E2455F] to-[#C53678] text-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-sky-100">
              <Phone className="w-3.5 h-3.5" />
              <span>24/7 Patient Assistance</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Contact MediSense Support & Hospital Care
            </h1>
            <p className="text-base sm:text-lg text-sky-100 max-w-2xl leading-relaxed">
              We are available round-the-clock to assist with outpatient appointments, emergency guidance, clinical inquiries, and platform feedback.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Contact Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Direct Lines</h2>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Connect With Our Clinical Team
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Choose from our dedicated emergency helplines, OPD appointment desks, or email support.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-700">24/7 Emergency Helpline</p>
                      <p className="text-lg font-black text-rose-950 mt-0.5">+91 (080) 4567-8900</p>
                      <p className="text-[11px] text-rose-800 mt-0.5">Immediate triage & ambulance coordination</p>
                    </div>
                  </div>

                  <div className="p-5 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Email Inquiries</p>
                      <p className="text-base font-bold text-slate-900 mt-0.5">support@medisense.health</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Response typically within 2-4 business hours</p>
                    </div>
                  </div>

                  <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Hospital Main Campus</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">MediSense Smart Hospital Campus</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Sector 4, Healthcare Innovation Corridor, Tech City</p>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">OPD Consultation Hours</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">Mon - Sat: 08:30 AM – 06:00 PM</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Emergency & Trauma Care: 24 Hours / 7 Days</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Inquiry Form */}
              <div className="lg:col-span-7">
                <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Send an Inquiry or Message</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below. Our hospital patient coordination desk will reach out via phone or email.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3 animate-fadeIn">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                      <h4 className="text-lg font-bold text-emerald-950">Inquiry Received Successfully!</h4>
                      <p className="text-xs text-emerald-800 max-w-md mx-auto">
                        Thank you for contacting MediSense. Our patient care representative has logged your ticket and will follow up with you shortly.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-bold text-emerald-700 hover:underline pt-2"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Ananya Roy"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="patient@example.com"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+91 9876543210"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Department / Subject</label>
                          <select
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500"
                          >
                            <option value="General">General Inquiries</option>
                            <option value="OPD">OPD Consultation & Doctors</option>
                            <option value="AI">AI Triage & Digital Token</option>
                            <option value="Billing">Billing & Insurance</option>
                            <option value="Feedback">Feedback / Suggestions</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Message / Inquiry Details</label>
                        <textarea
                          required
                          rows={4}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="How can we assist your clinical care or hospital visit?"
                          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs focus:outline-none focus:border-sky-500 resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-4 rounded-xl shadow-md transition"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Hospital Inquiry</span>
                      </button>
                    </form>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
