import React from 'react';
import { FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import { formatDate, getPriorityColor, getCategoryIcon, isOverdue, daysUntil } from '../../utils/helpers';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`} onClick={() => onToggle(task)} />
      <div className="task-content" onClick={() => onEdit(task)}>
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className="task-badge category">
            {getCategoryIcon(task.category)} {task.category}
          </span>
          <span className="task-badge priority" style={{ color: getPriorityColor(task.priority), background: `${getPriorityColor(task.priority)}15` }}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`task-due ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'overdue' : ''}`}>
              <FiClock size={12} /> {daysUntil(task.dueDate)} · {formatDate(task.dueDate)}
            </span>
          )}
          {task.subtasks?.length > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)} title="Edit"><FiEdit2 size={14} /></button>
        <button className="delete" onClick={() => onDelete(task._id)} title="Delete"><FiTrash2 size={14} /></button>
      </div>
    </div>
  );
}
