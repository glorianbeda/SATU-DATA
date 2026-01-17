import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const GradientDialog = ({
  open,
  onClose,
  title,
  icon,
  theme = 'blue',
  children,
  actions,
  loading = false,
  maxWidth = 'md'
}) => {
  const getGradient = (themeColor) => {
    switch (themeColor) {
      case 'green':
        return 'from-emerald-500 to-teal-600';
      case 'red':
        return 'from-rose-500 to-red-600';
      case 'blue':
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  const gradientClass = getGradient(theme);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        style: { borderRadius: 16, overflow: 'hidden' },
        component: motion.div,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
      }}
    >
      {/* Custom Header */}
      <Box className={`bg-gradient-to-r ${gradientClass} p-6 text-white flex justify-between items-center`}>
        <Box className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              {React.cloneElement(icon, { className: "text-white" })}
            </div>
          )}
          <Typography variant="h6" className="font-bold">
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          className="text-white hover:bg-white/20"
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent className="p-6 bg-gray-50 dark:bg-gray-900">
        {children}
      </DialogContent>

      {actions && (
        <DialogActions className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default GradientDialog;
