import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Button, CircularProgress, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import api from '~/utils/api';
import { useLayout } from '~/context/LayoutContext';
import { DataTable } from '~/components/DataTable';
import { useAlert } from '~/context/AlertContext';
import { SATU_LINK_API } from '~/features/satu-link/constants/api';

const MyShortLinksPage = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    setTitle(t('satu_link.my_short_links'));
  }, [t, setTitle]);

  const [shortLinks, setShortLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, link: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, link: null });
  const [createDialog, setCreateDialog] = useState({ open: false, loading: false, formData: { originalUrl: '', customCode: '', expiresAt: '' } });

  const fetchShortLinks = async () => {
    try {
      const response = await api.get(SATU_LINK_API.GET_MY_SHORT_LINKS);
      setShortLinks(response.data.shortLinks);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to fetch short links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortLinks();
  }, []);

  const handleCreate = async () => {
    const { formData } = createDialog;
    setCreateDialog({ ...createDialog, loading: true });
    try {
      await api.post(SATU_LINK_API.CREATE_MY_SHORT_LINK, formData);
      showSuccess(t('satu_link.short_link_created'));
      setCreateDialog({ open: false, loading: false, formData: { originalUrl: '', customCode: '', expiresAt: '' } });
      fetchShortLinks();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create short link');
      setCreateDialog({ ...createDialog, loading: false });
    }
  };

  const handleEdit = async () => {
    const { link } = editDialog;
    setActionLoading(link.id);
    try {
      await api.put(SATU_LINK_API.UPDATE_MY_SHORT_LINK(link.id), {
        originalUrl: link.originalUrl,
        customCode: link.customCode || null,
        expiresAt: link.expiresAt || null,
        isActive: link.isActive,
      });
      showSuccess(t('satu_link.short_link_updated'));
      setEditDialog({ open: false, link: null });
      fetchShortLinks();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to update short link');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    const { link } = deleteDialog;
    setActionLoading(link.id);
    try {
      await api.delete(SATU_LINK_API.DELETE_MY_SHORT_LINK(link.id));
      showSuccess(t('satu_link.short_link_deleted'));
      setDeleteDialog({ open: false, link: null });
      fetchShortLinks();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to delete short link');
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess(t('satu_link.copied'));
  };

  const columns = [
    { 
      field: 'shortCode', 
      headerName: t('satu_link.short_code'), 
      width: 140,
      renderCell: (row) => (
        <Box className="flex items-center gap-1">
          <Typography variant="body2" className="font-mono">
            {row.customCode || row.shortCode}
          </Typography>
          <IconButton size="small" onClick={() => copyToClipboard(`${window.location.origin}/satu-link/s/${row.customCode || row.shortCode}`)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    },
    { 
      field: 'originalUrl', 
      headerName: t('satu_link.original_url'), 
      width: 250,
      renderCell: (row) => (
        <Typography variant="body2" className="truncate" style={{ maxWidth: 230 }} title={row.originalUrl}>
          {row.originalUrl}
        </Typography>
      )
    },
    { 
      field: 'clicks', 
      headerName: t('satu_link.clicks'), 
      width: 100 
    },
    { 
      field: 'isActive', 
      headerName: t('satu_link.active'), 
      width: 100,
      renderCell: (row) => (
        <Chip 
          label={row.isActive ? t('common.yes') : t('common.no')} 
          color={row.isActive ? 'success' : 'default'} 
          size="small" 
        />
      ),
      valueGetter: (row) => row.isActive ? 'Yes' : 'No'
    },
    { 
      field: 'expiresAt', 
      headerName: t('satu_link.expires'), 
      width: 120,
      renderCell: (row) => row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : '-'
    },
    { 
      field: 'createdAt', 
      headerName: t('satu_link.created'), 
      width: 120,
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      exportable: false,
      renderCell: (row) => (
        <Box className="flex gap-1">
          <IconButton
            size="small"
            color="info"
            onClick={() => setEditDialog({ open: true, link: { ...row } })}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteDialog({ open: true, link: row })}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    },
  ];

  return (
    <Box className="p-2">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="body1" className="text-gray-500 dark:text-gray-400">
          {t('satu_link.my_short_links_subtitle')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialog({ open: true, loading: false, formData: { originalUrl: '', customCode: '', expiresAt: '' } })}
        >
          {t('satu_link.create_short_link')}
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={shortLinks}
        loading={loading}
        title={t('satu_link.my_short_links')}
        emptyMessage={t('satu_link.no_short_links')}
        exportable={true}
        searchable={true}
        pagination={true}
      />

      {/* Create Dialog */}
      <Dialog
        open={createDialog.open}
        onClose={() => setCreateDialog({ ...createDialog, open: false })}
        PaperProps={{ className: "dark:bg-gray-800" }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dark:text-white">{t('satu_link.create_short_link')}</DialogTitle>
        <DialogContent className="pt-4">
          <TextField
            fullWidth
            label={t('satu_link.original_url')}
            value={createDialog.formData.originalUrl}
            onChange={(e) => setCreateDialog({ ...createDialog, formData: { ...createDialog.formData, originalUrl: e.target.value } })}
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
              "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
            }}
          />
          <TextField
            fullWidth
            label={t('satu_link.custom_code')}
            value={createDialog.formData.customCode}
            onChange={(e) => setCreateDialog({ ...createDialog, formData: { ...createDialog.formData, customCode: e.target.value } })}
            margin="normal"
            helperText={t('satu_link.custom_code_hint')}
            sx={{
              "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
              "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
            }}
          />
          <TextField
            fullWidth
            label={t('satu_link.expires_at')}
            type="date"
            value={createDialog.formData.expiresAt}
            onChange={(e) => setCreateDialog({ ...createDialog, formData: { ...createDialog.formData, expiresAt: e.target.value } })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
              "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog({ ...createDialog, open: false })} className="dark:text-gray-300">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleCreate} variant="contained" disabled={createDialog.loading || !createDialog.formData.originalUrl}>
            {createDialog.loading ? <CircularProgress size={20} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, link: null })}
        PaperProps={{ className: "dark:bg-gray-800" }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dark:text-white">{t('satu_link.edit_short_link')}</DialogTitle>
        <DialogContent className="pt-4">
          <TextField
            fullWidth
            label={t('satu_link.original_url')}
            value={editDialog.link?.originalUrl || ''}
            onChange={(e) => setEditDialog({ ...editDialog, link: { ...editDialog.link, originalUrl: e.target.value } })}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
              "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
            }}
          />
          <TextField
            fullWidth
            label={t('satu_link.custom_code')}
            value={editDialog.link?.customCode || ''}
            onChange={(e) => setEditDialog({ ...editDialog, link: { ...editDialog.link, customCode: e.target.value } })}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
              "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
            }}
          />
          <TextField
            fullWidth
            label={t('satu_link.expires_at')}
            type="date"
            value={editDialog.link?.expiresAt ? editDialog.link.expiresAt.split('T')[0] : ''}
            onChange={(e) => setEditDialog({ ...editDialog, link: { ...editDialog.link, expiresAt: e.target.value } })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
              "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editDialog.link?.isActive ?? true}
                onChange={(e) => setEditDialog({ ...editDialog, link: { ...editDialog.link, isActive: e.target.checked } })}
              />
            }
            label={t('satu_link.is_active')}
            className="dark:text-white mt-2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, link: null })} className="dark:text-gray-300">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleEdit} variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, link: null })}
        PaperProps={{ className: "dark:bg-gray-800" }}
      >
        <DialogTitle className="dark:text-white">{t('satu_link.delete_short_link')}</DialogTitle>
        <DialogContent>
          <Typography className="dark:text-gray-200">
            {t('satu_link.delete_confirm')} <strong>{deleteDialog.link?.shortCode}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, link: null })} className="dark:text-gray-300">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyShortLinksPage;
