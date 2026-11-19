import React, { useState } from 'react';
import { MapPin, Compass, ArrowRight, Building, Layers, CheckCircle2 } from 'lucide-react';

export default function IndoorNavigation() {
  const [selectedDestination, setSelectedDestination] = useState('xray');

  const navigationGuides = {
    xray: {
      title: 'Radiology & X-Ray Room #204',
      floor: '2nd Floor',
      wing: 'Corridor B',
      steps: [
        'Start at Main Entrance Reception Desk',
        'Take Lift A or Central Stairs to 2nd Floor',
        'Turn Right into Corridor B (Follow Blue Floor Signs)',
        'Radiology Room #204 will be on your Left'
      ]
    },
    cardiology: {
      title: 'Cardiology OPD Room #204',
      floor: '2nd Floor',
      wing: 'OPD Wing A',
      steps: [
        'Start at Main Entrance Reception Desk',
        'Take Elevator A to 2nd Floor',
        'Walk straight down OPD Wing A',
        'Cardiology Room #204 is next to Doctor Lounge'
      ]
    },
    lab: {
      title: 'Central Pathology Laboratory #102',
      floor: '1st Floor',
      wing: 'Diagnostic Wing',
      steps: [
        'Start at Main Entrance Reception Desk',
        'Turn Left past Pharmacy Counter #3',
        'Pathology Sample Collection Room #102 is at the end of the hallway'
      ]
    },
    pharmacy: {
      title: 'Main Pharmacy Dispensing Counter #3',
      floor: 'Ground Floor',
      wing: 'Main Atrium',
      steps: [
        'Start at Main Entrance Reception Desk',
        'Walk 20 meters straight into Main Atrium',
        'Pharmacy Counter #3 is next to Billing Counter'
      ]
    }
  };

  const activeGuide = navigationGuides[selectedDestination];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase tracking-wide">
            Indoor Wayfinding
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            Hospital Indoor Navigation Guide
          </h2>
          <p className="text-xs text-slate-500">
            Step-by-step room and floor directions for seamless patient movement.
          </p>
        </div>

        {/* Destination Selector */}
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          className="py-2 px-3 border border-slate-300 rounded-xl text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="xray">X-Ray & Radiology (#204)</option>
          <option value="cardiology">Cardiology OPD (#204)</option>
          <option value="lab">Pathology Lab (#102)</option>
          <option value="pharmacy">Main Pharmacy (#3)</option>
        </select>
      </div>

      {/* Navigation Card Display */}
      {activeGuide && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              {activeGuide.title}
            </h3>
            <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full">
              {activeGuide.floor} • {activeGuide.wing}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {activeGuide.steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
