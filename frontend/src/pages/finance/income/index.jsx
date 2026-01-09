import React, { useState, useEffect } from 'react';
import DataTable from '~/components/DataTable/DataTable';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button, Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TransactionModal from '~/features/finance/components/TransactionModal';
import ImportTransactionModal from '~/features/finance/components/ImportTransactionModal';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useAlert } from '~/context/AlertContext';
import { formatDateFull } from '~/utils/date';

const Income = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, {
        params: { type: 'INCOME', limit: 1000 },
        withCredentials: true
      });
      setData(response.data.transactions);
    } catch (error) {
      console.error('Error fetching income:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      const payload = new FormData();
      payload.append('type', 'INCOME');
      payload.append('date', formData.date);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('amount', formData.amount);
      if (formData.proof) {
        payload.append('proof', formData.proof);
      }

      if (editingTransaction) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/finance/transactions/${editingTransaction.id}`, payload, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSuccess(t('finance.transaction_updated', 'Transaction updated successfully'));
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, payload, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSuccess(t('finance.transaction_added', 'Transaction added successfully'));
      }
      setModalOpen(false);
      setEditingTransaction(null);
      fetchData();
    } catch (error) {
      console.error('Error saving transaction:', error);
      showError(t('finance.save_error', 'Failed to save transaction'));
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    setDeletingTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/finance/transactions/${deletingTransaction.id}`, {
        withCredentials: true
      });
      showSuccess(t('finance.transaction_deleted', 'Transaction deleted successfully'));
      setDeleteDialogOpen(false);
      setDeletingTransaction(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showError(t('finance.delete_error', 'Failed to delete transaction'));
    }
  };

  const handleImport = async (transactions) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/finance/bulk`, {
        transactions,
        type: 'INCOME'
      }, {
        withCredentials: true
      });
      setImportModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error importing transactions:', error);
    }
  };

  const columns = [
    {
      field: 'date',
      headerName: t('common.date') || 'Date',
      renderCell: (row) => formatDateFull(row.date),
      valueGetter: (row) => formatDateFull(row.date)
    },
    { field: 'description', headerName: t('common.description') || 'Description' },
    { field: 'category', headerName: t('common.category') || 'Category' },
    {
      field: 'amount',
      headerName: t('common.amount') || 'Amount',
      renderCell: (row) => `Rp ${row.amount.toLocaleString('id-ID')}`,
      valueGetter: (row) => `Rp ${row.amount.toLocaleString('id-ID')}`
    },
    {
      field: 'proofImage',
      headerName: t('finance.proof') || 'Proof',
      renderCell: (row) => row.proofImage ? (
        <button
          onClick={() => setPreviewImage(`${import.meta.env.VITE_API_URL}${row.proofImage}`)}
          className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
        >
          {t('common.view')}
        </button>
      ) : '-',
      valueGetter: (row) => row.proofImage ? `${import.meta.env.VITE_API_URL}${row.proofImage}` : '-'
    },
    {
      field: 'createdBy',
      headerName: t('common.created_by') || 'Created By',
      renderCell: (row) => row.createdBy?.name,
      valueGetter: (row) => row.createdBy?.name || '-'
    },
    {
      field: 'actions',
      headerName: t('common.actions') || 'Actions',
      sortable: false,
      exportable: false,
      width: 120,
      renderCell: (row) => (
        <Box className="flex gap-1">
          <Tooltip title={t('common.edit')}>
            <IconButton size="small" onClick={() => handleEdit(row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton size="small" onClick={() => handleDeleteClick(row)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        title={t('sidebar.income') || 'Income'}
        columns={columns}
        data={data}
        loading={loading}
        actions={
          <Box className="flex gap-2 flex-wrap">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => navigate('/quick-edit?type=INCOME')}
            >
              {t('sidebar.quick_edit') || 'Quick Edit'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileUploadIcon />}
              onClick={() => setImportModalOpen(true)}
              size="small"
            >
              {t('common.import', 'Import')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingTransaction(null);
                setModalOpen(true);
              }}
              size="small"
            >
              {t('common.add')}
            </Button>
          </Box>
        }
      />
      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSave}
        type="INCOME"
        initialData={editingTransaction}
      />
      <ImportTransactionModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSave={handleImport}
        type="INCOME"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('common.confirm_delete', 'Confirm Delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('finance.delete_confirmation', 'Are you sure you want to delete this transaction? This action cannot be undone.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        className="flex items-center justify-center p-4"
      >
        <Box className="relative outline-none">
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{
              position: 'absolute',
              top: -16,
              right: -16,
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' },
              zIndex: 10,
              boxShadow: 3
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          {previewImage && (
            <img
              src={previewImage}
              alt="Proof"
              className="rounded-lg shadow-2xl"
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Income;

