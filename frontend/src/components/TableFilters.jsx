import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

/**
 * TableFilters - Reusable filter component for tables
 * 
 * @param {Object} props
 * @param {Array} props.filters - Filter configuration array
 * @param {Object} props.values - Current filter values
 * @param {Function} props.onChange - Callback when filters change
 * 
 * Filter config format:
 * {
 *   column: string,
 *   label: string,
 *   type: 'dropdown' | 'dateRange',
 *   options?: Array<{ value: string, label: string }> // for dropdown
 * }
 */
const TableFilters = ({ filters = [], values = {}, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (column, value) => {
    onChange({ ...values, [column]: value });
  };

  const handleDateChange = (column, field, value) => {
    const current = values[column] || {};
    onChange({
      ...values,
      [column]: { ...current, [field]: value }
    });
  };

  const handleClear = (column) => {
    const newValues = { ...values };
    delete newValues[column];
    onChange(newValues);
  };

  const hasActiveFilters = Object.keys(values).some(key => {
    const val = values[key];
    if (val === undefined || val === null || val === '') return false;
    if (typeof val === 'object') {
      return val.start || val.end;
    }
    return true;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        alignItems: 'flex-end',
        mb: 2 
      }}>
        {filters.map((filter) => {
          if (filter.type === 'dropdown') {
            return (
              <FormControl key={filter.column} size="small" sx={{ minWidth: 150 }}>
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  value={values[filter.column] || ''}
                  label={filter.label}
                  onChange={(e) => handleChange(filter.column, e.target.value)}
                >
                  <MenuItem value="">
                    <em>{t('common.all')}</em>
                  </MenuItem>
                  {filter.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }

          if (filter.type === 'dateRange') {
            const dateValue = values[filter.column] || {};
            return (
              <Box key={filter.column} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <DatePicker
                  label={`${filter.label} ${t('common.from')}`}
                  value={dateValue.start || null}
                  onChange={(date) => handleDateChange(filter.column, 'start', date)}
                  slotProps={{ 
                    textField: { size: 'small', sx: { width: 150 } } 
                  }}
                />
                <DatePicker
                  label={`${filter.label} ${t('common.to')}`}
                  value={dateValue.end || null}
                  onChange={(date) => handleDateChange(filter.column, 'end', date)}
                  slotProps={{ 
                    textField: { size: 'small', sx: { width: 150 } } 
                  }}
                />
                {(dateValue.start || dateValue.end) && (
                  <Tooltip title={t('common.clear')}>
                    <IconButton size="small" onClick={() => handleClear(filter.column)}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            );
          }

          return null;
        })}
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {Object.entries(values).map(([key, value]) => {
            if (!value || (typeof value === 'object' && !value.start && !value.end)) {
              return null;
            }
            
            const filter = filters.find(f => f.column === key);
            if (!filter) return null;

            let displayValue = value;
            if (filter.type === 'dropdown') {
              const option = filter.options?.find(o => o.value === value);
              displayValue = option?.label || value;
            } else if (filter.type === 'dateRange') {
              const parts = [];
              if (value.start) parts.push(`${t('common.from')}: ${value.start.toLocaleDateString()}`);
              if (value.end) parts.push(`${t('common.to')}: ${value.end.toLocaleDateString()}`);
              displayValue = parts.join(' - ');
            }

            return (
              <Chip
                key={key}
                label={`${filter.label}: ${displayValue}`}
                size="small"
                onDelete={() => handleClear(key)}
                color="primary"
                variant="outlined"
              />
            );
          })}
        </Box>
      )}
    </LocalizationProvider>
  );
};

export default TableFilters;
