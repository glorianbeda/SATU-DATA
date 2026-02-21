import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';

const ActivityHeatmap = () => {
    const [loginData, setLoginData] = useState([]);
    const today = new Date();

    useEffect(() => {
        const fetchLoginActivity = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/login-activity`, {
                    withCredentials: true
                });
                setLoginData(response.data);
            } catch (error) {
                console.error('Error fetching login activity:', error);
                setLoginData(generateDummyData());
            }
        };
        fetchLoginActivity();
    }, []);

    const generateDummyData = () => {
        const shiftDate = (date, numDays) => {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + numDays);
            return newDate;
        };

        return Array.from({ length: 151 }, (_, i) => ({
            date: shiftDate(today, -150 + i).toISOString().slice(0, 10),
            count: Math.floor(Math.random() * 4)
        }));
    };

    const displayData = loginData.length > 0 ? loginData : generateDummyData();

    const shiftDate = (date, numDays) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return newDate;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Login Activity</h3>
            <div className="w-full overflow-x-auto">
                <div className="min-w-[600px]">
                    <CalendarHeatmap
                        startDate={shiftDate(today, -150)}
                        endDate={today}
                        values={displayData.map(d => ({ date: d.date, count: d.count }))}
                        classForValue={(value) => {
                            if (!value || value.count === 0) {
                                return 'color-empty';
                            }
                            if (value.count <= 2) return 'color-scale-1';
                            if (value.count <= 5) return 'color-scale-2';
                            if (value.count <= 10) return 'color-scale-3';
                            return 'color-scale-4';
                        }}
                        tooltipDataAttrs={value => {
                            if (!value || !value.date) return null;
                            return {
                                'data-tooltip-id': 'heatmap-tooltip',
                                'data-tooltip-content': `${value.date}: ${value.count || 0} logins`,
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
