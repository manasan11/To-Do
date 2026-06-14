import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTasks } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import toast from 'react-hot-toast';

const statusFilters = ['all', 'todo', 'in-progress', 'completed'];
const sortOptions = ['createdAt', 'dueDate', 'priority', 'title'];

export default function TaskList() {
  const { tasks, loading, filters, setFilters, fetchTasks, createTask, updateTask, deleteTask, toggleComplete, reorderTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    reorderTasks(items);
  }, [tasks, reorderTasks]);

  const handleCreate = async (data) => {
    await createTask(data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    if (!editingTask) return;
    await updateTask(editingTask._id, data);
    setEditingTask(null);
  };

  const handleEdit = (task) => setEditingTask(task);

  const handleStatusChange = async (task) => {
    await toggleComplete(task);
    const msg = task.status === 'completed' ? 'Task reopened' : 'Task completed!';
    toast.success(msg);
  };

  const filtered = tasks.filter(t => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!t.title.toLowerCase().includes(s) && !(t.description || '').toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'dueDate') return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
    if (sortBy === 'priority') {
      const order = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (order[a.priority] || 0) - (order[b.priority] || 0);
    }
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div>
      <div className="page-header">
        <h1>Tasks</h1>
        <p>Manage and organize your tasks</p>
      </div>

      <div className="task-controls">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus size={16} /> New Task
        </button>
        <div className="task-filters">
          {statusFilters.map(s => (
            <button key={s} className={`filter-chip ${filters.status === s || (!filters.status && s === 'all') ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, status: s === 'all' ? '' : s }))}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== 'all' && <span style={{ marginLeft: 4, color: 'var(--text-muted)' }}>
                ({tasks.filter(t => t.status === s).length})
              </span>}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiFilter size={14} style={{ color: 'var(--text-muted)' }} />
          <select className="form-select" style={{ width: 'auto', padding: '6px 12px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {sortOptions.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>Create your first task to get started</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <FiPlus size={16} /> Create Task
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="task-list">
            {(provided) => (
              <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
                {sorted.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskCard task={task} onToggle={handleStatusChange} onEdit={handleEdit} onDelete={deleteTask} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {showForm && <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingTask && <TaskForm task={editingTask} onSubmit={handleUpdate} onClose={() => setEditingTask(null)} />}
    </div>
  );
}
