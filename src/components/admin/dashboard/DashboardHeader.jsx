import React from 'react';
import { FiRefreshCw } from "react-icons/fi";
import TimeFilter from './TimeFilter';

const DashboardHeader = ({ userName, timeFilter, onTimeFilterChange, onRefresh, refreshing }) => {
  return (
    <div className="admin-header flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 p-6 rounded-lg">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        <p className="text-base-content/70 mt-1">Welcome back, {userName || 'Admin'}!</p>
      </div>

      <div className="flex items-center gap-4">
        <TimeFilter
          currentFilter={timeFilter}
          onChange={onTimeFilterChange}
        />

        <button
          onClick={onRefresh}
          className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-all duration-200"
          disabled={refreshing}
          title="Refresh dashboard data"
        >
          <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
