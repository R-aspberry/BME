import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEmployee } from '../../services/employees'

export default function PortfolioDetails() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    getEmployee(id)
      .then(setEmployee)
      .catch(() => setEmployee(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="employee-content"><div className="aaib-empty"><h3>Loading portfolio...</h3></div></div>
  }

  if (!employee) {
    return (
      <div className="employee-content">
        <div className="aaib-empty">
          <div className="aaib-empty-icon">◎</div>
          <h3>Employee not found</h3>
          <p>This employee profile is no longer available.</p>
          <Link className="aaib-btn aaib-btn-secondary" to="/employee/portfolios">Back to portfolios</Link>
        </div>
      </div>
    )
  }

  const first = employee.fN || employee.FN || ''
  const last = employee.lN || employee.LN || ''
  const title = employee.title || employee.Title || 'BME colleague'
  const projects = Array.isArray(employee.projects) ? employee.projects : []

  return (
    <div className="employee-content aaib-animate-fade">
      <div className="employee-page-heading">
        <div>
          <p className="employee-eyebrow">EMPLOYEE PROFILE</p>
          <h1>{first} {last}</h1>
          <p>{title}</p>
        </div>
        <Link className="aaib-btn aaib-btn-secondary" to="/employee/portfolios">Back to directory</Link>
      </div>

      <div className="employee-profile-grid">
        <section className="aaib-panel employee-profile-card">
          <div className="employee-profile-hero">
            <div className="employee-profile-avatar">{`${first}${last}`.slice(0, 2).toUpperCase() || '??'}</div>
            <div>
              <h2>{first} {last}</h2>
              <p>{title}</p>
            </div>
          </div>

          <div className="employee-detail-facts">
            <div>
              <span>Email</span>
              <strong>{employee.email || employee.Email || 'Not shared'}</strong>
            </div>
            <div>
              <span>Department</span>
              <strong>{employee.departmentName || employee.DepartmentName || 'Not assigned'}</strong>
            </div>
            <div>
              <span>Experience</span>
              <strong>{employee.years_OF_Experience ?? employee.Years_OF_Experience ?? 'N/A'} years</strong>
            </div>
          </div>
        </section>

        <section className="aaib-panel employee-profile-card">
          <p className="employee-eyebrow">ASSIGNED WORK</p>
          <h2>Current projects</h2>

          {projects.length === 0 ? (
            <div className="aaib-empty compact">
              <h3>No projects assigned</h3>
            </div>
          ) : (
            <div className="employee-project-list compact-list">
              {projects.map(project => (
                <Link key={project.prj_ID} className="aaib-panel employee-project-row" to={`/employee/projects/${project.prj_ID}`}>
                  <div>
                    <span className="employee-project-id">PRJ-{String(project.prj_ID).padStart(3, '0')}</span>
                    <h3>{project.project_Name || 'Untitled project'}</h3>
                  </div>
                  <span className={`aaib-badge ${project.status && project.status.toLowerCase().includes('complete') ? 'aaib-badge-success' : 'aaib-badge-neutral'}`}>
                    {project.status || 'Open'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

