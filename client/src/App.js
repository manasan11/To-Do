import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import TaskList from './components/Tasks/TaskList';
import CalendarView from './components/Calendar/CalendarView';
import DayView from './components/Calendar/DayView';
import WeekView from './components/Calendar/WeekView';
import FocusMode from './components/FocusMode/FocusMode';
import MoodSelector from './components/Mood/MoodSelector';
import AchievementList from './components/Achievements/AchievementList';
import AITaskBreakdown from './components/AI/AITaskBreakdown';
import Settings from './components/Settings/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  return <TaskProvider><Layout>{children}</Layout></TaskProvider>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
      <Route path="/day" element={<ProtectedRoute><DayView /></ProtectedRoute>} />
      <Route path="/week" element={<ProtectedRoute><WeekView /></ProtectedRoute>} />
      <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
      <Route path="/mood" element={<ProtectedRoute><MoodSelector /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><AchievementList /></ProtectedRoute>} />
      <Route path="/ai-breakdown" element={<ProtectedRoute><AITaskBreakdown /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
