import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { pdfjs, Document, Page } from 'react-pdf';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Container,
  Card,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Transform as ConvertIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  DragIndicator,
  Delete as DeleteIcon,
  SwapHoriz as SwapIcon
} from '@mui/icons-material';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Sortable Image Item
const SortableImageItem = ({ id, file, onRemove }) => {
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
    position: 'relative',
    marginBottom: 8
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        elevation={isDragging ? 8 : 0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'white',
          boxShadow: isDragging ? 4 : 0
        }}
      >
        <Box {...attributes} {...listeners} sx={{ p: 1, cursor: 'grab', color: 'text.disabled', display: 'flex' }}>
           <DragIndicator />
        </Box>
        <Avatar 
           src={file.preview} 
           variant="rounded" 
           sx={{ width: 56, height: 56, mr: 2, bgcolor: 'grey.100', borderRadius: 2 }} 
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
           <Typography variant="subtitle2" fontWeight="bold" noWrap>{file.name}</Typography>
           <Typography variant="caption" color="text.secondary">{(file.size / 1024).toFixed(1)} KB</Typography>
        </Box>
        <IconButton size="small" onClick={() => onRemove(id)} sx={{ bgcolor: 'error.alpha', color: 'error.main' }}>
           <DeleteIcon fontSize="small" />
        </IconButton>
      </Card>
    </div>
  );
};

// Panel: Images -> PDF
const ImageToPdfPanel = () => {
   const { t } = useTranslation();
   const [files, setFiles] = useState([]);
   const [isProcessing, setIsProcessing] = useState(false);

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
   );

   const onDrop = useCallback((acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => Object.assign(file, {
         preview: URL.createObjectURL(file),
         id: `file-${Date.now()}-${Math.random()}`
      }));
      setFiles(prev => [...prev, ...newFiles]);
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'image/*': ['.png', '.jpg', '.jpeg'] }
   });

   const handleRemove = (id) => setFiles(prev => prev.filter(f => f.id !== id));

   const handleDragEnd = (event) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
         setFiles((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
         });
      }
   };

   const handleConvert = () => {
      if (files.length === 0) return;
      setIsProcessing(true);
      const doc = new jsPDF();
      
      files.forEach((file, index) => {
         const img = new Image();
         img.src = file.preview;
         if (index > 0) doc.addPage();
         
         const imgProps = doc.getImageProperties(img);
         const pdfWidth = doc.internal.pageSize.getWidth();
         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
         
         doc.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      });

      doc.save('images-converted.pdf');
      setIsProcessing(false);
   };

   return (
      <Box>
         {files.length === 0 ? (
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
                    mb: 3,
                    transition: 'all 0.3s',
                    '&:hover': { 
                       transform: 'scale(1.01)', 
                       bgcolor: 'rgba(25, 118, 210, 0.08)',
                       boxShadow: '0 10px 40px -10px rgba(25, 118, 210, 0.2)'
                    }
                 }}
              >
                 <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 >
                    <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'primary.light', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)' }}>
                        <ImageIcon color="inherit" sx={{ color: 'white' }} fontSize="large" />
                    </Box>
                 </motion.div>
                 <Typography variant="h6" fontWeight="bold" color="primary.main">{t('pdf_tools.common.upload_image_title')}</Typography>
                 <Typography variant="caption" color="text.secondary">{t('pdf_tools.common.upload_image_subtitle')}</Typography>
              </Paper>
           </Box>
         ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               {/* Sticky Header */}
               <Box sx={{ 
                 position: 'sticky', top: 0, zIndex: 100, 
                 bgcolor: 'rgba(245, 245, 247, 0.95)', 
                 backdropFilter: 'blur(20px)',
                 borderBottom: '1px solid', borderColor: 'divider',
                 px: 3, py: 2, mx: -3, mb: 3,
                 display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                     <Box sx={{ p: 1, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                        <ConvertIcon />
                     </Box>
                     <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{t('pdf_tools.convert.tab_img_to_pdf')}</Typography>
                        <Typography variant="caption" color="text.secondary">{t('pdf_tools.convert.images_selected', { count: files.length })}</Typography>
                     </Box>
                  </Stack>
                  <Button size="small" onClick={() => {}} {...getRootProps()}>{t('pdf_tools.common.add_more')}</Button>
                  <input {...getInputProps()} />
               </Box>

               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
                     <Stack spacing={2} sx={{ pb: 24 }}>
                        {files.map(file => (
                           <SortableImageItem key={file.id} id={file.id} file={file} onRemove={handleRemove} />
                        ))}
                     </Stack>
                  </SortableContext>
               </DndContext>
               
               {/* Bottom Bar */}
               <Box sx={{ 
                  position: 'fixed', bottom: 50, left: 0, right: 0, 
                  display: 'flex', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none'
               }}>
                  <Paper elevation={24} sx={{ pointerEvents: 'auto', borderRadius: 100, bgcolor: '#1d1d1f', p: 1, display: 'flex', gap: 1 }}>
                     <Button 
                        color="inherit" 
                        onClick={() => setFiles([])}
                        startIcon={<ClearIcon />}
                        sx={{ borderRadius: 100, px: 3, textTransform: 'none', color: 'grey.400' }}
                     >
                        {t('pdf_tools.common.clear')}
                     </Button>
                     <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConvert}
                        disabled={isProcessing}
                        startIcon={isProcessing ? <CircularProgress size={16} color="inherit"/> : <PdfIcon />}
                        sx={{ borderRadius: 100, px: 4, fontWeight: 'bold', textTransform: 'none' }}
                     >
                        {isProcessing ? t('pdf_tools.common.processing') : t('pdf_tools.convert.action_create_pdf')}
                     </Button>
                  </Paper>
               </Box>
            </motion.div>
         )}
      </Box>
   );
};

