import React from 'react';
import { BarChart } from '~/components/charts';

const WeeklySalesCard = () => {
    const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const series = [{
        name: 'Sales',
        data: [65, 59, 80, 81, 56, 72, 90],
        color: '#10b981',
    }];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full transition-colors duration-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Weekly Sales</h3>
            <div className="flex-1">
                <BarChart
                    categories={categories}
                    series={series}
                    showLegend={false}
                    showGrid={true}
                    height="100%"
                />
            </div>
        </div>
    );
};

export default WeeklySalesCard;
