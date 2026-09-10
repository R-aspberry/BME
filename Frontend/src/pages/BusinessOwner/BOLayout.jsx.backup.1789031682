import React from 'react'
import { Outlet } from 'react-router-dom'
import BOSidebar from './components/bo/BOSidebar'
import BOHeader from './components/bo/BOHeader'

export default function BOLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <BOHeader />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <BOSidebar />
        <main style={{ flex: 1, padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
