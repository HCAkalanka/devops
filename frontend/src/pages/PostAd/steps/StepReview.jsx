import React from 'react';
import { usePostAd } from '../../../context/PostAdContext';
import { Edit3, FileText, Car, MapPin, DollarSign, Image, CheckCircle } from 'lucide-react';

const Section = ({ title, icon: Icon, children, onEdit }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 shadow-sm hover-lift transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
        )}
        <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">{title}</h3>
      </div>
      {onEdit && (
        <button 
          onClick={onEdit} 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium transition-colors border border-blue-200"
        >
          <Edit3 size={14}/> Edit
        </button>
      )}
    </div>
    <div className="text-gray-700">
      {children}
    </div>
  </div>
);

const Pill = ({ children }) => (
  <span className="text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 font-medium border border-blue-200">
    {children}
  </span>
);

const StepReview = ({ onEditStep, publishing, publishError, publishSuccess }) => {
  const { draft } = usePostAd();
  const { vehicle = {}, pricing = {}, location = {} } = draft;

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
        <p className="text-gray-800 text-sm font-medium">
          📋 Review your details carefully. Ensure everything is correct before publishing your ad.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Title & Description" icon={FileText} onEdit={() => onEditStep?.(1)}>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <span className="font-semibold text-gray-900 block mb-1">Title:</span>
              <span className="text-gray-800 text-base">{draft.title || <em className="text-red-600 font-medium">(missing)</em>}</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <span className="font-semibold text-gray-900 block mb-2">Description:</span>
              <p className="text-gray-700 leading-relaxed text-sm">
                {draft.description || <em className="text-gray-500">No description provided.</em>}
              </p>
            </div>
          </div>
        </Section>

        <Section title="Vehicle" icon={Car} onEdit={() => onEditStep?.(0)}>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <span className="font-semibold text-gray-900 block mb-2">Details:</span>
              <div className="flex flex-wrap gap-2">
                <Pill>{vehicle.type || 'type?'}</Pill>
                {vehicle.brand && <Pill>{vehicle.brand}</Pill>}
                {vehicle.model && <Pill>{vehicle.model}</Pill>}
                {vehicle.year && <Pill>{vehicle.year}</Pill>}
                {vehicle.transmission && <Pill>{vehicle.transmission}</Pill>}
                {vehicle.fuel && <Pill>{vehicle.fuel}</Pill>}
                {vehicle.seats && <Pill>{vehicle.seats} seats</Pill>}
              </div>
            </div>
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <span className="font-semibold text-gray-900 block mb-2">Features:</span>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.slice(0,8).map((f,i) => <Pill key={i}>{f}</Pill>)}
                  {vehicle.features.length > 8 && <Pill>+{vehicle.features.length - 8} more</Pill>}
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section title="Location" icon={MapPin} onEdit={() => onEditStep?.(3)}>
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[70px]">City:</span>
              <span className="text-gray-800 font-medium">{location.city || <em className="text-red-600">(missing)</em>}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[70px]">Address:</span>
              <span className="text-gray-700">{location.address || '—'}</span>
            </div>
          </div>
        </Section>

        <Section title="Pricing" icon={DollarSign} onEdit={() => onEditStep?.(2)}>
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[100px]">Price / day:</span>
              <span className="text-gray-800 font-bold text-lg">
                {pricing.pricePerDay ? `LKR ${Number(pricing.pricePerDay).toLocaleString()}` : <em className="text-red-600 text-base">(missing)</em>}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[100px]">Deposit:</span>
              <span className="text-gray-700 font-medium">
                {pricing.deposit ? `LKR ${Number(pricing.deposit).toLocaleString()}` : '—'}
              </span>
            </div>
          </div>
        </Section>

        <Section title="Images" icon={Image} onEdit={() => onEditStep?.(4)}>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            {draft.images && draft.images.length ? (
              <div>
                <span className="font-semibold text-gray-900 block mb-3">{draft.images.length} image(s) uploaded</span>
                <div className="grid grid-cols-3 gap-2">
                  {draft.images.slice(0,6).map((img,i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover-scale">
                      <img src={img.url} alt={`Car image ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {draft.images.length > 6 && (
                    <div className="flex items-center justify-center text-sm font-medium text-gray-600 bg-gray-100 rounded-lg border-2 border-gray-200">
                      +{draft.images.length - 6}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 py-2">No images uploaded.</div>
            )}
          </div>
        </Section>

        <Section title="Status" icon={CheckCircle} onEdit={() => onEditStep?.(5)}>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Availability:</span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium border border-green-200">
                Active when published
              </span>
            </div>
          </div>
        </Section>
      </div>

      <details className="group bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors font-medium">
          ▶ Show raw JSON
        </summary>
        <pre className="p-4 overflow-auto text-xs text-green-400 font-mono bg-gray-950 border-t border-gray-700">
          {JSON.stringify(draft, null, 2)}
        </pre>
      </details>

      {publishing && !publishSuccess && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-blue-700 font-medium">Publishing your listing...</span>
        </div>
      )}
      {publishError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 font-medium">
          ❌ Error: {publishError}
        </div>
      )}
      {publishSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Published successfully! You can now view your listing.
        </div>
      )}
    </div>
  );
};

export default StepReview;
