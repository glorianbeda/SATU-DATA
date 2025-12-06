import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, CircularProgress, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const SignerListPanel = ({ users = [], selectedSigner, onSignerSelect }) => {

  return (
    <Box className="h-full flex flex-col">
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 2, px: 1 }}>
        PENANDA TANGAN
      </Typography>
      
      <Typography variant="caption" sx={{ color: 'text.disabled', mb: 2, px: 1 }}>
        Klik nama → lalu taruh tanda tangan
      </Typography>
      
      <Box className="flex-1 overflow-auto space-y-2">
        {users.map(user => (
          <Paper
            key={user.id}
            elevation={0}
            onClick={() => onSignerSelect(user)}
            sx={{
              p: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: selectedSigner?.id === user.id ? '#3b82f6' : 'transparent',
              backgroundColor: selectedSigner?.id === user.id ? 'rgba(59, 130, 246, 0.1)' : 'grey.50',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: selectedSigner?.id === user.id 
                  ? 'rgba(59, 130, 246, 0.15)' 
                  : 'grey.100'
              }
            }}
          >
            <Box className="flex items-center gap-2">
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  fontSize: '0.875rem',
                  bgcolor: selectedSigner?.id === user.id ? '#3b82f6' : 'grey.400'
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
              <Box className="flex-1 min-w-0">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: selectedSigner?.id === user.id ? 600 : 400,
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user.name}
                </Typography>
              </Box>
              {selectedSigner?.id === user.id && (
                <CheckCircleIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default SignerListPanel;
