import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import EmployeeSidebar from './EmployeeSidebar'
import EmployeeHeader from './EmployeeHeader'

export default function EmployeeLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={`bo-shell employee-bo-shell${sidebarCollapsed ? ' bo-sidebar-collapsed' : ''}${mobileSidebarOpen ? ' bo-mobile-sidebar-open' : ''}`}>
      <EmployeeSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(value => !value)}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="bo-page employee-bo-page">
        <EmployeeHeader onMenu={() => setMobileSidebarOpen(true)} />
        <main className="bo-main employee-bo-main"><Outlet /></main>
      </div>
      <button className="bo-sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} />
    </div>
  )
}
