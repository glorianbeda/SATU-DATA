import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import WalletCard from '~/features/finance/components/WalletCard';
import EditBalanceModal from '~/features/finance/components/EditBalanceModal';
import BalanceHistoryModal from '~/features/finance/components/BalanceHistoryModal';
import BarChart from '~/components/charts/BarChart';

const Balance = () => {
  const { t } = useTranslation();
  const [balanceData, setBalanceData] = useState({
    initialBalance: 0,
    balanceDate: new Date(),
    incomeAfterDate: 0,
    expenseAfterDate: 0,
    currentBalance: 0,
  });
  const [chartData, setChartData] = useState({ categories: [], series: [] });
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchBalanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/initial-balance`, {
        withCredentials: true
      });
      setBalanceData(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/summary`, {
        withCredentials: true
      });

      const categories = Object.keys(response.data.chartData).sort();
      const incomeSeries = categories.map(cat => response.data.chartData[cat].income);
      const expenseSeries = categories.map(cat => response.data.chartData[cat].expense);

      setChartData({
        categories,
        series: [
          { name: t('wallet.income', 'Pemasukan'), data: incomeSeries },
          { name: t('wallet.expense', 'Pengeluaran'), data: expenseSeries }
        ]
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/balance-history`, {
        withCredentials: true
      });
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceData();
    fetchChartData();
  }, []);

  const handleSaveBalance = async (data) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/finance/initial-balance`, data, {
        withCredentials: true
      });
      await fetchBalanceData();
    } catch (error) {
      console.error('Error saving balance:', error);
      throw error;
    }
  };

  const handleOpenHistory = () => {
    fetchHistory();
    setHistoryModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        {t('sidebar.balance', 'Saldo')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Card */}
        <WalletCard
          initialBalance={balanceData.initialBalance}
          balanceDate={balanceData.balanceDate}
          incomeAfterDate={balanceData.incomeAfterDate}
          expenseAfterDate={balanceData.expenseAfterDate}
          currentBalance={balanceData.currentBalance}
          loading={loading}
          onEdit={() => setEditModalOpen(true)}
          onHistory={handleOpenHistory}
        />

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">
            {t('wallet.financial_trends', 'Tren Keuangan')}
          </h3>
          <div className="h-64">
            {!loading && chartData.series.length > 0 && (
              <BarChart
                categories={chartData.categories}
                series={chartData.series}
                height="100%"
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditBalanceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveBalance}
        currentBalance={balanceData.initialBalance}
        currentDate={balanceData.balanceDate}
      />

      {/* History Modal */}
      <BalanceHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        loading={historyLoading}
      />
    </div>
  );
};

export default Balance;
