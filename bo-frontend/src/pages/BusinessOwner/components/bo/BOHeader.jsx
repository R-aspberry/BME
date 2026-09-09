import React from 'react'

export default function BOHeader() {
  const userName = localStorage.getItem('userName') || 'Business Owner'

  return (
    <header style={{
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e7e9ec',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 700, color: '#1b281e' }}>
        Business Owner Portal
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#374151',
        fontWeight: 600
      }}>
        <span>Welcome, {userName}</span>
      </div>
    </header>
  )
}
