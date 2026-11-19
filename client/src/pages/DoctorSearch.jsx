import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Stethoscope, Search, Star, Clock, MapPin, Calendar, CheckCircle2, 
  X, AlertCircle, ArrowRight, ShieldCheck, HeartPulse 
} from 'lucide-react';

export default function DoctorSearch() {
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

  const departments = [
    'All', 'General Medicine', 'Cardiology', 'Neurology', 
    'Orthopedics', 'Pediatrics', 'Dermatology'
  ];

  // Fetch doctor list based on department/search filter
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

  // Open booking modal and fetch live slots for target doctor & date
  const handleOpenBookingModal = async (doctor) => {
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
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment. Please try again.';
      setBookingStatus({ loading: false, success: false, error: msg });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-sky-600" />
              Doctor Recommendation & Search
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Find verified hospital specialists by department, rating, and earliest slot availability.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedDepartment === dept
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your department filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase tracking-wide">
                      {doctor.department}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{doctor.userId?.name || 'Dr. Specialist'}</h3>
                    <p className="text-xs font-medium text-slate-600">{doctor.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-amber-700 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doctor.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>{doctor.experienceYears} Years Exp.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Room #{doctor.roomNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Available Today
                </span>
                <button
                  onClick={() => handleOpenBookingModal(doctor)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-500/20 transition flex items-center gap-1.5"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Book Appointment</h3>
                <p className="text-xs text-slate-500">{selectedDoctor.userId?.name} • {selectedDoctor.department}</p>
              </div>
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingStatus.success ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500">Your digital token and timeline have been generated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingStatus.error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingStatus.error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={handleDateChange}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Time Slots</label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                    {availableSlots.map(({ slot, isBooked }) => (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold transition border ${
                          isBooked
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : selectedSlot === slot
                            ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Chest pain, routine OPD checkup"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={bookingStatus.loading || !selectedSlot}
                    onClick={handleConfirmBooking}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                  >
                    {bookingStatus.loading ? 'Booking...' : 'Confirm Slot'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
