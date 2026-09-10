import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'

const items = [
  ['Dashboard', '/employee/dashboard', '⌂'],
  ['My Projects', '/employee/projects', '▦'],
  ['Discover Projects', '/employee/projects?view=discover', '⌕'],
  ['Employee Portfolios', '/employee/portfolios', '◎'],
  ['Calendar', '/employee/calendar', '□'],
  ['Notifications', '/employee/notifications', '◌'],
  ['My Profile', '/employee/profile', '○']
]

export default function EmployeeSidebar() {
  const navigate = useNavigate()
  return (
    <aside className="employee-sidebar">
      <div className="employee-sidebar-logo">AAIB</div>
      <p className="employee-sidebar-label">Workspace</p>
      <nav className="employee-nav">
        {items.map(([label, to, icon]) => (
          <NavLink key={label} to={to} className={({ isActive }) => `employee-nav-item${isActive ? ' active' : ''}`}>
            <span className="employee-nav-icon">{icon}</span><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="employee-logout" onClick={() => { logout(); navigate('/login', { replace: true }) }}>
        <span className="employee-nav-icon">↪</span> Logout
      </button>
    </aside>
  )
}
