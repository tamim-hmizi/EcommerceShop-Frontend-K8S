import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { doughnutOptions } from './chartOptions';

const OrderStatusChart = ({ orderStatusData, stats }) => {
  return (
    <div className="admin-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-base-content">Order Status</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-base-200 px-3 py-1 rounded-full">
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
            <span className="text-xs font-medium text-base-content">
              Pending: {stats.pendingOrders || 0}
            </span>
          </div>
          <div className="flex items-center bg-base-200 px-3 py-1 rounded-full">
            <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
            <span className="text-xs font-medium text-base-content">
              Processing: {stats.processingOrders || 0}
            </span>
          </div>
          <div className="flex items-center bg-base-200 px-3 py-1 rounded-full">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
            <span className="text-xs font-medium text-base-content">
              Delivered: {stats.deliveredOrders || 0}
            </span>
          </div>
        </div>
      </div>
      <div className="h-80 flex items-center justify-center">
        <Doughnut data={orderStatusData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default OrderStatusChart;
