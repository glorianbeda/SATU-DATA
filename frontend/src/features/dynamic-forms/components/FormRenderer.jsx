import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Checkbox, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FormRenderer = ({ schema, onSubmit, readOnly = false, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={readOnly}
          />
        );
      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={readOnly}
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={readOnly}
          />
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              value={value ? new Date(value) : null}
              onChange={(newValue) => handleChange(field.id, newValue)}
              disabled={readOnly}
              slotProps={{ textField: { fullWidth: true, required: field.required } }}
            />
          </LocalizationProvider>
        );
      case 'select':
        return (
          <TextField
            fullWidth
            select
            label={field.label}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={readOnly}
          >
            {(field.options || []).map((opt, idx) => (
              <MenuItem key={idx} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                disabled={readOnly}
              />
            }
            label={field.label}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="flex flex-col gap-4">
        {schema.map((field) => (
          <Box key={field.id}>
            {renderField(field)}
          </Box>
        ))}
        {!readOnly && (
          <Button type="submit" variant="contained" color="primary" size="large" className="mt-4">
            Kirim
          </Button>
        )}
      </Box>
    </form>
  );
};

export default FormRenderer;
