import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard',   path: '/',            icon: '◈' },
  { section: 'Management' },
  { label: 'Students',    path: '/students',    icon: '◉' },
  { label: 'Courses',     path: '/courses',     icon: '▣' },
  { label: 'Enrollments', path: '/enrollments', icon: '◎' },
  { label: 'Results',     path: '/results',     icon: '◆' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>SchoolSys</h1>
        <p>Admin Portal</p>
        <span className="sidebar-badge">24BIT108</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">{item.section}</div>
          ) : (
            <button
              key={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span>⏻</span> Logout
        </button>
      </div>
    </div>
  );
}
