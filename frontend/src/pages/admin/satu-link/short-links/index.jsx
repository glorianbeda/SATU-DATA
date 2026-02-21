import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Button, CircularProgress, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Tabs, Tab, Avatar, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '~/utils/api';
import { useLayout } from '~/context/LayoutContext';
import { DataTable } from '~/components/DataTable';
import { useAlert } from '~/context/AlertContext';
import { useTheme } from '~/context/ThemeContext';
import { RoleRoute } from '~/components/RouteGuard';
import { SATU_LINK_API } from '~/features/satu-link/constants/api';

const ShortLinksPage = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { mode } = useTheme();
  const { showSuccess, showError } = useAlert();
  const isDark = mode === 'dark';

  useEffect(() => {
    setTitle(t('satu_link.title'));
  }, [t, setTitle]);

  const [tabValue, setTabValue] = useState(0);
  const [shortLinks, setShortLinks] = useState([]);
  const [linkTrees, setLinkTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, link: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, link: null });
  const [createDialog, setCreateDialog] = useState({ open: false, loading: false });
  const [selectedTree, setSelectedTree] = useState(null);

  const fetchShortLinks = async () => {
    try {
      const response = await api.get(SATU_LINK_API.GET_ADMIN_SHORT_LINKS);
      setShortLinks(response.data.shortLinks);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to fetch short links');
    }
  };

  const fetchLinkTrees = async () => {
    try {
      const response = await api.get(SATU_LINK_API.GET_ADMIN_LINK_TREES);
      setLinkTrees(response.data.linkTrees);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to fetch link trees');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchShortLinks(), fetchLinkTrees()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreate = async (formData) => {
    setCreateDialog({ ...createDialog, loading: true });
    try {
      await api.post(SATU_LINK_API.CREATE_ADMIN_SHORT_LINK, formData);
      showSuccess(t('satu_link.short_link_created'));
      setCreateDialog({ open: false, loading: false });
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
      await api.put(SATU_LINK_API.UPDATE_ADMIN_SHORT_LINK(link.id), {
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
      await api.delete(SATU_LINK_API.DELETE_ADMIN_SHORT_LINK(link.id));
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

  const shortLinkColumns = [
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
      field: 'user', 
      headerName: t('satu_link.owner'), 
      width: 160,
      valueGetter: (row) => row.user?.name || '-'
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
      <Typography variant="body1" className="text-gray-500 dark:text-gray-400 mb-4">
        {t('satu_link.short_links_subtitle')}
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
            color: isDark ? 'rgb(96, 165, 250)' : 'primary.main',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: isDark ? 'rgb(96, 165, 250)' : 'primary.main',
          },
        }}
      >
        <Tab label={t('satu_link.short_links')} />
        <Tab label={t('satu_link.link_trees')} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="body1" className="text-gray-500 dark:text-gray-400">
              {t('satu_link.short_links_subtitle')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialog({ open: true, loading: false })}
            >
              {t('satu_link.create_short_link')}
            </Button>
          </Box>

          <DataTable
            columns={shortLinkColumns}
            data={shortLinks}
            loading={loading}
            title={t('satu_link.short_links')}
            emptyMessage={t('satu_link.no_short_links')}
            exportable={true}
            searchable={true}
            pagination={true}
          />
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="body1" className="text-gray-500 dark:text-gray-400 mb-4">
            {t('satu_link.link_trees_subtitle')}
          </Typography>

          <TableContainer component={Paper} className="dark:bg-gray-800">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('satu_link.user')}</TableCell>
                  <TableCell>{t('satu_link.title_field')}</TableCell>
                  <TableCell>{t('satu_link.bio')}</TableCell>
                  <TableCell>{t('satu_link.items')}</TableCell>
                  <TableCell>{t('satu_link.shared')}</TableCell>
                  <TableCell>{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : linkTrees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="dark:text-gray-400">
                      {t('satu_link.no_link_trees')}
                    </TableCell>
                  </TableRow>
                ) : (
                  linkTrees.map((tree) => (
                    <TableRow key={tree.id} className="dark:hover:bg-gray-700">
                      <TableCell>
                        <Box className="flex items-center gap-2">
                          <Avatar src={tree.user?.profilePicture} sx={{ width: 32, height: 32 }}>
                            {tree.user?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{tree.user?.name}</Typography>
                            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                              {tree.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{tree.title}</TableCell>
                      <TableCell className="max-w-xs">
                        <Typography variant="body2" className="truncate">
                          {tree.bio || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>{tree.items?.length || 0}</TableCell>
                      <TableCell>
                        <Chip 
                          label={tree.isShared ? t('common.yes') : t('common.no')} 
                          color={tree.isShared ? 'success' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setSelectedTree(tree)}
                          title="View"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Create Dialog */}
      <CreateShortLinkDialog
        open={createDialog.open}
        onClose={() => setCreateDialog({ open: false, loading: false })}
        onSubmit={handleCreate}
        loading={createDialog.loading}
      />

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

      {/* View Link Tree Dialog */}
      {selectedTree && (
        <Dialog
          open={!!selectedTree}
          onClose={() => setSelectedTree(null)}
          PaperProps={{ className: "dark:bg-gray-800" }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="dark:text-white">{selectedTree.title}</DialogTitle>
          <DialogContent>
            <Box className="flex items-center gap-3 mb-4">
              <Avatar src={selectedTree.user?.profilePicture} sx={{ width: 48, height: 48 }}>
                {selectedTree.user?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" className="dark:text-gray-300">
                  {selectedTree.user?.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                  {selectedTree.user?.email}
                </Typography>
              </Box>
            </Box>
            
            {selectedTree.bio && (
              <Typography variant="body2" className="dark:text-gray-300 mb-4">
                {selectedTree.bio}
              </Typography>
            )}

            <Typography variant="subtitle2" className="dark:text-gray-300 mb-2">
              {t('satu_link.link_items')} ({selectedTree.items?.length || 0})
            </Typography>

            <Box className="space-y-2">
              {selectedTree.items?.map((item) => (
                <Box 
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-700"
                >
                  <Typography variant="body2" className="dark:text-white flex-1 truncate">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {item.url}
                  </Typography>
                </Box>
              )) || (
                <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                  {t('satu_link.no_items')}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedTree(null)} className="dark:text-gray-300">
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

const CreateShortLinkDialog = ({ open, onClose, onSubmit, loading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    originalUrl: '',
    customCode: '',
    expiresAt: '',
    userId: '',
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: "dark:bg-gray-800" }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="dark:text-white">{t('satu_link.create_short_link')}</DialogTitle>
      <DialogContent className="pt-4">
        <TextField
          fullWidth
          label={t('satu_link.original_url')}
          value={formData.originalUrl}
          onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
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
          value={formData.customCode}
          onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
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
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
            "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
          }}
        />
        <TextField
          fullWidth
          label={t('satu_link.user_id')}
          type="number"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          margin="normal"
          helperText={t('satu_link.user_id_hint')}
          sx={{
            "& .MuiOutlinedInput-root": { ".dark &": { color: "white" }, ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" } },
            "& .MuiInputLabel-root": { ".dark &": { color: "rgba(255, 255, 255, 0.7)" } },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="dark:text-gray-300">
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !formData.originalUrl}>
          {loading ? <CircularProgress size={20} /> : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function ProtectedShortLinksPage() {
  return (
    <RoleRoute allowedRoles={['SUPER_ADMIN']}>
      <ShortLinksPage />
    </RoleRoute>
  );
}
