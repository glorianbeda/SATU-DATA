import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import {
  CloudUpload,
  Close as CloseIcon,
  FilePresent as FileIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';

const ImportTransactionModal = ({ open, onClose, onSave, type }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const isIncome = type === 'INCOME';
  const themeColor = isIncome ? 'green' : 'red';

  const requiredColumns = ['Date', 'Amount', 'Category', 'Description'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (uploadedFile) => {
    setFile(uploadedFile);
    setProcessing(true);
    setErrors([]);
    setData([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length === 0) {
          setErrors(['File is empty']);
          setProcessing(false);
          return;
        }

        const headers = jsonData[0];
        // Create case-insensitive header mapping
        const headerMap = {};
        headers.forEach((h, index) => {
          if (h) {
            headerMap[h.toString().toLowerCase()] = index;
          }
        });

        // Check for missing columns (case-insensitive)
        const missingColumns = requiredColumns.filter(col => 
          !Object.keys(headerMap).includes(col.toLowerCase())
        );

        if (missingColumns.length > 0) {
          setErrors([`Missing columns: ${missingColumns.join(', ')}`]);
          setProcessing(false);
          return;
        }

        // Parse data using case-insensitive header matching
        const parsedData = jsonData.slice(1).map((row, index) => {
          return {
            Date: row[headerMap['date']],
            Amount: row[headerMap['amount']],
            Category: row[headerMap['category']],
            Description: row[headerMap['description']]
          };
        }).filter(row => row.Date && row.Amount); // Basic filter for empty rows

        setData(parsedData);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        setErrors(['Failed to parse file']);
      } finally {
        setProcessing(false);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { borderRadius: 16, overflow: 'hidden' },
        component: motion.div,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
      }}
    >
      {/* Header */}
      <Box className={`bg-gradient-to-r ${isIncome ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-red-600'} p-6 text-white flex justify-between items-center`}>
        <Box className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <CloudUpload className="text-white" />
          </div>
          <Typography variant="h6" className="font-bold">
            {t('finance.import_transactions', 'Import Transactions')}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" className="text-white hover:bg-white/20">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent className="p-6 bg-gray-50 dark:bg-gray-900">
        <Box className="space-y-6">
          {/* Upload Area */}
          <Box
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? `border-${themeColor}-500 bg-${themeColor}-50 dark:bg-${themeColor}-900/20`
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('import-upload').click()}
          >
            <input
              id="import-upload"
              type="file"
              hidden
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
            />
            {file ? (
              <Box className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-full bg-${themeColor}-100 dark:bg-${themeColor}-900/30 text-${themeColor}-600`}>
                  <FileIcon />
                </div>
                <Typography variant="body2" className="font-medium text-gray-700 dark:text-gray-200">
                  {file.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {(file.size / 1024).toFixed(0)} KB
                </Typography>
              </Box>
            ) : (
              <Box className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400">
                  <CloudUpload />
                </div>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Drag & drop Excel file or click to upload
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Required columns: Date, Amount, Category, Description
                </Typography>
              </Box>
            )}
          </Box>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </Alert>
          )}

          {/* Preview Table */}
          {data.length > 0 && (
            <Box>
              <Typography variant="subtitle2" className="mb-2 text-gray-600 dark:text-gray-400">
                Preview ({data.length} records)
              </Typography>
              <TableContainer component={Paper} className="max-h-60 overflow-auto shadow-none border border-gray-200 dark:border-gray-700">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {requiredColumns.map(col => (
                        <TableCell key={col} className="bg-gray-50 dark:bg-gray-800 font-semibold">{col}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(0, 5).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.Date}</TableCell>
                        <TableCell>{row.Amount}</TableCell>
                        <TableCell>{row.Category}</TableCell>
                        <TableCell>{row.Description}</TableCell>
                      </TableRow>
                    ))}
                    {data.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" className="text-gray-500">
                          ... and {data.length - 5} more
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <Button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={data.length === 0 || errors.length > 0}
          className={`px-6 py-2 rounded-lg shadow-lg shadow-${themeColor}-500/30 bg-gradient-to-r ${isIncome ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-red-600'} hover:shadow-xl transition-all`}
          startIcon={<CheckIcon />}
        >
          {t('common.import', 'Import')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportTransactionModal;
