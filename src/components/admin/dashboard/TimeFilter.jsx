import React from 'react';

const TimeFilter = ({ currentFilter, onChange }) => {
  const filters = [
    { id: 'all', label: 'All Time' },
    { id: 'year', label: 'Year' },
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'today', label: 'Today' }
  ];

  return (
    <div className="flex space-x-2 text-sm">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentFilter === filter.id
              ? 'bg-primary text-primary-content shadow-md'
              : 'bg-base-200 text-base-content hover:bg-base-300 hover:shadow-sm'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;
