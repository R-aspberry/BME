import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getProject, updateProject } from '../../services/projectService'

export default function ProjectDetail() {
  const { id } = useParams()
  const location = useLocation()
  const isEmployee = location.pathname.startsWith('/employee/')
  const [project, setProject] = useState(null)
  const [editing, setEditing] = useState(false)
  const [interested, setInterested] = useState(() => localStorage.getItem(`project-interest-${id}`) === 'true')
  const [briefOpen, setBriefOpen] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => { if (id) getProject(id).then(projectData => { setProject(projectData); setForm(projectData) }).catch(() => setProject(null)) }, [id])
  async function save() { const updated = await updateProject(id, form); setProject(updated || form); setEditing(false) }
  function showInterest() { localStorage.setItem(`project-interest-${id}`, 'true'); setInterested(true) }

  if (!project) return <div className="employee-content"><div className="aaib-empty"><h3>Project not found</h3><p>This project may have been removed or is no longer available.</p><Link className="aaib-btn aaib-btn-secondary" to={isEmployee ? '/employee/projects?view=discover' : '/projects'}>Back to projects</Link></div></div>

  return <div className={isEmployee ? 'employee-content aaib-animate-fade' : ''}><div className="employee-page-heading"><div><p className="employee-eyebrow">PRJ-{String(project.prj_ID).padStart(3, '0')}</p><h1>{project.project_Name}</h1><p>{isEmployee ? 'Review the opportunity before deciding whether it fits your interests.' : 'Project overview and management details.'}</p></div>{isEmployee ? <button className="aaib-btn aaib-btn-primary" onClick={showInterest}>{interested ? 'Interest recorded' : 'I am interested'}</button> : null}</div><div className="employee-detail-grid"><section className="aaib-panel employee-detail-card"><div className="employee-detail-status"><span className="aaib-badge aaib-badge-neutral">{project.status || 'Open'}</span><span>{project.flag || 'Bank initiative'}</span></div><h2>About this project</h2><p>{project.description || 'No project description is available.'}</p><div className="employee-detail-facts"><div><span>Start date</span><strong>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</strong></div><div><span>End date</span><strong>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</strong></div><div><span>MVP</span><strong>{project.mvp || 'Not specified'}</strong></div></div></section><section className="aaib-panel employee-detail-card"><h2>Available information</h2><p>Review the project scope and timeline before expressing interest. Assignment decisions are reviewed by the responsible project owner.</p>{project.brd ? <><button className="aaib-btn aaib-btn-secondary" onClick={() => setBriefOpen(open => !open)}>{briefOpen ? 'Hide project brief' : 'View project brief'}</button>{briefOpen && <div className="employee-brief-preview"><strong>{project.brd}</strong><p>The brief file is recorded in the project database but is not uploaded to this development environment.</p></div>}</> : <span className="employee-muted-note">No project brief attached.</span>}</section></div>{!isEmployee && <div className="actions">{editing ? <><button className="btn" onClick={() => setEditing(false)}>Cancel</button><button className="btn primary" onClick={save}>Save</button></> : <button className="btn" onClick={() => setEditing(true)}>Edit</button>}</div>}</div>
}
