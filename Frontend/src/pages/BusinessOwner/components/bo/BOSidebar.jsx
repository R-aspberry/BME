import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/bo/dashboard', label: 'Dashboard' },
  { to: '/bo/projects', label: 'My Projects' },
  { to: '/bo/projects/create', label: 'Create Project' },
  { to: '/bo/notifications', label: 'Notifications' },
  { to: '/bo/calendar', label: 'Calendar' },
  { to: '/bo/profile', label: 'Profile' }
]

export default function BOSidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('role')
    navigate('/login', { replace: true })
  }

  return (
    <aside style={{
      width: '220px',
      background: '#1b281e',
      minHeight: 'calc(100vh - 64px)',
      color: '#fff',
      padding: '22px 18px'
    }}>
      <div style={{
        fontSize: '22px',
        fontWeight: 700,
        color: '#c9a24c',
        marginBottom: '20px',
        letterSpacing: '0.04em'
      }}>
        AAIB
      </div>

      <nav style={{ display: 'grid', gap: '6px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/bo/dashboard'}
            style={({ isActive }) => ({
              display: 'block',
              color: isActive ? '#c9a24c' : '#dfe7e2',
              textDecoration: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              background: isActive ? 'rgba(201, 162, 76, 0.12)' : 'transparent',
              fontWeight: isActive ? 600 : 500
            })}
          >
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          style={{
            marginTop: '18px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: '#fff',
            padding: '10px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          Logout
        </button>
      </nav>
    </aside>
  )
}
