import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';

const ActivityHeatmap = () => {
    const today = new Date();

    // Generate dummy data for the last 365 days
    const shiftDate = (date, numDays) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return newDate;
    };

    const getRange = (count) => {
        return Array.from({ length: count }, (_, i) => i);
    };

    const randomValues = getRange(365).map(index => {
        return {
            date: shiftDate(today, -index),
            count: Math.floor(Math.random() * 4), // 0-3 intensity
        };
    });

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Login Activity</h3>
            <div className="w-full overflow-x-auto">
                <div className="min-w-[600px]">
                    <CalendarHeatmap
                        startDate={shiftDate(today, -150)}
                        endDate={today}
                        values={randomValues}
                        classForValue={(value) => {
                            if (!value) {
                                return 'color-empty';
                            }
                            return `color-scale-${value.count}`;
                        }}
                        tooltipDataAttrs={value => {
                            return {
                                'data-tooltip-id': 'heatmap-tooltip',
                                'data-tooltip-content': `${value.date.toISOString().slice(0, 10)}: ${value.count} logins`,
                            };
                        }}
                        showWeekdayLabels={true}
                    />
                    <Tooltip id="heatmap-tooltip" />
                </div>
            </div>
            <style>{`
        .react-calendar-heatmap text {
          font-size: 10px;
          fill: #9ca3af;
        }
        .dark .react-calendar-heatmap text {
          fill: #6b7280;
        }
        .react-calendar-heatmap .color-empty { fill: #f3f4f6; }
        .dark .react-calendar-heatmap .color-empty { fill: #374151; }
        .react-calendar-heatmap .color-scale-1 { fill: #dbeafe; }
        .dark .react-calendar-heatmap .color-scale-1 { fill: #1e3a8a; }
        .react-calendar-heatmap .color-scale-2 { fill: #60a5fa; }
        .dark .react-calendar-heatmap .color-scale-2 { fill: #2563eb; }
        .react-calendar-heatmap .color-scale-3 { fill: #2563eb; }
        .dark .react-calendar-heatmap .color-scale-3 { fill: #3b82f6; }
        .react-calendar-heatmap .color-scale-4 { fill: #1e40af; }
        .dark .react-calendar-heatmap .color-scale-4 { fill: #60a5fa; }
      `}</style>
        </div>
    );
};

export default ActivityHeatmap;

