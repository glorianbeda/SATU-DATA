import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Button, TextField, IconButton, MenuItem, Switch, FormControlLabel, Paper, Typography, Divider, Fab, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotesIcon from '@mui/icons-material/Notes';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';

// Draggable Field Component with Inline Edit
function SortableField({ id, field, onDelete, onUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} id={id} className="mb-4">
      <Paper className="p-4 flex flex-col gap-3 relative border border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
        {/* Header: Drag Handle & Type */}
        <Box className="flex items-center justify-between">
           <Box className="flex items-center gap-2">
             <div {...attributes} {...listeners} className="cursor-move text-gray-400 p-1 hover:bg-gray-100 rounded">
               <DragIndicatorIcon />
             </div>
             <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">{field.type}</Typography>
           </Box>
           <IconButton onClick={() => onDelete(id)} size="small" color="error">
             <DeleteIcon fontSize="small" />
           </IconButton>
        </Box>

        {/* Inline Edit Content */}
        <Box className="flex flex-col md:flex-row gap-4 items-start md:items-center">
           {/* Question / Label */}
           <TextField
             label="Question / Label"
             value={field.label}
             onChange={(e) => onUpdate(id, { label: e.target.value })}
             fullWidth
             variant="outlined"
             size="small"
             className="flex-grow"
           />
           
           {/* Required Toggle */}
           <Box className="flex items-center flex-shrink-0">
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required}
                    onChange={(e) => onUpdate(id, { required: e.target.checked })}
                    size="small"
                  />
                }
                label="Wajib"
              />
           </Box>
        </Box>

        {/* Options for Select/Checkbox */}
        {(field.type === 'select' || field.type === 'checkbox') && (
           <Box className="bg-gray-50 p-3 rounded mt-2">
              <Typography variant="caption" className="mb-2 block text-gray-500 font-bold">Pilihan</Typography>
              <Box className="flex flex-col gap-2">
                  {field.options?.map((option, index) => (
                      <Box key={index} className="flex gap-2 items-center">
                          <TextField
                              fullWidth
                              size="small"
                              value={option}
                              onChange={(e) => {
                                  const newOptions = [...(field.options || [])];
                                  newOptions[index] = e.target.value;
                                  onUpdate(id, { options: newOptions });
                              }}
                              placeholder={`Pilihan ${index + 1}`}
                              variant="outlined"
                              className="bg-white"
                          />
                          <IconButton 
                              size="small" 
                              onClick={() => {
                                  const newOptions = field.options.filter((_, i) => i !== index);
                                  onUpdate(id, { options: newOptions });
                              }}
                              className="text-gray-400 hover:text-red-500"
                          >
                              <DeleteIcon fontSize="small" />
                          </IconButton>
                      </Box>
                  ))}
                  <Button 
                      startIcon={<AddIcon />} 
                      size="small" 
                      onClick={() => {
                          const newOptions = [...(field.options || []), `Pilihan ${(field.options?.length || 0) + 1}`];
                          onUpdate(id, { options: newOptions });
                      }}
                      className="self-start mt-1 normal-case text-blue-600 hover:bg-blue-50"
                  >
                      Tambah Pilihan
                  </Button>
              </Box>
           </Box>
        )}
      </Paper>
    </div>
  );
}

const FIELD_TYPES = [
  { type: 'text', label: 'Teks', icon: TextFieldsIcon },
  { type: 'number', label: 'Angka', icon: NumbersIcon },
  { type: 'date', label: 'Tanggal', icon: CalendarMonthIcon },
  { type: 'textarea', label: 'Teks Panjang', icon: NotesIcon },
  { type: 'select', label: 'Pilihan', icon: ArrowDropDownCircleIcon },
  { type: 'checkbox', label: 'Centang', icon: CheckBoxIcon },
];

const FormBuilder = ({ schema, onChange }) => {
  const [activeId, setActiveId] = useState(null);
  const { t } = useTranslation();
  const lastAddedRef = React.useRef(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = schema.findIndex((item) => item.id === active.id);
      const newIndex = schema.findIndex((item) => item.id === over.id);
      onChange(arrayMove(schema, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const addField = (type) => {
    const newFieldId = `field-${Date.now()}`;
    const newField = {
      id: newFieldId,
      type,
      label: `Pertanyaan Baru`,
      required: false,
      options: type === 'select' || type === 'checkbox' ? ['Pilihan 1'] : [],
    };
    onChange([...schema, newField]);
    
    // Store ID to scroll to after render
    lastAddedRef.current = newFieldId;
  };

  // Scroll to newly added field
  React.useEffect(() => {
    if (lastAddedRef.current) {
      const element = document.getElementById(lastAddedRef.current);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      lastAddedRef.current = null;
    }
  }, [schema]);

  const updateField = (id, updates) => {
    onChange(schema.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id) => {
    onChange(schema.filter(f => f.id !== id));
  };

  return (
    <Box className="flex flex-col md:flex-row gap-6 items-start relative">
      {/* Desktop Toolbox (Left Sidebar - Sticky) */}
      <Paper className="hidden md:flex w-64 p-4 flex-col gap-2 shrink-0 sticky top-20 self-start">
        <Typography variant="subtitle1" className="mb-2 font-bold text-gray-700">Tambah Elemen</Typography>
        {FIELD_TYPES.map((ft) => (
          <Button
            key={ft.type}
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => addField(ft.type)}
            className="justify-start text-left normal-case text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          >
            {ft.label}
          </Button>
        ))}
      </Paper>

      {/* Mobile Add Fields Button - Bottom Left */}
      <Fab
        aria-label="add field"
        onClick={() => setIsAddDrawerOpen(true)}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 9999,
          bgcolor: '#10b981',
          color: 'white',
          '&:hover': { bgcolor: '#059669' }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Mobile Add Fields Drawer (Bottom Sheet) */}
      <Drawer
        anchor="bottom"
        open={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        className="md:hidden"
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '60vh'
          }
        }}
      >
        <Box className="p-4">
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-bold">Tambah Kolom</Typography>
            <IconButton onClick={() => setIsAddDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <List disablePadding>
            {FIELD_TYPES.map((ft) => {
              const IconComponent = ft.icon;
              return (
                <ListItem key={ft.type} disablePadding className="mb-2">
                  <ListItemButton 
                    onClick={() => {
                      addField(ft.type);
                      setIsAddDrawerOpen(false);
                    }}
                    className="rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <ListItemIcon className="min-w-[40px]">
                      <IconComponent className="text-blue-600" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={ft.label} 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <Typography variant="caption" className="text-blue-500 font-medium uppercase tracking-wide">Tambah</Typography>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Canvas (Center - Grow naturally) */}
      <Box className="flex-grow w-full bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-inner min-h-[500px]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={schema.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full flex flex-col gap-4">
               {schema.length === 0 ? (
                  <Box className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <Typography>Formulir masih kosong</Typography>
                    <Typography variant="caption">Pilih elemen untuk ditambahkan</Typography>
                  </Box>
               ) : (
                 schema.map((field) => (
                    <SortableField
                      key={field.id}
                      id={field.id}
                      field={field}
                      onDelete={deleteField}
                      onUpdate={updateField}
                    />
                 ))
               )}
            </div>
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
};

export default FormBuilder;

