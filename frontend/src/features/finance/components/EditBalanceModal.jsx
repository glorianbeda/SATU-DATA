import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { formatInputValue, parseRupiah } from '~/utils/currency';

const EditBalanceModal = ({ open, onClose, onSave, currentBalance = 0, currentDate = new Date() }) => {
  const { t } = useTranslation();
  const [balanceInput, setBalanceInput] = useState('');
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      // Format the current balance for display
      setBalanceInput(formatInputValue(currentBalance.toString()));
      // Format date for input[type="date"]
      const d = new Date(currentDate);
      setDate(d.toISOString().split('T')[0]);
    }
  }, [open, currentBalance, currentDate]);

  const handleBalanceChange = (e) => {
    const formatted = formatInputValue(e.target.value);
    setBalanceInput(formatted);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const numericBalance = parseRupiah(balanceInput);
      await onSave({ initialBalance: numericBalance, balanceDate: date });
      onClose();
    } catch (error) {
      console.error('Error saving balance:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'dark:bg-gray-800'
      }}
    >
      <DialogTitle className="flex items-center justify-between dark:text-white">
        <span>{t('wallet.edit_balance', 'Ubah Saldo Asli')}</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon className="dark:text-gray-400" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box className="pt-8 flex flex-col gap-8">
          <Box className="mb-4">
            <TextField
              label={t('wallet.initial_balance', 'Saldo Asli')}
              value={balanceInput}
              onChange={handleBalanceChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Rp</span>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
              helperText={t('wallet.initial_balance_help', 'Saldo awal yang akan menjadi basis perhitungan')}
              placeholder="0"
            />
          </Box>

          <Box>
            <TextField
              label={t('wallet.effective_date', 'Tanggal Berlaku')}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText={t('wallet.effective_date_help', 'Hanya transaksi setelah tanggal ini yang akan dihitung')}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onClose} color="inherit">
          {t('common.cancel', 'Batal')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saving}
          startIcon={<SaveIcon />}
        >
          {saving ? t('common.saving', 'Menyimpan...') : t('common.save', 'Simpan')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBalanceModal;
