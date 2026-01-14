import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Paper, Button, IconButton, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, Chip, Tooltip, CircularProgress, LinearProgress,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
  Breadcrumbs, Link, Menu, Divider, InputAdornment, Alert, Popover,
  Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Fab
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useAlert } from '~/context/AlertContext';
import { useConfirm } from '~/context/ConfirmationContext';
import FolderTable from './components/FolderTable';

const API_URL = import.meta.env.VITE_API_URL;

// Categories with descriptions
const CATEGORIES = [
  { value: 'Surat Masuk', desc: 'Surat yang diterima dari pihak eksternal' },
  { value: 'Surat Keluar', desc: 'Surat yang dikirim ke pihak eksternal' },
  { value: 'Laporan', desc: 'Laporan kegiatan, keuangan, atau progress' },
  { value: 'Kontrak', desc: 'Kontrak, perjanjian, MoU' },
  { value: 'Keuangan', desc: 'Dokumen keuangan, invoice, kwitansi' },
  { value: 'SDM', desc: 'Dokumen kepegawaian, SK, absensi' },
  { value: 'Foto', desc: 'Foto dan dokumentasi kegiatan' },
  { value: 'Lainnya', desc: 'Dokumen lainnya' },
];

// File type icons
const getFileIcon = (mimeType) => {
  if (mimeType?.includes('pdf')) return <PictureAsPdfIcon color="error" />;
  if (mimeType?.includes('image')) return <ImageIcon color="primary" />;
  if (mimeType?.includes('word') || mimeType?.includes('document')) return <DescriptionIcon color="info" />;
  return <InsertDriveFileIcon />;
};

