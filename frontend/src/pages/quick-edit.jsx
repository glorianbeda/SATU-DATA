import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAlert } from '../context/AlertContext';

const QuickEdit = () => {
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useAlert();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, {
        params: { limit: 100 },
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

  const handleAddRow = () => {
    setTransactions([
      ...transactions,
      {
        id: null,
        date: new Date().toISOString().split('T')[0],
        type: 'INCOME',
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
    const emptyRows = modifiedTransactions.filter(t => !t.description?.trim() || !t.amount);

    if (emptyRows.length > 0) {
      showWarning(t('quick_edit.empty_rows_warning', { count: emptyRows.length }));
      return;
    }

    setSaving(true);
    try {
      await Promise.all(modifiedTransactions.map(async (transaction) => {
        const payload = {
          type: transaction.type,
          amount: parseFloat(transaction.amount) || 0,
          description: transaction.description,
          category: transaction.category,
          date: transaction.date
        };

        if (transaction.id) {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/finance/transactions/${transaction.id}`, payload, { withCredentials: true });
        } else {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/finance/transactions`, payload, { withCredentials: true });
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

  const fields = ['date', 'type', 'description', 'category', 'amount'];

  const handleKeyDown = (e, index, field) => {
    const fieldIndex = fields.indexOf(field);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextInput = document.getElementById(`cell-${index + 1}-${field}`);
      if (nextInput) nextInput.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.getElementById(`cell-${index - 1}-${field}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight') {
      if (e.target.selectionStart === e.target.value.length || field === 'type') {
        e.preventDefault();
        if (fieldIndex < fields.length - 1) {
          const nextField = fields[fieldIndex + 1];
          const nextInput = document.getElementById(`cell-${index}-${nextField}`);
          if (nextInput) nextInput.focus();
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById(`cell-${index + 1}-${field}`);
      if (nextInput) {
        nextInput.focus();
      } else {
        handleAddRow();
        // Wait for render then focus
        setTimeout(() => {
            const newItemInput = document.getElementById(`cell-${index + 1}-${field}`);
            if (newItemInput) newItemInput.focus();
        }, 0);
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

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('quick_edit.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: t('quick_edit.info') }} />
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

      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-900 dark:text-gray-400 sticky top-0 z-10 shadow-sm">
                <tr>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-12 text-center bg-gray-50 dark:bg-gray-800">#</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-32 bg-gray-50 dark:bg-gray-800">{t('quick_edit.date')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-32 bg-gray-50 dark:bg-gray-800">{t('quick_edit.type')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">{t('quick_edit.description')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-48 bg-gray-50 dark:bg-gray-800">{t('quick_edit.category')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 w-40 bg-gray-50 dark:bg-gray-800">{t('quick_edit.amount')}</th>
                    <th className="px-4 py-2 w-12 bg-gray-50 dark:bg-gray-800"></th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={transaction.id || `new-${index}`} className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-2 py-1 border border-gray-200 dark:border-gray-700 text-gray-400 text-center select-none">
                            {index + 1}
                        </td>
                        <td className="p-0 border border-gray-200 dark:border-gray-700">
                            <input
                                id={`cell-${index}-date`}
                                type="date"
                                value={new Date(transaction.date).toISOString().split('T')[0]}
                                onChange={(e) => handleChange(index, 'date', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'date')}
                                onPaste={(e) => handlePaste(e, index, 'date')}
                                className="w-full h-full px-3 py-2 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                            />
                        </td>
                        <td className="p-0 border border-gray-200 dark:border-gray-700">
                            <select
                                id={`cell-${index}-type`}
                                value={transaction.type}
                                onChange={(e) => handleChange(index, 'type', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'type')}
                                className="w-full h-full px-3 py-2 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-gray-900 dark:text-white outline-none appearance-none"
                            >
                                <option value="INCOME">{t('quick_edit.income')}</option>
                                <option value="EXPENSE">{t('quick_edit.expense')}</option>
                            </select>
                        </td>
                        <td className="p-0 border border-gray-200 dark:border-gray-700">
                            <input
                                id={`cell-${index}-description`}
                                type="text"
                                value={transaction.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'description')}
                                onPaste={(e) => handlePaste(e, index, 'description')}
                                className="w-full h-full px-3 py-2 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                                placeholder={t('quick_edit.description')}
                            />
                        </td>
                        <td className="p-0 border border-gray-200 dark:border-gray-700">
                            <input
                                id={`cell-${index}-category`}
                                type="text"
                                value={transaction.category}
                                onChange={(e) => handleChange(index, 'category', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'category')}
                                onPaste={(e) => handlePaste(e, index, 'category')}
                                className="w-full h-full px-3 py-2 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                                placeholder={t('quick_edit.category')}
                            />
                        </td>
                        <td className="p-0 border border-gray-200 dark:border-gray-700">
                            <input
                                id={`cell-${index}-amount`}
                                type="number"
                                value={transaction.amount}
                                onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'amount')}
                                onPaste={(e) => handlePaste(e, index, 'amount')}
                                className="w-full h-full px-3 py-2 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-gray-900 dark:text-white font-mono text-right outline-none"
                                placeholder="0"
                            />
                        </td>
                        <td className="p-0 text-center border-b border-gray-200 dark:border-gray-700">
                            <Tooltip title="Delete Row">
                                <IconButton size="small" onClick={() => handleDeleteRow(index)} color="error">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuickEdit;
