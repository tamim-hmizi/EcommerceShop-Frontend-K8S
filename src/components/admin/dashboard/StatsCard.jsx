import React from 'react';
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const StatsCard = ({ icon, title, value, change, isCurrency = false, color = 'indigo' }) => {
  const isPositive = change >= 0;
  const formattedValue = isCurrency
    ? `$${value.toLocaleString()}`
    : value.toLocaleString();

  // Color variants with better theme support
  const colorVariants = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="admin-card overflow-hidden group">
      <div className={`bg-gradient-to-r ${colorVariants[color]} p-6 text-white relative`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              {icon}
            </div>
            <div className={`flex items-center ${isPositive ? 'text-green-200' : 'text-red-200'} text-sm font-semibold`}>
              {isPositive ? (
                <FiArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <FiArrowDown className="mr-1 h-4 w-4" />
              )}
              {Math.abs(change)}%
            </div>
          </div>

          <h3 className="text-white/90 text-sm font-medium uppercase tracking-wide mb-2">
            {title}
          </h3>
          <p className="text-3xl font-bold text-white">
            {formattedValue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
