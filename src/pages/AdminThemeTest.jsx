import React from 'react';
import { useTheme } from '../hooks/useTheme';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardHeader from '../components/admin/dashboard/DashboardHeader';
import StatsCard from '../components/admin/dashboard/StatsCard';
import TimeFilter from '../components/admin/dashboard/TimeFilter';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

const AdminThemeTest = () => {
  const { currentTheme, toggleTheme, isDark } = useTheme();

  // Mock data for testing
  const mockStats = {
    users: 1250,
    products: 89,
    orders: 342,
    revenue: 45678
  };

  const mockStatsChanges = {
    users: 12.5,
    products: -2.3,
    orders: 8.7,
    revenue: 15.2
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Theme Test Header */}
        <div className="admin-header p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Admin Theme Test Page
              </h1>
              <p className="text-base-content/70 mt-2">
                Testing dark/light mode implementation across all admin components
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-base-content">
                Current Theme: {currentTheme}
              </span>
              <button
                onClick={toggleTheme}
                className="btn btn-primary"
              >
                Toggle to {isDark ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Header Test */}
        <DashboardHeader
          userName="Test Admin"
          timeFilter="week"
          onTimeFilterChange={() => {}}
          onRefresh={() => {}}
          refreshing={false}
        />

        {/* Stats Cards Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<FiUsers className="w-6 h-6 text-white" />}
            title="Total Users"
            value={mockStats.users}
            change={mockStatsChanges.users}
            color="indigo"
          />
          <StatsCard
            icon={<FiPackage className="w-6 h-6 text-white" />}
            title="Products"
            value={mockStats.products}
            change={mockStatsChanges.products}
            color="green"
          />
          <StatsCard
            icon={<FiShoppingCart className="w-6 h-6 text-white" />}
            title="Orders"
            value={mockStats.orders}
            change={mockStatsChanges.orders}
            color="blue"
          />
          <StatsCard
            icon={<FiDollarSign className="w-6 h-6 text-white" />}
            title="Revenue"
            value={mockStats.revenue}
            change={mockStatsChanges.revenue}
            isCurrency
            color="amber"
          />
        </div>

        {/* Component Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card Examples */}
          <div className="admin-card p-6">
            <h3 className="text-lg font-semibold text-base-content mb-4">
              Admin Card Example
            </h3>
            <p className="text-base-content/70 mb-4">
              This is an example of the admin-card class with proper theme support.
            </p>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm">Primary</button>
              <button className="btn btn-secondary btn-sm">Secondary</button>
              <button className="btn btn-outline btn-sm">Outline</button>
            </div>
          </div>

          {/* Table Example */}
          <div className="admin-table">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-base-200 transition-colors">
                  <td>
                    <div className="font-semibold text-base-content">
                      Sample Item 1
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline btn-primary">
                      Edit
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-base-200 transition-colors">
                  <td>
                    <div className="font-semibold text-base-content">
                      Sample Item 2
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-warning">Pending</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline btn-primary">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Time Filter Test */}
        <div className="admin-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Time Filter Component
          </h3>
          <TimeFilter
            currentFilter="week"
            onChange={() => {}}
          />
        </div>

        {/* Theme Variables Display */}
        <div className="admin-card p-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Theme Variables Test
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary text-primary-content rounded-lg text-center">
              <div className="font-semibold">Primary</div>
              <div className="text-sm opacity-80">bg-primary</div>
            </div>
            <div className="p-4 bg-secondary text-secondary-content rounded-lg text-center">
              <div className="font-semibold">Secondary</div>
              <div className="text-sm opacity-80">bg-secondary</div>
            </div>
            <div className="p-4 bg-base-200 text-base-content rounded-lg text-center">
              <div className="font-semibold">Base 200</div>
              <div className="text-sm opacity-60">bg-base-200</div>
            </div>
            <div className="p-4 bg-base-300 text-base-content rounded-lg text-center">
              <div className="font-semibold">Base 300</div>
              <div className="text-sm opacity-60">bg-base-300</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeTest;
