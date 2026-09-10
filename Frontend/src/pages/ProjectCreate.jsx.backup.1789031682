import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProject } from '../services/projects'

export default function ProjectCreate(){
  const [form, setForm] = useState({ project_Name: '', description: '', mvp: '', brd: '', start_date: '', end_date: '', budget: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const payload = {
        project_Name: form.project_Name,
        description: form.description,
        mvp: form.mvp,
        brd: form.brd,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        budget: form.budget ? parseFloat(form.budget) : null,
        status: 'Open'
      }
      await createProject(payload)
      navigate('/projects')
    }catch(err){
      setError(String(err))
    }
  }

  function onFile(e){
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ()=> setForm({...form, brd: reader.result})
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <h1>Create Project</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <label>Project Name</label>
        <input value={form.project_Name} onChange={e=>setForm({...form, project_Name: e.target.value})} />

        <label>Description</label>
        <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />

        <label>MVP / Must-have</label>
        <textarea value={form.mvp} onChange={e=>setForm({...form, mvp: e.target.value})} />

        <label>BRD (upload)</label>
        <input type="file" onChange={onFile} />

        <label>Start date</label>
        <input type="date" value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} />

        <label>End date</label>
        <input type="date" value={form.end_date} onChange={e=>setForm({...form, end_date: e.target.value})} />

        <label>Budget</label>
        <input value={form.budget} onChange={e=>setForm({...form, budget: e.target.value})} />

        <div className="actions">
          <button className="btn primary" type="submit">Submit to PO</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
