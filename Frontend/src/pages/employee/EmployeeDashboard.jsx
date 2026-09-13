import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyProjects } from '../../services/projects'
import { me } from '../../services/auth'

function statusClass(status) {
  const value = (status || 'Open').toLowerCase()
  if (value.includes('complete') || value.includes('done')) return 'aaib-badge-success'
  if (value.includes('progress') || value.includes('review')) return 'aaib-badge-warning'
  return 'aaib-badge-neutral'
}

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [energy, setEnergy] = useState(() => localStorage.getItem('socialEnergy') || '60')
  const name = localStorage.getItem('userName') || 'Employee'

  useEffect(() => {
    const refreshEnergy = () => setEnergy(localStorage.getItem('socialEnergy') || '60')
    window.addEventListener('social-energy-updated', refreshEnergy)
    Promise.all([getMyProjects(), me().catch(() => null)])
      .then(([projectData, meData]) => { setProjects(projectData || []); setProfile(meData) })
      .finally(() => setLoading(false))
    return () => window.removeEventListener('social-energy-updated', refreshEnergy)
  }, [])

  const displayName = profile?.userName || name
  const active = projects.filter(project => !['done', 'completed'].includes((project.status || '').toLowerCase())).length

  return (
    <div className="bo-content employee-content aaib-animate-fade">
      <section className="bo-hero employee-welcome">
        <div>
          <p className="employee-eyebrow">EMPLOYEE WORKSPACE</p>
          <h1>Good to see you, {displayName}</h1>
          <p>Keep your projects, people, and important dates within reach.</p>
        </div>
        <div className="employee-welcome-mark">{displayName.slice(0, 1).toUpperCase()}</div>
      </section>

      <div className="bo-kpi-grid employee-stat-grid">
        <div className="bo-kpi-card employee-stat"><span className="bo-kpi-label">Assigned projects</span><strong>{loading ? '—' : projects.length}</strong><small className="bo-kpi-description">Across your workspace</small></div>
        <div className="bo-kpi-card employee-stat"><span className="bo-kpi-label">Active work</span><strong>{loading ? '—' : active}</strong><small className="bo-kpi-description">Still moving forward</small></div>
        <div className="bo-kpi-card employee-stat"><span className="bo-kpi-label">Upcoming dates</span><strong>03</strong><small className="bo-kpi-description">Milestones this month</small></div>
      </div>
      <div className="aaib-panel employee-energy-banner"><div><p className="employee-eyebrow">YOUR SOCIAL ENERGY</p><strong>{energy}%</strong><span>{Number(energy) >= 70 ? 'Open to connect' : Number(energy) >= 40 ? 'Available with focus' : 'Quiet focus mode'}</span></div><div className="employee-energy-bar"><i style={{ width: `${energy}%` }} /></div><Link to="/employee/profile">Adjust signal</Link></div>

      <section className="employee-section-heading"><div><p className="employee-eyebrow">PROJECT PULSE</p><h2>Your project view</h2></div><Link className="aaib-btn aaib-btn-secondary" to="/employee/projects">View all projects</Link></section>
      {loading ? <div className="employee-project-list"><div className="aaib-skeleton aaib-skeleton-card" /><div className="aaib-skeleton aaib-skeleton-card" /></div> : projects.length === 0 ? <div className="aaib-empty"><div className="aaib-empty-icon">▦</div><h3>No projects assigned yet</h3><p>Discover available bank projects from the project section.</p></div> : <div className="employee-project-list">{projects.slice(0, 4).map(project => <Link className="aaib-panel employee-project-row" to={`/employee/projects/${project.prj_ID}`} key={project.prj_ID}><div><span className="employee-project-id">PRJ-{String(project.prj_ID).padStart(3, '0')}</span><h3>{project.project_Name || 'Untitled project'}</h3><p>{project.description || 'Project details are available in the project workspace.'}</p></div><span className={`aaib-badge ${statusClass(project.status)}`}>{project.status || 'Open'}</span></Link>)}</div>}
    </div>
  )
}
