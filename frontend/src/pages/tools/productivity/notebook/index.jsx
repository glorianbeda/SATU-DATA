import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Paper, TextField, Button, IconButton,
  CircularProgress, Dialog, DialogContent, DialogActions,
  useTheme, useMediaQuery, Fab, Chip, InputBase,
  Menu, MenuItem, Tooltip, AppBar, Toolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PaletteIcon from '@mui/icons-material/Palette';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import RichTextEditor from './RichTextEditor';
// import Masonry from '@mui/lab/Masonry'; // Removed dependency, using custom SimpleMasonry
import axios from 'axios';
import { useLayout } from '~/context/LayoutContext';
import { useAlert } from '~/context/AlertContext';

// Color Palette
const NOTE_COLORS = {
  default: { light: '#ffffff', dark: '#1e1e1e' },
  red:    { light: '#faafa8', dark: '#5c2b29' },
  orange: { light: '#f39f76', dark: '#614a19' },
  yellow: { light: '#fff8b8', dark: '#635d19' },
  green:  { light: '#e2f6d3', dark: '#345920' },
  teal:   { light: '#b4ddd3', dark: '#16504b' },
  blue:   { light: '#d4e4ed', dark: '#2d555e' },
  purple: { light: '#d3bfdb', dark: '#42275e' },
  pink:   { light: '#f6e2dd', dark: '#5b2245' },
  gray:   { light: '#efeff1', dark: '#3c3f43' },
};

// --- Custom Masonry Implementation (Simpler than @mui/lab for now) ---
function SimpleMasonry({ children, columns = 1, spacing = 2 }) {
  const cols = Array.from({ length: columns }, () => []);
  
  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child)) {
      cols[index % columns].push(child);
    }
  });

  return (
    <Box sx={{ display: 'flex', gap: spacing, width: '100%' }}>
      {cols.map((col, i) => (
        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: spacing, flex: 1, minWidth: 0 }}>
          {col}
        </Box>
      ))}
    </Box>
  );
}

// --- Components ---

const ColorPicker = ({ selected, onChange }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  
  return (
    <>
      <Tooltip title="Background color">
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <PaletteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { p: 1, maxWidth: 320 } }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: 200 }}>
          {Object.entries(NOTE_COLORS).map(([key, value]) => (
            <Box
              key={key}
              onClick={() => { onChange(key); setAnchorEl(null); }}
              sx={{
                width: 32, height: 32, borderRadius: '50%',
                bgcolor: theme.palette.mode === 'dark' ? value.dark : value.light,
                border: key === selected ? `2px solid ${theme.palette.text.primary}` : '1px solid #ccc',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'transform 0.2s'
              }}
            />
          ))}
        </Box>
      </Menu>
    </>
  );
};

const NoteCard = ({ note, onClick, onDelete, onPin }) => {
  const theme = useTheme();
  const colorKey = note.color && NOTE_COLORS[note.color] ? note.color : 'default';
  const colorObj = NOTE_COLORS[colorKey] || NOTE_COLORS.default;
  const bgColor = theme.palette.mode === 'dark' ? colorObj.dark : colorObj.light;
  const isDark = theme.palette.mode === 'dark';

  const handlePinClick = (e) => {
    e.stopPropagation();
    onPin(note, !note.isPinned);
  };

  const previewText = note.content ? note.content.replace(/<[^>]+>/g, ' ') : '';

  return (
    <Paper
      onClick={() => onClick(note)}
      elevation={1}
      sx={{
        bgcolor: bgColor,
        color: isDark ? 'text.primary' : 'rgba(0,0,0,0.8)',
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        '&:hover': {
          boxShadow: 3,
          '& .pin-btn': { opacity: 1 }
        }
      }}
    >
      {note.coverImage && (
        <Box 
          component="img"
          src={note.coverImage.startsWith('http') ? note.coverImage : `${import.meta.env.VITE_API_URL}${note.coverImage}`}
          alt="cover"
          sx={{ width: '100%', height: 160, objectFit: 'cover' }}
        />
      )}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.4, mb: 0.5 }}>
            {note.title}
          </Typography>
          <Tooltip title={note.isPinned ? "Unpin" : "Pin"}>
            <IconButton 
              size="small" 
              className="pin-btn"
              onClick={handlePinClick}
              sx={{ 
                opacity: note.isPinned ? 1 : 0, 
                transition: 'opacity 0.2s',
                mt: -0.5, mr: -0.5
              }}
            >
              <PushPinIcon fontSize="small" sx={{ transform: 'rotate(45deg)' }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: isDark ? 'text.secondary' : 'rgba(0,0,0,0.6)',
            display: '-webkit-box',
            WebkitLineClamp: 10,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxHeight: 250,
            whiteSpace: 'pre-wrap'
          }}
        >
          {previewText}
        </Typography>
      </Box>
    </Paper>
  );
};

