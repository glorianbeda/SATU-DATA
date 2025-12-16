import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { removeBackground } from '@imgly/background-removal';
import SignatureCanvas from 'react-signature-canvas';
import {
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DrawIcon from '@mui/icons-material/Draw';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

const ProfileEditForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState(''); // Should be populated from context/API
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgRemovalLoading, setBgRemovalLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [signatureMethod, setSignatureMethod] = useState(0); // 0: Upload, 1: Draw

  const profileInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const sigCanvasRef = useRef({});

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/api/profile`, {
          withCredentials: true
        });

        const { user } = response.data;
        if (user) {
          setName(user.name || '');
          if (user.profilePicture) {
            // Check if it's a full URL or relative path
            const picUrl = user.profilePicture.startsWith('http')
              ? user.profilePicture
              : `${apiUrl}${user.profilePicture}`;
            setProfilePicturePreview(picUrl);
          }
          if (user.sign) {
             const signUrl = user.sign.startsWith('http')
              ? user.sign
              : `${apiUrl}${user.sign}`;
            setSignaturePreview(signUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveBackground = async () => {
    if (!signature) return;

    setBgRemovalLoading(true);
    try {
      // imglyRemoveBackground returns a Blob
      const blob = await removeBackground(signature);
      const file = new File([blob], "signature-nobg.png", { type: "image/png" });
      setSignature(file);
      setSignaturePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Background removal failed:", error);
      setMessage({ type: 'error', text: 'Background removal failed' });
    } finally {
      setBgRemovalLoading(false);
    }
  };

  const clearSignature = () => {
    sigCanvasRef.current.clear();
  };

  const getCanvasBlob = () => {
    return new Promise((resolve) => {
      if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
        resolve(null);
        return;
      }
      // Use toDataURL directly on the canvas reference (wrapper)
      // react-signature-canvas exposes toDataURL directly
      const dataURL = sigCanvasRef.current.toDataURL('image/png');
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "drawn-signature.png", { type: "image/png" });
          resolve(file);
        });
    });
  };

  const saveDrawnSignature = async () => {
    const file = await getCanvasBlob();
    if (file) {
      setSignature(file);
      setSignaturePreview(URL.createObjectURL(file));
      setSignatureMethod(0); // Switch back to preview/upload view
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let finalSignature = signature;

    // If in draw mode, try to get the signature from canvas
    if (signatureMethod === 1) {
       const drawnFile = await getCanvasBlob();
       if (drawnFile) {
         finalSignature = drawnFile;
       }
    }

    const formData = new FormData();
    if (name) formData.append('name', name);
    if (profilePicture) formData.append('profilePicture', profilePicture);
    if (finalSignature) formData.append('sign', finalSignature);

    try {
      // Assuming API URL is from env or relative if proxied
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await axios.put(`${apiUrl}/api/profile`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Typography variant="h6" className="mb-6 text-gray-800 dark:text-white font-bold">
        {t('profile.edit_profile')}
      </Typography>

      {message && (
        <Alert severity={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Profile Picture Section */}
        <Box className="flex items-center gap-4">
          <Avatar
            src={profilePicturePreview}
            sx={{ width: 80, height: 80 }}
            className="border-2 border-gray-200 dark:border-gray-600"
          />
          <Box>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={profileInputRef}
              onChange={handleProfilePictureChange}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => profileInputRef.current.click()}
              size="small"
              className="normal-case dark:text-gray-300 dark:border-gray-600"
            >
              {t('profile.upload_photo')}
            </Button>
            <Typography variant="caption" display="block" className="mt-1 text-gray-500 dark:text-gray-400">
              JPG, PNG or GIF. Max 5MB.
            </Typography>
          </Box>
        </Box>

        {/* Name Input */}
        <TextField
          label={t('profile.name')}
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-50 dark:bg-gray-900"
          InputLabelProps={{ className: "dark:text-gray-400" }}
          InputProps={{ className: "dark:text-white" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.87)" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
              ".dark &:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.87)" },
              ".dark &.Mui-focused fieldset": { borderColor: "#90caf9" },
              ".dark &": { color: "white" },
            },
            "& .MuiInputLabel-root": {
              ".dark &": { color: "rgba(255, 255, 255, 0.7)" },
              ".dark &.Mui-focused": { color: "#90caf9" },
            },
          }}
        />

        {/* Signature Section */}
        <Box>
          <Typography variant="subtitle2" className="mb-2 text-gray-700 dark:text-gray-300">
            {t('profile.signature')}
          </Typography>

          <Tabs
            value={signatureMethod}
            onChange={(e, newValue) => setSignatureMethod(newValue)}
            className="mb-4 border-b border-gray-200 dark:border-gray-700"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Upload Image" className="dark:text-gray-300" />
            <Tab label="Draw Signature" className="dark:text-gray-300" />
          </Tabs>

          {signatureMethod === 0 ? (
            <Box className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center min-h-[150px] bg-gray-50 dark:bg-gray-900/50">
              {signaturePreview ? (
                <img src={signaturePreview} alt="Signature" className="max-h-[100px] mb-4 object-contain" />
              ) : (
                <Typography variant="body2" className="text-gray-400 mb-4">
                  {t('profile.no_signature')}
                </Typography>
              )}

              <Box className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={signatureInputRef}
                  onChange={handleSignatureChange}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => signatureInputRef.current.click()}
                  className="dark:text-gray-300 dark:border-gray-600"
                >
                  {t('profile.upload_signature')}
                </Button>

                {signature && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={bgRemovalLoading ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
                    onClick={handleRemoveBackground}
                    disabled={bgRemovalLoading}
                  >
                    {t('profile.remove_bg')}
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                minWidth={2}
                maxWidth={4}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'sigCanvas w-full h-[200px] cursor-crosshair'
                }}
              />
              <Box className="flex justify-end gap-2 mt-2 border-t pt-2 border-gray-100">
                <Button
                  startIcon={<ClearIcon />}
                  onClick={clearSignature}
                  size="small"
                  color="error"
                >
                  Clear
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={saveDrawnSignature}
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  Use Signature
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          className="mt-2"
        >
          {loading ? <CircularProgress size={24} /> : t('profile.save_changes')}
        </Button>
      </form>
    </div>
  );
};

export default ProfileEditForm;
