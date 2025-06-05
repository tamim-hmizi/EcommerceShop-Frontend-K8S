import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { doughnutOptions } from './chartOptions';

const CategoryChart = ({ categoryData, totalCategories }) => {
  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-base-content">Product Categories</h3>
        <div className="badge badge-primary badge-lg">
          Total: {totalCategories || 0}
        </div>
      </div>
      <div className="h-80 flex items-center justify-center">
        <Doughnut data={categoryData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default CategoryChart;
