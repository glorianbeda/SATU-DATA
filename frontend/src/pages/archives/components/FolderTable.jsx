import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';

const FolderTable = ({ tabs = [], activeTab, onTabChange, children }) => {
  const tabsRef = useRef(null);

  useEffect(() => {
    if (tabsRef.current) {
      const activeElement = tabsRef.current.querySelector(`[data-tab-value="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <Box sx={{ position: 'relative', width: '100%', mt: 6 }}>
      {/* Tabs Row */}
      <Box
        ref={tabsRef}
        sx={{
          position: 'absolute',
          top: -45,
          left: 0,
          right: 0,
          display: 'flex',
          gap: 0.5,
          zIndex: 0,
          px: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for cleaner look
          msOverflowStyle: 'none',  // IE and Edge
          scrollbarWidth: 'none',  // Firefox
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <Box
              key={tab.value}
              data-tab-value={tab.value}
              onClick={() => onTabChange(tab.value)}
              sx={{
                minWidth: '100px',
                height: '50px',
                bgcolor: isActive ? '#1976d2' : alpha('#1976d2', 0.1), // Active vs Inactive (Blue)
                color: isActive ? 'white' : '#1976d2',
                borderRadius: '16px 16px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isActive ? 'translateY(0)' : 'translateY(4px)', // "Push down" inactive tabs slightly
                '&:hover': {
                  bgcolor: isActive ? '#1976d2' : alpha('#1976d2', 0.2),
                  transform: 'translateY(0)',
                },
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Main Glass Panel */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          borderTopLeftRadius: 0, // Should dynamically adjust if we want perfect tab connection, but constant is okay for now
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
         {/* White Paper Effect inside */}
         <Box sx={{ p: 2 }}>
            {/* Toolbar (Search, etc) */}
             {/* Toolbar removed from props and handled by children composition effectively, 
                 but if we want explicit positioning, we can add a toolbar area here if passed */}
            
            {children}
         </Box>
      </Box>
    </Box>
  );
};

export default FolderTable;

