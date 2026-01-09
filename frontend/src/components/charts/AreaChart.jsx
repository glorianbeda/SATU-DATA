import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '~/context/ThemeContext';

/**
 * Reusable Area Chart Component using ApexCharts
 * @param {Object} props
 * @param {Array} props.categories - Array of labels for x-axis
 * @param {Array} props.series - Array of series objects [{name: 'Series 1', data: []}]
 * @param {string} props.title - Chart title (optional)
 * @param {boolean} props.showLegend - Show/hide legend (default: true)
 * @param {boolean} props.showGrid - Show/hide grid (default: true)
 * @param {boolean} props.stacked - Stack areas (default: false)
 * @param {string} props.curve - Line curve type: 'smooth', 'straight', 'stepline' (default: 'smooth')
 * @param {Object} props.options - Additional ApexCharts options
 * @param {string} props.height - Chart height (default: '100%')
 */
const AreaChart = ({ 
  categories = [], 
  series = [], 
  title = '', 
  showLegend = true,
  showGrid = true,
  stacked = false,
  curve = 'smooth',
  options = {},
  height = '100%'
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const defaultOptions = {

    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    stroke: {
      curve: curve,
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
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
    ...options,
    chart: {
      type: 'area',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      stacked: stacked,
      background: 'transparent',
      ...options.chart // Merge user provided chart options (like sparkline)
    },
  };

  return <Chart options={defaultOptions} series={series} type="area" height={height} />;
};

export default AreaChart;
