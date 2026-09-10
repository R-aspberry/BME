import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="logo">AAIB</div>
      <nav>
        <NavLink to="/bo/dashboard" end>Dashboard</NavLink>
        <NavLink to="/bo/projects">My Projects</NavLink>
        <NavLink to="/bo/projects/create">Create Project</NavLink>
        <NavLink to="/bo/profile">Profile</NavLink>
      </nav>
    </aside>
  )
}
