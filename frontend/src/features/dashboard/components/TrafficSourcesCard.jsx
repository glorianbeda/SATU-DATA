import React from 'react';
import { PieChart } from '~/components/charts';

const TrafficSourcesCard = () => {
    const labels = ['Direct', 'Organic', 'Referral', 'Social'];
    const series = [300, 250, 100, 150];
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full transition-colors duration-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Traffic Sources</h3>
            <div className="flex-1">
                <PieChart
                    labels={labels}
                    series={series}
                    colors={colors}
                    showLegend={true}
                    legendPosition="bottom"
                    height="100%"
                />
            </div>
        </div>
    );
};

export default TrafficSourcesCard;
