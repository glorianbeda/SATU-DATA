import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Tooltip,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CallSplit as SplitIcon,
  Clear as ClearIcon,
  SelectAll as SelectAllIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CheckablePage = ({ index, checked, onToggle, t }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Paper
        onClick={() => onToggle(index)}
        elevation={checked ? 8 : 1}
        sx={{
          width: { xs: 140, sm: 160, md: 200 },
          m: 1,
          position: 'relative',
          cursor: 'pointer',
          borderRadius: 4,
          border: '2px solid',
          borderColor: checked ? 'primary.main' : 'transparent',
          overflow: 'hidden',
          transition: 'all 0.2s',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
           <Checkbox 
              checked={checked} 
              icon={<UncheckedIcon sx={{ color: 'grey.400', bgcolor: 'white', borderRadius: '50%' }} />}
              checkedIcon={<CheckCircleIcon sx={{ color: 'primary.main', bgcolor: 'white', borderRadius: '50%', boxShadow: 2 }} />}
              disableRipple
           />
        </Box>
        <Box sx={{ p: 2, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa', opacity: checked ? 1 : 0.7 }}>
          <Page
            pageIndex={index}
            width={100}
            renderTextLayer={false}
            renderAnnotationLayer={false}
             className="shadow-sm rounded"
          />
        </Box>
        <Box sx={{ 
           bgcolor: checked ? 'primary.main' : 'white', 
           color: checked ? 'white' : 'text.secondary', 
           textAlign: 'center',
           py: 1,
           fontSize: '0.8rem',
           fontWeight: 'bold',
           borderTop: '1px solid',
           borderColor: 'divider'
        }}>
           {t('pdf_tools.common.page')} {index + 1}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default function PDFSplitter() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setSelectedIndices(new Set());
      setNumPages(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleToggle = (index) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIndices.size === numPages) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(Array.from({ length: numPages }, (_, i) => i)));
    }
  };

  const handleClear = () => {
    setFile(null);
    setNumPages(0);
    setSelectedIndices(new Set());
  };

  const handleExtractOne = async () => {
    if (!file || selectedIndices.size === 0) return;
    setIsProcessing(true);
    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFDocument.create();

      const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, sortedIndices);

      copiedPages.forEach((page) => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `extracted-${file.name}`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractSeparate = async () => {
    if (!file || selectedIndices.size === 0) return;
    setIsProcessing(true);
    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const zip = new JSZip();

      const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);

      for (const idx of sortedIndices) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(pdfDoc, [idx]);
        newDoc.addPage(page);
        const pdfBytes = await newDoc.save();
        zip.file(`page-${idx + 1}.pdf`, pdfBytes);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `split-${file.name.replace('.pdf', '')}.zip`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

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
                  {t('pdf_tools.split.title')}
               </Typography>
               <Typography variant="body1" align="center" sx={{ color: '#86868b', mb: 6 }}>
                  {t('pdf_tools.split.subtitle')}
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
         {/* Header */}
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
                   <PdfIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                   <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: { xs: 200, md: 400 } }}>
                      {file.name}
                   </Typography>
                   <Typography variant="caption" color="text.secondary">
                      {t('pdf_tools.split.selected_count', { count: selectedIndices.size, total: numPages })}
                   </Typography>
                </Box>
             </Stack>
             <Button size="small" onClick={handleSelectAll} sx={{ fontWeight: 'bold' }}>
                {selectedIndices.size === numPages ? t('pdf_tools.split.deselect_all') : t('pdf_tools.split.select_all')}
             </Button>
         </Box>

         <Container maxWidth="xl" sx={{ py: 4, pb: 24 }}>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                  {Array.from({ length: numPages }, (_, i) => (
                    <CheckablePage
                      key={i}
                      index={i}
                      checked={selectedIndices.has(i)}
                      onToggle={handleToggle}
                      t={t}
                    />
                  ))}
                </Box>
            </Document>
         </Container>

         {/* Bottom Bar */}
         <Box sx={{ 
           position: 'fixed', bottom: 50, left: 0, right: 0, 
           display: 'flex', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none', px: 2
        }}>
           <Paper 
              elevation={24}
              sx={{ 
                 pointerEvents: 'auto',
                 borderRadius: 100,
                 bgcolor: '#1d1d1f',
                 color: 'white',
                 px: 1, py: 1,
                 display: 'flex', alignItems: 'center', gap: 1,
                 maxWidth: '100%',
                 overflowX: 'auto'
              }}
           >
              <Button 
                 color="inherit" 
                 onClick={handleClear}
                 startIcon={<ClearIcon />}
                 sx={{ borderRadius: 100, px: 2, minWidth: 'auto', color: 'grey.500' }}
              >
                 {isMobile ? '' : t('pdf_tools.common.cancel')}
              </Button>
              <Button
                 variant="contained"
                 color="primary"
                 onClick={handleExtractOne}
                 disabled={selectedIndices.size === 0 || isProcessing}
                 startIcon={!isProcessing && <DownloadIcon />}
                 sx={{ borderRadius: 100, px: 3, textTransform: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                 {isProcessing ? t('pdf_tools.common.processing') : (isMobile ? t('pdf_tools.split.merge') : t('pdf_tools.split.action_merge'))}
              </Button>
              <Button
                 variant="contained"
                 color="primary"
                 onClick={handleExtractSeparate}
                 disabled={selectedIndices.size === 0 || isProcessing}
                 startIcon={!isProcessing && <SplitIcon />}
                 sx={{ borderRadius: 100, px: 3, textTransform: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                 {isProcessing ? t('pdf_tools.common.processing') : (isMobile ? t('pdf_tools.split.split') : t('pdf_tools.split.action_zip'))}
              </Button>
           </Paper>
        </Box>
         </>
      )}
    </Box>
  );
}
