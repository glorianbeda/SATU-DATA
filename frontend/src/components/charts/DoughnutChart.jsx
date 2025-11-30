import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * Reusable Doughnut Chart Component using ApexCharts
 * @param {Object} props
 * @param {Array} props.labels - Array of labels
 * @param {Array} props.series - Array of data values
 * @param {Array} props.colors - Array of colors (optional)
 * @param {string} props.title - Chart title (optional)
 * @param {boolean} props.showLegend - Show/hide legend (default: true)
 * @param {string} props.legendPosition - Legend position (default: 'bottom')
 * @param {string} props.donutSize - Donut hole size (default: '65%')
 * @param {Object} props.options - Additional ApexCharts options
 * @param {string} props.height - Chart height (default: '100%')
 */
const DoughnutChart = ({ 
  labels = [], 
  series = [],
  colors = [],
  title = '', 
  showLegend = true,
  legendPosition = 'bottom',
  donutSize = '65%',
  options = {},
  height = '100%'
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const defaultOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    labels: labels,
    colors: colors.length > 0 ? colors : undefined,
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
      position: legendPosition,
      labels: {
        colors: isDark ? '#e5e7eb' : '#374151',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: donutSize,
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#e5e7eb' : '#374151',
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 'bold',
              color: isDark ? '#e5e7eb' : '#374151',
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#9ca3af' : '#6b7280',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: function(value) {
          return value;
        }
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    ...options
  };

  return <Chart options={defaultOptions} series={series} type="donut" height={height} />;
};

export default DoughnutChart;
