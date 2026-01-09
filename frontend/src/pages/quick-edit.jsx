import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon, AttachFile as AttachFileIcon, Assessment as AssessmentIcon } from '@mui/icons-material';
import { useAlert } from '../context/AlertContext';

const QuickEdit = () => {
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useAlert();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionType = searchParams.get('type'); // 'INCOME' or 'EXPENSE'
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [transactionType]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (transactionType) {
        params.type = transactionType;
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, {
        params,
        withCredentials: true
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const newTransactions = [...transactions];
    newTransactions[index] = { ...newTransactions[index], [field]: value, isModified: true };
    setTransactions(newTransactions);
  };

  const handleFileChange = (index, file) => {
    if (!file) return;

    // Validate Check File Size 5MB
    if (file.size > 5 * 1024 * 1024) {
        showWarning(t('quick_edit.file_too_large', 'Ukuran file maksimal 5MB'));
        // Reset input value manually if needed, but since we rely on onChange, returning here prevents state update
        return;
    }

    const newTransactions = [...transactions];
    newTransactions[index] = { ...newTransactions[index], proofFile: file, isModified: true };
    setTransactions(newTransactions);
  };

  const handleAddRow = () => {
    setTransactions([
      ...transactions,
      {
        id: null,
        date: new Date().toISOString().split('T')[0],
        type: transactionType || 'INCOME',
        description: '',
        category: '',
        amount: '',
        isModified: true,
        isNew: true
      }
    ]);
  };

  const handleDeleteRow = async (index) => {
    const transaction = transactions[index];

    // If it's an existing transaction, delete from API
    if (transaction.id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/finance/transactions/${transaction.id}`, {
          withCredentials: true
        });
        showSuccess(t('quick_edit.row_deleted'));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        showError(t('quick_edit.delete_failed'));
        return; // Don't remove from UI if API delete failed
      }
    }

    const newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
  };

  const handleSave = async () => {
    // Check for empty rows before saving
    const modifiedTransactions = transactions.filter(t => t.isModified);
    const incompleteRows = modifiedTransactions.filter(t => 
        !t.date || !t.description || !t.category || !t.amount || (!t.proofFile && !t.proofImage)
    );

    if (incompleteRows.length > 0) {
      setShowValidation(true);
      showWarning(t('quick_edit.incomplete_rows_warning', 'Mohon lengkapi semua baris yang diedit termasuk bukti upload.'));
      return;
    }

    setSaving(true);
    setShowValidation(false);
    try {
      await Promise.all(modifiedTransactions.map(async (transaction) => {
        const formData = new FormData();
        formData.append('type', transaction.type);
        formData.append('amount', parseFloat(transaction.amount) || 0);
        formData.append('description', transaction.description);
        formData.append('category', transaction.category);
        formData.append('date', transaction.date);

        if (transaction.proofFile) {
            formData.append('proof', transaction.proofFile);
        }

        const config = { 
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true 
        };

        if (transaction.id) {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/finance/transactions/${transaction.id}`, formData, config);
        } else {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, formData, config);
        }
      }));

      await fetchTransactions();
      showSuccess(t('quick_edit.changes_saved'));
    } catch (error) {
      console.error('Error saving transactions:', error);
      showError(t('quick_edit.save_error'));
    } finally {
      setSaving(false);
    }
  };

  const isTypeFixed = !!transactionType;
  const fields = ['date', 'type', 'description', 'category', 'amount'].filter(f => !isTypeFixed || f !== 'type');

  const handleKeyDown = (e, index, field) => {
    const fieldIndex = fields.indexOf(field);

    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById(`cell-${index + 1}-${field}`);
      if (nextInput) {
        nextInput.focus();
      } else if (e.key === 'Enter') {
        // Auto-add row on Enter at bottom
        handleAddRow();
        setTimeout(() => {
            const newItemInput = document.getElementById(`cell-${index + 1}-${field}`);
            if (newItemInput) newItemInput.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.getElementById(`cell-${index - 1}-${field}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
      if (e.key === 'Tab' || e.target.selectionStart === e.target.value.length || field === 'type') {
        e.preventDefault();
        if (e.shiftKey) {
            // Shift+Tab (Move Left)
            if (fieldIndex > 0) {
              const prevField = fields[fieldIndex - 1];
              document.getElementById(`cell-${index}-${prevField}`)?.focus();
            } else if (index > 0) {
               // Move to end of prev row
               const prevField = fields[fields.length - 1];
               document.getElementById(`cell-${index - 1}-${prevField}`)?.focus();
            }
        } else {
            // Tab / ArrowRight (Move Right)
            if (fieldIndex < fields.length - 1) {
              const nextField = fields[fieldIndex + 1];
              document.getElementById(`cell-${index}-${nextField}`)?.focus();
            } else if (index < transactions.length - 1) {
               // Move to start of next row
               const nextField = fields[0];
               document.getElementById(`cell-${index + 1}-${nextField}`)?.focus();
            }
        }
      }
    } else if (e.key === 'ArrowLeft') {
      if (e.target.selectionStart === 0 || field === 'type') {
        e.preventDefault();
        if (fieldIndex > 0) {
          const prevField = fields[fieldIndex - 1];
          const prevInput = document.getElementById(`cell-${index}-${prevField}`);
          if (prevInput) prevInput.focus();
        }
      }
    }
  };

  const handlePaste = (e, startIndex, startField) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text');
    const rows = clipboardData.split(/\r\n|\n|\r/).filter(row => row.trim() !== '');

    if (rows.length === 0) return;

    const startFieldIndex = fields.indexOf(startField);
    const newTransactions = [...transactions];

    rows.forEach((row, rowIndex) => {
      const targetRowIndex = startIndex + rowIndex;
      const cells = row.split('\t');

      // Create new row if needed
      if (targetRowIndex >= newTransactions.length) {
        newTransactions.push({
            id: null,
            date: new Date().toISOString().split('T')[0],
            type: 'EXPENSE',
            description: '',
            category: '',
            amount: '',
            proof: null,
            isNew: true,
            isModified: true
        });
      }

      // Update cells
      cells.forEach((cellData, cellIndex) => {
        const targetFieldIndex = startFieldIndex + cellIndex;
        if (targetFieldIndex < fields.length) {
          const fieldName = fields[targetFieldIndex];
          let value = cellData.trim();

          // Specific handling
          if (fieldName === 'amount') {
             value = value.replace(/[^0-9]/g, '');
          } else if (fieldName === 'type') {
             const lower = value.toLowerCase();
             if (lower.includes('income') || lower.includes('masuk')) value = 'INCOME';
             else if (lower.includes('expense') || lower.includes('keluar')) value = 'EXPENSE';
          }

          newTransactions[targetRowIndex][fieldName] = value;
          newTransactions[targetRowIndex].isModified = true;
        }
      });
    });

    setTransactions(newTransactions);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const pageTitle = transactionType === 'INCOME' 
    ? t('quick_edit.title_income', 'Edit Pemasukan')
    : transactionType === 'EXPENSE'
    ? t('quick_edit.title_expense', 'Edit Pengeluaran')
    : t('quick_edit.title', 'Edit Cepat');

  const backPath = transactionType === 'INCOME' 
    ? '/finance/income'
    : transactionType === 'EXPENSE'
    ? '/finance/expense'
    : null;

  return (
    <div className="p-4 md:p-6 h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex items-center gap-3">
          {backPath && (
            <Tooltip title={t('common.back', 'Kembali')}>
              <IconButton onClick={() => navigate(backPath)} className="text-gray-600 dark:text-gray-300">
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{pageTitle}</h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: t('quick_edit.info') }} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
          >
            {t('quick_edit.add_row')}
          </Button>
          <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving || !transactions.some(t => t.isModified)}
          >
              {saving ? t('quick_edit.saving') : t('quick_edit.save_changes')}
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden flex-1 overflow-auto space-y-3 p-4">
        {transactions.map((transaction, index) => (
          <div 
            key={transaction.id || `new-${index}`} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDeleteRow(index)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">{t('quick_edit.date')}</label>
                <input
                  type="date"
                  value={new Date(transaction.date).toISOString().split('T')[0]}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              {!isTypeFixed && (
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">{t('quick_edit.type')}</label>
                <select
                  value={transaction.type}
                  onChange={(e) => handleChange(index, 'type', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="INCOME">{t('quick_edit.income')}</option>
                  <option value="EXPENSE">{t('quick_edit.expense')}</option>
                </select>
              </div>
              )}
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">{t('quick_edit.description')}</label>
                <input
                  type="text"
                  value={transaction.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder={t('quick_edit.description')}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">{t('quick_edit.category')}</label>
                <input
                  type="text"
                  value={transaction.category}
                  onChange={(e) => handleChange(index, 'category', e.target.value)}
                  placeholder={t('quick_edit.category')}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">{t('quick_edit.amount')}</label>
                <input
                  type="number"
                  value={transaction.amount}
                  onChange={(e) => handleChange(index, 'amount', e.target.value)}
                  placeholder="0"
                  className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-right focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-900 dark:text-gray-400 sticky top-0 z-10 shadow-sm">
                <tr>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-12 text-center bg-gray-50 dark:bg-gray-800">#</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-32 bg-gray-50 dark:bg-gray-800">{t('quick_edit.date')}</th>
                    {!isTypeFixed && <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-32 bg-gray-50 dark:bg-gray-800">{t('quick_edit.type')}</th>}
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">{t('quick_edit.description')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-48 bg-gray-50 dark:bg-gray-800">{t('quick_edit.category')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-40 bg-gray-50 dark:bg-gray-800">{t('quick_edit.amount')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-48 bg-gray-50 dark:bg-gray-800 text-center">
                        {t('quick_edit.proof', 'Bukti')} <span className="text-[10px] text-gray-500 font-normal block">(Max 5MB)</span>
                    </th>
                    <th className="px-4 py-2 w-12 bg-gray-50 dark:bg-gray-800"></th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction, index) => {
                    const isRowIncomplete = !transaction.date || !transaction.description || !transaction.category || !transaction.amount || (!transaction.proofFile && !transaction.proofImage);
                    const getBorderColor = (val) => (showValidation && !val && isRowIncomplete ? 'border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700');
                    const isProofMissing = !transaction.proofFile && !transaction.proofImage;

                    return (
                    <tr key={transaction.id || `new-${index}`} className={`bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group ${showValidation && isRowIncomplete ? 'bg-red-50/30' : ''}`}>
                        <td className="px-2 py-1 border border-gray-200 dark:border-gray-700 text-gray-400 text-center select-none text-xs bg-gray-50 dark:bg-gray-900 group-hover:bg-blue-100 dark:group-hover:bg-gray-800 transition-colors">
                            {index + 1}
                        </td>
                        <td className={`p-0 border relative ${getBorderColor(transaction.date)}`}>
                            <input
                                id={`cell-${index}-date`}
                                type="date"
                                value={new Date(transaction.date).toISOString().split('T')[0]}
                                onChange={(e) => handleChange(index, 'date', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'date')}
                                onPaste={(e) => handlePaste(e, index, 'date')}
                                className="w-full h-full px-2 py-1.5 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:z-10 text-gray-900 dark:text-white outline-none font-medium text-sm"
                            />
                        </td>
                        {!isTypeFixed && (
                        <td className="p-0 border border-gray-200 dark:border-gray-700 relative">
                            <select
                                id={`cell-${index}-type`}
                                value={transaction.type}
                                onChange={(e) => handleChange(index, 'type', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'type')}
                                className="w-full h-full px-2 py-1.5 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:z-10 text-gray-900 dark:text-white outline-none appearance-none text-sm cursor-pointer"
                            >
                                <option value="INCOME">{t('quick_edit.income')}</option>
                                <option value="EXPENSE">{t('quick_edit.expense')}</option>
                            </select>
                        </td>
                        )}
                        <td className={`p-0 border relative ${getBorderColor(transaction.description)}`}>
                            <input
                                id={`cell-${index}-description`}
                                type="text"
                                value={transaction.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'description')}
                                onPaste={(e) => handlePaste(e, index, 'description')}
                                className="w-full h-full px-2 py-1.5 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:z-10 text-gray-900 dark:text-white outline-none text-sm"
                                placeholder={t('quick_edit.description')}
                            />
                        </td>
                        <td className={`p-0 border relative ${getBorderColor(transaction.category)}`}>
                            <input
                                id={`cell-${index}-category`}
                                type="text"
                                value={transaction.category}
                                onChange={(e) => handleChange(index, 'category', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'category')}
                                onPaste={(e) => handlePaste(e, index, 'category')}
                                className="w-full h-full px-2 py-1.5 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:z-10 text-gray-900 dark:text-white outline-none text-sm"
                                placeholder={t('quick_edit.category')}
                            />
                        </td>
                        <td className={`p-0 border relative ${getBorderColor(transaction.amount)}`}>
                            <input
                                id={`cell-${index}-amount`}
                                type="number"
                                value={transaction.amount}
                                onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'amount')}
                                onPaste={(e) => handlePaste(e, index, 'amount')}
                                className="w-full h-full px-2 py-1.5 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:z-10 text-gray-900 dark:text-white font-mono text-right outline-none text-sm font-semibold"
                                placeholder="0"
                            />
                        </td>
                        <td className={`p-0 border relative text-center ${showValidation && isProofMissing && isRowIncomplete ? 'border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                id={`file-input-${index}`}
                                className="hidden"
                                onChange={(e) => handleFileChange(index, e.target.files[0])}
                            />
                            <div className="flex items-center justify-center gap-2 w-full h-full px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => document.getElementById(`file-input-${index}`).click()}>
                                <Tooltip title={transaction.proofFile ? "File Selected" : transaction.proofImage ? "View Proof" : "Upload Proof (Required)"}>
                                    <IconButton 
                                        size="small" 
                                        className={
                                            transaction.proofFile 
                                                ? "text-green-500" 
                                                : transaction.proofImage 
                                                    ? "text-blue-500" 
                                                    : showValidation ? "text-red-400 dark:text-red-400 animate-pulse" : "text-gray-400 dark:text-gray-500"
                                        }
                                        onClick={(e) => { e.stopPropagation(); document.getElementById(`file-input-${index}`).click(); }}
                                    >
                                        <AttachFileIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <span className={`text-xs truncate max-w-[100px] select-none ${showValidation && isProofMissing ? 'text-red-500 italic' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {transaction.proofFile 
                                        ? transaction.proofFile.name 
                                        : transaction.proofImage 
                                            ? transaction.proofImage.split('/').pop() 
                                            : showValidation ? "Wajib Upload" : <span className="text-gray-400 italic">Upload</span>
                                    }
                                </span>
                            </div>
                        </td>
                        <td className="p-0 text-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                             <IconButton size="small" onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                                 <DeleteIcon fontSize="small" />
                             </IconButton>
                        </td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuickEdit;
