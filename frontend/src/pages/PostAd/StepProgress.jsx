import React from "react";

const steps = [
  "Vehicle",
  "Details",
  "Pricing",
  "Location",
  "Media",
  "Availability",
  "Review",
];

const StepProgress = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, idx) => {
        const active = idx === currentStep;
        const done = idx < currentStep;
        return (
          <div key={idx} className="flex-1 flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm transition-all
                ${done
                  ? "bg-blue-600 text-white border-blue-600"
                  : active
                  ? "border-blue-500 text-blue-600"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  done ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
