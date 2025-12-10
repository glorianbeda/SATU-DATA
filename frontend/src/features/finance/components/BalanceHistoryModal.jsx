import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const BalanceHistoryModal = ({ open, onClose, history = [], loading = false }) => {
  const { t } = useTranslation();

  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChangeIcon = (oldBalance, newBalance) => {
    if (newBalance > oldBalance) return <TrendingUpIcon className="text-green-500" />;
    if (newBalance < oldBalance) return <TrendingDownIcon className="text-red-500" />;
    return <TrendingFlatIcon className="text-gray-500" />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: 'dark:bg-gray-800'
      }}
    >
      <DialogTitle className="flex items-center justify-between dark:text-white">
        <span>{t('wallet.history', 'Riwayat Perubahan Saldo')}</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon className="dark:text-gray-400" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('wallet.no_history', 'Belum ada riwayat perubahan saldo')}
          </div>
        ) : (
          <TableContainer component={Paper} className="dark:bg-gray-900">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="dark:text-gray-300">{t('wallet.change', 'Perubahan')}</TableCell>
                  <TableCell className="dark:text-gray-300">{t('wallet.old_balance', 'Saldo Lama')}</TableCell>
                  <TableCell className="dark:text-gray-300">{t('wallet.new_balance', 'Saldo Baru')}</TableCell>
                  <TableCell className="dark:text-gray-300">{t('wallet.date_range', 'Tanggal Berlaku')}</TableCell>
                  <TableCell className="dark:text-gray-300">{t('wallet.changed_by', 'Diubah Oleh')}</TableCell>
                  <TableCell className="dark:text-gray-300">{t('wallet.changed_at', 'Waktu')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      {getChangeIcon(log.oldBalance, log.newBalance)}
                    </TableCell>
                    <TableCell className="dark:text-gray-400">
                      {formatCurrency(log.oldBalance)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatCurrency(log.newBalance)}
                        size="small"
                        color={log.newBalance > log.oldBalance ? 'success' : log.newBalance < log.oldBalance ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell className="dark:text-gray-400">
                      <div className="text-xs">
                        <div className="text-gray-400">{formatDate(log.oldDate)} →</div>
                        <div>{formatDate(log.newDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-400">
                      {log.changedBy?.name || 'System'}
                    </TableCell>
                    <TableCell className="dark:text-gray-400 text-sm">
                      {formatDateTime(log.changedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BalanceHistoryModal;
