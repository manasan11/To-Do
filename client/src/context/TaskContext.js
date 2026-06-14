import React, { createContext, useContext, useState, useCallback } from 'react';
import { taskAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);
export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', search: '' });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const query = { ...filters, ...params };
      Object.keys(query).forEach(k => { if (!query[k]) delete query[k]; });
      const { data } = await taskAPI.getAll(query);
      setTasks(data);
    } catch { /* api handles errors */ }
    finally { setLoading(false); }
  }, [filters]);

  const createTask = async (taskData) => {
    try {
      const { data } = await taskAPI.create(taskData);
      setTasks(prev => [data, ...prev]);
      toast.success('Task created!');
      return data;
    } catch { return null; }
  };

  const updateTask = async (id, updates) => {
    try {
      const { data } = await taskAPI.update(id, updates);
      setTasks(prev => prev.map(t => t._id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
      return data;
    } catch { return null; }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { /* handled */ }
  };

  const toggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTask(task._id, { status: newStatus });
  };

  const reorderTasks = async (reorderedTasks) => {
    setTasks(reorderedTasks);
    try {
      await taskAPI.reorder(reorderedTasks.map((t, i) => ({ ...t, order: i })));
    } catch { fetchTasks(); }
  };

  const completeSubtask = async (taskId, subtaskId) => {
    try {
      const { data } = await taskAPI.completeSubtask(taskId, subtaskId);
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
    } catch { /* handled */ }
  };

  const addSubtask = async (taskId, title) => {
    try {
      const { data } = await taskAPI.addSubtask(taskId, title);
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
      toast.success('Subtask added');
    } catch { /* handled */ }
  };

  return (
    <TaskContext.Provider value={{
      tasks, loading, filters, setFilters, fetchTasks,
      createTask, updateTask, deleteTask, toggleComplete,
      reorderTasks, completeSubtask, addSubtask
    }}>
      {children}
    </TaskContext.Provider>
  );
};
