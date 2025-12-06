import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Autocomplete, Checkbox, FormControlLabel, Chip, Avatar, Paper, IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const SignerSetupPanel = ({ selectedSigners = [], onSignersChange, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selfSign, setSelfSign] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { exclude_self: true }
        });
        setUsers(response.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter out current user from options
  const userOptions = React.useMemo(() => {
    if (!currentUser) return users;
    return users.filter(u => String(u.id) !== String(currentUser.id));
  }, [users, currentUser]);

  // Get selected signers excluding current user (for Autocomplete value)
  const otherSigners = selectedSigners.filter(s => !currentUser || String(s.id) !== String(currentUser.id));

  // Handle Autocomplete change
  const handleSignersChange = (event, newValue) => {
    // newValue is the array of selected "other" signers
    
    // Check if current user is currently selected (self-sign active)
    const isSelfSelected = currentUser && selectedSigners.some(s => String(s.id) === String(currentUser.id));
    
    // Combine new list with current user if self-sign is active
    let newSigners = [...newValue];
    if (isSelfSelected && currentUser) {
      newSigners.push(currentUser);
    }
    
    onSignersChange(newSigners);
  };

  // Handle self-sign checkbox
  const handleSelfSignChange = (event) => {
    const checked = event.target.checked;
    setSelfSign(checked);
    
    if (checked) {
      // Add current user if not already in list
      if (currentUser && !selectedSigners.some(s => s.id === currentUser.id)) {
        onSignersChange([...selectedSigners, currentUser]);
      }
    } else {
      // Remove current user from list
      if (currentUser) {
        onSignersChange(selectedSigners.filter(s => s.id !== currentUser.id));
      }
    }
  };

  // Sync selfSign state if currentUser is removed externally
  useEffect(() => {
    if (currentUser) {
      const isCurrentUserInList = selectedSigners.some(s => s.id === currentUser.id);
      if (selfSign !== isCurrentUserInList) {
        setSelfSign(isCurrentUserInList);
      }
    }
  }, [selectedSigners, currentUser]);

  return (
    <Box className="mt-6">
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Siapa yang perlu tanda tangan?
      </Typography>

      {/* Search & Add User (Multiple) */}
      <Autocomplete
        multiple
        options={userOptions}
        getOptionLabel={(option) => option.name || option.email}
        value={otherSigners}
        onChange={handleSignersChange}
        loading={loading}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cari pengguna..."
            variant="outlined"
            placeholder={otherSigners.length === 0 ? "Pilih pengguna..." : ""}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              avatar={<Avatar sx={{ bgcolor: '#3b82f6', color: 'white' }}>{option.name?.charAt(0)}</Avatar>}
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{option.name}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', lineHeight: 1, opacity: 0.7 }}>{option.email}</Typography>
                </Box>
              }
              {...getTagProps({ index })}
              sx={{ 
                height: 'auto', 
                py: 0.5,
                borderRadius: 2,
                '& .MuiChip-label': { display: 'block', textAlign: 'left' }
              }}
            />
          ))
        }
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key} {...otherProps}>
              <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14, bgcolor: '#e0e7ff', color: '#3b82f6' }}>
                {option.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">{option.email}</Typography>
              </Box>
            </Box>
          );
        }}
        sx={{ mb: 2 }}
      />

      {/* Self Sign Checkbox */}
      <FormControlLabel
        control={
          <Checkbox 
            checked={selfSign} 
            onChange={handleSelfSignChange}
            color="primary"
          />
        }
        label={
          <Typography variant="body2" color="text.primary">
            Saya juga akan menandatangani dokumen ini
          </Typography>
        }
        sx={{ mb: 3 }}
      />
    </Box>
  );
};

export default SignerSetupPanel;
