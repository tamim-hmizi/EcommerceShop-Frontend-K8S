import React from 'react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions } from './chartOptions';

const SalesChart = ({ salesData }) => {
  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-base-content">Sales Trend</h3>
        <div className="text-sm text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
          Last 7 days
        </div>
      </div>
      <div className="h-80">
        <Line data={salesData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default SalesChart;
