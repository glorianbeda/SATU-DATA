import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
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
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Delete as DeleteIcon,
  VerifiedUser as VerifyIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import { hasPermission } from '~/config/roles';
import { useAlert } from '~/context/AlertContext';
import DataTable from '~/components/DataTable/DataTable';
import VerifyReturnDialog from '~/features/inventory/components/VerifyReturnDialog';
import EditLoanDialog from '~/features/inventory/components/EditLoanDialog';

const LoansList = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlert();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [verifyDialog, setVerifyDialog] = useState({ open: false, loan: null });
  const [rejectDialog, setRejectDialog] = useState({ open: false, loan: null, reason: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, loan: null });
  const [editDialog, setEditDialog] = useState({ open: false, loan: null });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'KOORDINATOR_INVENTARIS'].includes(userRole?.name || userRole);

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

  const handleApprove = async (loan) => {
    try {
      await api.put(INVENTORY_API.APPROVE_LOAN(loan.id));
      showSuccess(t('inventory.loan_approved'));
      fetchLoans();
    } catch (error) {
      showError(t('inventory.error_approving_loan', 'Failed to approve loan'));
    }
  };

  const handleReject = async () => {
    try {
      await api.put(INVENTORY_API.REJECT_LOAN(rejectDialog.loan.id), {
        reason: rejectDialog.reason,
      });
      showSuccess(t('inventory.loan_rejected'));
      setRejectDialog({ open: false, loan: null, reason: '' });
      fetchLoans();
    } catch (error) {
      showError(t('inventory.error_rejecting_loan', 'Failed to reject loan'));
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(INVENTORY_API.DELETE_LOAN(deleteDialog.loan.id));
      showSuccess(t('inventory.loan_deleted', 'Loan deleted'));
      setDeleteDialog({ open: false, loan: null });
      fetchLoans();
    } catch (error) {
      showError(t('inventory.error_deleting_loan', 'Failed to delete loan'));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'info';
      case 'BORROWED': return 'primary';
      case 'RETURN_VERIFICATION': return 'secondary';
      case 'RETURNED': return 'success';
      case 'REJECTED': return 'error';
      case 'OVERDUE': return 'error';
      default: return 'default';
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('inventory.loan_management', 'Kelola Peminjaman')}
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
              <MenuItem value="RETURN_VERIFICATION">{t('inventory.return_verification')}</MenuItem>
              <MenuItem value="RETURNED">{t('inventory.returned')}</MenuItem>
              <MenuItem value="REJECTED">{t('inventory.rejected')}</MenuItem>
              <MenuItem value="OVERDUE">{t('inventory.overdue')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Loans Table */}
      <DataTable
        title={t('inventory.loan_list', 'Daftar Peminjaman')}
        columns={[
          {
            field: 'asset',
            headerName: t('inventory.asset'),
            renderCell: (row) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{row.asset?.name || '-'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ({row.asset?.assetCode || '-'})
                </Typography>
              </Box>
            ),
          },
          {
            field: 'borrower',
            headerName: t('inventory.borrower'),
            renderCell: (row) => row.borrower?.name || '-',
          },
          {
            field: 'status',
            headerName: t('inventory.status'),
            renderCell: (row) => (
              <Chip
                label={t(`inventory.${row.status.toLowerCase()}`)}
                color={getStatusColor(row.status)}
                size="small"
              />
            ),
          },
          {
            field: 'requestDate',
            headerName: t('inventory.request_date'),
            renderCell: (row) => new Date(row.requestDate).toLocaleDateString('id-ID'),
          },
          {
            field: 'borrowDate',
            headerName: t('inventory.borrow_date'),
            renderCell: (row) => row.borrowDate ? new Date(row.borrowDate).toLocaleDateString('id-ID') : '-',
          },
          {
            field: 'dueDate',
            headerName: t('inventory.due_date'),
            renderCell: (row) => {
              if (!row.dueDate) return '-';
              const dueDate = new Date(row.dueDate);
              const isOverdue = dueDate < new Date() && !['RETURNED', 'REJECTED'].includes(row.status);
              return (
                <Typography
                  variant="body2"
                  color={isOverdue ? 'error' : 'inherit'}
                  fontWeight={isOverdue ? 'bold' : 'normal'}
                >
                  {dueDate.toLocaleDateString('id-ID')}
                </Typography>
              );
            },
          },
          {
            field: 'actions',
            headerName: t('inventory.actions'),
            align: 'right',
            renderCell: (row) => (
              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                {/* Approve button for PENDING status - admin only */}
                {isAdmin && row.status === 'PENDING' && (
                  <Tooltip title={t('inventory.approve', 'Approve')}>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleApprove(row)}
                    >
                      <ApproveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                {/* Reject button for PENDING status - admin only */}
                {isAdmin && row.status === 'PENDING' && (
                  <Tooltip title={t('inventory.reject', 'Reject')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setRejectDialog({ open: true, loan: row, reason: '' })}
                    >
                      <RejectIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                {/* Verify button for RETURN_VERIFICATION status - admin only */}
                {isAdmin && row.status === 'RETURN_VERIFICATION' && (
                  <Tooltip title={t('inventory.verify')}>
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setVerifyDialog({ open: true, loan: row })}
                    >
                      <VerifyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {/* View button - always visible */}
                <Tooltip title={t('common.view')}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => (window.location.href = `/inventory/loans/${row.id}`)}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* Edit button - Admin only */}
                {isAdmin && (
                  <Tooltip title={t('common.edit')}>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => setEditDialog({ open: true, loan: row })}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Delete button - admin only for non-borrowed items */}
                {isAdmin && !['BORROWED', 'RETURN_VERIFICATION'].includes(row.status) && (
                  <Tooltip title={t('common.delete')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, loan: row })}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ),
          },
        ]}
        data={loans}
        loading={loading}
        searchable={true}
        pagination={true}
        emptyMessage={t('common.no_data')}
      />

      {/* Verify Return Dialog */}
      <VerifyReturnDialog 
        open={verifyDialog.open}
        onClose={() => setVerifyDialog({ open: false, loan: null })}
        loan={verifyDialog.loan}
        onSuccess={fetchLoans}
      />

      <EditLoanDialog 
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, loan: null })}
        loan={editDialog.loan}
        onSuccess={fetchLoans}
      />

      {/* Reject Loan Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, loan: null, reason: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('inventory.reject_loan', 'Reject Loan')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('inventory.rejection_reason')}
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, loan: null, reason: '' })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleReject} color="error" variant="contained">
            {t('inventory.reject', 'Reject')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, loan: null })} maxWidth="xs" fullWidth>
        <DialogTitle>{t('common.confirm_delete', 'Confirm Delete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('inventory.confirm_delete_loan', 'Are you sure you want to delete this loan request?')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, loan: null })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoansList;
