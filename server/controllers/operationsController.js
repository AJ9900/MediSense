/**
 * Hospital Operations Controller
 */

const Bed = require('../models/Bed');
const Medicine = require('../models/Medicine');
const DiagnosticTest = require('../models/DiagnosticTest');
const OxygenResource = require('../models/OxygenResource');
const WasteRecord = require('../models/WasteRecord');
const Ambulance = require('../models/Ambulance');

// --- BEDS & ICU ---
const getBeds = async (req, res, next) => {
  try {
    let beds = await Bed.find().sort({ category: 1, number: 1 });
    if (beds.length === 0) {
      // Seed default beds if collection is empty
      const defaultBeds = [
        { bedId: 'ICU-101', number: '101', category: 'ICU', status: 'AVAILABLE', roomNumber: '201' },
        { bedId: 'ICU-102', number: '102', category: 'ICU', status: 'OCCUPIED', roomNumber: '201' },
        { bedId: 'GEN-201', number: '201', category: 'GENERAL', status: 'AVAILABLE', roomNumber: '301' },
        { bedId: 'GEN-202', number: '202', category: 'GENERAL', status: 'CLEANING', roomNumber: '301' },
        { bedId: 'EMG-301', number: '301', category: 'EMERGENCY', status: 'AVAILABLE', roomNumber: '102' }
      ];
      beds = await Bed.insertMany(defaultBeds);
    }
    res.status(200).json({ success: true, count: beds.length, data: beds });
  } catch (error) { next(error); }
};

const updateBedStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bed = await Bed.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: bed });
  } catch (error) { next(error); }
};

// --- PHARMACY MEDICINES ---
const getMedicines = async (req, res, next) => {
  try {
    let medicines = await Medicine.find().sort({ name: 1 });
    if (medicines.length === 0) {
      const defaultMedicines = [
        { name: 'Paracetamol 500mg', category: 'Analgesic', batchNumber: 'B-2026-01', stockQuantity: 250, minStockThreshold: 50, expiryDate: '2027-12-31', unitPrice: 5.0 },
        { name: 'Amoxicillin 250mg', category: 'Antibiotics', batchNumber: 'B-2026-02', stockQuantity: 18, minStockThreshold: 30, expiryDate: '2027-06-30', unitPrice: 15.0 },
        { name: 'Atorvastatin 10mg', category: 'Cardiac', batchNumber: 'B-2026-03', stockQuantity: 120, minStockThreshold: 20, expiryDate: '2028-01-15', unitPrice: 22.0 }
      ];
      medicines = await Medicine.insertMany(defaultMedicines);
    }
    res.status(200).json({ success: true, count: medicines.length, data: medicines });
  } catch (error) { next(error); }
};

const addMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, data: medicine });
  } catch (error) { next(error); }
};

// --- OXYGEN & RESOURCES ---
const getOxygenStatus = async (req, res, next) => {
  try {
    let oxygen = await OxygenResource.findOne();
    if (!oxygen) {
      oxygen = await OxygenResource.create({
        totalCylinders: 50,
        availableCylinders: 38,
        mainTankLevelPercent: 78.5,
        icuDailyConsumptionRate: 12.0
      });
    }
    res.status(200).json({ success: true, data: oxygen });
  } catch (error) { next(error); }
};

const updateOxygenStatus = async (req, res, next) => {
  try {
    const { availableCylinders, mainTankLevelPercent } = req.body;
    let oxygen = await OxygenResource.findOne();
    if (oxygen) {
      if (availableCylinders !== undefined) oxygen.availableCylinders = availableCylinders;
      if (mainTankLevelPercent !== undefined) oxygen.mainTankLevelPercent = mainTankLevelPercent;
      await oxygen.save();
    }
    res.status(200).json({ success: true, data: oxygen });
  } catch (error) { next(error); }
};

// --- MEDICAL WASTE LOG ---
const getWasteRecords = async (req, res, next) => {
  try {
    let waste = await WasteRecord.find().sort({ createdAt: -1 });
    if (waste.length === 0) {
      waste = await WasteRecord.insertMany([
        { category: 'BIOMEDICAL', quantityKg: 14.5, department: 'Surgery Ward', disposalStatus: 'COLLECTED' },
        { category: 'SHARPS', quantityKg: 4.2, department: 'Emergency Room', disposalStatus: 'STORED' }
      ]);
    }
    res.status(200).json({ success: true, count: waste.length, data: waste });
  } catch (error) { next(error); }
};

const logWasteRecord = async (req, res, next) => {
  try {
    const waste = await WasteRecord.create(req.body);
    res.status(201).json({ success: true, data: waste });
  } catch (error) { next(error); }
};

// --- AMBULANCES ---
const getAmbulances = async (req, res, next) => {
  try {
    let ambulances = await Ambulance.find().sort({ vehicleNumber: 1 });
    if (ambulances.length === 0) {
      ambulances = await Ambulance.insertMany([
        { vehicleNumber: 'DL-01-AMB-101', driverName: 'Suresh Kumar', driverPhone: '+91 9811223344', status: 'AVAILABLE', currentLocation: 'Hospital Base' },
        { vehicleNumber: 'DL-01-AMB-102', driverName: 'Amit Singh', driverPhone: '+91 9811223355', status: 'DISPATCHED', currentLocation: 'Sector 62 Noida', emergencyLevel: 'CRITICAL' }
      ]);
    }
    res.status(200).json({ success: true, count: ambulances.length, data: ambulances });
  } catch (error) { next(error); }
};

const dispatchAmbulance = async (req, res, next) => {
  try {
    const { status, emergencyLevel, currentLocation } = req.body;
    const amb = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { status, emergencyLevel, currentLocation },
      { new: true }
    );
    res.status(200).json({ success: true, data: amb });
  } catch (error) { next(error); }
};

module.exports = {
  getBeds, updateBedStatus,
  getMedicines, addMedicine,
  getOxygenStatus, updateOxygenStatus,
  getWasteRecords, logWasteRecord,
  getAmbulances, dispatchAmbulance
};
