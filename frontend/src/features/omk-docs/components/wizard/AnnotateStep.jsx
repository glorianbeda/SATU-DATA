import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, TextField, Chip } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import DrawIcon from '@mui/icons-material/Draw';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import GestureIcon from '@mui/icons-material/Gesture';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import SignerListPanel from './SignerListPanel';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ANNOTATION_TYPES = {
  SIGNATURE: 'signature',
  DATE: 'date',
  TEXT: 'text',
  INITIAL: 'initial'
};

const ToolButton = ({ icon, label, onClick, active, disabled }) => (
  <Tooltip title={disabled ? 'Pilih penanda tangan dulu' : label} placement="left">
    <span>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          transition: 'all 0.2s',
          backgroundColor: active ? '#3b82f6' : 'grey.100',
          color: active ? 'white' : 'grey.600',
          opacity: disabled ? 0.5 : 1,
          '&:hover': {
            backgroundColor: active ? '#2563eb' : 'grey.200',
          }
        }}
      >
        {icon}
      </IconButton>
    </span>
  </Tooltip>
);

const getAnnotationDefaults = (type) => {
  switch (type) {
    case ANNOTATION_TYPES.SIGNATURE:
      return { borderColor: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)', width: 140, height: 70, minWidth: 50, minHeight: 30 };
    case ANNOTATION_TYPES.DATE:
      return { borderColor: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.2)', width: 120, height: 32, minWidth: 50, minHeight: 20 };
    case ANNOTATION_TYPES.TEXT:
      return { borderColor: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.2)', width: 150, height: 32, minWidth: 50, minHeight: 20 };
    case ANNOTATION_TYPES.INITIAL:
      return { borderColor: '#f97316', bgColor: 'rgba(249, 115, 22, 0.2)', width: 60, height: 60, minWidth: 30, minHeight: 30 };
    default:
      return { borderColor: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.2)', width: 100, height: 32, minWidth: 20, minHeight: 20 };
  }
};

