import React from 'react'
import { Link } from 'react-router-dom'

export default function EmployeeHeader() {
  const userName = localStorage.getItem('userName') || 'Employee'
  return (
    <header className="employee-header">
      <div className="employee-brand"><span className="employee-brand-mark">BME</span><span>Employee Portal</span></div>
      <Link className="employee-header-user employee-identity-link" to="/employee/profile" title="Open your profile"><span className="employee-avatar">{userName.slice(0, 1).toUpperCase()}</span><span>{userName}</span></Link>
    </header>
  )
}
