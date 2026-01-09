import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Paper, TextField, Button, IconButton,
  CircularProgress, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Tooltip, ToggleButtonGroup, ToggleButton, InputAdornment,
  Skeleton, useMediaQuery, useTheme, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { useLayout } from '~/context/LayoutContext';
import { useAlert } from '~/context/AlertContext';

const PRIORITY_COLORS = {
  HIGH: { bg: '#fee2e2', color: '#dc2626', label: 'High' },
  MEDIUM: { bg: '#fef3c7', color: '#d97706', label: 'Medium' },
  LOW: { bg: '#dcfce7', color: '#16a34a', label: 'Low' },
};

const STATUS_CONFIG = {
  PENDING: { label: 'Menunggu', color: '#f97316' },
  IN_PROGRESS: { label: 'Dalam Proses', color: '#3b82f6' },
  COMPLETED: { label: 'Selesai', color: '#22c55e' },
};

// Task Card Component
function TaskCard({ task, onClick, isDragging }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
  const priority = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM;

  return (
    <Paper
      elevation={isDragging ? 8 : 1}
      onClick={onClick}
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        borderRadius: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        bgcolor: 'background.paper',
        borderLeft: `4px solid ${priority.color}`,
        opacity: isDragging ? 0.8 : 1,
        transform: isDragging ? 'scale(1.05) rotate(2deg)' : 'none',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        position: 'relative',
        touchAction: 'none', // Prevent scrolling while dragging
        '&:hover': { 
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
        '&:active': { cursor: 'grabbing' },
      }}
    >
      {/* Assignee Avatar */}
      {task.assignee && (
        <Tooltip title={`Assigned to ${task.assignee.name}`}>
          <Box sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: 1
          }}>
            {task.assignee.name.charAt(0).toUpperCase()}
          </Box>
        </Tooltip>
      )}
      {/* Category & Priority */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
        {task.category && (
          <Chip 
            label={task.category} 
            size="small" 
            sx={{ fontSize: '0.7rem', height: 20 }} 
          />
        )}
        <Chip 
          label={priority.label}
          size="small"
          sx={{ 
            fontSize: '0.7rem', 
            height: 20,
            bgcolor: priority.bg,
            color: priority.color,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Title */}
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontWeight: 600, 
          mb: 0.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {task.title}
      </Typography>

      {/* Description */}
      {task.description && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
            fontSize: '0.75rem',
          }}
        >
          {task.description}
        </Typography>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 14, color: isOverdue ? 'error.main' : 'text.secondary' }} />
          <Typography 
            variant="caption" 
            sx={{ color: isOverdue ? 'error.main' : 'text.secondary', fontWeight: isOverdue ? 600 : 400 }}
          >
            {new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </Typography>
          {isOverdue && <Chip label="Overdue" size="small" color="error" sx={{ height: 16, fontSize: '0.6rem' }} />}
        </Box>
      )}

      {/* Completed At */}
      {task.status === 'COMPLETED' && task.completedAt && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
          <Typography variant="caption" color="success.main">
            Selesai {new Date(task.completedAt).toLocaleDateString('id-ID')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// Sortable Task Wrapper
function SortableTask({ task, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={() => onEdit(task)} isDragging={isDragging} />
    </Box>
  );
}

// Empty State Illustration
function EmptyState({ text, icon = '📋' }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4,
      px: 2,
    }}>
      <Box sx={{ fontSize: 48, mb: 1, opacity: 0.6 }}>{icon}</Box>
      <Typography sx={{ color: 'grey.500', textAlign: 'center', fontStyle: 'italic' }}>
        {text}
      </Typography>
    </Box>
  );
}

