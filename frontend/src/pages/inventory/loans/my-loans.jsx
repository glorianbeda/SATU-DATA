import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import { Visibility as ViewIcon, History as HistoryIcon, Storefront as ShopIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import DataTable from '~/components/DataTable/DataTable';

import ReturnAssetDialog from '~/features/inventory/components/ReturnAssetDialog';
import AssetShop from '~/features/inventory/components/AssetShop';
import BorrowingWorkflow from '~/features/inventory/components/BorrowingWorkflow';
import { AssignmentReturn as ReturnIcon } from '@mui/icons-material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MyLoans = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchMyLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${INVENTORY_API.GET_LOANS}?myLoans=true`);
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error('Error fetching my loans:', error);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'info';
      case 'BORROWED':
        return 'success';
      case 'RETURN_VERIFICATION':
        return 'warning';
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

  const isOverdue = (loan) => {
    return loan.status === 'BORROWED' && loan.dueDate && new Date(loan.dueDate) < new Date();
  };

  useEffect(() => {
    if (activeTab === 1) {
        fetchMyLoans();
    }
  }, [activeTab]);

  const handleReturnClick = (loan) => {
    setSelectedLoan(loan);
    setReturnDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('inventory.loan_requests', 'Pinjam Asset')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="inventory tabs">
          <Tab icon={<ShopIcon />} iconPosition="start" label={t('inventory.shop', 'Pinjam Asset')} />
          <Tab icon={<HistoryIcon />} iconPosition="start" label={t('inventory.my_loans', 'Riwayat Peminjaman')} />
        </Tabs>
      </Box>

      {/* SHOP TAB */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
                 <AssetShop />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <BorrowingWorkflow />
            </Grid>
        </Grid>
      </TabPanel>

      {/* MY LOANS TAB */}
      <TabPanel value={activeTab} index={1}>
        {loading ? (
             <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
             </Box>
        ) : (
            <>
                {loans.length === 0 ? (
                    <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h6" color="text.secondary">
                        {t('inventory.no_loans')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('inventory.request_loan')} untuk meminjam aset
                        </Typography>
                    </CardContent>
                    </Card>
                ) : (
                    <DataTable
                    title={t('inventory.my_loans')}
                    columns={[
                        {
                        field: 'asset',
                        headerName: t('inventory.asset'),
                        renderCell: (row) => (
                            <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {row.asset?.name || '-'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {row.asset?.assetCode || '-'}
                            </Typography>
                            </Box>
                        ),
                        },
                        {
                        field: 'status',
                        headerName: t('inventory.status'),
                        renderCell: (row) => {
                            const overdue = isOverdue(row);
                            const displayStatus = overdue ? 'OVERDUE' : row.status;
                            
                            return (
                            <Chip
                                label={t(`inventory.${displayStatus.toLowerCase()}`)}
                                color={overdue ? 'error' : getStatusColor(row.status)}
                                size="small"
                                sx={overdue ? { fontWeight: 'bold' } : {}}
                            />
                            );
                        },
                        },
                        {
                        field: 'requestDate',
                        headerName: t('inventory.request_date'),
                        renderCell: (row) => new Date(row.requestDate).toLocaleDateString('id-ID'),
                        },
                        {
                        field: 'borrowedDate',
                        headerName: t('inventory.borrow_date'),
                        renderCell: (row) =>
                            row.borrowedDate ? new Date(row.borrowedDate).toLocaleDateString('id-ID') : '-',
                        },
                        {
                        field: 'dueDate',
                        headerName: t('inventory.due_date'),
                        renderCell: (row) => {
                            if (!row.dueDate) return '-';
                            const dueDate = new Date(row.dueDate);
                            const overdue = isOverdue(row);
                            
                            return (
                            <Typography
                                variant="body2"
                                color={overdue ? 'error' : 'inherit'}
                                fontWeight={overdue ? 'bold' : 'normal'}
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
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            {(row.status === 'BORROWED') && (
                                    <Tooltip title={t('inventory.return')}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleReturnClick(row)}
                                    >
                                        <ReturnIcon fontSize="small" />
                                    </IconButton>
                                    </Tooltip>
                            )}
                            <Tooltip title={t('common.view')}>
                                <IconButton
                                size="small"
                                color="primary"
                                onClick={() => (window.location.href = `/inventory/loans/${row.id}`)}
                                >
                                <ViewIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            </Box>
                        ),
                        },
                    ]}
                    data={loans}
                    loading={loading}
                    searchable={true}
                    pagination={true}
                    emptyMessage={t('inventory.no_loans')}
                    />
                )}
            </>
        )}
      </TabPanel>

      <ReturnAssetDialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        loan={selectedLoan}
        onSuccess={fetchMyLoans}
      />
    </Box>
  );
};


export default MyLoans;