const DraggableAnnotation = ({ 
  id, 
  type, 
  position, 
  width,
  height,
  signerName,
  onPositionChange, 
  onResize,
  onDelete, 
  onTextChange, 
  text 
}) => {
  const nodeRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDrag = (e, data) => {
    onPositionChange(id, { x: data.x, y: data.y });
  };

  const defaults = getAnnotationDefaults(type);
  const currentWidth = width || defaults.width;
  const currentHeight = height || defaults.height;

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = currentWidth;
    const startHeight = currentHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newWidth = Math.max(defaults.minWidth, startWidth + deltaX);
      const newHeight = Math.max(defaults.minHeight, startHeight + deltaY);
      
      onResize(id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getLabel = () => {
    switch (type) {
      case ANNOTATION_TYPES.SIGNATURE:
        return 'Tanda Tangan';
      case ANNOTATION_TYPES.DATE:
        return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      case ANNOTATION_TYPES.TEXT:
        return text || 'Teks';
      case ANNOTATION_TYPES.INITIAL:
        return 'Paraf';
      default:
        return '';
    }
  };

  return (
    <Draggable
      bounds="parent"
      position={position}
      onStop={handleDrag}
      nodeRef={nodeRef}
      cancel=".resize-handle" // Prevent dragging when clicking resize handle
    >
      <div
        ref={nodeRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: `2px solid ${defaults.borderColor}`,
          backgroundColor: defaults.bgColor,
          width: currentWidth,
          height: currentHeight,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'move',
          zIndex: 10,
        }}
        className="group"
      >
        {/* Signer Badge - Show for signature/initial types */}
        {signerName && (type === ANNOTATION_TYPES.SIGNATURE || type === ANNOTATION_TYPES.INITIAL) && (
          <div 
            style={{
              position: 'absolute',
              top: -10,
              left: 4,
              backgroundColor: defaults.borderColor,
              color: 'white',
              fontSize: 9,
              padding: '2px 6px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <PersonIcon style={{ fontSize: 10 }} />
            {signerName}
          </div>
        )}

        {/* Delete button */}
        <div 
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onDelete(id); }}
        >
          <DeleteIcon className="text-white text-xs" style={{ fontSize: 14 }} />
        </div>

        {/* Resize Handle */}
        <div
          className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        >
           <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>

        {type === ANNOTATION_TYPES.TEXT && isEditing ? (
          <TextField
            size="small"
            value={text}
            onChange={(e) => onTextChange(id, e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="bg-white rounded text-xs"
            inputProps={{ style: { fontSize: 12, padding: '2px 8px' } }}
          />
        ) : (
          <Typography 
            variant="caption" 
            sx={{ fontWeight: 'bold', textAlign: 'center', px: 1 }}
            onClick={() => type === ANNOTATION_TYPES.TEXT && setIsEditing(true)}
          >
            {getLabel()}
          </Typography>
        )}
      </div>
    </Draggable>
  );
};

const AnnotateStep = ({ document, annotations, onAnnotationsChange, mode, currentUser, signers }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedSigner, setSelectedSigner] = useState(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const containerRef = useRef(null);
  const pdfContainerRef = useRef(null);

  const isSelfMode = mode === 'self';

  // Calculate container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (pdfContainerRef.current) {
        // Get actual available width minus padding and potential scrollbar
        const width = pdfContainerRef.current.clientWidth - 50; // Subtract padding + scrollbar safety
        setContainerWidth(Math.max(300, Math.min(width, 900))); // Min 300, max 900
      }
    };

    // Small delay to ensure layout is complete
    const timeoutId = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const fileUrl = document ? `${import.meta.env.VITE_API_URL}${document.filePath}` : null;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageLoadSuccess = (page) => {
    setPdfDimensions({ width: page.width, height: page.height });
  };

  const getRefDimensions = () => {
    if (!pdfDimensions.width) return { width: 600, height: 800 };
    const height = containerWidth * (pdfDimensions.height / pdfDimensions.width);
    return { width: containerWidth, height };
  };

  const handleCanvasClick = useCallback((e) => {
    if (!selectedTool) return;
    
    // For signature/initial in request mode, require signer selection
    if (!isSelfMode && 
        (selectedTool === ANNOTATION_TYPES.SIGNATURE || selectedTool === ANNOTATION_TYPES.INITIAL) && 
        !selectedSigner) {
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Determine signer
    let signerId = null;
    let signerName = null;
    
    if (isSelfMode && currentUser) {
      signerId = currentUser.id;
      signerName = currentUser.name;
    } else if (selectedSigner) {
      signerId = selectedSigner.id;
      signerName = selectedSigner.name;
    }

    const defaults = getAnnotationDefaults(selectedTool);
    const { width: refWidth, height: refHeight } = getRefDimensions();

    const newAnnotation = {
      id: `${selectedTool}-${Date.now()}`,
      type: selectedTool,
      position: { x, y },
      width: defaults.width,
      height: defaults.height,
      refWidth,
      refHeight,
      page: pageNumber,
      text: selectedTool === ANNOTATION_TYPES.TEXT ? 'Teks...' : '',
      signerId,
      signerName
    };

    onAnnotationsChange([...annotations, newAnnotation]);
    setSelectedTool(null);
  }, [selectedTool, pageNumber, annotations, onAnnotationsChange, selectedSigner, isSelfMode, currentUser, containerWidth, pdfDimensions]);

  const handlePositionChange = (id, position) => {
    const { width: refWidth, height: refHeight } = getRefDimensions();
    const updated = annotations.map(a => 
      a.id === id ? { ...a, position, refWidth, refHeight } : a
    );
    onAnnotationsChange(updated);
  };

  const handleResize = (id, size) => {
    const { width: refWidth, height: refHeight } = getRefDimensions();
    const updated = annotations.map(a => 
      a.id === id ? { ...a, ...size, refWidth, refHeight } : a
    );
    onAnnotationsChange(updated);
  };

  const handleDelete = (id) => {
    onAnnotationsChange(annotations.filter(a => a.id !== id));
  };

  const handleTextChange = (id, text) => {
    const updated = annotations.map(a => 
      a.id === id ? { ...a, text } : a
    );
    onAnnotationsChange(updated);
  };

  const currentPageAnnotations = annotations.filter(a => a.page === pageNumber);

  const tools = [
    { type: ANNOTATION_TYPES.SIGNATURE, icon: <DrawIcon />, label: 'Tanda Tangan', requiresSigner: true },
    { type: ANNOTATION_TYPES.DATE, icon: <CalendarTodayIcon />, label: 'Tanggal', requiresSigner: false },
    { type: ANNOTATION_TYPES.TEXT, icon: <TextFieldsIcon />, label: 'Teks', requiresSigner: false },
    { type: ANNOTATION_TYPES.INITIAL, icon: <GestureIcon />, label: 'Paraf', requiresSigner: true },
  ];

  const isToolDisabled = (tool) => {
    if (isSelfMode) return false;
    return tool.requiresSigner && !selectedSigner;
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%', overflow: 'hidden' }}>
      {/* Signer Panel - Only show in request mode */}
      {!isSelfMode && (
        <Paper 
          elevation={0} 
          sx={{ 
            width: 180, 
            p: 2, 
            borderRadius: 3, 
            backgroundColor: 'grey.50',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <SignerListPanel 
            users={signers}
            selectedSigner={selectedSigner}
            onSignerSelect={setSelectedSigner}
          />
        </Paper>
      )}

      {/* PDF Viewer */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box className="flex items-center justify-between mb-2">
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {isSelfMode ? 'Tempatkan Tanda Tangan' : 'Tempatkan Anotasi'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isSelfMode 
                ? 'Klik tool lalu klik pada dokumen'
                : 'Pilih penanda tangan → Klik tool → Klik dokumen'
              }
            </Typography>
          </Box>
          
          {/* Page Navigation + Selected Signer Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small"
                disabled={pageNumber <= 1} 
                onClick={() => setPageNumber(p => p - 1)}
                sx={{ backgroundColor: 'grey.100' }}
              >
                ←
              </IconButton>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {pageNumber}/{numPages || '?'}
              </Typography>
              <IconButton 
                size="small"
                disabled={pageNumber >= numPages} 
                onClick={() => setPageNumber(p => p + 1)}
                sx={{ backgroundColor: 'grey.100' }}
              >
                →
              </IconButton>
            </Box>
            {!isSelfMode && selectedSigner && (
              <Chip 
                icon={<PersonIcon />}
                label={selectedSigner.name}
                color="primary"
                size="small"
              />
            )}
          </Box>
        </Box>



        {/* PDF Canvas */}
        <Paper 
          ref={pdfContainerRef}
          elevation={0} 
          sx={{ 
            backgroundColor: 'grey.100', 
            p: 2, 
            borderRadius: 3,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            maxHeight: 'calc(100vh - 180px)',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {fileUrl && (
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Box 
                ref={containerRef}
                sx={{ 
                  position: 'relative', 
                  boxShadow: 3, 
                  cursor: selectedTool ? 'crosshair' : 'default' 
                }}
                onClick={handleCanvasClick}
              >
                <Page
                  pageNumber={pageNumber}
                  onLoadSuccess={handlePageLoadSuccess}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={containerWidth}
                />
                
                {/* Render Annotations */}
                {currentPageAnnotations.map(annotation => (
                  <DraggableAnnotation
                    key={annotation.id}
                    id={annotation.id}
                    type={annotation.type}
                    position={annotation.position}
                    width={annotation.width}
                    height={annotation.height}
                    text={annotation.text}
                    signerName={annotation.signerName}
                    onPositionChange={handlePositionChange}
                    onResize={handleResize}
                    onDelete={handleDelete}
                    onTextChange={handleTextChange}
                  />
                ))}
              </Box>
            </Document>
          )}
        </Paper>
      </Box>

      {/* Tools Panel */}
      <Paper 
        elevation={0} 
        sx={{ 
          width: 72, 
          backgroundColor: 'grey.50', 
          borderRadius: 3, 
          p: 1.5, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 1.5 
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1 }}>
          TOOLS
        </Typography>
        
        {tools.map(tool => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            label={tool.label}
            active={selectedTool === tool.type}
            disabled={isToolDisabled(tool)}
            onClick={() => setSelectedTool(selectedTool === tool.type ? null : tool.type)}
          />
        ))}

        <Box sx={{ flex: 1 }} />
        
        <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.disabled', fontSize: '0.7rem' }}>
          {annotations.length} item
        </Typography>
      </Paper>
    </Box>
  );
};

export default AnnotateStep;
