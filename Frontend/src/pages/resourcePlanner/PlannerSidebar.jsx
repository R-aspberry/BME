import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/auth'

const links = [
  ['Dashboard', '/resource-planner/dashboard', '⌂'],
  ['My Portfolio', '/resource-planner/portfolio', '◎'],
  ['OS Employees', '/resource-planner/employees', '▦'],
  ['PO Requests', '/resource-planner/requests', '◌']
]

export default function PlannerSidebar() {
  const navigate = useNavigate()

  return (
    <aside className="planner-sidebar">

      <div className="planner-logo">
        AAIB
      </div>

      <p className="planner-label">
        Planning desk
      </p>

      <nav>
        {links.map(([label, to, icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `planner-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        className="planner-logout"
        onClick={() => {
          logout()
          navigate('/login', { replace: true })
        }}
      >
        ↪
        <span>Logout</span>
      </button>

    </aside>
  )
}