import React from 'react'

export default function BOProjectList() {
  const projects = [
    { name: 'Online Banking Revamp', status: 'Approved', owner: 'Robert King', delivery: '2026-10-15' },
    { name: 'Marketing Campaign Tool', status: 'Pending', owner: 'Linda Scott', delivery: '2026-09-28' },
    { name: 'Inventory Management System', status: 'Draft', owner: 'David Green', delivery: '2026-11-10' }
  ]

  function getBadgeStyle(status) {
    if (status === 'Approved') return { background: '#dcfce7', color: '#166534' }
    if (status === 'Pending') return { background: '#fef3c7', color: '#92400e' }
    return { background: '#e5e7eb', color: '#374151' }
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', color: '#1b281e' }}>My Projects</h2>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 14px rgba(27, 40, 30, 0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #eef2f6', fontWeight: 700, color: '#1b281e' }}>
          Project Portfolio
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>Project Name</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>Owner</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.name} style={{ borderTop: '1px solid #eef2f6' }}>
                <td style={{ padding: '14px 20px', color: '#111827' }}>{project.name}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ ...getBadgeStyle(project.status), display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: '#374151' }}>{project.owner}</td>
                <td style={{ padding: '14px 20px', color: '#374151' }}>{project.delivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
