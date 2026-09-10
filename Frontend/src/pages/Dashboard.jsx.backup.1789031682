import React, { useEffect, useState } from 'react';
import { getProjects } from '../services/projects';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    setIsLoading(true);
    getProjects()
      .then(data => {
        setProjects(data || []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter logic from your original file
  const myProjects = projects.filter(p => 
    p.bo_ID === null || p.bo_ID === undefined || p.bo_ID === 0 ? [] : true
  );

  const stats = {
    total: projects.length,
    open: projects.filter(p => p.status === 'Open' || p.status === null).length,
    inReview: projects.filter(p => p.status === 'In Review').length,
    completed: projects.filter(p => p.status === 'Done' || p.status === 'Completed').length
  };

  // Helper to assign the correct AAIB badge colors based on status
  const getStatusBadge = (status) => {
    const s = (status || 'Open').toLowerCase();
    if (s.includes('done') || s.includes('completed')) return 'aaib-badge-success';
    if (s.includes('review') || s.includes('progress')) return 'aaib-badge-warning';
    if (s.includes('rejected') || s.includes('flag')) return 'aaib-badge-danger';
    return 'aaib-badge-neutral';
  };

  return (
    <div style={{ maxWidth: '1200px', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Header Section */}
      <header style={{ marginBottom: '32px' }}>
        <h1 className="aaib-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
          Welcome back, {userName}
        </h1>
        <p className="aaib-subtitle">
          Here is a summary of your enterprise projects and recent activity.
        </p>
      </header>

      {/* KPI Stats Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}
      >
        {[
          { label: 'Total Projects', value: stats.total },
          { label: 'Open', value: stats.open },
          { label: 'In Review', value: stats.inReview },
          { label: 'Completed', value: stats.completed }
        ].map((stat, idx) => (
          <div key={idx} className="aaib-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span 
              className="aaib-muted" 
              style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {stat.label}
            </span>
            <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--aaib-primary)', lineHeight: '1' }}>
              {isLoading ? '-' : stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Projects Section */}
      <section>
        <div className="aaib-row-between" style={{ marginBottom: '20px' }}>
          <h2 className="aaib-title" style={{ fontSize: '20px' }}>Recent Projects</h2>
        </div>

        {isLoading ? (
          /* Skeleton Loading State */
          <div className="aaib-stack">
            <div className="aaib-skeleton aaib-skeleton-card" style={{ height: '80px' }}></div>
            <div className="aaib-skeleton aaib-skeleton-card" style={{ height: '80px' }}></div>
            <div className="aaib-skeleton aaib-skeleton-card" style={{ height: '80px' }}></div>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="aaib-empty">
            <div className="aaib-empty-icon">📁</div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--aaib-primary)' }}>No projects found</h3>
            <p style={{ margin: 0 }}>You don't have any active projects at the moment.</p>
          </div>
        ) : (
          /* Data List */
          <div className="aaib-stack">
            {projects.slice(0, 5).map(p => (
              <div 
                key={p.prj_ID} 
                className="aaib-panel" 
                style={{ 
                  padding: '20px 24px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: 'var(--aaib-text)' }}>
                    {p.project_Name || 'Untitled Project'}
                  </h3>
                  <div className="aaib-row" style={{ fontSize: '13px' }}>
                    <span className="aaib-muted">ID: {p.prj_ID}</span>
                    {p.flag && (
                      <>
                        <span style={{ color: 'var(--aaib-border)' }}>•</span>
                        <span style={{ color: 'var(--aaib-warning)', fontWeight: '600' }}>{p.flag}</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <span className={`aaib-badge ${getStatusBadge(p.status)}`}>
                    {p.status || 'Open'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}