import React from 'react'
import { Link } from 'react-router-dom'
import aaibLogo from '../../../../Frontend/src/assests/image/aaib.png'

export default function PlannerHeader() {
  const name = localStorage.getItem('userName') || 'Resource Planner'
  return <header className="planner-header"><div className="planner-brand"><img className="planner-brand-logo" src={aaibLogo} alt="AAIB" /><strong>Resource Planner Workspace</strong></div><Link className="planner-user planner-identity-link" to="/planner/portfolio" title="Open your portfolio"><span className="planner-avatar">{name.slice(0, 1).toUpperCase()}</span>{name}</Link></header>
}
