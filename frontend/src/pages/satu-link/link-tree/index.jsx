import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Button, CircularProgress, TextField, Switch,
  FormControlLabel, IconButton, Avatar, Grid, Dialog, 
  DialogTitle, DialogContent, DialogActions, Paper,
  MenuItem, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import LanguageIcon from '@mui/icons-material/Language';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '~/utils/api';
import { useLayout } from '~/context/LayoutContext';
import { useAlert } from '~/context/AlertContext';
import { SATU_LINK_API } from '~/features/satu-link/constants/api';

const iconOptions = [
  { value: 'language', label: 'Website', icon: <LanguageIcon /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  { value: 'twitter', label: 'Twitter/X', icon: <TwitterIcon /> },
  { value: 'youtube', label: 'YouTube', icon: <YouTubeIcon /> },
  { value: 'email', label: 'Email', icon: <EmailIcon /> },
  { value: 'phone', label: 'Phone', icon: <PhoneIcon /> },
  { value: 'location', label: 'Location', icon: <LocationOnIcon /> },
  { value: 'link', label: 'Link', icon: <LinkIcon /> },
];

const SortableItem = ({ item, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const getIconComponent = (iconName) => {
    const icon = iconOptions.find(opt => opt.value === iconName);
    return icon ? icon.icon : <LinkIcon />;
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3"
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        boxShadow: isDragging ? '0 8px 25px rgba(59, 130, 246, 0.2)' : 'none',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
        },
      }}
    >
      <Box {...attributes} {...listeners} className="text-gray-400 cursor-grab">
        <DragIndicatorIcon />
      </Box>
      <Box 
        className="flex items-center justify-center"
        sx={{ 
          width: 44,
          height: 44,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          color: 'white',
          flexShrink: 0,
        }}
      >
        {getIconComponent(item.icon)}
      </Box>
      <Box className="flex-1 min-w-0">
        <Typography variant="body1" fontWeight="600" noWrap>
          {item.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" className="truncate block">
          {item.url}
        </Typography>
      </Box>
      {item.isActive ? (
        <VisibilityIcon sx={{ color: 'success.main', fontSize: 20 }} />
      ) : (
        <VisibilityOffIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
      )}
      <IconButton
        size="small"
        onClick={() => onEdit(item)}
        sx={{ 
          color: 'primary.main',
          '&:hover': { bgcolor: 'primary.light', color: 'white' },
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => onDelete(item.id)}
        sx={{ 
          '&:hover': { bgcolor: 'error.light', color: 'white' },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

const LinkTreePage = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    setTitle(t('satu_link.link_tree'));
  }, [t, setTitle]);

  const [linkTree, setLinkTree] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemDialog, setItemDialog] = useState({ open: false, item: null, isNew: false, error: '' });
  const [settingsDialog, setSettingsDialog] = useState({ open: false, loading: false });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchLinkTree = async () => {
    try {
      const response = await api.get(SATU_LINK_API.GET_MY_LINK_TREE);
      setLinkTree(response.data.linkTree);
      setItems(response.data.linkTree.items || []);
    } catch (err) {
      showError(err.response?.data?.error || t('satu_link.fetch_error', 'Gagal mengambil data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkTree();
  }, []);

  const validateUrl = (url) => {
    if (!url) return { valid: false, message: t('satu_link.url_required', 'URL wajib diisi') };
    const urlPattern = /^(https?:\/\/)/i;
    if (!urlPattern.test(url)) {
      return { valid: false, message: t('satu_link.url_must_http', 'URL harus dimulai dengan http:// atau https://') };
    }
    return { valid: true, message: '' };
  };

  const formatUrl = (url) => {
    if (!url) return '';
    const urlPattern = /^(https?:\/\/)/i;
    if (!urlPattern.test(url)) {
      return 'https://' + url;
    }
    return url;
  };

  const handleSaveSettings = async () => {
    setSettingsDialog({ ...settingsDialog, loading: true });
    try {
      await api.put(SATU_LINK_API.UPDATE_MY_LINK_TREE, {
        title: linkTree.title,
        bio: linkTree.bio,
        isShared: linkTree.isShared,
      });
      showSuccess(t('satu_link.settings_saved'));
      setSettingsDialog({ open: false, loading: false });
      fetchLinkTree();
    } catch (err) {
      showError(err.response?.data?.error || t('common.error'));
      setSettingsDialog({ ...settingsDialog, loading: false });
    }
  };

  const handleCreateItem = async () => {
    const { item, isNew } = itemDialog;
    
    const validation = validateUrl(item.url);
    if (!validation.valid) {
      setItemDialog({ ...itemDialog, error: validation.message });
      return;
    }

    const formattedUrl = formatUrl(item.url);

    try {
      if (isNew) {
        await api.post(SATU_LINK_API.CREATE_MY_LINK_TREE_ITEM, {
          title: item.title,
          url: formattedUrl,
          icon: item.icon,
        });
        showSuccess(t('satu_link.item_created'));
      } else {
        await api.put(SATU_LINK_API.UPDATE_MY_LINK_TREE_ITEM(item.id), {
          title: item.title,
          url: formattedUrl,
          icon: item.icon,
          isActive: item.isActive,
        });
        showSuccess(t('satu_link.item_updated'));
      }
      setItemDialog({ open: false, item: null, isNew: false, error: '' });
      fetchLinkTree();
    } catch (err) {
      showError(err.response?.data?.error || t('common.error'));
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(SATU_LINK_API.DELETE_MY_LINK_TREE_ITEM(itemId));
      showSuccess(t('satu_link.item_deleted'));
      fetchLinkTree();
    } catch (err) {
      showError(err.response?.data?.error || t('common.error'));
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      setItems(newItems);

      try {
        const reorderedItems = newItems.map((item, index) => ({ id: item.id, order: index }));
        await api.put(SATU_LINK_API.REORDER_MY_LINK_TREE_ITEMS, { items: reorderedItems });
        showSuccess(t('satu_link.reorder_success', 'Urutan berhasil diperbarui'));
      } catch (err) {
        showError(err.response?.data?.error || t('common.error'));
        fetchLinkTree();
      }
    }
  };

  const copyLinkToClipboard = () => {
    const username = linkTree?.title?.toLowerCase().replace(/'s\s*/g, '').replace(/\s+/g, '-') || 'user';
    const url = `${window.location.origin}/satu-link/u/${username}`;
    navigator.clipboard.writeText(url);
    showSuccess(t('satu_link.link_copied'));
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setItemDialog({ 
      ...itemDialog, 
      item: { ...itemDialog.item, url: value },
      error: '' 
    });
  };

  const handleEditItem = (item) => {
    setItemDialog({ 
      open: true, 
      item: { ...item }, 
      isNew: false,
      error: '' 
    });
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, height: 'calc(100vh - 100px)' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6" fontWeight="600">
                {t('satu_link.link_tree')}
              </Typography>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setSettingsDialog({ open: true, loading: false })}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {t('satu_link.edit')}
              </Button>
            </Box>

            <Box className="text-center mb-4 flex-shrink-0">
              <Paper
                className="inline-block p-1"
                sx={{ 
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                }}
              >
                <Avatar 
                  src={linkTree?.avatar}
                  sx={{ width: 80, height: 80, margin: '4px', fontSize: '2rem' }}
                >
                  {linkTree?.title?.charAt(0)}
                </Avatar>
              </Paper>
              <Typography variant="h6" fontWeight="600" sx={{ mt: 2 }}>
                {linkTree?.title}
              </Typography>
              {linkTree?.bio && (
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  {linkTree.bio}
                </Typography>
              )}
            </Box>

            <Box 
              className="flex items-center justify-between p-3 rounded-xl mb-2 flex-shrink-0"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box className="flex items-center gap-2">
                {linkTree?.isShared ? <PublicIcon /> : <LockIcon />}
                <Typography variant="body2">
                  {linkTree?.isShared ? t('satu_link.shared') : t('satu_link.private')}
                </Typography>
              </Box>
              <Typography variant="body2">
                {items.length} {t('satu_link.items')}
              </Typography>
            </Box>

            {linkTree?.isShared && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={copyLinkToClipboard}
                sx={{ 
                  mt: 'auto',
                  bgcolor: 'white',
                  color: '#3B82F6',
                  borderRadius: '12px',
                  fontWeight: 600,
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                {t('satu_link.copy_link')}
              </Button>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} lg={9}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box className="flex justify-between items-center mb-4 flex-shrink-0">
              <Typography variant="h6" fontWeight="600">
                {t('satu_link.link_tree_items')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setItemDialog({ 
                  open: true, 
                  item: { title: '', url: '', icon: 'link', isActive: true }, 
                  isNew: true,
                  error: ''
                })}
                sx={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                  },
                }}
              >
                {t('satu_link.add_item')}
              </Button>
            </Box>

            {items.length === 0 ? (
              <Box className="flex-1 flex flex-col items-center justify-center">
                <LinkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  {t('satu_link.no_items')}
                </Typography>
              </Box>
            ) : (
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={items.map(item => item.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <Box 
                    className="space-y-2 overflow-auto"
                    sx={{ flex: 1, pr: 1 }}
                  >
                    {items.map((item) => (
                      <SortableItem 
                        key={item.id} 
                        item={item} 
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </Box>
                </SortableContext>
              </DndContext>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={settingsDialog.open}
        onClose={() => setSettingsDialog({ ...settingsDialog, open: false })}
        PaperProps={{ 
          sx: { borderRadius: 3, minWidth: 400 } 
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight="600">
          {t('satu_link.link_tree_settings')}
        </DialogTitle>
        <DialogContent className="pt-2">
          <TextField
            fullWidth
            label={t('satu_link.title')}
            value={linkTree?.title || ''}
            onChange={(e) => setLinkTree({ ...linkTree, title: e.target.value })}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label={t('satu_link.bio')}
            value={linkTree?.bio || ''}
            onChange={(e) => setLinkTree({ ...linkTree, bio: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Switch
                checked={linkTree?.isShared || false}
                onChange={(e) => setLinkTree({ ...linkTree, isShared: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#3B82F6',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#3B82F6',
                  },
                }}
              />
            }
            label={t('satu_link.share_link_tree')}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setSettingsDialog({ ...settingsDialog, open: false })} 
            sx={{ borderRadius: 2 }}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            variant="contained" 
            disabled={settingsDialog.loading}
            startIcon={settingsDialog.loading ? null : <SaveIcon />}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
              },
            }}
          >
            {settingsDialog.loading ? <CircularProgress size={20} color="inherit" /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={itemDialog.open}
        onClose={() => setItemDialog({ open: false, item: null, isNew: false, error: '' })}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 400 } }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight="600">
          {itemDialog.isNew ? t('satu_link.add_item') : t('satu_link.edit_item')}
        </DialogTitle>
        <DialogContent className="pt-2">
          <TextField
            fullWidth
            label={t('satu_link.item_title')}
            value={itemDialog.item?.title || ''}
            onChange={(e) => setItemDialog({ 
              ...itemDialog, 
              item: { ...itemDialog.item, title: e.target.value } 
            })}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label={t('satu_link.item_url')}
            value={itemDialog.item?.url || ''}
            onChange={handleUrlChange}
            margin="normal"
            required
            variant="outlined"
            error={!!itemDialog.error}
            helperText={itemDialog.error || t('satu_link.url_helper', 'Contoh: https://instagram.com/username')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            select
            label={t('satu_link.item_icon')}
            value={itemDialog.item?.icon || 'link'}
            onChange={(e) => setItemDialog({ 
              ...itemDialog, 
              item: { ...itemDialog.item, icon: e.target.value } 
            })}
            margin="normal"
            variant="outlined"
          >
            {iconOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          {!itemDialog.isNew && (
            <FormControlLabel
              control={
                <Switch
                  checked={itemDialog.item?.isActive ?? true}
                  onChange={(e) => setItemDialog({ 
                    ...itemDialog, 
                    item: { ...itemDialog.item, isActive: e.target.checked } 
                  })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#3B82F6',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#3B82F6',
                    },
                  }}
                />
              }
              label={t('satu_link.is_active')}
              sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setItemDialog({ open: false, item: null, isNew: false, error: '' })}
            sx={{ borderRadius: 2 }}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleCreateItem} 
            variant="contained" 
            disabled={!itemDialog.item?.title || !itemDialog.item?.url}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
              },
            }}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LinkTreePage;
