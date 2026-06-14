export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (date) => `${formatDate(date)} ${formatTime(date)}`;

export const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
};

export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
};

export const isThisWeek = (date) => {
  if (!date) return false;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const d = new Date(date);
  return d >= weekStart && d < weekEnd;
};

export const daysUntil = (date) => {
  if (!date) return null;
  const now = new Date();
  const d = new Date(date);
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < 0) return `${Math.abs(diff)} days ago`;
  return `${diff} days`;
};

export const getPriorityColor = (priority) => {
  const colors = {
    urgent: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e'
  };
  return colors[priority] || colors.medium;
};

export const getCategoryIcon = (category) => {
  const icons = {
    work: '💼',
    personal: '👤',
    health: '💪',
    education: '📚',
    finance: '💰',
    social: '🤝',
    shopping: '🛒',
    other: '📌'
  };
  return icons[category] || icons.other;
};

export const getCategoryColor = (category) => {
  const colors = {
    work: '#3b82f6',
    personal: '#f2aec0',
    health: '#22c55e',
    education: '#f59e0b',
    finance: '#10b981',
    social: '#ec4899',
    shopping: '#f97316',
    other: '#64748b'
  };
  return colors[category] || colors.other;
};

export const getMoodEmoji = (mood) => {
  const emojis = {
    energetic: '⚡',
    happy: '😊',
    neutral: '😐',
    tired: '😴',
    stressed: '😰',
    sad: '😢',
    focused: '🎯',
    creative: '💡'
  };
  return emojis[mood] || '😐';
};

export const getMoodLabel = (mood) => {
  return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : 'Neutral';
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const truncate = (str, len = 50) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
};

export const exportToJSON = (data, filename = 'tasks-export.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (tasks) => {
  const headers = ['Title', 'Description', 'Category', 'Priority', 'Status', 'Due Date', 'Completed At', 'Tags'];
  const rows = tasks.map(t => [
    `"${t.title}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.category,
    t.priority,
    t.status,
    t.dueDate ? formatDate(t.dueDate) : '',
    t.completedAt ? formatDate(t.completedAt) : '',
    (t.tags || []).join('; ')
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks-export.csv';
  a.click();
  URL.revokeObjectURL(url);
};
