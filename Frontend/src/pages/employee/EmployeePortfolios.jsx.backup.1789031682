import React, { useEffect, useState } from 'react'
import { getEmployees } from '../../services/employees'

export default function EmployeePortfolios() {
  const [employees, setEmployees] = useState([])
  const [query, setQuery] = useState('')
  useEffect(() => { getEmployees().then(setEmployees).catch(() => setEmployees([])) }, [])
  const visible = employees.filter(employee => `${employee.fN || employee.fn || ''} ${employee.lN || employee.ln || ''} ${employee.title || ''}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="employee-content aaib-animate-fade"><div className="employee-page-heading"><div><p className="employee-eyebrow">PEOPLE DIRECTORY</p><h1>Employee portfolios</h1><p>Learn from the experience and capabilities across your teams.</p></div><input className="aaib-input employee-search" placeholder="Search people" value={query} onChange={event => setQuery(event.target.value)} /></div><div className="employee-portfolio-grid">{visible.map(employee => { const first = employee.fN || employee.fn || ''; const last = employee.lN || employee.ln || ''; return <article className="aaib-panel employee-person-card" key={employee.id || employee.iD}><div className="employee-person-avatar">{`${first}${last}`.slice(0, 2).toUpperCase() || '??'}</div><div><h2>{first} {last}</h2><p className="employee-person-title">{employee.title || 'BME colleague'}</p><p className="aaib-muted">{employee.email || 'Contact details available in profile.'}</p></div><button className="aaib-btn aaib-btn-secondary" type="button">View profile</button></article> })}</div>{!visible.length && <div className="aaib-empty"><div className="aaib-empty-icon">◎</div><h3>No colleagues found</h3><p>There are no portfolio matches for this search.</p></div>}</div>
}