// Panel: PDF -> Images
const PdfToImagePanel = () => {
   const { t } = useTranslation();
   const [file, setFile] = useState(null);
   const [numPages, setNumPages] = useState(0);
   const [isProcessing, setIsProcessing] = useState(false);

   const onDrop = useCallback((acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'application/pdf': ['.pdf'] },
      multiple: false
   });

   const handleConvert = async () => {
      if (!file) return;
      setIsProcessing(true);
      try {
         const arrayBuffer = await file.arrayBuffer();
         const pdf = await pdfjs.getDocument(arrayBuffer).promise;
         const zip = new JSZip();

         for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            
            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            zip.file(`page-${i}.jpg`, imgData.split(',')[1], { base64: true });
         }

         const content = await zip.generateAsync({ type: 'blob' });
         const link = document.createElement('a');
         link.href = URL.createObjectURL(content);
         link.download = `converted-images.zip`;
         link.click();
      } catch (err) {
         console.error(err);
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <Box>
         {!file ? (
            <Box {...getRootProps()}>
               <input {...getInputProps()} />
                <Paper
                   elevation={0}
                   sx={{
                      p: 8,
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
                       <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'primary.light', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)' }}>
                         <PdfIcon color="inherit" sx={{ color: 'white' }} fontSize="large" />
                       </Box>
                    </motion.div>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">{t('pdf_tools.convert.upload_pdf_title')}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, maxWidth: 300, mx: 'auto' }}>
                       {t('pdf_tools.convert.zip_hint')}
                    </Typography>
                </Paper>
            </Box>
         ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               {/* Sticky Header */}
               <Box sx={{ 
                 position: 'sticky', top: 0, zIndex: 100, 
                 bgcolor: 'rgba(245, 245, 247, 0.95)', 
                 backdropFilter: 'blur(20px)',
                 borderBottom: '1px solid', borderColor: 'divider',
                 px: 3, py: 2, mx: -3, mb: 4,
                 display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ overflow: 'hidden' }}>
                     <Box sx={{ p: 1, borderRadius: 3, bgcolor: 'secondary.dark', color: 'white' }}>
                        <PdfIcon />
                     </Box>
                     <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: { xs: 200, md: 400 } }}>
                           {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{t('pdf_tools.convert.pages_detected', { count: numPages })}</Typography>
                     </Box>
                  </Stack>
               </Box>

               <Container maxWidth="sm" sx={{ pb: 24 }}>
                  <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                     <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Paper elevation={4} sx={{ p: 1, borderRadius: 2 }}>
                           <Page pageIndex={0} width={200} renderTextLayer={false} renderAnnotationLayer={false} />
                        </Paper>
                     </Box>
                  </Document>
                  <Typography align="center" color="text.secondary">{t('pdf_tools.convert.preview_page')}</Typography>
               </Container>
               
               {/* Bottom Bar */}
               <Box sx={{ 
                  position: 'fixed', bottom: 50, left: 0, right: 0, 
                  display: 'flex', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none'
               }}>
                  <Paper elevation={24} sx={{ pointerEvents: 'auto', borderRadius: 100, bgcolor: '#1d1d1f', p: 1, display: 'flex', gap: 1 }}>
                     <Button 
                         color="inherit"
                         onClick={() => setFile(null)} 
                         startIcon={<ClearIcon />}
                         sx={{ borderRadius: 100, px: 3, textTransform: 'none', color: 'grey.400' }}
                     >
                        {t('pdf_tools.common.cancel')}
                     </Button>
                     <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleConvert}
                        disabled={isProcessing}
                        sx={{ borderRadius: 100, px: 4, fontWeight: 'bold', textTransform: 'none' }}
                     >
                        {isProcessing ? t('pdf_tools.common.processing') : t('pdf_tools.convert.action_download_zip')}
                     </Button>
                  </Paper>
               </Box>
            </motion.div>
         )}
      </Box>
   );
};

