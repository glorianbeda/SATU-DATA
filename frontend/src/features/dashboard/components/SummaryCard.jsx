import React from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart } from '~/components/charts';

const SummaryCard = ({ title, value, percentage, data, color, type }) => {
    const { t } = useTranslation();
    const isPositive = percentage >= 0;

    // Transform data for ApexCharts format
    const categories = data.map((_, index) => `${t('dashboard.summary.day')} ${index + 1}`);
    const series = [{
        name: title,
        data: data.map(item => item.value),
        color: color,
    }];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</h3>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${isPositive ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {isPositive ? '+' : ''}{percentage}% {t('dashboard.summary.from_last_month')}
                </div>
            </div>

            <div className="h-16 mt-auto">
                <AreaChart
                    categories={categories}
                    series={series}
                    showLegend={false}
                    showGrid={false}
                    height="100%"
                    options={{
                        chart: {
                            background: 'transparent',
                            sparkline: {
                                enabled: true
                            }
                        },
                        stroke: {
                            width: 2
                        },
                        tooltip: {
                            enabled: true,
                            fixed: {
                                enabled: false
                            },
                            x: {
                                show: false
                            },
                            y: {
                                title: {
                                    formatter: function (seriesName) {
                                        return ''
                                    }
                                }
                            },
                            marker: {
                                show: false
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default SummaryCard;
