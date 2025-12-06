import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BalanceCard from './BalanceCard';
import SummaryCard from './SummaryCard';
import ActivityHeatmap from './ActivityHeatmap';
import TrafficSourcesCard from './TrafficSourcesCard';
import WeeklySalesCard from './WeeklySalesCard';
import ContentLoader from '~/components/ContentLoader';
import { useLayout } from '~/context/LayoutContext';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTitle(t('dashboard.title'));
  }, [t, setTitle]);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Dummy data for charts
  const incomeData = [
    { value: 4000 }, { value: 3000 }, { value: 2000 }, { value: 2780 },
    { value: 1890 }, { value: 2390 }, { value: 3490 }
  ];
  
  const expenseData = [
    { value: 2400 }, { value: 1398 }, { value: 9800 }, { value: 3908 },
    { value: 4800 }, { value: 3800 }, { value: 4300 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column - Financials */}
        <div className="md:col-span-4 flex flex-col gap-6">
            {isLoading ? <ContentLoader height="h-48" /> : <BalanceCard />}
            
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <>
                        <ContentLoader height="h-32" />
                        <ContentLoader height="h-32" />
                    </>
                ) : (
                    <>
                        <SummaryCard 
                            title={t('dashboard.summary.total_income')} 
                            value="Rp 45.2M" 
                            percentage={12} 
                            data={incomeData} 
                            color="#10b981" // Green
                        />
                        <SummaryCard 
                            title={t('dashboard.summary.total_expense')} 
                            value="Rp 12.8M" 
                            percentage={-5} 
                            data={expenseData} 
                            color="#ef4444" // Red
                        />
                    </>
                )}
            </div>
        </div>

        {/* Right Column - Activity & Others */}
        <div className="md:col-span-8 flex flex-col gap-6">
            {isLoading ? <ContentLoader height="h-80" /> : <ActivityHeatmap />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {isLoading ? (
                    <>
                        <ContentLoader height="h-64" />
                        <ContentLoader height="h-64" />
                    </>
                ) : (
                    <>
                        <TrafficSourcesCard />
                        <WeeklySalesCard />
                    </>
                )}
            </div>
        </div>

    </div>
  );
};

export default DashboardLayout;