// Loading Skeleton for Task Cards
function TaskSkeleton() {
  return (
    <Paper sx={{ p: 2, mb: 1.5, borderRadius: 2, borderLeft: '4px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        <Skeleton variant="rounded" width={60} height={20} />
        <Skeleton variant="rounded" width={50} height={20} />
      </Box>
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="60%" height={16} />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Skeleton variant="text" width={80} height={16} />
      </Box>
    </Paper>
  );
}

// Kanban Column Skeleton
function KanbanColumnSkeleton({ color }) {
  return (
    <Box sx={{ 
      flex: { xs: '1 1 auto', md: 1 }, 
      minWidth: { xs: '100%', sm: 280 }, 
      maxWidth: { xs: '100%', md: 350 },
      width: { xs: '100%', sm: 'auto' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, borderRadius: 2, bgcolor: color }}>
        <Skeleton variant="text" width={100} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
        <Box sx={{ ml: 'auto' }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
        </Box>
      </Box>
      <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'grey.100' }}>
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </Box>
    </Box>
  );
}

// Droppable Column
function KanbanColumn({ id, title, tasks, color, onEdit, emptyText }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const taskIds = tasks.map(t => String(t.id));
  
  const emptyIcons = {
    PENDING: '📝',
    IN_PROGRESS: '⏳',
    COMPLETED: '✅',
  };

  return (
    <Box sx={{ 
      flex: { xs: '1 1 auto', md: 1 }, 
      minWidth: { xs: '100%', sm: 280 }, 
      maxWidth: { xs: '100%', md: 350 },
      width: { xs: '100%', sm: 'auto' }
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 2, 
        p: 1.5, 
        borderRadius: 2, 
        bgcolor: color,
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', flex: 1 }}>
          {title}
        </Typography>
        <Chip 
          label={tasks.length} 
          size="small" 
          sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600 }} 
        />
      </Box>

      <Box
        ref={setNodeRef}
        sx={{
          minHeight: 200,
          p: 1,
          borderRadius: 2,
          bgcolor: isOver ? 'action.selected' : 'grey.100',
          border: isOver ? '2px dashed' : '2px solid transparent',
          borderColor: isOver ? 'primary.main' : 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <EmptyState text={emptyText} icon={emptyIcons[id] || '📋'} />
          ) : (
            tasks.map(task => (
              <SortableTask key={task.id} task={task} onEdit={onEdit} />
            ))
          )}
        </SortableContext>
      </Box>
    </Box>
  );
}

// Task Edit Modal
function TaskEditModal({ open, task, onClose, onSave, onDelete, listId }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: '',
    dueDate: '',
    status: 'PENDING',
    assigneeId: '',
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (open && listId) {
      // Fetch members for assignment
      axios.get(`${import.meta.env.VITE_API_URL}/api/task-lists/${listId}/members`, { withCredentials: true })
        .then(res => setMembers(res.data.members || []))
        .catch(console.error);
    }
  }, [open, listId]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        category: task.category || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status || 'PENDING',
        assigneeId: task.assignee?.id || '',
      });
    }
  }, [task]);

  const handleSave = () => {
    onSave({ ...task, ...form, dueDate: form.dueDate || null });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {task?.id ? 'Edit Task' : 'New Task'}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          margin="normal"
          multiline
          rows={3}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={form.priority}
              label="Priority"
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Design, Research, QA..."
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <FormControl fullWidth margin="normal">
          <InputLabel>Assignee</InputLabel>
          <Select
            value={form.assigneeId}
            label="Assignee"
            onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {members.map(m => (
              <MenuItem key={m.userId} value={m.userId}>{m.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        {task?.id && (
          <Button onClick={() => onDelete(task.id)} color="error" sx={{ mr: 'auto' }}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!form.title.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// TaskList Manage Modal
function TaskListModal({ open, list, onClose, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (list) {
      setName(list.name || '');
      setDescription(list.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [list]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{list?.id ? 'Edit List' : 'New List'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} required margin="normal"
        />
        <TextField
          fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" multiline rows={2}
        />
      </DialogContent>
      <DialogActions>
        {list?.id && (
          <Button onClick={() => onDelete(list.id)} color="error" sx={{ mr: 'auto' }}>Delete</Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave({ ...list, name, description })} variant="contained" disabled={!name.trim()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

// Member Manage Modal
function MemberModal({ open, listId, onClose }) {
  const { showSuccess, showError } = useAlert();
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/task-lists/${listId}/members`, { withCredentials: true });
      setMembers(res.data.members || []);
    } catch (err) {
      showError('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [listId, showError]);

  useEffect(() => {
    if (open && listId) fetchMembers();
  }, [open, listId, fetchMembers]);

  const handleInvite = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/task-lists/${listId}/members`, { email: inviteEmail, permission: 'EDITOR' }, { withCredentials: true });
      showSuccess('Member invited');
      setInviteEmail('');
      fetchMembers();
    } catch (err) {
      showError('Failed to invite member');
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/task-lists/${listId}/members/${userId}`, { withCredentials: true });
      showSuccess('Member removed');
      fetchMembers();
    } catch (err) {
      showError('Failed to remove member');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Valid Members</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField 
            fullWidth size="small" label="Invite by Email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@example.com"
          />
          <Button variant="contained" onClick={handleInvite} disabled={!inviteEmail}>Invite</Button>
        </Box>
        {loading ? <CircularProgress /> : (
          <Box>
            {members.map(m => (
              <Box key={m.userId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '1px solid #eee' }}>
                <Box>
                  <Typography variant="subtitle2">{m.name} {m.isOwner && '(Owner)'}</Typography>
                  <Typography variant="caption" color="text.secondary">{m.email}</Typography>
                </Box>
                {!m.isOwner && (
                  <IconButton size="small" onClick={() => handleRemove(m.userId)} color="error"><DeleteIcon /></IconButton>
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}

// User Tips Modal
function TipsModal({ open, onClose }) {
  const tips = [
    { icon: '🖱️', text: 'Drag task ke kolom lain untuk ubah status' },
    { icon: '👆', text: 'Klik task untuk edit detail' },
    { icon: '🔍', text: 'Gunakan filter untuk fokus pada prioritas tertentu' },
    { icon: '📅', text: 'Set due date agar tidak lupa deadline' },
    { icon: '📊', text: 'Switch view mode sesuai preferensi' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>💡 Tips Penggunaan</DialogTitle>
      <DialogContent>
        {tips.map((tip, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Typography variant="h5">{tip.icon}</Typography>
            <Typography variant="body2">{tip.text}</Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Mengerti</Button>
      </DialogActions>
    </Dialog>
  );
}

// Main Component
function TodoPage() {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { showSuccess, showError } = useAlert();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tasks, setTasks] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(() => {
    const saved = localStorage.getItem('selectedTaskListId');
    return saved ? parseInt(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('todoViewMode') || 'kanban');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [showTips, setShowTips] = useState(() => !localStorage.getItem('todoTipsShown'));
  const [activeTask, setActiveTask] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    setTitle(t('todo.title') || 'To-Do List');
  }, [t, setTitle]);

  useEffect(() => {
    localStorage.setItem('todoViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (selectedListId) {
      localStorage.setItem('selectedTaskListId', String(selectedListId));
    }
  }, [selectedListId]);

  // Fetch TaskLists on mount
  const fetchTaskLists = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task-lists`,
        { withCredentials: true }
      );
      const lists = res.data.taskLists || [];
      setTaskLists(lists);
      // Auto-select first list if none selected
      if (lists.length > 0 && !selectedListId) {
        setSelectedListId(lists[0].id);
      }
    } catch (err) {
      showError('Failed to load task lists');
    }
  }, [selectedListId, showError]);

  useEffect(() => {
    fetchTaskLists();
  }, [fetchTaskLists]);

  const fetchTasks = useCallback(async () => {
    if (!selectedListId) {
      setLoading(false);
      return;
    }
    try {
      const params = new URLSearchParams();
      params.append('taskListId', String(selectedListId));
      if (search) params.append('search', search);
      if (filterPriority) params.append('priority', filterPriority);
      if (assignedToMe) params.append('assignedToMe', 'true');
      if (sortBy) params.append('sortBy', sortBy);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks?${params.toString()}`,
        { withCredentials: true }
      );
      setTasks(res.data.tasks || []);
    } catch (err) {
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [selectedListId, search, filterPriority, assignedToMe, sortBy, showError]);

  useEffect(() => {
    if (selectedListId) {
      setLoading(true);
      fetchTasks();
    }
  }, [selectedListId, fetchTasks]);

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tasks/${taskData.id}`,
          taskData,
          { withCredentials: true }
        );
        showSuccess('Task updated');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/tasks`,
          { ...taskData, taskListId: selectedListId },
          { withCredentials: true }
        );
        showSuccess('Task created');
      }
      fetchTasks();
      setEditTask(null);
    } catch (err) {
      showError('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, { withCredentials: true });
      showSuccess('Task deleted');
      fetchTasks();
      setEditTask(null);
    } catch (err) {
      showError('Failed to delete task');
    }
  };

  const handleDragStart = (event) => {
    const task = tasks.find(t => String(t.id) === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    // Dropped on column
    if (['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(overId)) {
      const task = tasks.find(t => String(t.id) === activeTaskId);
      if (task && task.status !== overId) {
        try {
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/tasks/${task.id}`,
            { status: overId },
            { withCredentials: true }
          );
          fetchTasks();
        } catch (err) {
          showError('Failed to update status');
        }
      }
      return;
    }

    // Reorder
    if (activeTaskId !== overId) {
      const oldIndex = tasks.findIndex(t => String(t.id) === activeTaskId);
      const newIndex = tasks.findIndex(t => String(t.id) === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        setTasks(newTasks);
        try {
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/tasks/reorder`,
            { taskListId: selectedListId, tasks: newTasks.map((t, i) => ({ id: t.id, status: t.status, order: i })) },
            { withCredentials: true }
          );
        } catch (err) {
          fetchTasks();
        }
      }
    }
  };

  const handleSaveList = async (listData) => {
    try {
      if (listData.id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/task-lists/${listData.id}`, listData, { withCredentials: true });
        showSuccess('List updated');
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/task-lists`, listData, { withCredentials: true });
        // Add new list and select it
        const newList = res.data;
        setTaskLists(prev => [newList, ...prev]);
        setSelectedListId(newList.id);
        showSuccess('List created');
      }
      fetchTaskLists();
      setShowListModal(false);
    } catch (err) {
      showError('Failed to save list');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm('Delete this list?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/task-lists/${listId}`, { withCredentials: true });
      showSuccess('List deleted');
      setTaskLists(prev => prev.filter(l => l.id !== listId));
      if (selectedListId === listId) setSelectedListId(taskLists[0]?.id || null);
      setShowListModal(false);
    } catch (err) {
      showError('Failed to delete list');
    }
  };

  const handleCloseTips = () => {
    setShowTips(false);
    localStorage.setItem('todoTipsShown', 'true');
  };

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
        {/* Skeleton Header */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
          <Skeleton variant="rounded" width={200} height={40} />
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={96} height={40} />
          <Box sx={{ ml: 'auto' }}>
            <Skeleton variant="rounded" width={120} height={36} />
          </Box>
        </Box>
        {/* Skeleton Columns */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          overflowX: { xs: 'visible', sm: 'auto' }, 
          pb: 2 
        }}>
          <KanbanColumnSkeleton color="#f97316" />
          <KanbanColumnSkeleton color="#3b82f6" />
          <KanbanColumnSkeleton color="#22c55e" />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {/* Top Bar: List Selector & Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
            <Select
              value={selectedListId || ''}
              onChange={(e) => setSelectedListId(e.target.value)}
              displayEmpty
            >
              {taskLists.map(list => (
                <MenuItem key={list.id} value={list.id}>
                  {list.name} {list.isOwner ? '(Owner)' : '(Shared)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={() => { setEditingList(null); setShowListModal(true); }}>
            New List
          </Button>
          
          {selectedListId && (
            <>
              <Button size="small" onClick={() => { setEditingList(taskLists.find(l => l.id === selectedListId)); setShowListModal(true); }}>
                Edit List
              </Button>
              <Button size="small" onClick={() => setShowMemberModal(true)}>
                Members
              </Button>
            </>
          )}
        </Box>

        {/* Filters & Actions Row */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 2 }, 
          alignItems: 'center' 
        }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder={t('todo.search') || 'Search...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              minWidth: { xs: '100%', sm: 200 },
              order: { xs: 1, sm: 0 },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />

          {/* Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 }, order: { xs: 2, sm: 0 } }}>
            <Select
              displayEmpty
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              startAdornment={!isMobile && <FilterListIcon sx={{ mr: 1, color: 'grey.500' }} />}
            >
              <MenuItem value="">{t('todo.all_priority') || 'All Priority'}</MenuItem>
              <MenuItem value="HIGH">{t('todo.high') || 'High'}</MenuItem>
              <MenuItem value="MEDIUM">{t('todo.medium') || 'Medium'}</MenuItem>
              <MenuItem value="LOW">{t('todo.low') || 'Low'}</MenuItem>
            </Select>
          </FormControl>

          {/* Assigned to Me Toggle */}
          <ToggleButton
            value="assignedToMe"
            selected={assignedToMe}
            onChange={() => setAssignedToMe(!assignedToMe)}
            size="small"
            sx={{ height: 40, order: { xs: 2, sm: 0 }, px: 2 }}
          >
            <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
            Assigned to Me
          </ToggleButton>

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 }, order: { xs: 3, sm: 0 } }}>
            <Select
              displayEmpty
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={!isMobile && <SortIcon sx={{ mr: 1, color: 'grey.500' }} />}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="dueDate">{t('todo.due_date') || 'Due Date'}</MenuItem>
              <MenuItem value="priority">{t('todo.priority') || 'Priority'}</MenuItem>
              <MenuItem value="createdAt">Created</MenuItem>
            </Select>
          </FormControl>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, v) => v && setViewMode(v)}
            size="small"
            sx={{ order: { xs: 4, sm: 0 } }}
          >
            <ToggleButton value="kanban"><ViewKanbanIcon /></ToggleButton>
            <ToggleButton value="table"><TableRowsIcon /></ToggleButton>
            <ToggleButton value="list"><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>

          {/* Add Button - Desktop */}
          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setEditTask({})}
              sx={{ ml: 'auto' }}
            >
              {t('todo.add') || 'Add Task'}
            </Button>
          )}

          {/* Help */}
          <Tooltip title={t('todo.tips_title') || 'Tips'}>
            <IconButton onClick={() => setShowTips(true)} sx={{ order: { xs: 5, sm: 0 }, ml: { xs: 'auto', sm: 0 } }}>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            overflowX: { xs: 'visible', sm: 'auto' },
            pb: 2,
            alignItems: { xs: 'stretch', sm: 'flex-start' },
          }}>
            <KanbanColumn
              id="PENDING"
              title={t('todo.pending') || 'Pending'}
              tasks={pendingTasks}
              color="#f97316"
              onEdit={setEditTask}
              emptyText={t('todo.no_tasks') || 'No tasks'}
            />
            <KanbanColumn
              id="IN_PROGRESS"
              title={t('todo.in_progress') || 'In Progress'}
              tasks={inProgressTasks}
              color="#3b82f6"
              onEdit={setEditTask}
              emptyText={t('todo.no_tasks') || 'No tasks'}
            />
            <KanbanColumn
              id="COMPLETED"
              title={t('todo.completed') || 'Completed'}
              tasks={completedTasks}
              color="#22c55e"
              onEdit={setEditTask}
              emptyText={t('todo.no_tasks') || 'No tasks'}
            />
          </Box>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Paper sx={{ overflow: 'auto' }}>
          {tasks.length === 0 ? (
            <EmptyState text={t('todo.no_tasks') || 'No tasks'} icon="📋" />
          ) : (
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: { xs: 500, sm: 'auto' } }}>
              <Box component="thead" sx={{ bgcolor: 'grey.100' }}>
                <Box component="tr">
                  <Box component="th" sx={{ p: 1.5, textAlign: 'left' }}>Title</Box>
                  <Box component="th" sx={{ p: 1.5, textAlign: 'left' }}>Status</Box>
                  <Box component="th" sx={{ p: 1.5, textAlign: 'left' }}>Priority</Box>
                  <Box component="th" sx={{ p: 1.5, textAlign: 'left', display: { xs: 'none', sm: 'table-cell' } }}>Category</Box>
                  <Box component="th" sx={{ p: 1.5, textAlign: 'left' }}>Due Date</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {tasks.map(task => (
                  <Box 
                    component="tr" 
                    key={task.id} 
                    onClick={() => setEditTask(task)}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <Box component="td" sx={{ p: 1.5 }}>{task.title}</Box>
                    <Box component="td" sx={{ p: 1.5 }}>
                      <Chip label={STATUS_CONFIG[task.status]?.label} size="small" sx={{ bgcolor: STATUS_CONFIG[task.status]?.color, color: 'white' }} />
                    </Box>
                    <Box component="td" sx={{ p: 1.5 }}>
                      <Chip label={PRIORITY_COLORS[task.priority]?.label} size="small" sx={{ bgcolor: PRIORITY_COLORS[task.priority]?.bg, color: PRIORITY_COLORS[task.priority]?.color }} />
                    </Box>
                    <Box component="td" sx={{ p: 1.5, display: { xs: 'none', sm: 'table-cell' } }}>{task.category || '-'}</Box>
                    <Box component="td" sx={{ p: 1.5 }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Box>
          {tasks.length === 0 ? (
            <Paper sx={{ p: 2 }}>
              <EmptyState text={t('todo.no_tasks') || 'No tasks'} icon="📋" />
            </Paper>
          ) : (
            tasks.map(task => (
              <Paper 
                key={task.id} 
                onClick={() => setEditTask(task)}
                sx={{ 
                  p: { xs: 1, sm: 1.5 }, 
                  mb: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1, sm: 2 }, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderLeft: `4px solid ${PRIORITY_COLORS[task.priority]?.color}`,
                }}
              >
                <Chip label={STATUS_CONFIG[task.status]?.label} size="small" sx={{ bgcolor: STATUS_CONFIG[task.status]?.color, color: 'white', minWidth: { xs: 60, sm: 80 }, fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
                <Typography sx={{ flex: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>{task.title}</Typography>
                {task.dueDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                )}
              </Paper>
            ))
          )}
        </Box>
      )}

      {/* Modals */}
      <TaskListModal open={showListModal} list={editingList} onClose={() => setShowListModal(false)} onSave={handleSaveList} onDelete={handleDeleteList} />
      <MemberModal open={showMemberModal} listId={selectedListId} onClose={() => setShowMemberModal(false)} />

      {/* Edit Modal */}
      <TaskEditModal
        open={!!editTask}
        task={editTask}
        listId={selectedListId}
        onClose={() => setEditTask(null)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* Tips Modal */}
      <TipsModal open={showTips} onClose={handleCloseTips} />

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add task"
          onClick={() => setEditTask({})}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

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

export default function TodoPageWrapper() {
  return (
    <ErrorBoundary>
      <TodoPage />
    </ErrorBoundary>
  );
}
