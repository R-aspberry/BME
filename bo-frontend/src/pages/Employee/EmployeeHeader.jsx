import React from 'react'

export default function EmployeeHeader() {
  const userName = localStorage.getItem('userName') || 'Employee'
  return (
    <header className="employee-header">
      <div className="employee-brand"><span className="employee-brand-mark">BME</span><span>Employee Portal</span></div>
      <div className="employee-header-user"><span className="employee-avatar">{userName.slice(0, 1).toUpperCase()}</span><span>{userName}</span></div>
    </header>
  )
}
