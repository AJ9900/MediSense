import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Stethoscope, Search, Star, Clock, MapPin, Calendar, CheckCircle2, 
  X, AlertCircle, ArrowRight, ShieldCheck, HeartPulse, User, LogIn 
} from 'lucide-react';

export default function DoctorsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, error: '' });
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const departments = [
    'All', 'General Medicine', 'Cardiology', 'Neurology', 
    'Orthopedics', 'Pediatrics', 'Dermatology'
  ];

  // Parse query params (e.g. /doctors?dept=Cardiology)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const deptParam = params.get('dept');
    if (deptParam && departments.includes(deptParam)) {
      setSelectedDepartment(deptParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchDoctors();
  }, [selectedDepartment, searchQuery]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let url = `/doctors?department=${selectedDepartment}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const response = await API.get(url);
      setDoctors(response.data.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = async (doctor) => {
    if (!user) {
      setSelectedDoctor(doctor);
      setShowAuthPrompt(true);
      return;
    }

    if (user.role !== 'patient') {
      alert(`You are logged in as a ${user.role}. Only patient accounts can book appointments.`);
      return;
    }

    setSelectedDoctor(doctor);
    setSelectedSlot('');
    setBookingStatus({ loading: false, success: false, error: '' });
    fetchSlots(doctor._id, bookingDate);
  };

  const fetchSlots = async (doctorId, dateStr) => {
    try {
      const response = await API.get(`/doctors/${doctorId}?date=${dateStr}`);
      setAvailableSlots(response.data.data.slots);
    } catch (err) {
      console.error('Failed to fetch doctor slots:', err);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setBookingDate(newDate);
    if (selectedDoctor) {
      fetchSlots(selectedDoctor._id, newDate);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      setBookingStatus({ loading: false, success: false, error: 'Please select a time slot' });
      return;
    }

    setBookingStatus({ loading: true, success: false, error: '' });

    try {
      await API.post('/appointments', {
        doctorId: selectedDoctor._id,
        date: bookingDate,
        timeSlot: selectedSlot,
        reasonForVisit: reasonForVisit || 'General OPD Consultation'
      });

      setBookingStatus({ loading: false, success: true, error: '' });
      setTimeout(() => {
        setSelectedDoctor(null);
        navigate('/patient/dashboard');
      }, 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment. Please try again.';
      setBookingStatus({ loading: false, success: false, error: msg });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Page Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-sky-100">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Public Specialist Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Certified Doctors & Clinical Faculty
          </h1>
          <p className="text-sm sm:text-base text-sky-100 max-w-2xl leading-relaxed">
            Browse our verified team of medical consultants. Review clinical specializations, qualifications, experience, and OPD consultation schedules freely without any login barrier.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Department Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedDepartment === dept
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any specialist matching your search query in {selectedDepartment}. Try broadening your search or choosing 'All'.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-100 to-teal-100 border border-sky-200 flex items-center justify-center text-sky-700 font-black text-xl shadow-inner">
                      {doctor.userId?.name ? doctor.userId.name.replace('Dr. ', '').charAt(0) : 'D'}
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {doctor.department}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {doctor.userId?.name || 'Consultant Physician'}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 mt-0.5">{doctor.specialization}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doctor.qualification}</p>
                  </div>

                  {/* Meta stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Experience</p>
                      <p className="text-xs font-extrabold text-slate-800">{doctor.experienceYears}+ Years</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Rating</p>
                      <p className="text-xs font-extrabold text-amber-600 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{doctor.rating || 4.9}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Room</p>
                      <p className="text-xs font-extrabold text-slate-800">Room {doctor.roomNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mon - Fri • 09:00 AM - 05:00 PM</span>
                  </div>

                </div>

                {/* Booking Trigger */}
                <div className="pt-6 mt-2">
                  <button
                    onClick={() => handleOpenBookingModal(doctor)}
                    className="w-full flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* AUTH REQUIRED MODAL (FOR VISITORS) */}
      {showAuthPrompt && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scaleUp">
            
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>
              <button
                onClick={() => { setShowAuthPrompt(false); setSelectedDoctor(null); }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Sign In to Book Appointment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You selected <strong>{selectedDoctor.userId?.name}</strong> ({selectedDoctor.department}). To confirm your slot and receive a real-time digital token, please sign in or register a patient account.
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center space-x-3 text-xs text-sky-800">
              <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
              <span>Free instant account • Zero cancellation fees • Encrypted medical records</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                to="/login"
                state={{ from: '/doctors', doctorId: selectedDoctor._id }}
                className="w-full flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition"
              >
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                state={{ from: '/doctors', doctorId: selectedDoctor._id }}
                className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl transition"
              >
                <span>Create New Patient Account</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* APPOINTMENT BOOKING MODAL (FOR AUTHENTICATED PATIENT) */}
      {!showAuthPrompt && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Book OPD Consultation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDoctor.userId?.name} • {selectedDoctor.department} (Room {selectedDoctor.roomNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingStatus.success ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-lg">Appointment Confirmed!</h4>
                <p className="text-xs text-emerald-800">
                  Your appointment with {selectedDoctor.userId?.name} is successfully scheduled for {bookingDate} at {selectedSlot}. Your digital token has been registered in your Patient Super App.
                </p>
                <p className="text-[11px] font-semibold text-emerald-600 animate-pulse">
                  Redirecting to your patient dashboard...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {bookingStatus.error && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{bookingStatus.error}</span>
                  </div>
                )}

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Consultation Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={handleDateChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Time Slot Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Available Time Slots</label>
                  {availableSlots.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                      Loading available slots for this date...
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            selectedSlot === slot
                              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Visit / Symptoms</label>
                  <textarea
                    rows={2}
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder="Briefly state your concern (e.g. routine checkup, persistent chest pain)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-sky-500 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingStatus.loading || !selectedSlot}
                    className="w-full flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition"
                  >
                    {bookingStatus.loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Appointment & Generate Token</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
