import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { id as idLocale } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useCart } from '~/context/CartContext';
import api from '~/utils/api';

const CheckoutDialog = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { cartItems, clearCart } = useCart();
  const [dueDate, setDueDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!dueDate) return;

    setLoading(true);
    setError(null);
    try {
      const assetIds = cartItems.map(item => item.id);
      
      await api.post('/api/inventory/loans', {
        assetIds,
        dueDate: dueDate.toISOString(), // Unified due date
      });

      clearCart();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.error || t('common.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('inventory.checkout_confirmation')}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Typography variant="subtitle2" gutterBottom>
          {t('inventory.selected_items')}:
        </Typography>
        <List dense sx={{ mb: 2, maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper' }}>
          {cartItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemText 
                primary={item.name}
                secondary={`${t('inventory.code')}: ${item.assetCode}`}
               />
            </ListItem>
          ))}
        </List>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
            <DatePicker
                label={t('inventory.return_due_date')}
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                disablePast
                minDate={new Date()}
            />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button 
            onClick={handleCheckout} 
            variant="contained" 
            disabled={loading || !dueDate || cartItems.length === 0}
        >
          {loading ? t('common.processing') : t('inventory.confirm_loan')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog;
