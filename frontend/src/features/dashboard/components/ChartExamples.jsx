import React from 'react';
import { LineChart, BarChart, PieChart, DoughnutChart, AreaChart } from '../../../components/charts';

const ChartExamples = () => {
    // Sample data for different chart types
    const monthCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    
    const lineSeries = [
        {
            name: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
            color: '#2563eb',
        },
        {
            name: 'Expenses',
            data: [8000, 12000, 10000, 15000, 14000, 18000, 16000],
            color: '#ef4444',
        }
    ];

    const barSeries = [
        {
            name: 'Sales',
            data: [65, 59, 80, 81, 56, 55, 70],
            color: '#10b981',
        },
        {
            name: 'Returns',
            data: [28, 48, 40, 19, 86, 27, 45],
            color: '#f59e0b',
        }
    ];

    const pieLabels = ['Direct', 'Organic', 'Referral', 'Social', 'Email'];
    const pieSeries = [300, 250, 100, 150, 200];
    const pieColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const doughnutLabels = ['Product A', 'Product B', 'Product C', 'Product D'];
    const doughnutSeries = [450, 320, 280, 150];
    const doughnutColors = ['#3b82f6', '#06b6d4', '#14b8a6', '#10b981'];

    const areaCategories = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    const areaSeries = [
        {
            name: 'Active Users',
            data: [4000, 4500, 4200, 5100, 4900, 5500],
            color: '#8b5cf6',
        },
        {
            name: 'New Users',
            data: [2400, 2800, 2600, 3200, 3000, 3400],
            color: '#ec4899',
        }
    ];

    const stackedAreaSeries = [
        {
            name: 'Desktop',
            data: [3000, 3500, 3200, 4000, 3800, 4200, 4500],
            color: '#2563eb',
        },
        {
            name: 'Mobile',
            data: [2000, 2400, 2200, 2800, 2600, 3000, 3200],
            color: '#10b981',
        },
        {
            name: 'Tablet',
            data: [1000, 1200, 1100, 1400, 1300, 1500, 1600],
            color: '#f59e0b',
        }
    ];

    return (
        <div className="space-y-6">
            {/* Line Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Line Chart Example</h3>
                <div className="h-80">
                    <LineChart
                        categories={monthCategories}
                        series={lineSeries}
                        title="Monthly Revenue vs Expenses"
                        height="100%"
                    />
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Bar Chart Example</h3>
                <div className="h-80">
                    <BarChart
                        categories={monthCategories}
                        series={barSeries}
                        title="Sales vs Returns"
                        height="100%"
                    />
                </div>
            </div>

            {/* Pie & Doughnut Charts Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Pie Chart Example</h3>
                    <div className="h-80">
                        <PieChart
                            labels={pieLabels}
                            series={pieSeries}
                            colors={pieColors}
                            title="Traffic Sources"
                            height="100%"
                        />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Doughnut Chart Example</h3>
                    <div className="h-80">
                        <DoughnutChart
                            labels={doughnutLabels}
                            series={doughnutSeries}
                            colors={doughnutColors}
                            title="Product Distribution"
                            height="100%"
                        />
                    </div>
                </div>
            </div>

            {/* Area Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Area Chart Example</h3>
                <div className="h-80">
                    <AreaChart
                        categories={areaCategories}
                        series={areaSeries}
                        title="User Growth Over Time"
                        height="100%"
                    />
                </div>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Horizontal Bar Chart Example</h3>
                <div className="h-80">
                    <BarChart
                        categories={['Category A', 'Category B', 'Category C', 'Category D', 'Category E']}
                        series={[
                            {
                                name: 'Performance Score',
                                data: [85, 72, 90, 68, 95],
                                color: '#6366f1',
                            }
                        ]}
                        horizontal={true}
                        title="Performance by Category"
                        height="100%"
                    />
                </div>
            </div>

            {/* Stacked Area Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Stacked Area Chart Example</h3>
                <div className="h-80">
                    <AreaChart
                        categories={monthCategories}
                        series={stackedAreaSeries}
                        stacked={true}
                        title="Device Usage (Stacked)"
                        height="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChartExamples;
