import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '~/context/ThemeContext';

/**
 * Reusable Line Chart Component using ApexCharts
 * @param {Object} props
 * @param {Array} props.categories - Array of labels for x-axis
 * @param {Array} props.series - Array of series objects [{name: 'Series 1', data: []}]
 * @param {string} props.title - Chart title (optional)
 * @param {boolean} props.showLegend - Show/hide legend (default: true)
 * @param {boolean} props.showGrid - Show/hide grid (default: true)
 * @param {string} props.curve - Line curve type: 'smooth', 'straight', 'stepline' (default: 'smooth')
 * @param {Object} props.options - Additional ApexCharts options
 * @param {string} props.height - Chart height (default: '100%')
 */
const LineChart = ({ 
  categories = [], 
  series = [], 
  title = '', 
  showLegend = true,
  showGrid = true,
  curve = 'smooth',
  options = {},
  height = '100%'
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const defaultOptions = {
    chart: {
      type: 'line',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    stroke: {
      curve: curve,
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: isDark ? '#e5e7eb' : '#374151',
      },
    },
    legend: {
      show: showLegend,
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: isDark ? '#e5e7eb' : '#374151',
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: isDark ? '#9ca3af' : '#6b7280',
          fontSize: '11px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? '#9ca3af' : '#6b7280',
          fontSize: '11px',
        },
      },
    },
    grid: {
      show: showGrid,
      borderColor: isDark ? '#374151' : '#e5e7eb',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: showGrid,
        },
      },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      x: {
        show: true,
      },
    },
    ...options
  };

  return <Chart options={defaultOptions} series={series} type="line" height={height} />;
};

export default LineChart;
