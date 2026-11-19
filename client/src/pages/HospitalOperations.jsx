import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Building2, Bed, Package, Gauge, Trash2, Truck, AlertTriangle, 
  CheckCircle2, Clock, Plus, Activity, Zap, RefreshCw, ShieldAlert 
} from 'lucide-react';

export default function HospitalOperations() {
  const [activeTab, setActiveTab] = useState('beds'); // 'beds' | 'pharmacy' | 'oxygen' | 'waste' | 'ambulance'

  // Data states
  const [beds, setBeds] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [oxygen, setOxygen] = useState(null);
  const [wasteRecords, setWasteRecords] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperationsData();
  }, [activeTab]);

  const fetchOperationsData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'beds') {
        const res = await API.get('/operations/beds');
        setBeds(res.data.data);
      } else if (activeTab === 'pharmacy') {
        const res = await API.get('/operations/medicines');
        setMedicines(res.data.data);
      } else if (activeTab === 'oxygen') {
        const res = await API.get('/operations/oxygen');
        setOxygen(res.data.data);
      } else if (activeTab === 'waste') {
        const res = await API.get('/operations/waste');
        setWasteRecords(res.data.data);
      } else if (activeTab === 'ambulance') {
        const res = await API.get('/operations/ambulances');
        setAmbulances(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch operations data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBedStatus = async (id, newStatus) => {
    try {
      await API.put(`/operations/beds/${id}`, { status: newStatus });
      fetchOperationsData();
    } catch (err) {
      console.error('Failed to update bed status:', err);
    }
  };

  const handleDispatchAmbulance = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'AVAILABLE' ? 'DISPATCHED' : 'AVAILABLE';
      const emergencyLevel = nextStatus === 'DISPATCHED' ? 'CRITICAL' : 'NONE';
      await API.put(`/operations/ambulances/${id}`, { status: nextStatus, emergencyLevel });
      fetchOperationsData();
    } catch (err) {
      console.error('Failed to dispatch ambulance:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Operations Suite Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-amber-600" />
              Hospital Operations & Resource Suite
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time monitoring and control for Beds, ICU, Pharmacy, Oxygen, Waste, and Emergency Pre-Arrival.
            </p>
          </div>
          <button
            onClick={fetchOperationsData}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 self-start sm:self-auto border border-slate-200 transition"
            title="Refresh Operations Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Operations Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setActiveTab('beds')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'beds' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bed className="w-4 h-4" /> Beds & ICU
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'pharmacy' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" /> Pharmacy Stock
          </button>

          <button
            onClick={() => setActiveTab('oxygen')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'oxygen' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" /> Oxygen Supply
          </button>

          <button
            onClick={() => setActiveTab('waste')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'waste' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trash2 className="w-4 h-4" /> Medical Waste
          </button>

          <button
            onClick={() => setActiveTab('ambulance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'ambulance' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" /> Ambulance & Emergency
          </button>
        </div>
      </div>

      {/* 1. BEDS & ICU TAB */}
      {activeTab === 'beds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Bed & ICU Occupancy Matrix</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
              <span className="flex items-center gap-1 text-rose-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied</span>
              <span className="flex items-center gap-1 text-amber-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {beds.map((b) => (
              <div key={b._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Bed #{b.number}</h3>
                    <p className="text-xs text-slate-500">Room #{b.roomNumber}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    b.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'OCCUPIED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Change Status:</span>
                  <select
                    value={b.status}
                    onChange={(e) => handleUpdateBedStatus(b._id, e.target.value)}
                    className="py-1 px-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="CLEANING">CLEANING</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PHARMACY STOCK TAB */}
      {activeTab === 'pharmacy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Pharmacy Medicine Inventory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Medicine Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Batch No</th>
                  <th className="p-3">Quantity In Stock</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Stock Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{m.name}</td>
                    <td className="p-3">{m.category}</td>
                    <td className="p-3 font-mono text-slate-500">{m.batchNumber}</td>
                    <td className="p-3 font-bold">{m.stockQuantity} units</td>
                    <td className="p-3">{m.expiryDate}</td>
                    <td className="p-3">₹{m.unitPrice}</td>
                    <td className="p-3">
                      {m.stockQuantity <= m.minStockThreshold ? (
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> LOW STOCK
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">NORMAL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. OXYGEN SUPPLY TAB */}
      {activeTab === 'oxygen' && oxygen && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-sky-600" />
            Central Oxygen Tank & Cylinder Monitor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gauge Progress Bar */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Main Oxygen Tank Level</span>
                <span className="text-sky-700 text-base">{oxygen.mainTankLevelPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${oxygen.mainTankLevelPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500">ICU Daily Consumption: <strong>{oxygen.icuDailyConsumptionRate} Liters/min</strong></p>
            </div>

            {/* Cylinder Stock Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Oxygen Cylinders</span>
                <div className="text-3xl font-extrabold text-slate-900">{oxygen.availableCylinders} / {oxygen.totalCylinders}</div>
                <p className="text-xs text-slate-500">Filled & Available Cylinders Ready for Deployment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MEDICAL WASTE TAB */}
      {activeTab === 'waste' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Biomedical Waste Logging & Tracking</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Waste Category</th>
                  <th className="p-3">Quantity (Kg)</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Collection Date</th>
                  <th className="p-3">Disposal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wasteRecords.map((w) => (
                  <tr key={w._id}>
                    <td className="p-3 font-bold text-slate-900">{w.category}</td>
                    <td className="p-3 font-bold">{w.quantityKg} Kg</td>
                    <td className="p-3">{w.department}</td>
                    <td className="p-3">{w.collectionTime}</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                        {w.disposalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. AMBULANCE & EMERGENCY PRE-ARRIVAL TAB */}
      {activeTab === 'ambulance' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Ambulance Fleet & Emergency Pre-Arrival System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ambulances.map((amb) => (
              <div key={amb._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                      {amb.vehicleNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Driver: {amb.driverName}</h3>
                    <p className="text-xs text-slate-500">Phone: {amb.driverPhone}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    amb.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                  }`}>
                    {amb.status}
                  </span>
                </div>

                {amb.status === 'DISPATCHED' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>EMERGENCY PRE-ARRIVAL ALERT TRIGGERED — Room #102 Prepared</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Location: <strong>{amb.currentLocation}</strong></span>
                  <button
                    onClick={() => handleDispatchAmbulance(amb._id, amb.status)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                      amb.status === 'AVAILABLE'
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {amb.status === 'AVAILABLE' ? 'Dispatch Emergency' : 'Recall to Base'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
