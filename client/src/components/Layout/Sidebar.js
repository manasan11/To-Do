import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiCalendar, FiClock, FiTarget, FiSmile, FiAward, FiCpu, FiSettings, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { section: 'Main', items: [
    { path: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/tasks', icon: <FiList />, label: 'Tasks' },
    { path: '/calendar', icon: <FiCalendar />, label: 'Calendar' },
  ]},
  { section: 'Views', items: [
    { path: '/day', icon: <FiClock />, label: 'Day View' },
    { path: '/week', icon: <FiCalendar />, label: 'Week View' },
  ]},
  { section: 'Focus', items: [
    { path: '/focus', icon: <FiTarget />, label: 'Focus Mode' },
    { path: '/mood', icon: <FiSmile />, label: 'Mood Tracker' },
  ]},
  { section: 'Features', items: [
    { path: '/achievements', icon: <FiAward />, label: 'Achievements' },
    { path: '/ai-breakdown', icon: <FiCpu />, label: 'AI Breakdown' },
  ]},
  { section: 'Account', items: [
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
  ]},
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✓</div>
        <h2>TodoFlow</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(section => (
          <div key={section.section} className="nav-section">
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
