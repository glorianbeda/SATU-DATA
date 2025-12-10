import React, { useState, useEffect } from 'react';
import DataTable from '~/components/DataTable/DataTable';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import TransactionModal from '~/features/finance/components/TransactionModal';
import ImportTransactionModal from '~/features/finance/components/ImportTransactionModal';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Expense = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, {
        params: { type: 'EXPENSE', limit: 1000 },
        withCredentials: true
      });
      setData(response.data.transactions);
    } catch (error) {
      console.error('Error fetching expense:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      const data = new FormData();
      data.append('type', 'EXPENSE');
      data.append('date', formData.date);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('amount', formData.amount);
      if (formData.proof) {
        data.append('proof', formData.proof);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleImport = async (transactions) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/finance/bulk`, {
        transactions,
        type: 'EXPENSE'
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
      renderCell: (row) => new Date(row.date).toLocaleDateString(),
      valueGetter: (row) => new Date(row.date).toLocaleDateString()
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
        <a href={`${import.meta.env.VITE_API_URL}${row.proofImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {t('common.view')}
        </a>
      ) : '-',
      valueGetter: (row) => row.proofImage ? `${import.meta.env.VITE_API_URL}${row.proofImage}` : '-'
    },
    {
      field: 'createdBy',
      headerName: t('common.created_by') || 'Created By',
      renderCell: (row) => row.createdBy?.name,
      valueGetter: (row) => row.createdBy?.name || '-'
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        title={t('sidebar.expense') || 'Expense'}
        columns={columns}
        data={data}
        loading={loading}
        actions={
          <Box className="flex gap-2">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => navigate('/quick-edit')}
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
              onClick={() => setModalOpen(true)}
              size="small"
            >
              {t('common.add')}
            </Button>
          </Box>
        }
      />
      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        type="EXPENSE"
      />
      <ImportTransactionModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSave={handleImport}
        type="EXPENSE"
      />
    </div>
  );
};

export default Expense;
