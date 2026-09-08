import React, { useEffect, useState } from 'react'
import { getProjects } from '../services/projects'

export default function Dashboard(){
  const [projects, setProjects] = useState([])
  useEffect(()=>{
    getProjects().then(setProjects).catch(()=>setProjects([]))
  },[])

  const userName = localStorage.getItem('userName') || ''

  const myProjects = projects.filter(p=>p.bo_ID === null || p.bo_ID === undefined || p.bo_ID === 0 ? [] : true)

  const stats = {
    total: projects.length,
    open: projects.filter(p=>p.status === 'Open' || p.status === null).length,
    inReview: projects.filter(p=>p.status === 'In Review').length,
    completed: projects.filter(p=>p.status === 'Done').length
  }

  return (
    <div>
      <h1>Welcome back, {userName}</h1>
      <div className="stats">
        <div className="card stat">
          <div className="label">Total Projects</div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="card stat">
          <div className="label">Open</div>
          <div className="value">{stats.open}</div>
        </div>
        <div className="card stat">
          <div className="label">In Review</div>
          <div className="value">{stats.inReview}</div>
        </div>
        <div className="card stat">
          <div className="label">Completed</div>
          <div className="value">{stats.completed}</div>
        </div>
      </div>

      <section>
        <h2>Recent Projects</h2>
        <div className="cards">
          {projects.slice(0,5).map(p=> (
            <div key={p.prj_ID} className="card project-card">
              <div className="project-name">{p.project_Name}</div>
              <div className="meta">{p.status} • {p.flag}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