const NoteEditorDialog = ({ open, note, onClose, onSave, onDelete }) => {
  const { t } = useTranslation();
  const { showError } = useAlert();
  // Local state for editing to prevent lag
  const [form, setForm] = useState({ title: '', content: '', color: 'default', isPinned: false, coverImage: null });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (note) {
      setForm({ 
        title: note.title || '', 
        content: note.content || '', 
        color: note.color || 'default', 
        isPinned: note.isPinned || false,
        coverImage: note.coverImage || null
      });
    } else {
      setForm({ title: '', content: '', color: 'default', isPinned: false, coverImage: null });
    }
  }, [note, open]);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleEditorChange = (html) => {
    setForm(prev => ({ ...prev, content: html }));
  };

  const handleCreate = () => {
    onSave(form);
    onClose();
  };

  const handleClose = () => {
    if (open) handleCreate(); // Auto save on close
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      });
      setForm(prev => ({ ...prev, coverImage: res.data.url }));
    } catch (err) {
      console.error(err);
      showError('Failed to upload image');
    }
  };

  const handleRemoveCover = () => {
    setForm(prev => ({ ...prev, coverImage: null }));
  };

  const colorKey = form.color && NOTE_COLORS[form.color] ? form.color : 'default';
  const colorObj = NOTE_COLORS[colorKey] || NOTE_COLORS.default;
  const bgColor = theme.palette.mode === 'dark' ? colorObj.dark : colorObj.light;

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          bgcolor: bgColor,
          borderRadius: fullScreen ? 0 : 3,
          backgroundImage: 'none'
        }
      }}
    >
      <input 
        type="file" 
        hidden 
        ref={fileInputRef} 
        accept="image/*"
        onChange={handleFileChange}
      />

      {form.coverImage && (
        <Box sx={{ position: 'relative' }}>
            <Box 
              component="img"
              src={form.coverImage.startsWith('http') ? form.coverImage :(`${import.meta.env.VITE_API_URL}${form.coverImage}`)}
              sx={{ width: '100%', height: 200, objectFit: 'cover' }}
            />
            <IconButton 
                size="small"
                onClick={handleRemoveCover}
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
            >
                <CloseIcon />
            </IconButton>
        </Box>
      )}

      {/* Editor Content replaced InputBase */}
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
         <InputBase
            placeholder={t('notebook.title_placeholder')}
            value={form.title}
            onChange={handleChange('title')}
            sx={{ 
                fontSize: '1.5rem', 
                fontWeight: 600, 
                px: 3, pt: 3, pb: 1 
            }}
          />
          
          <Box sx={{ flex: 1, px: 3, pb: 2, overflowY: 'auto' }}>
            <RichTextEditor 
                content={form.content}
                onChange={handleEditorChange}
                placeholder={t('notebook.content_placeholder')}
            />
          </Box>

      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
         <Box sx={{ display: 'flex', gap: 1 }}>
            <ColorPicker selected={form.color} onChange={(c) => setForm({ ...form, color: c })} />
            
            <Tooltip title="Add Image">
                <IconButton size="small" onClick={handleUploadClick}>
                    <ImageIcon fontSize="small" />
                </IconButton>
            </Tooltip>

             {note?.id && (
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => { if(confirm('Delete?')) onDelete(note.id); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
         </Box>
         <Button onClick={handleClose}>{t('common.close') || "Close"}</Button>
      </DialogActions>
    </Dialog>
  );
};

// --- Main Page ---

const NotebookPage = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { showSuccess, showError } = useAlert();
  const theme = useTheme();
  
  // Breakpoints for masonry
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const numColumns = isMobile ? 1 : isTablet ? 2 : 4;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Editor State
  const [activeNote, setActiveNote] = useState(null); // null = closed, {} = new, {id} = edit

  useEffect(() => {
    setTitle(t('notebook.title') || 'Notebook');
    fetchNotes();
  }, [setTitle]);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, { withCredentials: true });
      setNotes(res.data.notes || []);
    } catch (err) {
      showError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const handleSaveNote = async (noteData) => {
    // Optimistic update
    try {
      const isNew = !noteData.id;
      let savedNote;
      
      if (isNew) {
        // Create
        // Don't create empty notes
        if (!noteData.title.trim() && !noteData.content.trim()) return; 
        
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/notes`, 
          noteData, 
          { withCredentials: true }
        );
        savedNote = res.data.note;
        setNotes(prev => [savedNote, ...prev]);
      } else {
        // Update
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/notes/${noteData.id}`, 
          noteData, 
          { withCredentials: true }
        );
        savedNote = res.data.note;
        setNotes(prev => prev.map(n => n.id === noteData.id ? savedNote : n));
      }
    } catch (err) {
      showError('Failed to save note');
      fetchNotes(); // Revert
    }
  };

  const handleTogglePin = async (note, newPinnedStatus) => {
    const updated = { ...note, isPinned: newPinnedStatus };
    // Optimistic
    setNotes(prev => prev.map(n => n.id === note.id ? updated : n));
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notes/${note.id}`, 
        { isPinned: newPinnedStatus }, 
        { withCredentials: true }
      );
    } catch (err) {
      fetchNotes(); // Revert
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, { withCredentials: true });
      setNotes(prev => prev.filter(n => n.id !== id));
      setActiveNote(null);
      showSuccess('Note deleted');
    } catch (err) {
      showError('Failed to delete note');
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  return (
    <Box sx={{ width: '100%', minHeight: '100%', p: isMobile ? 2 : 4, pb: 10 }}>
      {/* Search Bar (Centered, Keep Style) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper
          elevation={1}
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: isMobile ? '100%' : 600,
            borderRadius: 2
          }}
        >
          <IconButton sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={t('notebook.search') || "Search notes"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <IconButton onClick={() => setSearch('')}>
              <CloseIcon />
            </IconButton>
          )}
        </Paper>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Grid */}
      {!loading && (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {pinnedNotes.length > 0 && (
            <>
              <Typography variant="overline" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>
                {t('notebook.pinned') || "PINNED"}
              </Typography>
              <SimpleMasonry columns={numColumns} spacing={2}>
                {pinnedNotes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onClick={setActiveNote} 
                    onPin={handleTogglePin}
                  />
                ))}
              </SimpleMasonry>
              <Box sx={{ height: 32 }} />
              {otherNotes.length > 0 && (
                <Typography variant="overline" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>
                  {t('notebook.others') || "OTHERS"}
                </Typography>
              )}
            </>
          )}

          <SimpleMasonry columns={numColumns} spacing={2}>
            {otherNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onClick={setActiveNote} 
                onPin={handleTogglePin}
              />
            ))}
          </SimpleMasonry>
          
          {filteredNotes.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary', opacity: 0.6 }}>
              <Box sx={{ fontSize: 64, mb: 2 }}>💡</Box>
              <Typography>{t('notebook.empty_state') || "Notes you add appear here"}</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Floating Action Button (Mobile & Desktop) */}
      <Fab 
        color="secondary" 
        sx={{ 
          position: 'fixed', 
          bottom: isMobile ? 24 : 32, 
          right: isMobile ? 24 : 32 
        }}
        onClick={() => setActiveNote({})}
      >
        <AddIcon />
      </Fab>

      {/* Editor Modal */}
      <NoteEditorDialog 
        open={Boolean(activeNote)} 
        note={activeNote && activeNote.id ? activeNote : null}
        onClose={() => setActiveNote(null)}
        onSave={handleSaveNote}
        onDelete={handleDelete}
      />
    </Box>
  );
};

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>Something went wrong</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            {this.state.error?.toString()}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Reload Page</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

const NotebookPageWrapper = () => (
  <ErrorBoundary>
    <NotebookPage />
  </ErrorBoundary>
);

export default NotebookPageWrapper;
