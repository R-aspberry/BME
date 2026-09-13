import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getMyProjects, getProjects } from '../../services/projectService'

export default function EmployeeProjects() {
  const [projects, setProjects] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const view = searchParams.get('view') === 'discover' ? 'discover' : 'mine'

  useEffect(() => {
    if (view === 'discover') {
      getProjects().then(setProjects).catch(() => setProjects([]))
      return
    }
    Promise.all([getMyProjects(), getProjects()]).then(([assigned, all]) => {
      const interestedIds = Object.keys(localStorage)
        .filter(key => key.startsWith('project-interest-') && localStorage.getItem(key) === 'true')
        .map(key => Number(key.replace('project-interest-', '')))
      const assignedIds = new Set(assigned.map(project => project.prj_ID))
      setProjects(all.filter(project => assignedIds.has(project.prj_ID) || interestedIds.includes(project.prj_ID)))
    }).catch(() => setProjects([]))
  }, [view])
  const filtered = useMemo(() => projects.filter(project => `${project.project_Name || ''} ${project.description || ''}`.toLowerCase().includes(query.toLowerCase())), [projects, query])

  return <div className="employee-content aaib-animate-fade">
    <div className="employee-page-heading"><div><p className="employee-eyebrow">PROJECTS</p><h1>{view === 'mine' ? 'My projects' : 'Discover projects'}</h1><p>Explore the work happening across the bank.</p></div><input className="aaib-input employee-search" placeholder="Search projects" value={query} onChange={event => setQuery(event.target.value)} /></div>
    <div className="employee-tabs"><button className={view === 'mine' ? 'active' : ''} onClick={() => setSearchParams({})}>My Projects</button><button className={view === 'discover' ? 'active' : ''} onClick={() => setSearchParams({ view: 'discover' })}>Discover Projects</button></div>
    <div className="employee-project-grid">{filtered.map(project => { const interested = localStorage.getItem(`project-interest-${project.prj_ID}`) === 'true'; return <Link to={`/employee/projects/${project.prj_ID}`} className="aaib-panel employee-project-card" key={project.prj_ID}><div className="employee-project-card-top"><span className="employee-project-id">PRJ-{String(project.prj_ID).padStart(3, '0')}</span><span className={`aaib-badge ${interested ? 'aaib-badge-warning' : 'aaib-badge-neutral'}`}>{interested ? 'Interest pending' : project.status || 'Open'}</span></div><h2>{project.project_Name || 'Untitled project'}</h2><p>{project.description || 'No project description is available.'}</p><div className="employee-project-meta"><span>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Start date TBD'}</span><span>{project.flag || 'Bank initiative'}</span></div></Link> })}</div>
    {!filtered.length && <div className="aaib-empty"><div className="aaib-empty-icon">⌕</div><h3>No matching projects</h3><p>Try another search or check back when new work is published.</p></div>}
  </div>
}
