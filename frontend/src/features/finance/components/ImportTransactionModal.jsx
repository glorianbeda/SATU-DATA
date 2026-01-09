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
        const headerMap = {};
        headers.forEach((h, index) => {
          if (h) headerMap[h.toString().toLowerCase()] = index;
        });

        const missingColumns = requiredColumns.filter(col => 
          !Object.keys(headerMap).includes(col.toLowerCase())
        );

        if (missingColumns.length > 0) {
          setErrors([`Missing columns: ${missingColumns.join(', ')}`]);
          setProcessing(false);
          return;
        }

        const parsedData = jsonData.slice(1).map((row, index) => {
          const rawDate = row[headerMap['date']];
          const rawAmount = row[headerMap['amount']];
          const rawCategory = row[headerMap['category']];
          const rawDesc = row[headerMap['description']];

          const rowErrors = {};
          let isValid = true;

          // Date Validation
          let dateVal = rawDate;
          if (!rawDate) {
             rowErrors.Date = 'Date is required';
             isValid = false;
          } else {
             // Handle Excel serial date
             if (typeof rawDate === 'number') {
                const dateObj = XLSX.SSF.parse_date_code(rawDate);
                // Format YYYY-MM-DD
                const y = dateObj.y;
                const m = dateObj.m < 10 ? `0${dateObj.m}` : dateObj.m;
                const d = dateObj.d < 10 ? `0${dateObj.d}` : dateObj.d;
                dateVal = `${y}-${m}-${d}`;
             }
             // Simple string check
             else if (typeof rawDate === 'string') {
                 // Try to parse?
                 if (isNaN(Date.parse(rawDate))) {
                     rowErrors.Date = 'Invalid date format';
                     isValid = false;
                 } else {
                     dateVal = new Date(rawDate).toISOString().split('T')[0];
                 }
             }
          }

          // Amount Validation
          let amountVal = rawAmount;
          if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
             rowErrors.Amount = 'Amount is required';
             isValid = false;
          } else {
             const num = parseFloat(rawAmount.toString().replace(/[^0-9.-]/g, ''));
             if (isNaN(num)) {
                 rowErrors.Amount = 'Invalid amount';
                 isValid = false;
             } else {
                 amountVal = num;
             }
          }

          // Category Validation
          if (!rawCategory || !rawCategory.toString().trim()) {
              rowErrors.Category = 'Category is required';
              isValid = false;
          }

          // Description Validation
          if (!rawDesc || !rawDesc.toString().trim()) {
              rowErrors.Description = 'Description is required';
              isValid = false;
          }

          return {
            Date: dateVal,
            Amount: amountVal,
            Category: rawCategory,
            Description: rawDesc,
            _isValid: isValid,
            _errors: rowErrors,
            _row: index + 2
          };
        }).filter(row => row.Date || row.Amount || row.Category || row.Description); // Filter completely empty rows

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
    const validRows = data.filter(r => r._isValid);
    if (validRows.length > 0) {
        onSave(validRows);
        onClose();
    }
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

          {/* Errors from Parsing */}
          {errors.length > 0 && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </Alert>
          )}
          
          {/* Validation Warning */}
          {data.length > 0 && data.some(r => !r._isValid) && (
             <Alert severity="warning">
                {data.filter(r => !r._isValid).length} invalid rows will be skipped.
             </Alert>
          )}

          {/* Preview Table */}
          {data.length > 0 && (
            <Box>
              <Box className="flex justify-between items-center mb-2">
                  <Typography variant="subtitle2" className="text-gray-600 dark:text-gray-400">
                    Preview ({data.length} records)
                  </Typography>
                  <Box className="flex gap-3 text-xs">
                     <span className="text-green-600 font-medium">
                        {data.filter(r => r._isValid).length} Valid
                     </span>
                     <span className="text-red-500 font-medium">
                        {data.filter(r => !r._isValid).length} Invalid
                     </span>
                  </Box>
              </Box>
              
              <TableContainer component={Paper} className="max-h-60 overflow-auto shadow-none border border-gray-200 dark:border-gray-700">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className="bg-gray-50 dark:bg-gray-800 font-semibold w-12 text-center">#</TableCell>
                      {requiredColumns.map(col => (
                        <TableCell key={col} className="bg-gray-50 dark:bg-gray-800 font-semibold">{col}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(0, 100).map((row, i) => (
                      <TableRow key={i} className={!row._isValid ? "bg-red-50 dark:bg-red-900/20" : ""}>
                         <TableCell className="text-center text-xs text-gray-400">{row._row}</TableCell>
                        <TableCell className="relative group">
                            {row.Date}
                            {row._errors?.Date && (
                                <div className="absolute hidden group-hover:block bottom-full left-0 bg-red-600 text-white text-xs p-1 rounded z-10 whitespace-nowrap mb-1">
                                    {row._errors.Date}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="relative group">
                            {row.Amount}
                            {row._errors?.Amount && (
                                <div className="absolute hidden group-hover:block bottom-full left-0 bg-red-600 text-white text-xs p-1 rounded z-10 whitespace-nowrap mb-1">
                                    {row._errors.Amount}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="relative group">
                            {row.Category}
                            {row._errors?.Category && (
                                <div className="absolute hidden group-hover:block bottom-full left-0 bg-red-600 text-white text-xs p-1 rounded z-10 whitespace-nowrap mb-1">
                                    {row._errors.Category}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="relative group">
                            {row.Description}
                            {row._errors?.Description && (
                                <div className="absolute hidden group-hover:block bottom-full left-0 bg-red-600 text-white text-xs p-1 rounded z-10 whitespace-nowrap mb-1">
                                    {row._errors.Description}
                                </div>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {data.length > 100 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" className="text-gray-500">
                          ... and {data.length - 100} more
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
          disabled={data.filter(r => r._isValid).length === 0}
          className={`px-6 py-2 rounded-lg shadow-lg shadow-${themeColor}-500/30 bg-gradient-to-r ${isIncome ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-red-600'} hover:shadow-xl transition-all`}
          startIcon={<CheckIcon />}
        >
          {t('common.import', 'Import')} ({data.filter(r => r._isValid).length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportTransactionModal;
