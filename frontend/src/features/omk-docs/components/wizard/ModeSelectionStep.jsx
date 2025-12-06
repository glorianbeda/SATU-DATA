import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import DrawIcon from '@mui/icons-material/Draw';
import SendIcon from '@mui/icons-material/Send';

const ModeSelectionStep = ({ onModeSelect }) => {
  const modes = [
    {
      id: 'self',
      icon: <DrawIcon sx={{ fontSize: 48 }} />,
      title: 'Tanda Tangan Sendiri',
      description: 'Saya akan menandatangani dokumen ini sendiri',
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      hoverBg: 'rgba(34, 197, 94, 0.2)'
    },
    {
      id: 'request',
      icon: <SendIcon sx={{ fontSize: 48 }} />,
      title: 'Minta Tanda Tangan',
      description: 'Minta orang lain untuk menandatangani dokumen ini',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      hoverBg: 'rgba(59, 130, 246, 0.2)'
    }
  ];

  return (
    <Box className="flex flex-col items-center justify-center h-full py-8">
      <Box className="text-center mb-10">
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
          Pilih Jenis Tanda Tangan
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Apa yang ingin Anda lakukan dengan dokumen ini?
        </Typography>
      </Box>

      <Box className="flex gap-6 flex-wrap justify-center">
        {modes.map((mode) => (
          <Paper
            key={mode.id}
            elevation={0}
            onClick={() => onModeSelect(mode.id)}
            sx={{
              width: 280,
              p: 4,
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'transparent',
              backgroundColor: mode.bgColor,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: mode.hoverBg,
                borderColor: mode.color,
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 24px ${mode.color}30`
              }
            }}
          >
            <Box className="flex flex-col items-center text-center gap-4">
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: mode.color,
                  color: 'white'
                }}
              >
                {mode.icon}
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {mode.title}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {mode.description}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ModeSelectionStep;
