import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import { hasPermission } from '~/config/roles';

const LoanHistory = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  const canViewAllLoans = hasPermission(userRole, 'canViewAllLoans');

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get(INVENTORY_API.GET_LOANS);
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error('Error fetching loan history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'info';
      case 'BORROWED':
        return 'primary';
      case 'RETURNED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'OVERDUE':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return t('inventory.pending');
      case 'APPROVED':
        return t('inventory.approved');
      case 'BORROWED':
        return t('inventory.borrowed_status');
      case 'RETURNED':
        return t('inventory.returned');
      case 'REJECTED':
        return t('inventory.rejected');
      case 'OVERDUE':
        return t('inventory.overdue');
      default:
        return status;
    }
  };

  const filteredLoans = loans.filter((loan) => {
    if (statusFilter === 'all') return true;
    return loan.status === statusFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('inventory.loan_history')}
      </Typography>

      <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('inventory.status')}</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label={t('inventory.status')}
          >
            <MenuItem value="all">{t('common.all')}</MenuItem>
            <MenuItem value="PENDING">{t('inventory.pending')}</MenuItem>
            <MenuItem value="APPROVED">{t('inventory.approved')}</MenuItem>
            <MenuItem value="BORROWED">{t('inventory.borrowed_status')}</MenuItem>
            <MenuItem value="RETURNED">{t('inventory.returned')}</MenuItem>
            <MenuItem value="REJECTED">{t('inventory.rejected')}</MenuItem>
            <MenuItem value="OVERDUE">{t('inventory.overdue')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredLoans.length === 0 ? (
            <Alert severity="info">
              {statusFilter === 'all'
                ? t('inventory.no_assets')
                : t('inventory.no_assets')}
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('inventory.asset')}</TableCell>
                    <TableCell>{t('inventory.borrower')}</TableCell>
                    <TableCell>{t('inventory.request_date')}</TableCell>
                    <TableCell>{t('inventory.due_date')}</TableCell>
                    <TableCell>{t('inventory.return_date')}</TableCell>
                    <TableCell>{t('inventory.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLoans.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {loan.asset?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {loan.asset?.assetCode}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{loan.borrower?.name || '-'}</TableCell>
                      <TableCell>{formatDate(loan.requestDate)}</TableCell>
                      <TableCell>{formatDate(loan.dueDate)}</TableCell>
                      <TableCell>{formatDate(loan.returnedDate)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(loan.status)}
                          color={getStatusColor(loan.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoanHistory;
