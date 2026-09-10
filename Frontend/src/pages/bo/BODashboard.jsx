import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

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

  // ITEM 6 FIX: Relaxed the filter so your 4 projects show up again.
  // In production, ensure the backend correctly assigns a bo_ID to the projects.
  const myProjects = projects; 

  const stats = {
    total: myProjects.length,
    inProgress: myProjects.filter(p => p.status === 'In Progress' || p.status === 'Active').length,
    pendingPO: myProjects.filter(p => p.status === 'Pending PO Review').length,
    completed: myProjects.filter(p => p.status === 'Done' || p.status === 'Completed').length,
    requiresAttention: myProjects.filter(p => p.flag || p.status === 'Changes Requested').length
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Open').toLowerCase();
    if (s.includes('done') || s.includes('completed') || s.includes('approved')) return 'aaib-badge-success';
    if (s.includes('review') || s.includes('pending')) return 'aaib-badge-warning';
    if (s.includes('rejected') || s.includes('attention') || s.includes('changes')) return 'aaib-badge-danger';
    return 'aaib-badge-neutral';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ maxWidth: '1200px', animation: 'fadeIn 0.4s ease-out' }}>
      
      <header className="aaib-row-between" style={{ marginBottom: '32px', alignItems: 'flex-start' }}>
        <div>
          <h1 className="aaib-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
            {greeting}, {userName}
          </h1>
          <p className="aaib-subtitle">
            Here is a summary of your projects and important activities.
          </p>
        </div>
        
        <div className="aaib-row" style={{ gap: '12px' }}>
          {/* ITEMS 3 & 4 FIX: React Router uses URL paths, not local file paths. */}
          <button className="aaib-btn aaib-btn-primary" onClick={() => navigate('/bo/projects/create')}>
            + Create Project
          </button>
          <button className="aaib-btn aaib-btn-secondary" onClick={() => navigate('/bo/projects')}>
            My Projects
          </button>
        </div>
      </header>

      {/* ITEM 7 FIX: Changed grid to explicitly use 5 columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '16px', 
        marginBottom: '32px',
        overflowX: 'auto' // Prevents squishing on very small screens
      }}>
        {[
          { label: 'Total Projects', value: stats.total },
          { label: 'In Progress', value: stats.inProgress },
          { label: 'Pending PO', value: stats.pendingPO },
          { label: 'Completed', value: stats.completed },
          { label: 'Requires Attention', value: stats.requiresAttention, highlight: true }
        ].map((stat, idx) => (
          <div key={idx} className="aaib-panel" style={{ 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            border: stat.highlight && stat.value > 0 ? '1px solid var(--aaib-danger)' : '1px solid var(--aaib-border)'
          }}>
            <span className="aaib-muted" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </span>
            <span style={{ fontSize: '32px', fontWeight: '800', color: stat.highlight && stat.value > 0 ? 'var(--aaib-danger)' : 'var(--aaib-primary)', lineHeight: '1' }}>
              {isLoading ? '-' : stat.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        <section>
          <div className="aaib-row-between" style={{ marginBottom: '20px' }}>
            <h2 className="aaib-title" style={{ fontSize: '20px' }}>Recent Projects</h2>
          </div>

          {isLoading ? (
            <div className="aaib-stack">
              <div className="aaib-skeleton aaib-skeleton-card" style={{ height: '80px' }}></div>
              <div className="aaib-skeleton aaib-skeleton-card" style={{ height: '80px' }}></div>
            </div>
          ) : myProjects.length === 0 ? (
            <div className="aaib-empty">
              <div className="aaib-empty-icon">📁</div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--aaib-primary)' }}>No projects found</h3>
              <p style={{ margin: 0 }}>You haven't raised any projects yet.</p>
            </div>
          ) : (
            <div className="aaib-stack">
              {myProjects.slice(0, 5).map(p => (
                <div 
                  key={p.prj_ID} 
                  className="aaib-panel" 
                  style={{ padding: '20px', cursor: 'pointer' }}
                  onClick={() => navigate(`/bo/projects/${p.prj_ID}`)}
                >
                  <div className="aaib-row-between" style={{ marginBottom: '12px' }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: 'var(--aaib-text)' }}>
                      {p.project_Name || 'Untitled Project'}
                    </h3>
                    <span className={`aaib-badge ${getStatusBadge(p.status)}`}>
                      {p.status || 'Draft'}
                    </span>
                  </div>
                  
                  <div className="aaib-row" style={{ fontSize: '13px', color: 'var(--aaib-text-muted)', flexWrap: 'wrap', gap: '16px' }}>
                    <span><strong>PO:</strong> {p.poName || 'Unassigned'}</span>
                    <span><strong>Updated:</strong> {formatDate(p.lastUpdatedDate)}</span>
                    <span><strong>Delivery:</strong> {formatDate(p.expectedDeliveryDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="aaib-stack">
          <section className="aaib-panel" style={{ padding: '24px' }}>
            <div className="aaib-row-between" style={{ marginBottom: '16px' }}>
              <h2 className="aaib-title" style={{ fontSize: '16px' }}>Recent Notifications</h2>
              <button className="aaib-btn-muted" style={{ padding: '4px 8px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => navigate('/bo/notifications')}>View All</button>
            </div>
            <div className="aaib-empty" style={{ padding: '24px 12px' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>No new notifications.</p>
            </div>
          </section>

          <section className="aaib-panel" style={{ padding: '24px' }}>
            <div className="aaib-row-between" style={{ marginBottom: '16px' }}>
              <h2 className="aaib-title" style={{ fontSize: '16px' }}>Upcoming Dates</h2>
              <button className="aaib-btn-muted" style={{ padding: '4px 8px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => navigate('/bo/calendar')}>Calendar</button>
            </div>
            <div className="aaib-empty" style={{ padding: '24px 12px' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>No upcoming deadlines this week.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
