import React from "react";
import { motion } from "framer-motion";

const StepLayout = ({ title, subtitle, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white shadow-md border border-gray-100 rounded-2xl p-6"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
};

export default StepLayout;
