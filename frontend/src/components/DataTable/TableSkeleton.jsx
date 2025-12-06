import React from 'react';
import { TableRow, TableCell, Skeleton, Box } from '@mui/material';
import { useTheme } from '~/context/ThemeContext';

const TableSkeleton = ({ columns, rows = 5 }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <>
      {Array.from(new Array(rows)).map((_, index) => (
        <TableRow key={index}>
          {columns.map((col, colIndex) => (
            <TableCell 
              key={colIndex}
              sx={{
                borderBottom: isDark ? '1px solid rgb(55, 65, 81)' : '1px solid rgba(224, 224, 224, 1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {col.field === 'actions' ? (
                  <Box display="flex" gap={1}>
                    <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: isDark ? 'grey.800' : 'grey.200' }} />
                    <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: isDark ? 'grey.800' : 'grey.200' }} />
                  </Box>
                ) : (
                  <Skeleton 
                    variant="text" 
                    width={colIndex === 0 ? '40%' : '80%'} 
                    height={24} 
                    sx={{ bgcolor: isDark ? 'grey.800' : 'grey.200' }}
                  />
                )}
              </Box>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
