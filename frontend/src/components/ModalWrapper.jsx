import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton, 
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

/**
 * Global ModalWrapper - A declarative modal wrapper with built-in controls
 * 
 * @param {boolean} open - Control modal visibility
 * @param {function} onClose - Callback when modal is closed
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {boolean} showActions - Show action buttons (default: true)
 * @param {boolean} showSubmit - Show submit button (default: true)
 * @param {boolean} showClose - Show close button in header (default: true)
 * @param {string} submitText - Custom submit button text
 * @param {string} cancelText - Custom cancel button text
 * @param {function} onSubmit - Submit button callback
 * @param {boolean} disabledSubmit - Disable submit button
 * @param {boolean} loadingSubmit - Show loading on submit button
 * @param {string} maxWidth - Max width of modal (default: 'md')
 * @param {boolean} fullScreen - Force fullscreen on mobile (default: true)
 * @param {boolean} allowFullscreen - Allow fullscreen toggle (default: true)
 */
const ModalWrapper = ({
  open,
  onClose,
  title,
  children,
  showActions = true,
  showSubmit = true,
  showClose = true,
  submitText,
  cancelText,
  onSubmit,
  disabledSubmit = false,
  loadingSubmit = false,
  maxWidth = 'md',
  fullScreen: fullScreenProp,
  allowFullscreen = true,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Auto fullscreen on mobile unless disabled
  const fullScreen = fullScreenProp !== undefined ? fullScreenProp : isMobile;

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen || isFullscreen}
      PaperProps={{
        sx: isFullscreen ? {
          maxWidth: '100%',
          height: '100%',
          borderRadius: 0,
        } : undefined,
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 1.5,
        px: 2,
      }}>
        <Box sx={{ fontWeight: 600 }}>
          {title}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {allowFullscreen && (
            <IconButton 
              size="small" 
              onClick={handleToggleFullscreen}
              title={isFullscreen ? t('common.exit_fullscreen', 'Exit Fullscreen') : t('common.fullscreen', 'Fullscreen')}
            >
              {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          )}
          {showClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers sx={{ p: 2 }}>
        {children}
      </DialogContent>

      {/* Actions */}
      {showActions && (
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={onClose} variant="outlined">
            {cancelText || t('common.cancel')}
          </Button>
          {showSubmit && (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={disabledSubmit}
              startIcon={!loadingSubmit && <CheckIcon />}
            >
              {loadingSubmit ? t('common.processing') : (submitText || t('common.save'))}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalWrapper;
