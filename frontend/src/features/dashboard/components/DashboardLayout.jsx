import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
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
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  useEffect(() => {
    setTitle(t('dashboard.title'));
  }, [t, setTitle]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/summary`, {
          withCredentials: true
        });
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">

        {/* Left Column - Financials */}
        <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            {isLoading ? <ContentLoader height="h-48" /> : <BalanceCard balance={summary.balance} income={summary.totalIncome} expense={summary.totalExpense} />}

            <div className="grid grid-cols-1 gap-4 md:gap-6">
                {isLoading ? (
                    <>
                        <ContentLoader height="h-32" />
                        <ContentLoader height="h-32" />
                    </>
                ) : (
                    <>
                        <SummaryCard
                            title={t('dashboard.summary.total_income')}
                            value={`Rp ${summary.totalIncome.toLocaleString()}`}
                            percentage={12}
                            data={incomeData}
                            color="#10b981" // Green
                        />
                        <SummaryCard
                            title={t('dashboard.summary.total_expense')}
                            value={`Rp ${summary.totalExpense.toLocaleString()}`}
                            percentage={-5}
                            data={expenseData}
                            color="#ef4444" // Red
                        />
                    </>
                )}
            </div>
        </div>

        {/* Right Column - Activity & Others */}
        <div className="md:col-span-8 flex flex-col gap-4 md:gap-6">
            {isLoading ? <ContentLoader height="h-80" /> : <ActivityHeatmap />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
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
