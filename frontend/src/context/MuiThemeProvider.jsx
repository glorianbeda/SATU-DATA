import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from './ThemeContext';

/**
 * Global MUI Theme Provider that syncs with ThemeContext
 * This makes all MUI components automatically adapt to dark/light mode
 */
const MuiThemeProviderWrapper = ({ children }) => {
  const { mode } = useTheme();

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: '#3b82f6', // Blue-500
          light: '#60a5fa', // Blue-400
          dark: '#2563eb', // Blue-600
        },
        secondary: {
          main: '#8b5cf6', // Violet-500
        },
        background: {
          default: mode === 'dark' ? '#111827' : '#f9fafb', // gray-900 / gray-50
          paper: mode === 'dark' ? '#1f2937' : '#ffffff', // gray-800 / white
        },
        text: {
          primary: mode === 'dark' ? '#f9fafb' : '#111827', // gray-50 / gray-900
          secondary: mode === 'dark' ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
        },
        divider: mode === 'dark' ? '#374151' : '#e5e7eb', // gray-700 / gray-200
        action: {
          hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          selected: mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
        },
      },
      typography: {
        fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2rem',
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#1f2937' : '#ffffff',
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#f9fafb' : '#111827',
            },
          },
        },
        MuiDialogContent: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#e5e7eb' : '#374151',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                backgroundColor: mode === 'dark' ? '#374151' : '#ffffff',
                color: mode === 'dark' ? '#f9fafb' : '#111827',
                '& fieldset': {
                  borderColor: mode === 'dark' ? '#4b5563' : '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? '#6b7280' : '#9ca3af',
                },
              },
              '& .MuiInputLabel-root': {
                color: mode === 'dark' ? '#9ca3af' : '#6b7280',
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#374151' : '#ffffff',
              color: mode === 'dark' ? '#f9fafb' : '#111827',
            },
            icon: {
              color: mode === 'dark' ? '#9ca3af' : '#6b7280',
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#1f2937' : '#ffffff',
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#f9fafb' : '#111827',
              '&:hover': {
                backgroundColor: mode === 'dark' ? '#374151' : '#f3f4f6',
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#d1d5db' : '#374151',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#f9fafb' : '#111827',
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderBottom: mode === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
              color: mode === 'dark' ? '#e5e7eb' : '#111827',
            },
            head: {
              backgroundColor: mode === 'dark' ? '#1f2937' : '#f9fafb',
              color: mode === 'dark' ? '#d1d5db' : '#374151',
              fontWeight: 600,
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: mode === 'dark' ? '#374151' : '#f9fafb',
              },
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#d1d5db' : '#374151',
              backgroundColor: mode === 'dark' ? '#1f2937' : '#ffffff',
            },
            selectIcon: {
              color: mode === 'dark' ? '#9ca3af' : '#6b7280',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#9ca3af' : '#6b7280',
              '&.Mui-selected': {
                color: mode === 'dark' ? '#60a5fa' : '#3b82f6',
              },
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: {
              backgroundColor: mode === 'dark' ? '#60a5fa' : '#3b82f6',
            },
          },
        },
        MuiFormControl: {
          styleOverrides: {
            root: {
              '& .MuiInputLabel-root': {
                color: mode === 'dark' ? '#9ca3af' : '#6b7280',
              },
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#f9fafb' : '#111827',
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      {children}
    </MuiThemeProvider>
  );
};

export default MuiThemeProviderWrapper;
