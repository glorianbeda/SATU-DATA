import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  RequestPage as RequestIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  PieChart as PieChartIcon,
  History as HistoryIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import BorrowingWorkflow from '~/features/inventory/components/BorrowingWorkflow';

const PieChart = ({ data, colors, labels }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let currentAngle = 0;

  const slices = data.map((value, index) => {
    const angle = (value / total) * 360;
    const slice = (
      <g key={index}>
        <path
          d={describeArc(100, 100, 80, currentAngle, currentAngle + angle)}
          fill={colors[index]}
          stroke="#fff"
          strokeWidth="2"
        />
        <text
          x={100 + 50 * Math.cos((currentAngle + angle / 2) * Math.PI / 180)}
          y={100 + 50 * Math.sin((currentAngle + angle / 2) * Math.PI / 180)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
        >
          {Math.round((value / total) * 100)}%
        </text>
      </g>
    );
    currentAngle += angle;
    return slice;
  });

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      {slices}
    </svg>
  );
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const InventoryDashboard = () => {
  const { t } = useTranslation();
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
  const categoryColors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c2185b', '#0097a7'];

  const statusData = [stats.available, stats.borrowed, stats.maintenance, stats.lost];
  const statusLabels = [t('inventory.available'), t('inventory.borrowed'), t('inventory.maintenance'), t('inventory.lost')];
  const statusColors = ['#2e7d32', '#ed6c02', '#d32f2f', '#d32f2f'];

  const getActionIcon = (action) => {
    switch (action) {
      case 'BORROWED':
        return <RequestIcon color="primary" />;
      case 'RETURNED':
        return <CheckCircle color="success" />;
      case 'MAINTENANCE':
        return <TrendingDown color="error" />;
      case 'DAMAGED':
        return <TrendingDown color="error" />;
      case 'STATUS_CHANGE':
        return <HistoryIcon color="info" />;
      default:
        return <HistoryIcon />;
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

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-2px)', boxShadow: 4 } : {},
      }} 
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('inventory.loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('inventory.inventory_dashboard')}
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column: Stats, Charts, Activity */}
        <Grid item xs={12} lg={8} xl={9}>
          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={InventoryIcon}
                title={t('inventory.total_assets')}
                value={stats.totalAssets}
                color="primary"
                onClick={() => window.location.href = '/inventory/assets'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={CheckCircle}
                title={t('inventory.available')}
                value={stats.available}
                color="success"
                onClick={() => window.location.href = '/inventory/assets?status=AVAILABLE'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={RequestIcon}
                title={t('inventory.borrowed')}
                value={stats.borrowed}
                color="warning"
                onClick={() => window.location.href = '/inventory/assets?status=BORROWED'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={TrendingDown}
                title={t('inventory.maintenance')}
                value={stats.maintenance}
                color="error"
                onClick={() => window.location.href = '/inventory/assets?status=MAINTENANCE'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={TrendingUp}
                title={t('inventory.pending_requests')}
                value={stats.pendingRequests}
                color="info"
                onClick={() => window.location.href = '/inventory/loans'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={TrendingDown}
                title={t('inventory.overdue')}
                value={stats.overdue}
                color="error"
                onClick={() => window.location.href = '/inventory/loans?status=OVERDUE'}
              />
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PieChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {t('inventory.asset_status_distribution')}
                  </Typography>
                </Box>
                {stats.totalAssets > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: 180, height: 180 }}>
                      <PieChart
                        data={statusData}
                        colors={statusColors}
                        labels={statusLabels}
                      />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                      {statusLabels.map((label, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: statusColors[index] }} />
                          <Typography variant="caption">
                            {label}: {statusData[index]}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    {t('inventory.no_assets')}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {t('inventory.asset_category_distribution')}
                  </Typography>
                </Box>
                {categoryLabels.length > 0 ? (
                  <Box>
                    {categoryLabels.map((label, index) => {
                      const percentage = Math.round((categoryValues[index] / stats.totalAssets) * 100);
                      return (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{label}</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {categoryValues[index]} ({percentage}%)
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: 6,
                              bgcolor: 'grey.200',
                              borderRadius: 4,
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                height: '100%',
                                width: `${percentage}%`,
                                bgcolor: categoryColors[index % categoryColors.length],
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    {t('inventory.no_assets')}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t('inventory.recent_activity')}
              </Typography>
            </Box>
            {recentActivity.length > 0 ? (
              <List disablePadding>
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 1 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'background.default', width: 40, height: 40 }}>
                        {getActionIcon(activity.action)}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {getActionLabel(activity.action)}
                            </Typography>
                            <Chip
                              label={activity.action}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                              {new Date(activity.actionDate).toLocaleString('id-ID')}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                            <Typography variant="body2" component="span" color="text.primary">
                              {activity.asset?.name || t('inventory.asset')}
                            </Typography>
                            {activity.notes && (
                                <Typography variant="caption" component="span" color="text.secondary" sx={{ display: 'block' }}>
                                  — {activity.notes}
                                </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < Math.min(recentActivity.length, 5) - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                {t('inventory.no_assets')}
              </Typography>
            )}
            {recentActivity.length > 5 && (
                 <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Chip 
                        label={t('inventory.show_more')} 
                        onClick={() => {}} 
                        icon={<ArrowForwardIcon />} 
                        variant="outlined" 
                        clickable 
                    />
                 </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column: Workflow */}
        <Grid item xs={12} lg={4} xl={3}>
           <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden' }}>
             <BorrowingWorkflow sx={{ height: '100%', boxShadow: 'none', bgcolor: 'transparent' }} />
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryDashboard;
