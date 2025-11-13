import React, { useState } from "react";
import StepProgress from "./StepProgress";
import StepVehicle from "./steps/StepVehicle";
import StepDetails from "./steps/StepDetails";
import StepPricing from "./steps/StepPricing";
import StepLocation from "./steps/StepLocation";
import StepMedia from "./steps/StepMedia";
import StepAvailability from "./steps/StepAvailability";
import StepReview from "./steps/StepReview";
import { createListing } from '../../api/listings';
import { usePostAd } from "../../context/PostAdContext";

const steps = [
  StepVehicle,
  StepDetails,
  StepPricing,
  StepLocation,
  StepMedia,
  StepAvailability,
  StepReview,
];

const PostAd = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { draft } = usePostAd();
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(null);

  const StepComponent = steps[currentStep];

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const doPublish = async () => {
    if (publishing) return;
    setPublishing(true);
    setPublishError('');
    try {
      const payload = { ...draft, status: 'active' };
      const created = await createListing(payload);
      setPublishSuccess(created);
      // Navigate to the new listing details if desired
      // window.location.href = `/cardetails/${created._id}?source=listing`;
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to publish';
      setPublishError(msg);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <StepProgress currentStep={currentStep} />
      <div className="mt-6">
        <StepComponent
          onEditStep={(i) => setCurrentStep(i)}
          publishing={publishing}
          publishError={publishError}
          publishSuccess={publishSuccess}
        />
      </div>

      <div className="flex justify-between mt-8">
        {currentStep > 0 ? (
          <button
            onClick={back}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < steps.length - 1 ? (
          <button
            onClick={next}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={doPublish}
            disabled={publishing}
            className="px-6 py-2 bg-green-600 disabled:opacity-60 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            {publishing && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeOpacity="0.3" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            )}
            {publishSuccess ? 'Published' : 'Publish'}
          </button>
        )}
      </div>
      {publishError && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{publishError}</div>
      )}
      {publishSuccess && (
        <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
          Listing published successfully.
          <button
            onClick={() => window.location.href = `/cardetails/${publishSuccess._id}?source=listing`}
            className="ml-3 underline text-green-700"
          >View Listing →</button>
        </div>
      )}
    </div>
  );
};

export default PostAd;
