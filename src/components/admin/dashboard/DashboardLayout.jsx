import React from 'react';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign } from "react-icons/fi";
import DashboardHeader from './DashboardHeader';
import StatsCard from './StatsCard';
import SalesChart from './SalesChart';
import OrderStatusChart from './OrderStatusChart';
import CategoryChart from './CategoryChart';
import UserGrowthChart from './UserGrowthChart';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProducts';
import PerformanceMetrics from './PerformanceMetrics';

const DashboardLayout = ({
  user,
  stats,
  statsChanges,
  salesData,
  orderStatusData,
  categoryData,
  userGrowthData,
  recentOrders,
  topProducts,
  timeFilter,
  loading,
  refreshing,
  handleTimeFilterChange,
  handleRefresh
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="admin-card p-6 h-32 animate-pulse">
                  <div className="h-4 bg-base-300 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-base-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with welcome message and time filter */}
          <DashboardHeader
            userName={user?.name}
            timeFilter={timeFilter}
            onTimeFilterChange={handleTimeFilterChange}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={<FiUsers className="w-6 h-6 text-white" />}
              title="Total Users"
              value={stats.users}
              change={statsChanges.users}
              color="indigo"
            />
            <StatsCard
              icon={<FiPackage className="w-6 h-6 text-white" />}
              title="Products"
              value={stats.products}
              change={statsChanges.products}
              color="green"
            />
            <StatsCard
              icon={<FiShoppingCart className="w-6 h-6 text-white" />}
              title="Orders"
              value={stats.orders}
              change={statsChanges.orders}
              color="blue"
            />
            <StatsCard
              icon={<FiDollarSign className="w-6 h-6 text-white" />}
              title="Revenue"
              value={stats.revenue}
              change={statsChanges.revenue}
              isCurrency
              color="amber"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Trend Chart */}
            <SalesChart salesData={salesData} />

            {/* Order Status Distribution */}
            <OrderStatusChart orderStatusData={orderStatusData} stats={stats} />
          </div>

          {/* Second Row of Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution */}
            <CategoryChart categoryData={categoryData} totalCategories={stats.categories} />

            {/* User Growth */}
            <UserGrowthChart userGrowthData={userGrowthData} />
          </div>

          {/* Recent Activity and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <RecentOrders recentOrders={recentOrders} pendingOrders={stats.pendingOrders} />

            {/* Top Products */}
            <TopProducts topProducts={topProducts} totalStock={stats.totalStock} />
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics avgOrderValue={stats.avgOrderValue} totalStock={stats.totalStock} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
