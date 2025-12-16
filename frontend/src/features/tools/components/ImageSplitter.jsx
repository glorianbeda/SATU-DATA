import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Slider,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  GridView as GridViewIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

// A4 dimensions at 300 DPI
const A4_WIDTH_PX = 2480;
const A4_HEIGHT_PX = 3508;
const A4_ASPECT_RATIO = A4_WIDTH_PX / A4_HEIGHT_PX; // ~0.707

// Preview cell size (scaled down for display)
const PREVIEW_CELL_WIDTH = 150;
const PREVIEW_CELL_HEIGHT = PREVIEW_CELL_WIDTH / A4_ASPECT_RATIO;

const ImageSplitter = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewCells, setPreviewCells] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Calculate grid dimensions
  const gridWidth = cols * PREVIEW_CELL_WIDTH;
  const gridHeight = rows * PREVIEW_CELL_HEIGHT;

  // Handle file upload
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
      setError(t('imageSplitter.invalidFile'));
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageData(event.target.result);
        setOffset({ x: 0, y: 0 });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }, [t]);

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = gridWidth;
    canvas.height = gridHeight;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, gridWidth, gridHeight);

    // Calculate scale to fit image
    const scale = Math.max(
      gridWidth / image.width,
      gridHeight / image.height
    );

    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    // Draw image with offset
    ctx.drawImage(
      image,
      offset.x,
      offset.y,
      scaledWidth,
      scaledHeight
    );

    // Draw grid overlay
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Draw vertical lines
    for (let i = 1; i < cols; i++) {
      const x = i * PREVIEW_CELL_WIDTH;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gridHeight);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = 1; i < rows; i++) {
      const y = i * PREVIEW_CELL_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(gridWidth, y);
      ctx.stroke();
    }

    // Draw border
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(0, 100, 255, 1)';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, gridWidth, gridHeight);
  }, [image, rows, cols, offset, gridWidth, gridHeight]);

  // Handle mouse drag for repositioning
  const handleMouseDown = useCallback((e) => {
    if (!image) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  }, [image, offset]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Generate split images
  const generateSplitImages = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    const cells = [];

    // Calculate the scale used in preview
    const scale = Math.max(
      gridWidth / image.width,
      gridHeight / image.height
    );

    // For each cell, calculate the source rectangle from the original image
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Create a canvas for each cell at A4 resolution
        const cellCanvas = document.createElement('canvas');
        cellCanvas.width = A4_WIDTH_PX;
        cellCanvas.height = A4_HEIGHT_PX;
        const ctx = cellCanvas.getContext('2d');

        // Calculate source position from preview
        const previewX = col * PREVIEW_CELL_WIDTH - offset.x;
        const previewY = row * PREVIEW_CELL_HEIGHT - offset.y;

        // Convert to original image coordinates
        const srcX = previewX / scale;
        const srcY = previewY / scale;
        const srcWidth = PREVIEW_CELL_WIDTH / scale;
        const srcHeight = PREVIEW_CELL_HEIGHT / scale;

        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

        // Draw the portion of the image
        ctx.drawImage(
          image,
          srcX,
          srcY,
          srcWidth,
          srcHeight,
          0,
          0,
          A4_WIDTH_PX,
          A4_HEIGHT_PX
        );

        // Get data URL for preview
        const dataUrl = cellCanvas.toDataURL('image/png');
        cells.push({
          row: row + 1,
          col: col + 1,
          dataUrl,
          canvas: cellCanvas,
        });
      }
    }

    setPreviewCells(cells);
    setShowPreviewModal(true);
    setIsProcessing(false);
  }, [image, rows, cols, offset, gridWidth, gridHeight]);

  // Download all cells as ZIP
  const downloadAsZip = useCallback(async () => {
    setIsProcessing(true);

    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const cell of previewCells) {
        // Convert canvas to blob
        const blob = await new Promise((resolve) => {
          cell.canvas.toBlob(resolve, 'image/png');
        });
        zip.file(`split_${cell.row}_${cell.col}.png`, blob);
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image_split_${rows}x${cols}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowPreviewModal(false);
    } catch (err) {
      console.error('Error creating ZIP:', err);
      setError('Failed to create ZIP file');
    }

    setIsProcessing(false);
  }, [previewCells, rows, cols]);

  // Download all cells as PDF (one page per cell, A4 size) with compression
  const downloadAsPdf = useCallback(async () => {
    setIsProcessing(true);

    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      
      // Create PDF with A4 size (210 x 297 mm) and compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      
      // Target resolution for PDF (150 DPI is good for print, much smaller than 300 DPI)
      const pdfWidth = 1240;
      const pdfHeight = 1754;

      // Process each cell with a small delay to prevent UI freeze
      for (let i = 0; i < previewCells.length; i++) {
        const cell = previewCells[i];
        
        // Add new page for cells after the first
        if (i > 0) {
          pdf.addPage();
        }

        // Create a smaller canvas for PDF to reduce file size
        const pdfCanvas = document.createElement('canvas');
        pdfCanvas.width = pdfWidth;
        pdfCanvas.height = pdfHeight;
        const pdfCtx = pdfCanvas.getContext('2d');
        
        // Draw the original cell canvas scaled down
        pdfCtx.drawImage(cell.canvas, 0, 0, pdfWidth, pdfHeight);
        
        // Convert to JPEG with compression
        const jpegDataUrl = pdfCanvas.toDataURL('image/jpeg', 0.8);

        // Add image to fill the entire A4 page
        pdf.addImage(
          jpegDataUrl,
          'JPEG',
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          'FAST'
        );
        
        // Yield to main thread every few pages to prevent freeze
        if (i % 2 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

      // Save PDF
      pdf.save(`image_split_${rows}x${cols}.pdf`);
      setShowPreviewModal(false);
    } catch (err) {
      console.error('Error creating PDF:', err);
      setError('Failed to create PDF file');
    }

    setIsProcessing(false);
  }, [previewCells, rows, cols]);

  // Reset
  const handleReset = useCallback(() => {
    setImage(null);
    setImageData(null);
    setOffset({ x: 0, y: 0 });
    setPreviewCells([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <Box className="p-6 max-w-6xl mx-auto">
      <Typography variant="h4" className="mb-6 font-bold text-gray-800 dark:text-white">
        {t('imageSplitter.title')}
      </Typography>

      <Paper className="p-6 mb-6 dark:bg-gray-800">
        {/* Controls */}
        <Box className="flex flex-wrap gap-4 mb-6 items-center">
          <Box className="flex items-center gap-2">
            <Typography className="text-gray-600 dark:text-gray-300">
              {t('imageSplitter.rows')}:
            </Typography>
            <TextField
              type="number"
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              inputProps={{ min: 1, max: 10 }}
              size="small"
              sx={{ width: 80 }}
            />
          </Box>

          <Box className="flex items-center gap-2">
            <Typography className="text-gray-600 dark:text-gray-300">
              {t('imageSplitter.columns')}:
            </Typography>
            <TextField
              type="number"
              value={cols}
              onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              inputProps={{ min: 1, max: 10 }}
              size="small"
              sx={{ width: 80 }}
            />
          </Box>

          <Typography className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <GridViewIcon fontSize="small" />
            {t('imageSplitter.gridSize')}: {cols}×{rows} = {cols * rows} {t('imageSplitter.cellSize')}
          </Typography>

          <Box className="flex-1" />

          {image && (
            <>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
              >
                {t('imageSplitter.reset')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                onClick={generateSplitImages}
                disabled={isProcessing}
              >
                {t('imageSplitter.exportAll')}
              </Button>
            </>
          )}
        </Box>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Upload or Canvas Area */}
        <Box
          ref={containerRef}
          className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden transition-all"
          sx={{
            minHeight: 400,
            backgroundColor: image ? '#f5f5f5' : 'transparent',
            cursor: image ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
          }}
          onClick={() => !image && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!image ? (
            <Box className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <UploadIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">{t('imageSplitter.uploadPrompt')}</Typography>
              <Typography variant="body2" className="mt-2 opacity-70">
                PNG, JPG, WEBP
              </Typography>
            </Box>
          ) : (
            <Box className="flex items-center justify-center p-4" style={{ minHeight: gridHeight + 40 }}>
              <canvas
                ref={canvasRef}
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          {image && (
            <Typography
              variant="caption"
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
            >
              {t('imageSplitter.dragToReposition')}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Preview Modal */}
      <Dialog
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{t('imageSplitter.preview')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-2">
            {previewCells.map((cell) => (
              <Grid item xs={6} sm={4} md={3} key={`${cell.row}-${cell.col}`}>
                <Card className="relative">
                  <CardMedia
                    component="img"
                    image={cell.dataUrl}
                    alt={`Cell ${cell.row}-${cell.col}`}
                    sx={{ aspectRatio: `${A4_WIDTH_PX}/${A4_HEIGHT_PX}` }}
                  />
                  <Typography
                    variant="caption"
                    className="absolute bottom-1 right-1 bg-black/60 text-white px-2 py-0.5 rounded"
                  >
                    {cell.row},{cell.col}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreviewModal(false)} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            onClick={downloadAsZip}
            disabled={isProcessing}
          >
            {t('imageSplitter.downloadZip')}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />}
            onClick={downloadAsPdf}
            disabled={isProcessing}
          >
            {t('imageSplitter.downloadPdf')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageSplitter;
