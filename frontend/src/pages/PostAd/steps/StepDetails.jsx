import React from "react";
import { usePostAd } from "../../../context/PostAdContext";
import StepLayout from "../StepLayout";

const StepDetails = () => {
  const { draft, setDraft } = usePostAd();
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <StepLayout title="Ad Details" subtitle="Add an engaging title and description">
      <div className="grid gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Ad Title</label>
          <input
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Catchy title (e.g. Luxury Sedan for Rent)"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={draft.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={5}
            placeholder="Describe your vehicle, rules, and highlights"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </StepLayout>
  );
};

export default StepDetails;
