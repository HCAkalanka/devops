import React, { useState } from 'react';
import { usePostAd } from '../../../context/PostAdContext';

const vehicleTypes = ['car','suv','van','motorbike','bus','truck','threewheeler','tractor'];

const StepVehicle = () => {
  const { draft, setDraft } = usePostAd();
  const v = draft.vehicle;
  const [featureInput, setFeatureInput] = useState('');
  const update = (patch) => setDraft(d => ({ ...d, vehicle: { ...d.vehicle, ...patch } }));
  const addFeature = () => {
    const f = featureInput.trim();
    if (!f) return;
    if ((v.features||[]).includes(f)) { setFeatureInput(''); return; }
    update({ features: [...(v.features||[]), f] });
    setFeatureInput('');
  };
  const removeFeature = (f) => update({ features: (v.features||[]).filter(x => x !== f) });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Type</label>
        <div className="flex flex-wrap gap-2">
          {vehicleTypes.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => update({ type: t })}
              className={`px-3 py-1.5 rounded-full text-sm capitalize border transition ${v.type === t ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
            >{t}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Brand</label>
          <input value={v.brand} onChange={e => update({ brand: e.target.value })} placeholder="e.g. Toyota" className="border rounded-lg px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Model</label>
          <input value={v.model} onChange={e => update({ model: e.target.value })} placeholder="e.g. Corolla" className="border rounded-lg px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Year</label>
          <input value={v.year} onChange={e => update({ year: e.target.value.replace(/[^0-9]/g,'') })} placeholder="2024" className="border rounded-lg px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Seats</label>
          <input value={v.seats} onChange={e => update({ seats: e.target.value.replace(/[^0-9]/g,'') })} placeholder="5" className="border rounded-lg px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Transmission</label>
          <select value={v.transmission} onChange={e => update({ transmission: e.target.value })} className="border rounded-lg px-3 py-2">
            <option>Automatic</option>
            <option>Manual</option>
            <option>Semi-Automatic</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Fuel</label>
          <select value={v.fuel} onChange={e => update({ fuel: e.target.value })} className="border rounded-lg px-3 py-2">
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Electric</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Features</label>
          <div className="flex gap-2">
            <input value={featureInput} onChange={e=>setFeatureInput(e.target.value)} placeholder="e.g. AC" className="border rounded-lg px-3 py-2 flex-1" />
            <button type="button" onClick={addFeature} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add</button>
          </div>
          {v.features && v.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {v.features.map(f => (
                <span key={f} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  {f}
                  <button type="button" onClick={()=>removeFeature(f)} className="text-red-500 hover:text-red-700">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepVehicle;
