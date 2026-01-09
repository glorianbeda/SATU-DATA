import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, degrees } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  RotateRight as RotateIcon,
  Close as CloseIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Sortable Page Component
const SortablePage = ({ id, index, pageIndex, onDelete, onRotate, rotation, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Paper 
             elevation={isDragging ? 8 : 1}
             sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: 4,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'grab'
             }}
          >
             <Box sx={{ p: 2, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'center', minHeight: 200, alignItems: 'center' }}>
                 <Box sx={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s' }}>
                    <Page
                        pageIndex={pageIndex}
                        width={140}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-sm"
                    />
                 </Box>
             </Box>
             
             {/* Actions */}
             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                 <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRotate(id); }} sx={{ color: 'primary.main', bgcolor: 'primary.alpha' }}>
                    <RotateIcon fontSize="small" />
                 </IconButton>
                 <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    {t('pdf_tools.common.page')} {index + 1}
                 </Typography>
                 <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(id); }} sx={{ color: 'error.main', bgcolor: 'error.alpha' }}>
                    <DeleteIcon fontSize="small" />
                 </IconButton>
             </Stack>
          </Paper>
      </motion.div>
    </div>
  );
};

export default function PDFEditor() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      
      const newPages = Array.from({ length: pdf.numPages }, (_, i) => ({
        id: `page-${i}`,
        originalIndex: i,
        rotation: 0
      }));
      setPages(newPages);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleDragStart = (event) => {
     setActiveId(event.active.id);
  }

  const handleDelete = (id) => {
    setPages(pages.filter(p => p.id !== id));
  };

  const handleRotate = (id) => {
    setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setIsSaving(true);
    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFDocument.create();

      for (const pageItem of pages) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageItem.originalIndex]);
        copiedPage.setRotation(degrees(copiedPage.getRotation().angle + pageItem.rotation));
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `edited-${file.name}`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
     setFile(null);
     setPages([]);
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {!file ? (
        <Container maxWidth="sm" sx={{ pt: 10 }}>
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Typography variant="h4" fontWeight="900" align="center" gutterBottom sx={{ color: '#1d1d1f' }}>
                 {t('pdf_tools.editor.title')}
              </Typography>
              <Typography variant="body1" align="center" sx={{ color: '#86868b', mb: 6 }}>
                 {t('pdf_tools.editor.subtitle')}
              </Typography>

              <Box {...getRootProps()}>
                 <input {...getInputProps()} />
                 <Paper
                    elevation={0}
                    sx={{
                       p: 6,
                       borderRadius: 6,
                       bgcolor: 'rgba(25, 118, 210, 0.04)',
                       border: '2px dashed',
                       borderColor: 'primary.main',
                       cursor: 'pointer',
                       textAlign: 'center',
                       transition: 'all 0.3s',
                       '&:hover': { 
                          transform: 'scale(1.02)', 
                          bgcolor: 'rgba(25, 118, 210, 0.08)',
                          boxShadow: '0 10px 40px -10px rgba(25, 118, 210, 0.2)'
                       }
                    }}
                 >
                    <motion.div 
                       animate={{ y: [0, -10, 0] }} 
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                       <Box sx={{ 
                          width: 80, height: 80, 
                          borderRadius: '24px', 
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 3,
                          boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)'
                       }}>
                          <CloudUploadIcon sx={{ fontSize: 40, color: 'white' }} />
                       </Box>
                    </motion.div>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">{t('pdf_tools.common.upload_title')}</Typography>
                    <Typography color="text.secondary">{t('pdf_tools.common.upload_subtitle')}</Typography>
                 </Paper>
              </Box>
           </motion.div>
        </Container>
      ) : (
        <>
        {/* Sticky Header */}
        <Box sx={{ 
           position: 'sticky', top: 0, zIndex: 100, 
           bgcolor: 'rgba(245, 245, 247, 0.95)', 
           backdropFilter: 'blur(20px)',
           borderBottom: '1px solid', borderColor: 'divider',
           px: 3, py: 2,
           display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
           <Stack direction="row" alignItems="center" spacing={2} sx={{ overflow: 'hidden' }}>
              <Box sx={{ p: 1, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                 <PictureAsPdfIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                 <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: { xs: 200, md: 400 } }}>
                    {file.name}
                 </Typography>
                 <Typography variant="caption" color="text.secondary">
                    {pages.length} {t('pdf_tools.common.page')}
                 </Typography>
              </Box>
           </Stack>
        </Box>

        {/* Grid Content */}
        <Container maxWidth="xl" sx={{ py: 4, pb: 24 }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                <Box sx={{ 
                   display: 'grid', 
                   gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' },
                   gap: 3
                }}>
                  {pages.map((page, index) => (
                    <SortablePage
                      key={page.id}
                      id={page.id}
                      index={index}
                      pageIndex={page.originalIndex}
                      rotation={page.rotation}
                      onDelete={handleDelete}
                      onRotate={handleRotate}
                      t={t}
                    />
                  ))}
                </Box>
              </SortableContext>
              <DragOverlay>
                 {activeId ? <Box sx={{ width: 140, height: 200, bgcolor: 'grey.200', borderRadius: 4 }} /> : null}
              </DragOverlay>
            </DndContext>
        </Container>

        {/* Bottom Floating Bar */}
        <Box sx={{ 
           position: 'fixed', bottom: 50, left: 0, right: 0, 
           display: 'flex', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none'
        }}>
           <Paper 
              elevation={24}
              sx={{ 
                 pointerEvents: 'auto',
                 borderRadius: 100,
                 bgcolor: '#1d1d1f',
                 color: 'white',
                 px: 1, py: 1,
                 display: 'flex', alignItems: 'center', gap: 1
              }}
           >
              <Button 
                 color="inherit" 
                 onClick={handleReset}
                 startIcon={<CloseIcon />}
                 sx={{ borderRadius: 100, px: 3, textTransform: 'none', color: 'grey.400' }}
              >
                 {t('pdf_tools.common.close')}
              </Button>
              <Button 
                 variant="contained" 
                 color="primary" 
                 onClick={handleSave}
                 disabled={isSaving}
                 startIcon={isSaving ? <CircularProgress size={16} color="inherit"/> : <SaveIcon />}
                 sx={{ borderRadius: 100, px: 4, fontWeight: 'bold', textTransform: 'none' }}
              >
                 {isSaving ? t('pdf_tools.common.saving') : t('pdf_tools.common.save')}
              </Button>
           </Paper>
        </Box>
        </>
      )}
    </Box>
  );
}
