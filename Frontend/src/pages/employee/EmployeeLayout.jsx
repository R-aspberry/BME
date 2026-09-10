import React from 'react'
import { Outlet } from 'react-router-dom'
import EmployeeSidebar from './EmployeeSidebar'
import EmployeeHeader from './EmployeeHeader'

export default function EmployeeLayout() {
  return (
    <div className="employee-shell">
      <EmployeeHeader />
      <div className="employee-frame">
        <EmployeeSidebar />
        <main className="employee-main"><Outlet /></main>
      </div>
    </div>
  )
}
