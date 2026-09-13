import React from 'react'
import { Link } from 'react-router-dom'
import aaibLogo from '../../assets/images/aaib.png'

export default function EmployeeHeader({ onMenu }) {
  const userName = localStorage.getItem('userName') || 'Employee'
  return (
    <header className="bo-header employee-bo-header">
      <div className="bo-header-left">
        <button className="bo-mobile-menu" type="button" onClick={onMenu} aria-label="Open navigation">☰</button>
        <div className="bo-header-brand">
          <img src={aaibLogo} alt="AAIB" />
        </div>
        <strong className="bo-header-title employee-bo-title">Employee Portal</strong>
      </div>
      <div className="bo-header-right">
        <Link className="bo-header-icon" to="/employee/notifications" aria-label="Open notifications">◌</Link>
        <Link className="bo-header-user employee-identity-link" to="/employee/profile" title="Open your profile">
          <span className="bo-user-avatar">{userName.slice(0, 1).toUpperCase()}</span>
          <span className="bo-user-details"><strong>{userName}</strong><span>Employee workspace</span></span>
        </Link>
      </div>
    </header>
  )
}
