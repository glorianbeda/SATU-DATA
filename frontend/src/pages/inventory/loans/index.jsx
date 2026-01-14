import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  Tooltip,
  Grid,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import { hasPermission } from '~/config/roles';

const LoansList = () => {
  const { t } = useTranslation();
  const [loans, setLoans] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [requestDialog, setRequestDialog] = useState({ open: false, assetId: '' });

  const userRole = JSON.parse(localStorage.getItem('userRole') || '{}');
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole.name);
  const canViewAllLoans = hasPermission(userRole, 'canViewAllLoans');
  const canRequestLoans = hasPermission(userRole, 'canRequestLoans');

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.search) params.append('search', filter.search);

      const response = await api.get(`${INVENTORY_API.GET_LOANS}?${params.toString()}`);
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await api.get(`${INVENTORY_API.GET_ASSETS}?status=AVAILABLE`);
      setAssets(response.data.assets);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleRequestLoan = async () => {
    if (!requestDialog.assetId) {
      alert(t('inventory.asset') + ' is required');
      return;
    }

    try {
      const response = await api.post(INVENTORY_API.CREATE_LOAN, {
        assetId: parseInt(requestDialog.assetId),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      setLoans([response.data.loan, ...loans]);
      setRequestDialog({ open: false, assetId: '' });
    } catch (error) {
      console.error('Error requesting loan:', error);
      alert(t('common.error'));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'info';
      case 'APPROVED':
        return 'warning';
      case 'BORROWED':
        return 'success';
      case 'RETURNED':
        return 'default';
      case 'REJECTED':
        return 'error';
      case 'OVERDUE':
        return 'error';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    fetchLoans();
    if (canRequestLoans) {
      fetchAssets();
    }
  }, [filter]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('inventory.loan_requests')}
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder={t('common.search')}
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('inventory.status')}</InputLabel>
            <Select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              label={t('inventory.status')}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="PENDING">{t('inventory.pending')}</MenuItem>
              <MenuItem value="APPROVED">{t('inventory.approved')}</MenuItem>
              <MenuItem value="BORROWED">{t('inventory.borrowed')}</MenuItem>
              <MenuItem value="RETURNED">{t('inventory.returned')}</MenuItem>
              <MenuItem value="REJECTED">{t('inventory.rejected')}</MenuItem>
              <MenuItem value="OVERDUE">{t('inventory.overdue')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Loans Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('inventory.asset')}</TableCell>
              <TableCell>{t('inventory.borrower')}</TableCell>
              <TableCell>{t('inventory.status')}</TableCell>
              <TableCell>{t('inventory.request_date')}</TableCell>
              <TableCell>{t('inventory.due_date')}</TableCell>
              <TableCell align="right">{t('inventory.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t('inventory.loading')}
                </TableCell>
              </TableRow>
            ) : loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t('common.no_data')}
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{loan.asset?.name || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({loan.asset?.assetCode || '-'})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{loan.borrower?.name || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`inventory.${loan.status.toLowerCase()}`)}
                      color={getStatusColor(loan.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(loan.requestDate).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('id-ID') : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => window.location.href = `/inventory/loans/${loan.id}`}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Request Loan Button */}
      {canRequestLoans && (
        <Fab
          color="primary"
          aria-label={t('inventory.request_loan')}
          onClick={() => setRequestDialog({ open: true, assetId: '' })}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Request Loan Dialog */}
      <Dialog open={requestDialog.open} onClose={() => setRequestDialog({ open: false, assetId: '' })} maxWidth="sm">
        <DialogTitle>{t('inventory.request_new_loan')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t('inventory.asset')}</InputLabel>
            <Select
              value={requestDialog.assetId}
              onChange={(e) => setRequestDialog({ ...requestDialog, assetId: e.target.value })}
              label={t('inventory.asset')}
            >
              <MenuItem value="">{t('common.select')}</MenuItem>
              {assets.filter(a => a.status === 'AVAILABLE').map((asset) => (
                <MenuItem key={asset.id} value={asset.id.toString()}>
                  {asset.name} ({asset.assetCode})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialog({ open: false, assetId: '' })}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleRequestLoan}
            variant="contained"
            color="primary"
          >
            {t('inventory.request')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoansList;
