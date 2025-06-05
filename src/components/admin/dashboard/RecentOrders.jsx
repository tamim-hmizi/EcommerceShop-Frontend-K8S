import React from 'react';
import { FiAlertCircle } from "react-icons/fi";

const RecentOrders = ({ recentOrders, pendingOrders }) => {
  const getStatusBadgeClass = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered':
        return 'badge-success';
      case 'shipped':
        return 'badge-info';
      case 'processing':
        return 'badge-primary';
      default:
        return 'badge-warning';
    }
  };

  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-base-content">Recent Orders</h3>
        <div className="flex items-center">
          <span className="badge badge-primary badge-lg">
            {pendingOrders || 0} pending
          </span>
        </div>
      </div>
      <div className="overflow-hidden">
        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 border border-base-300 hover:bg-base-200 transition-all duration-200 rounded-lg group"
              >
                <div>
                  <p className="font-semibold text-base-content">
                    #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-base-content/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-base-content">
                    ${order.totalPrice.toLocaleString()}
                  </p>
                  <span className={`badge badge-sm ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-base-content/60">
            <FiAlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No recent orders</p>
            <p className="text-sm">Orders will appear here once customers start placing them</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
