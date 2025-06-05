import React from 'react';
import { Bar } from 'react-chartjs-2';
import { lineChartOptions } from './chartOptions';

const UserGrowthChart = ({ userGrowthData }) => {
  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-base-content">User Growth</h3>
        <div className="text-sm text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
          Last 6 months
        </div>
      </div>
      <div className="h-80">
        <Bar data={userGrowthData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default UserGrowthChart;
