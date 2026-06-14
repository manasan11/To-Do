import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Something went wrong';
    if (error.response?.status !== 401) toast.error(msg);
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: data => api.put('/auth/profile', data),
  updatePassword: data => api.put('/auth/password', data),
  updateStats: data => api.put('/auth/stats', data)
};

export const taskAPI = {
  getAll: params => api.get('/tasks', { params }),
  getById: id => api.get(`/tasks/${id}`),
  create: data => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: id => api.delete(`/tasks/${id}`),
  reorder: tasks => api.put('/tasks/reorder', { tasks }),
  bulkUpdate: (taskIds, updates) => api.put('/tasks/bulk', { taskIds, updates }),
  getByDateRange: params => api.get('/tasks/range', { params }),
  completeSubtask: (taskId, subtaskId) => api.put(`/tasks/${taskId}/subtasks/${subtaskId}`),
  addSubtask: (taskId, title) => api.post(`/tasks/${taskId}/subtasks`, { title })
};

export const achievementAPI = {
  getAll: () => api.get('/achievements'),
  check: () => api.post('/achievements/check')
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getWeekly: () => api.get('/analytics/weekly'),
  getMonthly: (year, month) => api.get('/analytics/monthly', { params: { year, month } }),
  getCategories: () => api.get('/analytics/categories'),
  getTrend: () => api.get('/analytics/trend')
};

export const moodAPI = {
  log: data => api.post('/mood', data),
  getHistory: days => api.get('/mood', { params: { days } }),
  getSuggestions: params => api.get('/mood/suggestions', { params })
};

export const aiAPI = {
  breakdown: data => api.post('/ai/breakdown', data),
  suggest: data => api.post('/ai/suggest', data)
};

export default api;
