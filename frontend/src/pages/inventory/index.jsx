import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  RequestPage as RequestIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  PieChart as PieChartIcon,
  History as HistoryIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PieChart, BarChart } from '~/components/charts';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import BorrowingWorkflow from '~/features/inventory/components/BorrowingWorkflow';

// Gradient Stat Card Component - Modern Design
const StatCard = ({ icon: IconComponent, title, value, gradient, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      ${gradient} 
      p-5 rounded-2xl shadow-lg text-white 
      cursor-pointer transition-all duration-300
      hover:-translate-y-1 hover:shadow-xl
      relative overflow-hidden
    `}
  >
    {/* Decorative circles */}
    <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className={`
          w-12 h-12 rounded-xl 
          bg-white/20 backdrop-blur-sm 
          flex items-center justify-center
        `}>
          {IconComponent && <IconComponent sx={{ fontSize: 24 }} />}
        </div>
        <ArrowForwardIcon sx={{ opacity: 0.6, fontSize: 20 }} />
      </div>
      
      <Typography variant="h3" fontWeight="bold" className="mb-1">
        {value}
      </Typography>
      
      <Typography 
        variant="body2" 
        className="text-white/80 font-medium uppercase tracking-wide text-xs"
      >
        {title}
      </Typography>
    </div>
  </div>
);

// Modern Chart Card
const ChartCard = ({ title, icon: IconComponent, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 h-full">
    <div className="flex items-center gap-2 mb-4">
      {IconComponent && <IconComponent className="text-blue-500" />}
      <Typography variant="h6" fontWeight="600" className="text-gray-800 dark:text-white">
        {title}
      </Typography>
    </div>
    {children}
  </div>
);

// Modern Activity Item
const ActivityItem = ({ activity, getActionIcon, getActionLabel, isLast, t }) => {
  const getGradientForAction = (action) => {
    switch (action) {
      case 'BORROWED':
        return 'from-orange-500 to-orange-600';
      case 'RETURNED':
        return 'from-green-500 to-green-600';
      case 'MAINTENANCE':
        return 'from-red-500 to-red-600';
      case 'DAMAGED':
        return 'from-red-600 to-red-700';
      case 'STATUS_CHANGE':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const gradient = getGradientForAction(activity.action);

  return (
    <>
      <div className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl p-3 transition-colors duration-200 -mx-2">
        <div className="flex items-start gap-3">
          <div className={`
            w-10 h-10 rounded-xl 
            bg-gradient-to-br ${gradient}
            flex items-center justify-center flex-shrink-0
            text-white shadow-md
          `}>
            {getActionIcon(activity.action)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Typography variant="subtitle2" fontWeight="bold" className="text-gray-800 dark:text-white">
                {getActionLabel(activity.action)}
              </Typography>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                bg-gradient-to-r ${gradient}
                text-white
              `}>
                {activity.action}
              </span>
            </div>
            
            <Typography variant="body2" className="text-gray-600 dark:text-gray-300 mt-0.5">
              {activity.asset?.name || t('inventory.asset')}
            </Typography>
            
            {activity.notes && (
              <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block mt-0.5">
                — {activity.notes}
              </Typography>
            )}
          </div>
          
          <Typography variant="caption" className="text-gray-400 dark:text-gray-500 whitespace-nowrap">
            {new Date(activity.actionDate).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </div>
      </div>
      {!isLast && <Divider className="my-1" />}
    </>
  );
};

const InventoryDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssets: 0,
    available: 0,
    borrowed: 0,
    maintenance: 0,
    lost: 0,
    pendingRequests: 0,
    overdue: 0,
    categoryDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/inventory/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await api.get(INVENTORY_API.GET_ASSETS);
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await api.get(INVENTORY_API.GET_HISTORY_USER);
      setRecentActivity(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAssets();
    fetchRecentActivity();
  }, []);

  const categoryData = assets.reduce((acc, asset) => {
    const categoryName = asset.category?.name || 'Uncategorized';
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);

  const statusData = [stats.available, stats.borrowed, stats.maintenance, stats.lost];
  const statusLabels = [t('inventory.available'), t('inventory.borrowed'), t('inventory.maintenance'), t('inventory.lost')];
  const statusColors = ['#10b981', '#f59e0b', '#ef4444', '#dc2626'];

  const getActionIcon = (action) => {
    switch (action) {
      case 'BORROWED':
        return <RequestIcon sx={{ fontSize: 18 }} />;
      case 'RETURNED':
        return <CheckCircle sx={{ fontSize: 18 }} />;
      case 'MAINTENANCE':
        return <TrendingDown sx={{ fontSize: 18 }} />;
      case 'DAMAGED':
        return <WarningIcon sx={{ fontSize: 18 }} />;
      case 'STATUS_CHANGE':
        return <HistoryIcon sx={{ fontSize: 18 }} />;
      default:
        return <HistoryIcon sx={{ fontSize: 18 }} />;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'BORROWED':
        return t('inventory.borrow');
      case 'RETURNED':
        return t('inventory.return');
      case 'MAINTENANCE':
        return t('inventory.maintenance');
      case 'DAMAGED':
        return t('inventory.condition_damaged');
      case 'STATUS_CHANGE':
        return t('common.status');
      default:
        return action;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header Section */}
      <div className="mb-6">
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ fontWeight: 600, mb: 1 }}
          className="text-gray-800 dark:text-white"
        >
          {t('inventory.inventory_dashboard')}
        </Typography>
        <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </div>

      {/* Stats Grid - 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          icon={InventoryIcon}
          title={t('inventory.total_assets')}
          value={stats.totalAssets}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          onClick={() => navigate('/inventory/assets')}
        />
        <StatCard
          icon={CheckCircle}
          title={t('inventory.available')}
          value={stats.available}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          onClick={() => navigate('/inventory/assets?status=AVAILABLE')}
        />
        <StatCard
          icon={RequestIcon}
          title={t('inventory.borrowed')}
          value={stats.borrowed}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          onClick={() => navigate('/inventory/assets?status=BORROWED')}
        />
        <StatCard
          icon={TrendingDown}
          title={t('inventory.maintenance')}
          value={stats.maintenance}
          gradient="bg-gradient-to-br from-red-500 to-red-600"
          onClick={() => navigate('/inventory/assets?status=MAINTENANCE')}
        />
        <StatCard
          icon={TrendingUp}
          title={t('inventory.pending_requests')}
          value={stats.pendingRequests}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          onClick={() => navigate('/inventory/loans')}
        />
        <StatCard
          icon={WarningIcon}
          title={t('inventory.overdue')}
          value={stats.overdue}
          gradient="bg-gradient-to-br from-red-600 to-red-700"
          onClick={() => navigate('/inventory/loans?status=OVERDUE')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Status Distribution Pie Chart */}
        <ChartCard 
          title={t('inventory.asset_status_distribution')}
          icon={PieChartIcon}
        >
          {stats.totalAssets > 0 ? (
            <div className="h-64">
              <PieChart
                labels={statusLabels}
                series={statusData}
                colors={statusColors}
                showLegend={true}
                legendPosition="bottom"
                height="100%"
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Typography variant="body2" color="text.secondary">
                {t('inventory.no_assets')}
              </Typography>
            </div>
          )}
        </ChartCard>

        {/* Category Distribution Bar Chart */}
        <ChartCard 
          title={t('inventory.asset_category_distribution')}
          icon={InventoryIcon}
        >
          {categoryLabels.length > 0 ? (
            <div className="h-64">
              <BarChart
                categories={categoryLabels.slice(0, 5)}
                series={[
                  {
                    name: 'Assets',
                    data: categoryValues.slice(0, 5),
                    color: '#3b82f6',
                  }
                ]}
                horizontal={true}
                showLegend={false}
                height="100%"
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Typography variant="body2" color="text.secondary">
                {t('inventory.no_assets')}
              </Typography>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Bottom Row - Activity & Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full min-h-[400px] transition-colors duration-300 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <HistoryIcon className="text-blue-500" />
              <Typography variant="h6" fontWeight="600" className="text-gray-800 dark:text-white">
                {t('inventory.recent_activity')}
              </Typography>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-1 flex-1 overflow-auto">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    getActionIcon={getActionIcon}
                    getActionLabel={getActionLabel}
                    isLast={index === Math.min(recentActivity.length, 5) - 1}
                    t={t}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center flex-1 flex items-center justify-center">
                <Typography variant="body2" color="text.secondary">
                  {t('inventory.no_assets')}
                </Typography>
              </div>
            )}
            
            {recentActivity.length > 5 && (
              <div className="mt-4 text-center">
                <Chip 
                  label={t('inventory.show_more')} 
                  onClick={() => {}} 
                  icon={<ArrowForwardIcon />} 
                  variant="outlined" 
                  clickable 
                  className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                />
              </div>
            )}
          </div>
        </div>

        {/* Borrowing Workflow - 1/3 width */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full min-h-[400px] transition-colors duration-300 flex flex-col">
            <BorrowingWorkflow sx={{ height: '100%', boxShadow: 'none', bgcolor: 'transparent', flex: 1 }} />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default InventoryDashboard;
