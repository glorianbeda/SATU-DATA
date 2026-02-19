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
} from '@mui/material';
import { Visibility as ViewIcon, History as HistoryIcon, Storefront as ShopIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchMyLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${INVENTORY_API.GET_LOANS}?myLoans=true`);
      setLoans(response.data.loans || []);
    } catch {
      console.error('Error fetching my loans:');
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
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {t('inventory.loan_requests', 'Pinjam Asset')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="inventory tabs"
          variant="fullWidth"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              minWidth: 'auto',
              flex: { xs: 1, sm: 'initial' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
            } 
          }}
        >
          <Tab icon={<ShopIcon fontSize="small" />} iconPosition="start" label={t('inventory.shop', 'Pinjam')} />
          <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label={t('inventory.my_loans', 'Riwayat')} />
        </Tabs>
      </Box>

      {/* SHOP TAB */}
      <TabPanel value={activeTab} index={0}>
        {/* Borrowing Workflow - Horizontal */}
        <Box sx={{ mb: 3 }}>
            <BorrowingWorkflow />
        </Box>
        
        <AssetShop />
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
                        flex: 1,
                        minWidth: 120,
                        renderCell: (row) => (
                            <Box>
                            <Typography variant="body2" fontWeight="500" noWrap>
                                {row.asset?.name || '-'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {row.asset?.assetCode || '-'}
                            </Typography>
                            </Box>
                        ),
                        },
                        {
                        field: 'status',
                        headerName: t('inventory.status'),
                        width: 130,
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
                        width: 100,
                        renderCell: (row) => new Date(row.requestDate).toLocaleDateString('id-ID'),
                        },
                        {
                        field: 'borrowedDate',
                        headerName: t('inventory.borrow_date'),
                        width: 100,
                        renderCell: (row) =>
                            row.borrowedDate ? new Date(row.borrowedDate).toLocaleDateString('id-ID') : '-',
                        },
                        {
                        field: 'dueDate',
                        headerName: t('inventory.due_date'),
                        width: 100,
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
                        width: 100,
                        align: 'right',
                        renderCell: (row) => (
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
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
                                onClick={() => navigate(`/inventory/loans/${row.id}`)}
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
