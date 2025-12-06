import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const ConfirmationDialog = ({ open, title, description, confirmText, cancelText, variant, onConfirm, onCancel }) => {
  const isDanger = variant === 'danger';
  const isInfo = variant === 'info';

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: { borderRadius: 3, minWidth: 320, maxWidth: 480 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {isDanger && <WarningIcon color="error" />}
        {isInfo && <InfoIcon color="info" />}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onCancel} color="inherit" sx={{ borderRadius: 2 }}>
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={isDanger ? 'error' : (isInfo ? 'info' : 'primary')}
          autoFocus
          sx={{ borderRadius: 2, px: 3 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
