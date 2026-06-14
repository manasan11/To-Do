import React, { useState } from 'react';
import { FiUser, FiBell, FiEye, FiDownload, FiLock, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { authAPI } from '../../utils/api';
import { exportToJSON, exportToCSV } from '../../utils/helpers';
import { useTasks } from '../../context/TaskContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { tasks } = useTasks();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ name });
      updateUser(data);
      toast.success('Profile updated');
    } catch { /* handled */ }
    finally { setSaving(false) }
  };

  const handleExport = (format) => {
    if (tasks.length === 0) return toast.error('No tasks to export');
    if (format === 'json') exportToJSON(tasks);
    else exportToCSV(tasks);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-section">
        <h3><FiUser size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Profile</h3>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
        </div>
        <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-section">
        <h3><FiEye size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Appearance</h3>
        <div className="settings-row">
          <div>
            <div className="settings-label">Theme Mode</div>
            <div className="settings-desc">{theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
            {theme === 'dark' ? <><FiSun size={14} /> Light</> : <><FiMoon size={14} /> Dark</>}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3><FiBell size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Notifications</h3>
        <div className="settings-row">
          <div>
            <div className="settings-label">In-App Notifications</div>
            <div className="settings-desc">Receive notifications for reminders</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Email Notifications</div>
            <div className="settings-desc">Get email updates for task reminders</div>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Sound Effects</div>
            <div className="settings-desc">Play sounds for Pomodoro and notifications</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3><FiDownload size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Data Export</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
          Export your tasks and data for backup or analysis
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => handleExport('json')}>
            Export as JSON
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
            Export as CSV
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3><FiLock size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Account</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
          Total tasks: {tasks.length} · Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </p>
        <button className="btn btn-danger btn-sm">Delete Account</button>
      </div>
    </div>
  );
}
