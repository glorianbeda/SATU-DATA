import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Request as RequestIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';

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
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/inventory/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <Card sx={{ height: '100%' }} onClick={onClick}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color + '.light',
              color: color + '.main',
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
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

      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('inventory.borrowing_workflow')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              1
            </Box>
            <Typography>{t('inventory.request')}</Typography>
          </Box>
          <Box sx={{ width: 30, height: 2, bgcolor: 'text.disabled' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'warning.light',
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              2
            </Box>
            <Typography>{t('inventory.approve')}</Typography>
          </Box>
          <Box sx={{ width: 30, height: 2, bgcolor: 'text.disabled' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'success.light',
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              3
            </Box>
            <Typography>{t('inventory.borrow')}</Typography>
          </Box>
          <Box sx={{ width: 30, height: 2, bgcolor: 'text.disabled' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'info.light',
                color: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              4
            </Box>
            <Typography>{t('inventory.return')}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InventoryDashboard;
