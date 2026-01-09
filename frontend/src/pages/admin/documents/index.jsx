import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Button, CircularProgress, Chip, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import { useLayout } from '~/context/LayoutContext';
import { DataTable } from '~/components/DataTable';
import { useAlert } from '~/context/AlertContext';
import { useTheme } from '~/context/ThemeContext';
import { RoleRoute } from '~/components/RouteGuard';

const DocumentManagement = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  useEffect(() => {
    setTitle('Manajemen Dokumen');
  }, [setTitle]);

  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, document: null });
  const [previewDialog, setPreviewDialog] = useState({ open: false, document: null });

  const { showSuccess, showError } = useAlert();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/admin`, {
        withCredentials: true
      });
      setDocuments(response.data.documents);
    } catch (err) {
      showError(err.response?.data?.error || 'Gagal memuat dokumen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async () => {
    const { document } = deleteDialog;
    setActionLoading(document.id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/documents/${document.id}`, {
        withCredentials: true
      });
      showSuccess('Dokumen berhasil dihapus');
      setDeleteDialog({ open: false, document: null });
      fetchDocuments();
    } catch (err) {
      showError(err.response?.data?.error || 'Gagal menghapus dokumen');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePreview = (document) => {
    const url = `${import.meta.env.VITE_API_URL}${document.filePath}`;
    window.open(url, '_blank');
  };

  const getStatusChip = (doc) => {
    if (doc.isDeleted) {
      return <Chip label="Dihapus" color="error" size="small" />;
    }
    if (doc.signedCount === doc.requestCount && doc.requestCount > 0) {
      return <Chip label="Selesai" color="success" size="small" />;
    }
    if (doc.pendingCount > 0) {
      return <Chip label="Pending" color="warning" size="small" />;
    }
    return <Chip label="Aktif" color="primary" size="small" />;
  };

  // Filter documents based on tab
  const activeDocuments = documents.filter(d => !d.isDeleted);
  const deletedDocuments = documents.filter(d => d.isDeleted);

  const columns = [
    { 
      field: 'title', 
      headerName: 'Judul', 
      width: 250,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon sx={{ color: '#ef4444', fontSize: 20 }} />
          <Typography variant="body2" noWrap>
            {row.title}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'uploader', 
      headerName: 'Diupload Oleh', 
      width: 180,
      renderCell: (row) => row.uploader?.name || '-',
      valueGetter: (row) => row.uploader?.name || '-'
    },
    {
      field: 'requests',
      headerName: 'Tanda Tangan',
      width: 150,
      renderCell: (row) => (
        <Typography variant="body2">
          {row.signedCount}/{row.requestCount} selesai
        </Typography>
      ),
      valueGetter: (row) => `${row.signedCount}/${row.requestCount}`
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      exportable: false,
      renderCell: (row) => getStatusChip(row),
      valueGetter: (row) => row.isDeleted ? 'Dihapus' : 'Aktif'
    },
    {
      field: 'createdAt',
      headerName: 'Tanggal Upload',
      width: 150,
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString('id-ID'),
      valueGetter: (row) => new Date(row.createdAt).toLocaleDateString('id-ID')
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 120,
      sortable: false,
      exportable: false,
      renderCell: (row) => (
        <Box className="flex gap-1">
          <IconButton
            size="small"
            color="primary"
            onClick={() => handlePreview(row)}
            title="Lihat Dokumen"
            disabled={row.isDeleted}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          {!row.isDeleted && (
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteDialog({ open: true, document: row })}
              title="Hapus Dokumen"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )
    },
  ];

  return (
    <Box className="p-2">
      <Typography variant="body1" className="text-gray-500 dark:text-gray-400 mb-4">
        Kelola semua dokumen dalam sistem
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        className="mb-4"
        sx={{
          '& .MuiTab-root': {
            color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
          },
          '& .Mui-selected': {
            color: isDark ? 'rgb(96, 165, 250) !important' : 'primary.main',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: isDark ? 'rgb(96, 165, 250)' : 'primary.main',
          },
        }}
      >
        <Tab label={`Aktif (${activeDocuments.length})`} />
        <Tab label={`Dihapus (${deletedDocuments.length})`} />
      </Tabs>

      {tabValue === 0 && (
        <DataTable
          columns={columns}
          data={activeDocuments}
          loading={loading}
          title="Dokumen Aktif"
          emptyMessage="Tidak ada dokumen aktif"
          exportable={true}
          searchable={true}
          pagination={true}
        />
      )}

      {tabValue === 1 && (
        <DataTable
          columns={columns}
          data={deletedDocuments}
          loading={loading}
          title="Dokumen Dihapus"
          emptyMessage="Tidak ada dokumen yang dihapus"
          exportable={true}
          searchable={true}
          pagination={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, document: null })}
        PaperProps={{
          className: "dark:bg-gray-800"
        }}
      >
        <DialogTitle className="dark:text-white">Hapus Dokumen</DialogTitle>
        <DialogContent>
          <Alert severity="warning" className="mb-4">
            <strong>Perhatian:</strong> Dokumen yang dihapus akan ditandai sebagai tidak tersedia.
            Pengguna akan melihat pesan "File telah dihapus admin".
          </Alert>
          <Typography className="dark:text-gray-200">
            Apakah Anda yakin ingin menghapus dokumen <strong>{deleteDialog.document?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2 dark:text-gray-400">
            Dokumen ini memiliki {deleteDialog.document?.requestCount || 0} permintaan tanda tangan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, document: null })} className="dark:text-gray-300">
            Batal
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error" 
            disabled={actionLoading === deleteDialog.document?.id}
          >
            {actionLoading === deleteDialog.document?.id ? <CircularProgress size={20} /> : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default function ProtectedDocumentManagement() {
  return (
    <RoleRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DocumentManagement />
    </RoleRoute>
  );
}
