import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';

// Constants for label dimensions (7cm wide x 3.5cm tall)
const LABEL_WIDTH_CM = 7;
const LABEL_HEIGHT_CM = 3.5;
const LABELS_PER_ROW = 2;
const LABELS_PER_PAGE = 16;
const PAGE_MARGIN_CM = 1;

import GradientDialog from '~/components/GradientDialog';

const BarcodeLabelPrint = ({ open, onClose, assets = [], selectedAssetIds = [] }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(selectedAssetIds);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open && selectedAssetIds) {
      setSelected(selectedAssetIds);
    }
  }, [open, JSON.stringify(selectedAssetIds)]);

  const handleToggle = (assetId) => {
    const currentIndex = selected.indexOf(assetId);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(assetId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  const handleSelectAll = () => {
    if (selected.length === assets.length) {
      setSelected([]);
    } else {
      setSelected(assets.map((a) => a.id));
    }
  };

  const handlePrint = async () => {
    const selectedAssets = assets.filter((a) => selected.includes(a.id));
    
    // Generate label list (duplicated by quantity)
    const allLabels = [];
    for (let q = 0; q < quantity; q++) {
      selectedAssets.forEach((asset) => {
        allLabels.push(asset);
      });
    }

    try {
      setLoading(true);
      
      // Use native fetch for binary data to avoid Axios JSON parsing issues
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/inventory/labels/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            assets: allLabels,
            config: { type: 'bulk' }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `labels-bulk-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onClose();
    } catch (err) {
      console.error('Error generating labels:', err);
      // You might want to show an error message here (e.g., via toast or alert)
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <GradientDialog
      open={open}
      onClose={onClose}
      title={t('inventory.print_label')}
      icon={<PrintIcon />}
      maxWidth="sm"
      loading={loading}
      actions={
        <>
           <Button onClick={onClose} color="inherit" disabled={loading}>
             {t('common.cancel')}
           </Button>
           <Button
             variant="contained"
             onClick={handlePrint}
             disabled={selected.length === 0 || loading}
             startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
             sx={{
               background: 'linear-gradient(to right, #3b82f6, #2563eb)',
               boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)',
               '&:hover': {
                 background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
               }
             }}
           >
             {loading ? t('common.processing') : `${t('common.download')} PDF (${selected.length * quantity})`}
           </Button>
        </>
      }
    >
        <Box sx={{ mb: 3 }}>
          <TextField
            label={t('inventory.print_quantity')}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            size="small"
            fullWidth
            inputProps={{ min: 1, max: 100 }}
            helperText="Number of copies per asset"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {t('inventory.asset')} <Typography component="span" color="text.secondary" variant="body2">({selected.length} {t('common.selected')})</Typography>
          </Typography>
          
          <Button size="small" onClick={handleSelectAll} sx={{ textTransform: 'none' }}>
            {selected.length === assets.length ? t('common.deselect_all') : t('common.select_all')}
          </Button>
        </Box>

        <List 
          sx={{ 
            maxHeight: 300, 
            overflow: 'auto', 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          {assets.map((asset) => (
            <ListItem key={asset.id} disablePadding divider>
              <ListItemButton onClick={() => handleToggle(asset.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(asset.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={asset.name}
                  secondary={asset.assetCode}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontFamily: 'monospace' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {assets.length === 0 && (
            <ListItem>
              <ListItemText primary={t('common.no_data')} sx={{ textAlign: 'center', color: 'text.secondary' }} />
            </ListItem>
          )}
        </List>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
           <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <DownloadIcon fontSize="small" />
             {t('inventory.label_size', 'Label size')}: {LABEL_WIDTH_CM}cm × {LABEL_HEIGHT_CM}cm | A4 Layout
           </Typography>
        </Box>
    </GradientDialog>
  );
};

export default BarcodeLabelPrint;