export default function PDFConvert() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
       <Container maxWidth="sm" sx={{ pt: 8, px: { xs: 2, md: 0 } }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
             <Typography variant="h4" fontWeight="900" align="center" gutterBottom sx={{ color: '#1d1d1f' }}>
                {t('pdf_tools.convert.title')}
             </Typography>
             
             {/* Custom Tabs */}
             <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                <Paper sx={{ p: '4px', bgcolor: 'grey.200', borderRadius: 100, display: 'inline-flex' }} elevation={0}>
                   <Button 
                      onClick={() => setTab(0)}
                      variant={tab === 0 ? 'contained' : 'text'}
                      color={tab === 0 ? 'inherit' : 'inherit'}
                      sx={{ 
                         borderRadius: 100, 
                         bgcolor: tab === 0 ? 'white' : 'transparent',
                         color: tab === 0 ? 'black' : 'text.secondary',
                         boxShadow: tab === 0 ? 2 : 0,
                         px: 3,
                         '&:hover': { bgcolor: tab === 0 ? 'white' : 'rgba(0,0,0,0.05)' }
                      }}
                   >
                      {t('pdf_tools.convert.tab_img_to_pdf')}
                   </Button>
                   <Button 
                      onClick={() => setTab(1)}
                      variant={tab === 1 ? 'contained' : 'text'}
                      color={tab === 1 ? 'inherit' : 'inherit'}
                      sx={{ 
                         borderRadius: 100, 
                         bgcolor: tab === 1 ? 'white' : 'transparent',
                         color: tab === 1 ? 'black' : 'text.secondary',
                         boxShadow: tab === 1 ? 2 : 0,
                         px: 3,
                         '&:hover': { bgcolor: tab === 1 ? 'white' : 'rgba(0,0,0,0.05)' }
                      }}
                   >
                      {t('pdf_tools.convert.tab_pdf_to_img')}
                   </Button>
                </Paper>
             </Box>

             <AnimatePresence mode="wait">
                <motion.div
                   key={tab}
                   initial={{ x: 10, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: -10, opacity: 0 }}
                   transition={{ duration: 0.2 }}
                >
                   {tab === 0 ? <ImageToPdfPanel /> : <PdfToImagePanel />}
                </motion.div>
             </AnimatePresence>

          </motion.div>
       </Container>
    </Box>
  );
}
