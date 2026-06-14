import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const categories = ['work', 'personal', 'health', 'education', 'finance', 'social', 'shopping', 'other'];
const priorities = ['low', 'medium', 'high', 'urgent'];

export default function TaskForm({ task, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'work', priority: 'medium',
    dueDate: '', reminder: '', estimatedMinutes: 25, tags: '', isRecurring: false, recurringPattern: ''
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'work',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        reminder: task.reminder ? new Date(task.reminder).toISOString().slice(0, 16) : '',
        estimatedMinutes: task.estimatedMinutes || 25,
        tags: (task.tags || []).join(', '),
        isRecurring: task.isRecurring || false,
        recurringPattern: task.recurringPattern || ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      reminder: form.reminder ? new Date(form.reminder).toISOString() : undefined,
      isRecurring: form.isRecurring,
      recurringPattern: form.isRecurring ? form.recurringPattern : undefined
    };
    if (task) data.status = task.status;
    onSubmit(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'New Task'}</h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Add details..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Reminder</label>
                <input className="form-input" type="datetime-local" value={form.reminder} onChange={e => setForm({ ...form, reminder: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Est. Minutes</label>
                <input className="form-input" type="number" min={1} value={form.estimatedMinutes} onChange={e => setForm({ ...form, estimatedMinutes: parseInt(e.target.value) || 25 })} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="frontend, urgent, team" />
              </div>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: form.isRecurring ? 12 : 0 }}>
                <label className="toggle">
                  <input type="checkbox" checked={form.isRecurring} onChange={e => setForm({ ...form, isRecurring: e.target.checked })} />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Recurring Task</span>
              </div>
              {form.isRecurring && (
                <select className="form-select" value={form.recurringPattern} onChange={e => setForm({ ...form, recurringPattern: e.target.value })}>
                  <option value="">Select pattern</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                </select>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
