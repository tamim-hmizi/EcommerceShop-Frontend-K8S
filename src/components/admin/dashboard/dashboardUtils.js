// Utility functions for dashboard data processing

// Filter data based on selected time period
export const filterDataByTime = (data, timeFilter) => {
  if (timeFilter === 'all') return data;

  const now = new Date();
  let cutoffDate;

  switch (timeFilter) {
    case 'today':
      cutoffDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      cutoffDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return data;
  }

  return data.filter(item => new Date(item.createdAt) >= cutoffDate);
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 100;
  return Number(((current - previous) / previous * 100).toFixed(1));
};

// Prepare sales chart data
export const prepareSalesChartData = (orders) => {
  // If no orders, create sample data
  if (!orders || orders.length === 0) {
    const today = new Date();
    const sampleDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString();
    });

    return {
      labels: sampleDates,
      datasets: [
        {
          label: 'Revenue',
          data: sampleDates.map(() => 0),
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  try {
    // Group orders by date
    const ordersByDate = orders.reduce((acc, order) => {
      if (!order.createdAt) return acc;

      const date = new Date(order.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += order.totalPrice || 0;
      return acc;
    }, {});

    // Sort dates and take last 7
    const sortedDates = Object.keys(ordersByDate).sort((a, b) => new Date(a) - new Date(b));
    const recentDates = sortedDates.slice(-7);
    const recentRevenue = recentDates.map(date => ordersByDate[date]);

    return {
      labels: recentDates.length > 0 ? recentDates : ['No Data'],
      datasets: [
        {
          label: 'Revenue',
          data: recentRevenue.length > 0 ? recentRevenue : [0],
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  } catch (error) {
    console.error("Error preparing sales chart data:", error);

    // Fallback to empty chart
    return {
      labels: ['No Data'],
      datasets: [
        {
          label: 'Revenue',
          data: [0],
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
};

// Other chart data preparation functions
export const prepareCategoryChartData = (products, categories) => {
  // Implementation similar to the original function
  // Simplified for brevity
  if (!products || products.length === 0 || !categories || categories.length === 0) {
    return {
      labels: ['No Categories'],
      datasets: [
        {
          data: [1],
          backgroundColor: ['rgba(156, 163, 175, 0.8)'],
          borderWidth: 1
        }
      ]
    };
  }

  try {
    // Count products by category
    const productsByCategory = products.reduce((acc, product) => {
      let categoryId;
      if (product.category) {
        if (typeof product.category === 'object' && product.category._id) {
          categoryId = product.category._id;
        } else if (typeof product.category === 'string') {
          categoryId = product.category;
        }
      }

      if (!categoryId) {
        if (!acc["uncategorized"]) {
          acc["uncategorized"] = 0;
        }
        acc["uncategorized"]++;
        return acc;
      }

      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId]++;
      return acc;
    }, {});

    // Map category IDs to names
    const categoryNames = categories.reduce((acc, category) => {
      if (category && category._id) {
        acc[category._id] = category.name || 'Unnamed Category';
      }
      return acc;
    }, {});

    categoryNames["uncategorized"] = "Uncategorized";

    // Prepare chart data
    const labels = Object.keys(productsByCategory).map(id => categoryNames[id] || 'Unknown');
    const data = Object.values(productsByCategory);

    // Generate colors
    const backgroundColors = [
      'rgba(99, 102, 241, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(14, 165, 233, 0.8)'
    ];

    return {
      labels: labels.length > 0 ? labels : ['No Categories'],
      datasets: [
        {
          data: data.length > 0 ? data : [1],
          backgroundColor: backgroundColors.slice(0, labels.length || 1),
          borderWidth: 1
        }
      ]
    };
  } catch (error) {
    console.error("Error preparing category chart data:", error);
    return {
      labels: ['Error'],
      datasets: [
        {
          data: [1],
          backgroundColor: ['rgba(239, 68, 68, 0.8)'],
          borderWidth: 1
        }
      ]
    };
  }
};

export const prepareOrderStatusChartData = (orders) => {
  // Implementation similar to the original function
  // Simplified for brevity
  if (!orders || orders.length === 0) {
    const sampleLabels = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const sampleColors = [
      'rgba(245, 158, 11, 0.8)',
      'rgba(99, 102, 241, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(14, 165, 233, 0.8)'
    ];

    return {
      labels: sampleLabels,
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: sampleColors,
          borderWidth: 1
        }
      ]
    };
  }

  try {
    // Count orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      if (!order.status) {
        if (!acc['unknown']) {
          acc['unknown'] = 0;
        }
        acc['unknown']++;
        return acc;
      }

      const status = order.status.toLowerCase();
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {});

    // Prepare chart data
    const labels = Object.keys(ordersByStatus).map(status =>
      status.charAt(0).toUpperCase() + status.slice(1)
    );
    const data = Object.values(ordersByStatus);

    // Generate colors
    const backgroundColors = {
      pending: 'rgba(245, 158, 11, 0.8)',
      processing: 'rgba(99, 102, 241, 0.8)',
      shipped: 'rgba(16, 185, 129, 0.8)',
      delivered: 'rgba(14, 165, 233, 0.8)',
      cancelled: 'rgba(239, 68, 68, 0.8)',
      unknown: 'rgba(156, 163, 175, 0.8)'
    };

    const colors = labels.map(label =>
      backgroundColors[label.toLowerCase()] || 'rgba(156, 163, 175, 0.8)'
    );

    return {
      labels: labels.length > 0 ? labels : ['No Orders'],
      datasets: [
        {
          data: data.length > 0 ? data : [1],
          backgroundColor: colors.length > 0 ? colors : ['rgba(156, 163, 175, 0.8)'],
          borderWidth: 1
        }
      ]
    };
  } catch (error) {
    console.error("Error preparing order status chart data:", error);
    return {
      labels: ['Error'],
      datasets: [
        {
          data: [1],
          backgroundColor: ['rgba(239, 68, 68, 0.8)'],
          borderWidth: 1
        }
      ]
    };
  }
};

export const prepareUserGrowthData = (users) => {
  // Implementation similar to the original function
  // Simplified for brevity
  if (!users || users.length === 0) {
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sampleLabels = [];

    // Generate labels for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      sampleLabels.push(`${monthName} ${year}`);
    }

    return {
      labels: sampleLabels,
      datasets: [
        {
          label: 'New Users',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: 'rgba(16, 185, 129, 0.8)'
        }
      ]
    };
  }

  try {
    // Group users by month of registration
    const usersByMonth = users.reduce((acc, user) => {
      // Skip users without createdAt
      if (!user.createdAt) return acc;

      try {
        const date = new Date(user.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear]++;
      } catch (err) {
        console.warn("Error parsing user date:", err);
      }
      return acc;
    }, {});

    // Ensure we have at least 6 months of data
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fill in missing months with zeros
    const filledMonths = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      filledMonths[monthYear] = usersByMonth[monthYear] || 0;
    }

    const recentMonths = Object.keys(filledMonths).sort((a, b) => {
      const [aMonth, aYear] = a.split('/').map(Number);
      const [bMonth, bYear] = b.split('/').map(Number);
      return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
    });

    const recentUsers = recentMonths.map(month => filledMonths[month]);

    // Format month labels
    const formattedLabels = recentMonths.map(month => {
      const [monthNum, year] = month.split('/').map(Number);
      return `${monthNames[monthNum - 1]} ${year}`;
    });

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: 'New Users',
          data: recentUsers,
          backgroundColor: 'rgba(16, 185, 129, 0.8)'
        }
      ]
    };
  } catch (error) {
    console.error("Error preparing user growth data:", error);
    return {
      labels: ['Error'],
      datasets: [
        {
          label: 'New Users',
          data: [0],
          backgroundColor: 'rgba(239, 68, 68, 0.8)'
        }
      ]
    };
  }
};
