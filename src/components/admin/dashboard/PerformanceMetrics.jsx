import React from 'react';
import { FiActivity, FiPackage, FiClock } from "react-icons/fi";

const PerformanceMetrics = ({ avgOrderValue, totalStock }) => {
  const metrics = [
    {
      icon: FiActivity,
      label: "Avg. Order Value",
      value: `$${(avgOrderValue || 0).toFixed(2)}`,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-600"
    },
    {
      icon: FiPackage,
      label: "Total Stock",
      value: `${(totalStock || 0).toLocaleString()} units`,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-600"
    },
    {
      icon: FiClock,
      label: "Processing Time",
      value: "2.5 days",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600"
    }
  ];

  return (
    <div className="admin-card p-6">
      <h3 className="text-lg font-semibold text-base-content mb-6">Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className={`flex items-center p-5 ${metric.bgColor} rounded-xl border border-base-300 hover:shadow-lg transition-all duration-200 group`}
            >
              <div className={`p-3 bg-gradient-to-r ${metric.color} text-white rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-base-content/60 mb-1">
                  {metric.label}
                </p>
                <p className={`text-xl font-bold ${metric.textColor}`}>
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