// Format file size
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ArchivesPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
  const { confirm } = useConfirm();
  const fileInputRef = useRef(null);

  // State
  const [loading, setLoading] = useState(true);
  const [archives, setArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Dialogs
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [categoryGuideAnchor, setCategoryGuideAnchor] = useState(null);
  
  // Upload State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('Lainnya');

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/archives`, {
        params: { 
          category: categoryFilter || undefined,
          search: searchTerm || undefined,
        },
        withCredentials: true,
      });

      setArchives(res.data.archives || []);
    } catch (error) {
      showError('Gagal memuat data arsip');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchTerm, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // File selection handler
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Pre-check size
    const maxSize = 150 * 1024 * 1024; // 150MB
    const isPdf = file.type === 'application/pdf';

    if (file.size > maxSize) {
      if (isPdf) {
        const redirectToCompress = await confirm({
          title: 'File Terlalu Besar',
          description: 'File PDF melebihi batas 150MB. Apakah Anda ingin mengompres file terlebih dahulu?',
          confirmText: 'Kompres PDF',
          cancelText: 'Batal',
        });
        
        if (redirectToCompress) {
          // Store file in sessionStorage for auto-fill
          sessionStorage.setItem('pendingCompressFile', file.name);
          navigate('/tools/pdf/compress', { state: { pendingFile: file } });
        }
      } else {
        showError('Ukuran file maksimal adalah 150MB');
      }
      return;
    }

    setSelectedFile(file);
    setUploadCategory('Lainnya'); // Reset category
    setUploadDialogOpen(true);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Confirm Upload
  const confirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', uploadCategory);


    try {
      setUploading(true);
      setUploadProgress(0);

      await axios.post(`${API_URL}/api/archives`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      showSuccess('File berhasil diunggah');
      setUploadDialogOpen(false);
      fetchData();
    } catch (error) {
      if (error.response?.data?.suggestCompress) {
        setUploadDialogOpen(false);
        const redirectToCompress = await confirm({
          title: 'File PDF Terlalu Besar',
          description: 'Sistem mendeteksi file PDF ini terlalu besar. Apakah Anda ingin mengompresnya?',
          confirmText: 'Kompres Sekarang',
        });

        if (redirectToCompress) {
          navigate('/tools/pdf/compress', { state: { pendingFile: selectedFile } });
        }
      } else {
        showError(error.response?.data?.error || 'Gagal mengunggah file');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Download file
  const handleDownload = async (archive) => {
    try {
      const response = await axios.get(`${API_URL}/api/archives/${archive.id}/download`, {
        withCredentials: true,
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', archive.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showError('Gagal mengunduh file');
    }
  };

  // Delete archive
  const handleDeleteArchive = async (archiveId) => {
    const isConfirmed = await confirm({
      title: 'Hapus Arsip',
      description: 'Apakah Anda yakin ingin menghapus arsip ini? Aksi ini tidak dapat dibatalkan.',
      confirmText: 'Hapus',
      variant: 'danger',
    });

    if (!isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/api/archives/${archiveId}`, { withCredentials: true });
      showSuccess('Arsip berhasil dihapus');
      fetchData();
    } catch (error) {
      showError('Gagal menghapus arsip');
    }
  };

  // Share file
  const handleShare = async (archive) => {
    try {
      const response = await axios.post(`${API_URL}/api/archives/${archive.id}/share`, {
        permission: 'VIEW',
      }, { withCredentials: true });
      
      setShareUrl(response.data.shareUrl);
      setSelectedArchive(archive);
      setShareDialogOpen(true);
    } catch (error) {
      showError('Gagal membuat link berbagi');
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    showSuccess('Link berhasil disalin');
  };

  // Render Table Row for File
  const renderFileRow = (archive) => (
    <TableRow
      key={`archive-${archive.id}`}
      hover
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {getFileIcon(archive.mimeType)}
        <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
          {archive.originalName}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip label={archive.category} size="small" variant="outlined" sx={{ height: 24 }} />
      </TableCell>
      <TableCell>{formatSize(archive.fileSize)}</TableCell>
      <TableCell>{new Date(archive.createdAt).toLocaleDateString('id-ID')}</TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Unduh">
            <IconButton size="small" onClick={() => handleDownload(archive)}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bagikan">
            <IconButton size="small" onClick={() => handleShare(archive)}>
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus">
            <IconButton size="small" onClick={() => handleDeleteArchive(archive.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Handle Sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort Data
  const sortedArchives = React.useMemo(() => {
    if (!archives) return [];
    const sorted = [...archives];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [archives, sortConfig]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Arsip Dokumen</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>

          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Unggah File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileUpload}
          />
        </Box>
      </Box>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Mengunggah... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}



      {/* Category Guide Popover */}
      <Popover
        open={Boolean(categoryGuideAnchor)}
        anchorEl={categoryGuideAnchor}
        onClose={() => setCategoryGuideAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Panduan Kategori
          </Typography>
          {CATEGORIES.map(cat => (
            <Box key={cat.value} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">{cat.value}</Typography>
              <Typography variant="caption" color="text.secondary">{cat.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Content */}
      <Box sx={{ minHeight: 400 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Back button */}


            {/* Folders Grid */}


            {/* Files Table or Empty State */}
            <Box sx={{ mt: 2 }}>
              <FolderTable 
                tabs={[
                  { label: 'Semua File', value: '' },
                  ...CATEGORIES.map(cat => ({ label: cat.value, value: cat.value }))
                ]}
                activeTab={categoryFilter}
                onTabChange={setCategoryFilter}
              >
                {/* Search Bar Inside Folder */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                   <TextField
                    size="small"
                    placeholder="Cari file..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: { xs: '100%', sm: 300 }, bgcolor: 'white', borderRadius: 1 }}
                  />
                </Box>

                {sortedArchives.length > 0 ? (
                  <Table sx={{ minWidth: 650 }} aria-label="file table">
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 'bold', color: '#555' } }}>
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig.key === 'originalName'}
                            direction={sortConfig.key === 'originalName' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('originalName')}
                          >
                            Nama File
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                           <TableSortLabel
                            active={sortConfig.key === 'category'}
                            direction={sortConfig.key === 'category' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('category')}
                          >
                            Kategori
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                           <TableSortLabel
                            active={sortConfig.key === 'fileSize'}
                            direction={sortConfig.key === 'fileSize' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('fileSize')}
                          >
                            Ukuran
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                           <TableSortLabel
                            active={sortConfig.key === 'createdAt'}
                            direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                            onClick={() => handleSort('createdAt')}
                          >
                           Tanggal Upload
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedArchives.map(renderFileRow)}
                    </TableBody>
                  </Table>
                ) : (
                  // Empty State inside Folder
                  <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                    <FolderOpenIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">Belum ada arsip</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {searchTerm ? `Tidak ditemukan file dengan kata kunci "${searchTerm}"` : 
                       categoryFilter ? `Tidak ada file di kategori "${categoryFilter}"` : 'Mulai dengan mengunggah file'}
                    </Typography>
                    <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => fileInputRef.current?.click()}>
                      Unggah File
                    </Button>
                  </Box>
                )}
              </FolderTable>
            </Box>

            {/* Empty Folder State (Specific to when browsing a subfolder) */}

          </>
        )}
      </Box>

      {/* Create Folder Dialog */}


      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
           {selectedFile && (
             <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
               {getFileIcon(selectedFile.type)}
               <Box sx={{ overflow: 'hidden' }}>
                 <Typography variant="subtitle2" noWrap>{selectedFile.name}</Typography>
                 <Typography variant="caption" color="text.secondary">{formatSize(selectedFile.size)}</Typography>
               </Box>
             </Box>
           )}
           <FormControl fullWidth margin="normal">
             <InputLabel>Kategori Dokumen</InputLabel>
             <Select
               value={uploadCategory}
               label="Kategori Dokumen"
               onChange={(e) => setUploadCategory(e.target.value)}
               endAdornment={
                 <InputAdornment position="end" sx={{ mr: 2 }}>
                   <IconButton
                     size="small"
                     onClick={(e) => setCategoryGuideAnchor(e.currentTarget)}
                   >
                     <HelpOutlineIcon fontSize="small" />
                   </IconButton>
                 </InputAdornment>
               }
             >
               {CATEGORIES.map(cat => (
                 <MenuItem key={cat.value} value={cat.value}>{cat.value}</MenuItem>
               ))}
             </Select>
           </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Batal</Button>
          <Button 
            onClick={confirmUpload} 
            variant="contained" 
            startIcon={<UploadFileIcon />}
            disabled={uploading}
          >
            {uploading ? 'Mengunggah...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          Bagikan "{selectedArchive?.originalName}"
          <IconButton
            onClick={() => setShareDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Siapa saja dengan link ini dapat melihat dan mengunduh file.
          </Alert>
          <TextField
            fullWidth
            value={shareUrl}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyLink} edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLink} variant="contained" startIcon={<ContentCopyIcon />}>
            Salin Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Floating Action Button */}
      <Fab
        color="primary"
        aria-label="upload"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <UploadFileIcon />
      </Fab>
    </Box>
  );
}
