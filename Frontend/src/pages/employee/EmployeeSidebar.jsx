import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/auth'

const items = [
  ['Dashboard', '/employee/dashboard', '⌂'],
  ['My Projects', '/employee/projects', '▦'],
  ['Discover Projects', '/employee/projects?view=discover', '⌕'],
  ['Employee Portfolios', '/employee/portfolios', '◎'],
  ['Calendar', '/employee/calendar', '□'],
  ['Notifications', '/employee/notifications', '◌'],
  ['My Profile', '/employee/profile', '○']
]

export default function EmployeeSidebar({ collapsed, onToggle, onClose }) {
  const navigate = useNavigate()
  return (
    <aside className="bo-sidebar employee-bo-sidebar">
      <div className="bo-sidebar-top">
        <div className="bo-sidebar-logo"><span className="aaib-logo-light" /></div>
        <button className="bo-collapse-btn" type="button" onClick={onToggle} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>{collapsed ? '›' : '‹'}</button>
        <button className="bo-mobile-close" type="button" onClick={onClose} aria-label="Close navigation">×</button>
      </div>
      <div className="bo-sidebar-section-label">Employee Workspace</div>
      <nav className="bo-nav">
        {items.map(([label, to, icon]) => (
          <NavLink key={label} to={to} onClick={onClose} className={({ isActive }) => `bo-nav-item${isActive ? ' active' : ''}`}>
            <span className="bo-nav-icon">{icon}</span><span className="bo-nav-text">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="bo-sidebar-bottom">
        <button className="bo-nav-item bo-logout" onClick={() => { logout(); navigate('/login', { replace: true }) }}>
          <span className="bo-nav-icon">↪</span><span className="bo-nav-text">Logout</span>
        </button>
      </div>
    </aside>
  )
}
