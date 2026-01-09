import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { pdfjs } from 'react-pdf';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Slider,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Compress as CompressIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  PictureAsPdf as PictureAsPdfIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFCompress() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedPdf, setCompressedPdf] = useState(null);
  const [stats, setStats] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setCompressedPdf(null);
      setStats(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setCompressedPdf(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      const doc = new jsPDF();
      doc.deletePage(1);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        // Dynamic scale based on quality: 0.1 -> ~1.2, 1.0 -> ~3.0
        const scale = 1.0 + (quality * 2.0);
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const imgData = canvas.toDataURL('image/jpeg', quality);
        
        const originalViewport = page.getViewport({ scale: 1.0 });
        const width = originalViewport.width; 
        const height = originalViewport.height;
        
        doc.addPage([width, height], width > height ? 'l' : 'p');
        doc.addImage(imgData, 'JPEG', 0, 0, width, height);
      }

      const output = doc.output('blob');
      const reducedSize = output.size;
      const originalSize = file.size;
      const reduction = ((originalSize - reducedSize) / originalSize) * 100;

      setStats({
         original: originalSize,
         compressed: reducedSize,
         percent: reduction.toFixed(1)
      });
      setCompressedPdf(output);

    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
     if (compressedPdf) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedPdf);
        link.download = `compressed-${file.name}`;
        link.click();
     }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedPdf(null);
    setStats(null); 
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
                 {t('pdf_tools.compress.title')}
              </Typography>
              <Typography variant="body1" align="center" sx={{ color: '#86868b', mb: 6 }}>
                 {t('pdf_tools.compress.subtitle')}
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
                     {stats ? t('pdf_tools.compress.stat_compressed') : t('pdf_tools.compress.stat_original')}: {stats ? (stats.compressed/1024/1024).toFixed(2) : (file.size/1024/1024).toFixed(2)} MB
                  </Typography>
               </Box>
            </Stack>
            {stats && (
               <Chip 
                  label={t('pdf_tools.compress.reduced_msg', { percent: stats.percent })} 
                  color="primary" 
                  size="small" 
                  sx={{ fontWeight: 'bold', color: 'white' }} 
               />
            )}
         </Box>

         <Container maxWidth="md" sx={{ py: 6, pb: 24 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <Paper sx={{ p: 4, borderRadius: 6, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                  
                  {stats ? (
                     <Box sx={{ py: 2 }}>
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                           <Typography variant="h3" fontWeight="900" color="primary.main" gutterBottom>
                              {t('pdf_tools.compress.reduced_msg', { percent: stats.percent })} 🚀
                           </Typography>
                           <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                              {t('pdf_tools.compress.subtitle')}
                           </Typography>

                           <Paper elevation={0} sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 4, display: 'inline-block', minWidth: 200 }}>
                              <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
                                 <Box textAlign="center">
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                       {t('pdf_tools.compress.stat_original')}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                                       {(stats.original/1024/1024).toFixed(2)} MB
                                    </Typography>
                                 </Box>
                                 
                                 <Typography variant="h4" color="text.secondary">→</Typography>
                                 
                                 <Box textAlign="center">
                                    <Typography variant="caption" color="primary.main" fontWeight="bold">
                                       {t('pdf_tools.compress.stat_compressed')}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                       {(stats.compressed/1024/1024).toFixed(2)} MB
                                    </Typography>
                                 </Box>
                              </Stack>
                           </Paper>
                        </motion.div>
                     </Box>
                  ) : (
                     <Box>
                        <Typography gutterBottom variant="h6" fontWeight="bold" color="text.secondary">
                           {t('pdf_tools.compress.target_quality')}
                        </Typography>
                        <Typography variant="h3" fontWeight="900" color="primary.main" gutterBottom>
                            {Math.round(quality * 100)}%
                        </Typography>
                        
                        <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
                           <Slider
                              value={quality}
                              min={0.1}
                              max={1.0}
                              step={0.1}
                              onChange={(e, v) => setQuality(v)}
                              sx={{ 
                                 height: 8, 
                                 '& .MuiSlider-thumb': { width: 28, height: 28, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' },
                                 '& .MuiSlider-rail': { opacity: 0.2 }
                              }}
                           />
                           <Stack direction="row" justifyContent="space-between" mt={1}>
                              <Typography variant="caption" fontWeight="bold" color="text.secondary">{t('pdf_tools.compress.high_compression')}</Typography>
                              <Typography variant="caption" fontWeight="bold" color="text.secondary">{t('pdf_tools.compress.high_quality')}</Typography>
                           </Stack>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                           {t('pdf_tools.compress.helper_text')}
                        </Typography>
                     </Box>
                  )}
               </Paper>
            </motion.div>
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
                   startIcon={<ClearIcon />}
                   sx={{ borderRadius: 100, px: 3, textTransform: 'none', color: 'grey.400' }}
                >
                   {t('pdf_tools.common.cancel')}
                </Button>
                <Button 
                   variant="contained" 
                   color="primary"
                   onClick={stats ? handleDownload : handleCompress}
                   disabled={isProcessing}
                   startIcon={isProcessing ? <CircularProgress size={16} color="inherit"/> : (stats ? <DownloadIcon /> : <CompressIcon />)}
                   sx={{ borderRadius: 100, px: 4, textTransform: 'none', fontWeight: 'bold' }}
                >
                   {isProcessing ? t('pdf_tools.common.processing') : (stats ? t('pdf_tools.compress.button_download') : t('pdf_tools.compress.button_action'))}
                </Button>
             </Paper>
         </Box>
         </>
      )}
    </Box>
  );
}
