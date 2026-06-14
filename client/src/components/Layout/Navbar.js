import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMoon, FiSun, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getGreeting } from '../../utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-search">
        <FiSearch className="search-icon" size={16} />
        <input type="text" placeholder="Search tasks..." />
      </div>
      <div className="navbar-actions">
        <button onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>
        <button onClick={() => navigate('/settings')} title="Settings">
          <FiSettings size={16} />
        </button>
        <button onClick={logout} title="Logout">
          <FiLogOut size={16} />
        </button>
        <div className="user-avatar" title={`${getGreeting()}, ${user?.name}`}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </nav>
  );
}
