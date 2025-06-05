// Chart options for dashboard charts

// Get theme-aware colors
const getThemeColors = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  return {
    text: isDark ? '#f9fafb' : '#1f2937',
    textSecondary: isDark ? '#d1d5db' : '#6b7280',
    background: isDark ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    border: isDark ? '#4b5563' : '#e5e7eb',
    grid: isDark ? '#374151' : '#f3f4f6'
  };
};

// Line and Bar chart options
export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: getThemeColors().background,
      titleColor: getThemeColors().text,
      bodyColor: getThemeColors().textSecondary,
      borderColor: getThemeColors().border,
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      cornerRadius: 8,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: getThemeColors().textSecondary
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [2, 4],
        color: getThemeColors().grid
      },
      ticks: {
        color: getThemeColors().textSecondary,
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    }
  }
};

// Doughnut chart options
export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        color: getThemeColors().text,
        font: {
          size: 12,
          family: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      backgroundColor: getThemeColors().background,
      titleColor: getThemeColors().text,
      bodyColor: getThemeColors().textSecondary,
      borderColor: getThemeColors().border,
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12
    }
  }
};

// Create theme-aware chart options factory
export const createChartOptions = (type = 'line') => {
  const colors = getThemeColors();

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: colors.background,
        titleColor: colors.text,
        bodyColor: colors.textSecondary,
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    }
  };

  if (type === 'line' || type === 'bar') {
    return {
      ...baseOptions,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: colors.textSecondary
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [2, 4],
            color: colors.grid
          },
          ticks: {
            color: colors.textSecondary
          }
        }
      }
    };
  }

  if (type === 'doughnut') {
    return {
      ...baseOptions,
      cutout: '70%',
      plugins: {
        ...baseOptions.plugins,
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: colors.text,
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            }
          }
        }
      }
    };
  }

  return baseOptions;
};
