import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '~/context/ThemeContext';

/**
 * Reusable Bar Chart Component using ApexCharts
 * @param {Object} props
 * @param {Array} props.categories - Array of labels for x-axis
 * @param {Array} props.series - Array of series objects [{name: 'Series 1', data: []}]
 * @param {string} props.title - Chart title (optional)
 * @param {boolean} props.showLegend - Show/hide legend (default: true)
 * @param {boolean} props.showGrid - Show/hide grid (default: true)
 * @param {boolean} props.horizontal - Horizontal bar chart (default: false)
 * @param {boolean} props.stacked - Stack bars (default: false)
 * @param {Object} props.options - Additional ApexCharts options
 * @param {string} props.height - Chart height (default: '100%')
 */
const BarChart = ({ 
  categories = [], 
  series = [], 
  title = '', 
  showLegend = true,
  showGrid = true,
  horizontal = false,
  stacked = false,
  options = {},
  height = '100%'
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const defaultOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      toolbar: {
        show: false,
      },
      stacked: stacked,
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        borderRadius: 8,
        columnWidth: '60%',
        dataLabels: {
          position: 'top',
        },
      },
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
      yaxis: {
        lines: {
          show: showGrid,
        },
      },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
    },
    ...options
  };

  return <Chart options={defaultOptions} series={series} type="bar" height={height} />;
};

export default BarChart;
