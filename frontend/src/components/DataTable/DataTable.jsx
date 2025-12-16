import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Toolbar,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useTheme } from '~/context/ThemeContext';
import TableSkeleton from './TableSkeleton';

/**
 * Reusable DataTable Component
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{field, headerName, width, renderCell, sortable, exportable}]
 * @param {Array} props.data - Array of row data objects
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.exportable - Enable export buttons
 * @param {boolean} props.searchable - Enable search bar
 * @param {boolean} props.pagination - Enable pagination
 * @param {string} props.title - Table title
 * @param {string} props.emptyMessage - Message when no data
 * @param {number} props.defaultRowsPerPage - Default rows per page (default: 10)
 * @param {Array} props.rowsPerPageOptions - Rows per page options (default: [5, 10, 25, 50])
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  exportable = true,
  searchable = true,
  pagination = true,
  title = '',
  emptyMessage = 'No data available',
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  actions,
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? '';
      const bVal = b[orderBy] ?? '';
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage, pagination]);

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper to get cell value for export
  const getCellValue = (row, col) => {
    if (col.valueGetter) {
      return col.valueGetter(row);
    }
    return row[col.field];
  };

  // Export to CSV
  const exportToCSV = () => {
    const exportColumns = columns.filter((col) => col.exportable !== false);
    const headers = exportColumns.map((col) => col.headerName).join(',');
    const rows = sortedData.map((row) =>
      exportColumns.map((col) => {
        const value = getCellValue(row, col);
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value ?? '').replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'data'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setExportAnchorEl(null);
  };

  // Export to PDF
  const exportToPDF = () => {
    const exportColumns = columns.filter((col) => col.exportable !== false);
    const doc = new jsPDF();

    // Add title
    if (title) {
      doc.setFontSize(16);
      doc.text(title, 14, 15);
    }

    // Add table
    doc.autoTable({
      startY: title ? 25 : 15,
      head: [exportColumns.map((col) => col.headerName)],
      body: sortedData.map((row) =>
        exportColumns.map((col) => String(getCellValue(row, col) ?? ''))
      ),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`${title || 'data'}_${new Date().toISOString().split('T')[0]}.pdf`);
    setExportAnchorEl(null);
  };

  return (
    <Paper elevation={0} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <Toolbar className="flex flex-col md:flex-row justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <Box className="flex items-center gap-3 w-full md:w-auto">
          {title && (
            <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white text-base md:text-lg">
              {title}
            </Typography>
          )}
        </Box>

        <Box className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {actions}
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              className="w-full md:w-64"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDark ? 'rgb(31, 41, 55)' : 'white',
                  borderRadius: '8px',
                  color: isDark ? 'white' : 'inherit',
                  '& fieldset': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  opacity: 1,
                },
              }}
            />
          )}

          {exportable && (
            <>
              <Tooltip title="Export">
                <IconButton
                  onClick={(e) => setExportAnchorEl(e.currentTarget)}
                  sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
                >
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={() => setExportAnchorEl(null)}
              >
                <MenuItem onClick={exportToCSV}>
                  <FileDownloadIcon fontSize="small" className="mr-2" />
                  Export as CSV
                </MenuItem>
                <MenuItem onClick={exportToPDF}>
                  <PictureAsPdfIcon fontSize="small" className="mr-2" />
                  Export as PDF
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Card View */}
      <Box className="block md:hidden">
        {loading ? (
          <Box className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
                <Box className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></Box>
                <Box className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></Box>
              </Box>
            ))}
          </Box>
        ) : paginatedData.length === 0 ? (
          <Box className="p-8 text-center text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </Box>
        ) : (
          <Box className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => (
              <Box
                key={row.id || rowIndex}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {columns.map((col) => (
                  <Box key={col.field} className="flex justify-between items-start py-1">
                    <Typography
                      variant="caption"
                      className="text-gray-500 dark:text-gray-400 font-medium uppercase text-xs"
                    >
                      {col.headerName}
                    </Typography>
                    <Box className="text-right text-gray-900 dark:text-white text-sm">
                      {col.renderCell ? col.renderCell(row) : row[col.field]}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Desktop Table View */}
      <TableContainer sx={{ overflowX: 'auto' }} className="hidden md:block">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: isDark ? 'rgb(31, 41, 55)' : 'rgb(249, 250, 251)' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  style={{ width: col.width }}
                  sx={{
                    fontWeight: 600,
                    color: isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
                    borderBottom: isDark ? '1px solid rgb(55, 65, 81)' : '1px solid rgba(224, 224, 224, 1)',
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : 'asc'}
                      onClick={() => handleSort(col.field)}
                      sx={{
                        color: isDark ? 'rgb(209, 213, 219)' : 'inherit',
                        '&.Mui-active': {
                          color: isDark ? 'rgb(255, 255, 255)' : 'inherit',
                        },
                        '& .MuiTableSortLabel-icon': {
                          color: isDark ? 'rgba(255, 255, 255, 0.7) !important' : 'inherit',
                        },
                      }}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={columns} rows={rowsPerPage} />
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    py: 6,
                    color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
                    backgroundColor: isDark ? 'rgb(31, 41, 55)' : 'transparent',
                  }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  hover
                  className="transition-colors"
                  sx={{
                    backgroundColor: isDark
                      ? (rowIndex % 2 === 0 ? 'rgb(31, 41, 55)' : 'rgb(17, 24, 39)')
                      : (rowIndex % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)'),
                    '&:hover': {
                      backgroundColor: isDark ? 'rgb(55, 65, 81) !important' : 'rgba(0, 0, 0, 0.04) !important',
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{
                        color: isDark ? 'rgb(229, 231, 235)' : 'inherit',
                        borderBottom: isDark ? '1px solid rgb(55, 65, 81)' : '1px solid rgba(224, 224, 224, 1)',
                      }}
                    >
                      {col.renderCell ? col.renderCell(row) : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && !loading && paginatedData.length > 0 && (
        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={{
            borderTop: isDark ? '1px solid rgb(55, 65, 81)' : '1px solid rgba(224, 224, 224, 1)',
            backgroundColor: isDark ? 'rgb(31, 41, 55)' : 'transparent',
            color: isDark ? 'rgb(209, 213, 219)' : 'inherit',
            '& .MuiTablePagination-selectIcon': {
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
            },
            '& .MuiIconButton-root': {
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
            },
            '& .MuiIconButton-root.Mui-disabled': {
              color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
            },
          }}
        />
      )}
    </Paper>
  );
};

export default DataTable;
