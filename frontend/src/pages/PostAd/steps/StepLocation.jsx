import React from 'react';
import { usePostAd } from '../../../context/PostAdContext';

const StepLocation = () => {
  const { draft, setDraft } = usePostAd();
  const update = (patch) => setDraft(d => ({ ...d, location: { ...d.location, ...patch } }));
  const l = draft.location;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">City</label>
        <input value={l.city} onChange={e => update({ city: e.target.value })} placeholder="e.g. New York" className="border rounded-lg px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Address</label>
        <input value={l.address} onChange={e => update({ address: e.target.value })} placeholder="Street & number" className="border rounded-lg px-3 py-2" />
      </div>
      <div className="md:col-span-2 text-sm text-gray-600">Map picker can be added later for coordinates.</div>
    </div>
  );
};

export default StepLocation;
