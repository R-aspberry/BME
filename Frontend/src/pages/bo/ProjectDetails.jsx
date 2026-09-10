import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject, updateProject } from '../../services/projectService'

export default function ProjectDetail(){
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(()=>{
    if (!id) return
    getProject(id).then(p=>{ setProject(p); setForm(p) }).catch(()=>{})
  },[id])

  async function save(){
    await updateProject(id, form)
    setEditing(false)
    setProject(form)
  }

  if (!project) return <div>Loading...</div>

  return (
    <div>
      <h1>{project.project_Name}</h1>
      <div className="card">
        <div><strong>Status:</strong> <span className="badge">{project.status || 'Open'}</span></div>
        <div><strong>Flag:</strong> {project.flag}</div>
        <div><strong>Start:</strong> {project.start_date}</div>
        <div><strong>End:</strong> {project.end_date}</div>
      </div>

      <section>
        <h2>Description</h2>
        <div className="card">{project.description}</div>
      </section>

      <section>
        <h2>BRD</h2>
        <div className="card">{project.brd ? <a href={project.brd}>View BRD</a> : 'None'}</div>
      </section>

      <div className="actions">
        {editing ? (
          <>
            <button className="btn" onClick={()=>setEditing(false)}>Cancel</button>
            <button className="btn primary" onClick={save}>Save</button>
          </>
        ) : (
          <button className="btn" onClick={()=>setEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  )
}
