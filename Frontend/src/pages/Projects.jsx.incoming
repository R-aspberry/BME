import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../services/projects'

export default function Projects(){
  const [projects, setProjects] = useState([])
  useEffect(()=>{ getProjects().then(setProjects).catch(()=>setProjects([])) },[])

  return (
    <div>
      <h1>My Projects</h1>
      <div className="table">
        <div className="table-row table-head">
          <div>Project</div><div>Status</div><div>Start</div><div>End</div>
        </div>
        {projects.map(p=> (
          <Link to={`/projects/${p.prj_ID}`} className="table-row" key={p.prj_ID}>
            <div>{p.project_Name}</div>
            <div><span className={`badge ${p.status?.toLowerCase()}`}>{p.status || 'Open'}</span></div>
            <div>{p.start_date ? new Date(p.start_date).toLocaleDateString() : '-'}</div>
            <div>{p.end_date ? new Date(p.end_date).toLocaleDateString() : '-'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
