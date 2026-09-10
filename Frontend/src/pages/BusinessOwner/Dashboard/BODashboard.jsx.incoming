import React from 'react'

export default function BODashboard() {
  const stats = [
    { label: 'Total Projects', value: '24', tone: '#1b281e' },
    { label: 'In Progress', value: '8', tone: '#3b82f6' },
    { label: 'Pending PO Review', value: '4', tone: '#d4a63a' },
    { label: 'Completed', value: '12', tone: '#16a34a' }
  ]

  const recentProjects = [
    { name: 'Online Banking Revamp', status: 'In Progress', po: 'Robert King', delivery: '2026-10-15' },
    { name: 'Marketing Campaign Tool', status: 'Pending', po: 'Linda Scott', delivery: '2026-09-28' },
    { name: 'Inventory Management System', status: 'Completed', po: 'David Green', delivery: '2026-08-11' }
  ]

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', color: '#1b281e' }}>Business Owner Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 14px rgba(27, 40, 30, 0.08)' }}>
            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '30px', fontWeight: 700, color: stat.tone }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 14px rgba(27, 40, 30, 0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #eef2f6', fontWeight: 700, color: '#1b281e' }}>
          Recent Projects
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>Project Name</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>PO</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', color: '#475569' }}>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((project) => (
              <tr key={project.name} style={{ borderTop: '1px solid #eef2f6' }}>
                <td style={{ padding: '14px 20px', color: '#111827' }}>{project.name}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '999px',
                    background: project.status === 'Completed' ? '#dcfce7' : project.status === 'Pending' ? '#fef3c7' : '#dbeafe',
                    color: project.status === 'Completed' ? '#166534' : project.status === 'Pending' ? '#92400e' : '#1d4ed8',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: '#374151' }}>{project.po}</td>
                <td style={{ padding: '14px 20px', color: '#374151' }}>{project.delivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
