import React from 'react';
import { usePostAd } from '../../../context/PostAdContext';

const StepPricing = () => {
  const { draft, setDraft } = usePostAd();
  const updatePricing = (patch) => setDraft(d => ({ ...d, pricing: { ...d.pricing, ...patch } }));
  const p = draft.pricing;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Price per day ($)</label>
        <input value={p.pricePerDay} onChange={e => updatePricing({ pricePerDay: e.target.value })} placeholder="100" className="border rounded-lg px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Deposit ($)</label>
        <input value={p.deposit} onChange={e => updatePricing({ deposit: e.target.value })} placeholder="0" className="border rounded-lg px-3 py-2" />
      </div>
      <div className="md:col-span-2 text-sm text-gray-600">Optional: Add discounts or weekend pricing later.</div>
    </div>
  );
};

export default StepPricing;
