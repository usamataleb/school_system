import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navItems } from '../libs/constant'



export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>SchoolSys</h1>
        <p>Admin Portal</p>
        <span className="sidebar-badge"> {localStorage.getItem('username')} </span>
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
              <i className={`fa-solid fa-${item.icon}`}></i>
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
    </div>
  );
}
