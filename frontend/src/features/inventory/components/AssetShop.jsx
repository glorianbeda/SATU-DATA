import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Fab,
  Badge,
  Card,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import AssetCard from '~/features/inventory/components/AssetCard';
import CheckoutDialog from '~/features/inventory/components/CheckoutDialog';
import { useCart } from '~/context/CartContext';

const AssetShop = ({ initialStatus = '' }) => {
  const { t } = useTranslation();
  const { cartItems } = useCart();
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ categoryId: '', search: '', status: initialStatus });
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (initialStatus) {
      setFilter(prev => ({ ...prev, status: initialStatus }));
    }
  }, [initialStatus]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.categoryId) params.append('categoryId', filter.categoryId);
      if (filter.search) params.append('search', filter.search);
      if (filter.status) params.append('status', filter.status);

      const response = await api.get(`${INVENTORY_API.GET_ASSETS}?${params.toString()}`);
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get(INVENTORY_API.GET_CATEGORIES);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchAssets();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [filter]);

  return (
    <Box sx={{ position: 'relative', minHeight: '60vh' }}>
      {/* Filters */}
      <Card sx={{ mb: 3, p: { xs: 1.5, sm: 2 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1.5, 
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
              size="small"
              placeholder={t('common.search')}
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 0.5 }} /> }}
              sx={{ 
                flexGrow: 1, 
                minWidth: 150, 
                maxWidth: 300,
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
          />
          <TextField
              select
              size="small"
              label={t('inventory.category')}
              value={filter.categoryId}
              onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })}
              sx={{ minWidth: 140 }}
          >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                  </MenuItem>
              ))}
          </TextField>
          <TextField
              select
              size="small"
              label={t('common.status')}
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              sx={{ minWidth: 120 }}
          >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="AVAILABLE">{t('inventory.available')}</MenuItem>
              <MenuItem value="BORROWED">{t('inventory.borrowed')}</MenuItem>
              <MenuItem value="MAINTENANCE">{t('inventory.maintenance')}</MenuItem>
              <MenuItem value="LOST">{t('inventory.lost')}</MenuItem>
          </TextField>
        </Box>
      </Card>

      {/* Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {assets.map((asset) => (
            <Grid item key={asset.id} xs={12} sm={6} md={4} lg={3}>
              <AssetCard asset={asset} />
            </Grid>
          ))}
          {assets.length === 0 && (
             <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">
                      {t('inventory.no_assets_found')}
                  </Typography>
                </Box>
             </Grid>
          )}
        </Grid>
      )}

      {/* Checkout FAB */}
      <Fab
        color="primary"
        aria-label="cart"
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 16, sm: 32 }, 
          right: { xs: 16, sm: 32 }, 
          zIndex: 1000 
        }}
        onClick={() => setCheckoutOpen(true)}
      >
        <Badge badgeContent={cartItems.length} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
            fetchAssets();
        }}
      />
    </Box>
  );
};

export default AssetShop;
