import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'

export default function Header(){
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName')
  function doLogout(){
    logout()
    navigate('/login')
  }
  return (
    <header className="header">
      <div className="brand">AAIB - BO Portal</div>
      <div className="header-right">
        <div className="user">{userName}</div>
        <button className="btn outline" onClick={doLogout}>Logout</button>
      </div>
    </header>
  )
}
