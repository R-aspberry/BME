import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import aaibLogo from '../../assets/images/aaib.png';

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    requests: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    projects: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      </>
    ),
    employees: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0M14.5 20a4.5 4.5 0 0 1 6 0" />
      </>
    ),
    notifications: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
        <path d="M14 8l4 4-4 4M9 12h9" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    chevron: <path d="M9 18l6-6-6-6" />,
    briefcase: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
        <path d="M3 11h18" />
        <path d="M10 11v2h4v-2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.7 2.7L16 9" />
      </>
    ),
    alert: (
      <>
        <path d="M10.3 4.5 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const status = (project) => String(project?.status || '').trim().toLowerCase();

const projectName = (project) =>
  project?.project_Name || project?.projectName || project?.name || 'Untitled Project';

const projectId = (project) =>
  project?.prj_ID ?? project?.projectId ?? project?.id;

const boName = (project) =>
  project?.boName || project?.bo_Name || project?.businessOwnerName || 'Not assigned';

const deadline = (project) =>
  project?.expectedDeliveryDate || project?.endDate || project?.end_date;

const asDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = asDate(value);
  if (!date) return '—';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const statusClass = (value) => {
  const current = String(value || '').toLowerCase();
  if (current.includes('completed') || current.includes('done') || current.includes('approved')) return 'success';
  if (current.includes('pending') || current.includes('review') || current.includes('submitted') || current.includes('new')) return 'warning';
  if (current.includes('rejected') || current.includes('changes') || current.includes('attention')) return 'danger';
  if (current.includes('progress') || current.includes('active')) return 'active';
  return 'neutral';
};

export default function PODashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';
  const initials = userName
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const firstName = userName.includes('.') ? userName.split('.')[0] : userName.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getProjects()
      .then((data) => {
        if (mounted) setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setProjects([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const newRequests = useMemo(
    () => projects.filter((project) => ['pending po review', 'pending review', 'new', 'submitted', 'pending'].includes(status(project))),
    [projects]
  );

  const pendingReview = useMemo(
    () => projects.filter((project) => ['pending po review', 'pending review'].includes(status(project))),
    [projects]
  );

  const inProgress = useMemo(
    () => projects.filter((project) => ['in progress', 'active'].includes(status(project))),
    [projects]
  );

  const completed = useMemo(
    () => projects.filter((project) => ['completed', 'done'].includes(status(project))),
    [projects]
  );

  const attention = useMemo(
    () => projects.filter((project) =>
      Boolean(project?.flag) ||
      ['changes requested', 'rejected', 'requires attention'].includes(status(project))
    ),
    [projects]
  );

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const aDate = asDate(a?.lastUpdatedDate || a?.updatedAt || a?.createdAt)?.getTime() || 0;
        const bDate = asDate(b?.lastUpdatedDate || b?.updatedAt || b?.createdAt)?.getTime() || 0;
        return bDate - aDate;
      })
      .slice(0, 4);
  }, [projects]);

  const upcomingProjects = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...projects]
      .map((project) => ({ project, date: asDate(deadline(project)) }))
      .filter(({ date }) => date && date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 4);
  }, [projects]);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const goToProject = (project) => {
    const id = projectId(project);
    if (id !== undefined && id !== null) navigate(`/po/projects/${id}`);
  };

  const stats = [
    { label: 'New Requests', value: newRequests.length, icon: 'requests', type: 'warning', help: 'Awaiting your review' },
    { label: 'Pending Review', value: pendingReview.length, icon: 'clock', type: 'gold', help: 'Decision still required' },
    { label: 'In Progress', value: inProgress.length, icon: 'briefcase', type: 'active', help: 'Currently active' },
    { label: 'Completed', value: completed.length, icon: 'check', type: 'success', help: 'Completed projects' },
    { label: 'Requires Attention', value: attention.length, icon: 'alert', type: 'danger', help: 'Flagged or blocked' },
  ];

  return (
    <div className={`po-shell ${sidebarCollapsed ? 'po-sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'po-mobile-sidebar-open' : ''}`}>
      <aside className="po-sidebar">
        <div className="po-sidebar-top">
          <div className="po-sidebar-logo">
            <img src={aaibLogo} alt="AAIB" />
          </div>
          <button type="button" className="po-collapse-btn" onClick={() => setSidebarCollapsed((value) => !value)} aria-label="Toggle sidebar">
            <Icon name={sidebarCollapsed ? 'chevron' : 'menu'} size={18} />
          </button>
          <button type="button" className="po-mobile-close" onClick={closeMobileSidebar} aria-label="Close sidebar">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="po-sidebar-label">Product Owner Portal</div>

        <nav className="po-nav">
          <NavLink to="/po/dashboard" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileSidebar}>
            <span className="po-nav-icon"><Icon name="dashboard" /></span><span className="po-nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/po/project-requests" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileSidebar}>
            <span className="po-nav-icon"><Icon name="requests" /></span><span className="po-nav-text">Project Requests</span>
          </NavLink>
          <NavLink to="/po/projects" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileSidebar}>
            <span className="po-nav-icon"><Icon name="projects" /></span><span className="po-nav-text">My Projects</span>
          </NavLink>
          <NavLink to="/po/employees" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileSidebar}>
            <span className="po-nav-icon"><Icon name="employees" /></span><span className="po-nav-text">Employees</span>
          </NavLink>
          <NavLink to="/po/notifications" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileSidebar}>
            <span className="po-nav-icon"><Icon name="notifications" /></span><span className="po-nav-text">Notifications</span>
          </NavLink>
          <NavLink to="/po/calendar" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileSidebar}>
            <span className="po-nav-icon"><Icon name="calendar" /></span><span className="po-nav-text">Calendar</span>
          </NavLink>
        </nav>

        <div className="po-sidebar-bottom">
          <NavLink to="/po/profile" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileSidebar}>
            <span className="po-nav-icon"><Icon name="profile" /></span><span className="po-nav-text">Profile</span>
          </NavLink>
          <button type="button" className="po-nav-item po-logout" onClick={logout}>
            <span className="po-nav-icon"><Icon name="logout" /></span><span className="po-nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {mobileSidebarOpen && <div className="po-sidebar-backdrop" onClick={closeMobileSidebar} />}

      <div className="po-page">
        <header className="po-header">
          <div className="po-header-left">
            <button type="button" className="po-mobile-menu" onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu">
              <Icon name="menu" size={20} />
            </button>
            <img src={aaibLogo} alt="AAIB" className="po-header-aaib-logo" />
            <div className="po-header-title">Product Owner Portal</div>
          </div>

          <div className="po-header-right">
            <button type="button" className="po-header-icon" onClick={() => navigate('/po/notifications')} aria-label="Notifications">
              <Icon name="notifications" size={19} /><span className="po-notification-dot" />
            </button>
            <button type="button" className="po-header-user" onClick={() => navigate('/po/profile')}>
              <span className="po-user-avatar">{initials}</span>
              <span className="po-user-details"><strong>{userName}</strong><small>Product Owner</small></span>
              <Icon name="chevron" size={15} />
            </button>
          </div>
        </header>

        <main className="po-main">
          <div className="po-content">
            <section className="po-page-heading">
              <div>
                <span className="po-eyebrow">PRODUCT OWNER WORKSPACE</span>
                <h1>{greeting}, {firstName}</h1>
                <p>Review incoming projects, track delivery, and focus on the work that needs your decision.</p>
              </div>
              <div className="po-heading-actions">
                <button type="button" className="aaib-btn aaib-btn-secondary" onClick={() => navigate('/po/projects')}>
                  <Icon name="projects" size={15} /> My Projects
                </button>
                <button type="button" className="aaib-btn aaib-btn-primary" onClick={() => navigate('/po/project-requests')}>
                  <Icon name="requests" size={15} /> Review Requests
                </button>
              </div>
            </section>

            <section className="po-kpi-grid">
              {stats.map((item) => (
                <button type="button" className="po-kpi-card" key={item.label} onClick={() => {
                  if (item.label === 'New Requests' || item.label === 'Pending Review') navigate('/po/project-requests');
                  else if (item.label === 'In Progress' || item.label === 'Completed' || item.label === 'Requires Attention') navigate('/po/projects');
                }}>
                  <div className="po-kpi-top">
                    <span className={`po-kpi-icon ${item.type}`}><Icon name={item.icon} size={16} /></span>
                    <span className="po-kpi-label">{item.label}</span>
                  </div>
                  <strong>{isLoading ? '—' : item.value}</strong>
                  <small>{item.help}</small>
                </button>
              ))}
            </section>

            <div className="po-top-grid">
              <section className="po-panel po-attention-card">
                <div className="po-section-head">
                  <div><span>PRIORITY</span><h2>Projects Requiring Attention</h2><p>Flagged projects and items that need action.</p></div>
                  <button type="button" className="po-link-button" onClick={() => navigate('/po/projects')}>View all <Icon name="arrow" size={13} /></button>
                </div>
                {isLoading ? (
                  <div className="po-list"><div className="po-skeleton" /><div className="po-skeleton" /></div>
                ) : attention.length === 0 ? (
                  <div className="po-empty-inline"><span className="po-empty-circle success"><Icon name="check" size={18} /></span><div><strong>Nothing requires attention</strong><p>There are no flagged projects right now.</p></div></div>
                ) : (
                  <div className="po-list">
                    {attention.slice(0, 4).map((project) => (
                      <button type="button" className="po-list-row" key={projectId(project)} onClick={() => goToProject(project)}>
                        <span className="po-row-icon danger"><Icon name="alert" size={16} /></span>
                        <span className="po-row-main">
                          <span className="po-row-title"><strong>{projectName(project)}</strong><em className={`po-status ${statusClass(project.status)}`}>{project.status || 'Attention'}</em></span>
                          <span className="po-row-meta">BO: {boName(project)} <b>·</b> Deadline: {formatDate(deadline(project))}</span>
                        </span>
                        <Icon name="chevron" size={15} />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="po-panel">
                <div className="po-section-head compact">
                  <div><span>INCOMING</span><h2>New Project Requests</h2></div>
                  <button type="button" className="po-link-button" onClick={() => navigate('/po/project-requests')}>View all</button>
                </div>
                {isLoading ? (
                  <div className="po-list"><div className="po-skeleton" /><div className="po-skeleton" /></div>
                ) : newRequests.length === 0 ? (
                  <div className="po-empty-inline"><span className="po-empty-circle warning"><Icon name="requests" size={17} /></span><div><strong>No new requests</strong><p>New BO submissions will appear here.</p></div></div>
                ) : (
                  <div className="po-list">
                    {newRequests.slice(0, 3).map((project) => (
                      <button type="button" className="po-request-row" key={projectId(project)} onClick={() => goToProject(project)}>
                        <span><strong>{projectName(project)}</strong><small>Submitted by {boName(project)}</small></span>
                        <span className="po-status warning">Pending</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="po-middle-grid">
              <section className="po-panel">
                <div className="po-section-head">
                  <div><span>PORTFOLIO</span><h2>Recent Projects</h2><p>Your latest project activity.</p></div>
                  <button type="button" className="po-link-button" onClick={() => navigate('/po/projects')}>View all <Icon name="arrow" size={13} /></button>
                </div>
                {isLoading ? (
                  <div className="po-list"><div className="po-skeleton" /><div className="po-skeleton" /><div className="po-skeleton" /></div>
                ) : recentProjects.length === 0 ? (
                  <div className="po-empty-inline"><span className="po-empty-circle"><Icon name="projects" size={17} /></span><div><strong>No projects available</strong><p>Available projects will appear here.</p></div></div>
                ) : (
                  <div className="po-list">
                    {recentProjects.map((project) => (
                      <button type="button" className="po-list-row" key={projectId(project)} onClick={() => goToProject(project)}>
                        <span className="po-row-icon"><Icon name="briefcase" size={16} /></span>
                        <span className="po-row-main">
                          <span className="po-row-title"><strong>{projectName(project)}</strong><em className={`po-status ${statusClass(project.status)}`}>{project.status || 'Open'}</em></span>
                          <span className="po-row-meta">BO: {boName(project)} <b>·</b> Updated: {formatDate(project.lastUpdatedDate || project.updatedAt || project.createdAt)}</span>
                        </span>
                        <Icon name="chevron" size={15} />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="po-panel">
                <div className="po-section-head compact">
                  <div><span>DELIVERY</span><h2>Upcoming Deadlines</h2></div>
                  <button type="button" className="po-link-button" onClick={() => navigate('/po/calendar')}>Calendar</button>
                </div>
                {isLoading ? (
                  <div className="po-list"><div className="po-skeleton" /><div className="po-skeleton" /></div>
                ) : upcomingProjects.length === 0 ? (
                  <div className="po-empty-inline"><span className="po-empty-circle"><Icon name="calendar" size={17} /></span><div><strong>No upcoming deadlines</strong><p>No future delivery dates are available.</p></div></div>
                ) : (
                  <div className="po-list">
                    {upcomingProjects.map(({ project, date }) => (
                      <button type="button" className="po-deadline-row" key={projectId(project)} onClick={() => goToProject(project)}>
                        <span className="po-deadline-date"><strong>{date.getDate()}</strong><small>{date.toLocaleDateString('en-GB', { month: 'short' })}</small></span>
                        <span><strong>{projectName(project)}</strong><small>Expected delivery</small></span>
                        <Icon name="chevron" size={15} />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <section className="po-panel po-notification-panel">
              <div className="po-section-head compact">
                <div><span>UPDATES</span><h2>Recent Notifications</h2><p>Stay informed about new requests and project updates.</p></div>
                <button type="button" className="po-link-button" onClick={() => navigate('/po/notifications')}>View all <Icon name="arrow" size={13} /></button>
              </div>
              <button type="button" className="po-notification-empty" onClick={() => navigate('/po/notifications')}>
                <span className="po-row-icon gold"><Icon name="notifications" size={17} /></span>
                <span><strong>Open notification center</strong><small>View read and unread notifications and project-related updates.</small></span>
                <Icon name="arrow" size={14} />
              </button>
            </section>
          </div>
        </main>

        <style>{`
          .po-shell{--po-sidebar-width:252px;--po-sidebar-collapsed-width:78px;min-height:100vh;display:flex;background:var(--aaib-bg);color:var(--aaib-text)}
          .po-sidebar{position:fixed;z-index:100;inset:0 auto 0 0;width:var(--po-sidebar-width);display:flex;flex-direction:column;padding:22px 14px 18px;background:linear-gradient(180deg,var(--aaib-primary),var(--aaib-primary-strong));color:#fff;transition:width .25s ease,transform .25s ease;box-shadow:8px 0 30px rgba(20,33,24,.08)}
          .po-sidebar-top{height:60px;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:25px}.po-sidebar-logo{flex:1;min-width:0}.po-sidebar-logo img{width:172px;height:48px;object-fit:contain;object-position:left center;display:block}.po-collapse-btn,.po-mobile-close{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.11);border-radius:9px;background:rgba(255,255,255,.04);color:rgba(255,255,255,.72);cursor:pointer}.po-collapse-btn:hover,.po-mobile-close:hover{background:rgba(255,255,255,.09);color:var(--aaib-accent)}.po-mobile-close{display:none}.po-sidebar-label{padding:0 12px;margin-bottom:11px;color:rgba(255,255,255,.38);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;white-space:nowrap;overflow:hidden}.po-nav{display:grid;gap:5px}.po-nav-item{position:relative;display:flex;align-items:center;gap:13px;min-height:43px;padding:10px 12px;border:0;border-radius:9px;background:transparent;color:rgba(255,255,255,.72);text-decoration:none;font-size:13px;font-weight:600;cursor:pointer;text-align:left}.po-nav-item:hover{color:#fff;background:rgba(255,255,255,.055)}.po-nav-item.active{color:var(--aaib-accent);background:linear-gradient(90deg,rgba(197,160,89,.15),rgba(197,160,89,.06))}.po-nav-item.active::before{content:'';position:absolute;left:-1px;top:9px;bottom:9px;width:3px;border-radius:0 3px 3px 0;background:var(--aaib-accent)}.po-nav-icon{width:20px;min-width:20px;display:grid;place-items:center}.po-nav-text{white-space:nowrap;overflow:hidden}.po-sidebar-bottom{margin-top:auto;display:grid;gap:5px;padding-top:15px;border-top:1px solid rgba(255,255,255,.08)}.po-logout{width:100%}
          .po-sidebar-collapsed .po-sidebar{width:var(--po-sidebar-collapsed-width)}.po-sidebar-collapsed .po-sidebar-logo img{width:42px;margin:auto;object-position:center}.po-sidebar-collapsed .po-sidebar-label{opacity:0;height:0;margin:0;padding:0}.po-sidebar-collapsed .po-nav-item{justify-content:center;gap:0;padding-left:0;padding-right:0}.po-sidebar-collapsed .po-nav-text{width:0;opacity:0}.po-sidebar-collapsed .po-collapse-btn{position:absolute;right:-11px;top:73px;width:24px;height:24px;border-radius:50%;background:var(--aaib-primary);box-shadow:0 3px 8px rgba(0,0,0,.18)}.po-sidebar-collapsed .po-collapse-btn svg{transform:rotate(180deg)}
          .po-page{flex:1;min-width:0;margin-left:var(--po-sidebar-width);transition:margin-left .25s ease}.po-sidebar-collapsed .po-page{margin-left:var(--po-sidebar-collapsed-width)}.po-header{position:sticky;z-index:50;top:0;height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(20px,3vw,38px);background:rgba(255,255,255,.92);border-bottom:1px solid var(--aaib-border);backdrop-filter:blur(14px)}.po-header-left,.po-header-right{display:flex;align-items:center}.po-header-left{gap:13px}.po-header-aaib-logo{width:82px;height:32px;object-fit:contain;object-position:left center;display:block;flex-shrink:0}.po-header-title{color:var(--aaib-primary);font-size:14px;font-weight:700}.po-header-right{gap:15px}.po-header-icon{position:relative;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--aaib-border);border-radius:10px;background:#fff;color:var(--aaib-primary);cursor:pointer}.po-header-icon:hover{background:var(--aaib-surface-alt)}.po-notification-dot{position:absolute;top:8px;right:8px;width:6px;height:6px;border-radius:50%;background:var(--aaib-accent);box-shadow:0 0 0 2px #fff}.po-header-user{display:flex;align-items:center;gap:10px;padding:0 0 0 4px;border:0;background:transparent;cursor:pointer}.po-user-avatar{width:36px;height:36px;display:grid;place-items:center;border-radius:50%;background:var(--aaib-primary);color:var(--aaib-accent);font-size:11px;font-weight:800}.po-user-details{text-align:left;display:grid;gap:1px}.po-user-details strong{color:var(--aaib-primary);font-size:12px}.po-user-details small{color:var(--aaib-text-muted);font-size:10px}.po-header-user>svg{color:var(--aaib-text-muted);transform:rotate(90deg)}.po-mobile-menu{display:none;width:38px;height:38px;align-items:center;justify-content:center;border:1px solid var(--aaib-border);border-radius:10px;background:#fff;color:var(--aaib-primary);cursor:pointer}
          .po-main{padding:28px clamp(20px,3vw,42px) 45px}.po-content{width:100%;max-width:1380px;margin:0 auto;animation:fadeIn .35s ease-out}.po-page-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:20px}.po-eyebrow,.po-section-head>div>span{display:block;color:var(--aaib-accent);font-size:9px;font-weight:800;letter-spacing:.14em}.po-page-heading h1{margin:4px 0 5px;color:var(--aaib-primary);font-size:30px;line-height:1.15;letter-spacing:-.03em}.po-page-heading p{margin:0;color:var(--aaib-text-muted);font-size:12px}.po-heading-actions{display:flex;gap:8px;flex-shrink:0}.po-heading-actions .aaib-btn{padding:9px 13px;font-size:10px}
          .po-kpi-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:13px;margin-bottom:15px}.po-kpi-card{min-width:0;padding:16px 17px;border:1px solid var(--aaib-border);border-radius:var(--aaib-radius);background:#fff;box-shadow:var(--aaib-shadow-card);text-align:left;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}.po-kpi-card:hover{transform:translateY(-2px);box-shadow:var(--aaib-shadow-hover)}.po-kpi-top{display:flex;align-items:center;gap:9px;margin-bottom:13px}.po-kpi-icon{width:31px;height:31px;display:grid;place-items:center;border-radius:8px;color:var(--aaib-primary);background:var(--aaib-primary-soft)}.po-kpi-icon.warning{color:var(--aaib-warning);background:var(--aaib-warning-soft)}.po-kpi-icon.gold{color:#96731d;background:var(--aaib-accent-soft)}.po-kpi-icon.active{color:var(--aaib-primary);background:var(--aaib-primary-soft)}.po-kpi-icon.success{color:var(--aaib-success);background:var(--aaib-success-soft)}.po-kpi-icon.danger{color:var(--aaib-danger);background:var(--aaib-danger-soft)}.po-kpi-label{color:var(--aaib-text-muted);font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.po-kpi-card>strong{display:block;color:var(--aaib-primary);font-size:24px;line-height:1;margin-bottom:7px}.po-kpi-card small{color:var(--aaib-text-muted);font-size:8px}
          .po-top-grid,.po-middle-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,.9fr);gap:14px;margin-bottom:14px}.po-panel{min-width:0;padding:20px;background:#fff;border:1px solid var(--aaib-border);border-radius:var(--aaib-radius);box-shadow:var(--aaib-shadow-card)}.po-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:15px}.po-section-head.compact{margin-bottom:13px}.po-section-head h2{margin:3px 0 3px;color:var(--aaib-primary);font-size:16px;line-height:1.2;letter-spacing:-.02em}.po-section-head p{margin:0;color:var(--aaib-text-muted);font-size:9px}.po-link-button{display:inline-flex;align-items:center;gap:5px;padding:0;border:0;background:transparent;color:var(--aaib-primary);font-size:9px;font-weight:700;cursor:pointer;white-space:nowrap}.po-link-button:hover{color:var(--aaib-accent)}.po-list{display:grid;gap:7px}.po-list-row,.po-request-row,.po-deadline-row,.po-notification-empty{width:100%;border:1px solid var(--aaib-border);border-radius:9px;background:#fff;text-align:left;cursor:pointer}.po-list-row{display:flex;align-items:center;gap:10px;padding:10px}.po-list-row:hover,.po-request-row:hover,.po-deadline-row:hover,.po-notification-empty:hover{background:var(--aaib-primary-soft);border-color:rgba(27,40,30,.15)}.po-row-icon{width:31px;height:31px;flex:0 0 auto;display:grid;place-items:center;border-radius:8px;color:var(--aaib-primary);background:var(--aaib-primary-soft)}.po-row-icon.danger{color:var(--aaib-danger);background:var(--aaib-danger-soft)}.po-row-icon.gold{color:#96731d;background:var(--aaib-accent-soft)}.po-row-main{min-width:0;flex:1}.po-row-title{display:flex;align-items:center;gap:7px;margin-bottom:4px}.po-row-title>strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--aaib-primary);font-size:10px}.po-row-meta{display:block;color:var(--aaib-text-muted);font-size:7px}.po-row-meta b{margin:0 4px;color:#aab3ad}.po-status{display:inline-flex;align-items:center;justify-content:center;min-height:20px;padding:0 7px;border-radius:999px;font-size:7px;font-style:normal;font-weight:800;white-space:nowrap}.po-status.success{color:var(--aaib-success);background:var(--aaib-success-soft)}.po-status.warning{color:var(--aaib-warning);background:var(--aaib-warning-soft)}.po-status.danger{color:var(--aaib-danger);background:var(--aaib-danger-soft)}.po-status.active{color:var(--aaib-primary);background:var(--aaib-primary-soft)}.po-status.neutral{color:#53616a;background:#edf1f4}
          .po-request-row{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:11px 10px}.po-request-row>span:first-child{min-width:0}.po-request-row strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--aaib-primary);font-size:10px}.po-request-row small{display:block;margin-top:3px;color:var(--aaib-text-muted);font-size:7px}.po-deadline-row{display:flex;align-items:center;gap:10px;padding:9px}.po-deadline-date{width:38px;height:39px;flex:0 0 auto;display:grid;place-items:center;border-radius:8px;background:var(--aaib-accent-soft);color:var(--aaib-primary)}.po-deadline-date strong{font-size:15px;line-height:1}.po-deadline-date small{font-size:7px;font-weight:800}.po-deadline-row>span:nth-child(2){min-width:0;flex:1}.po-deadline-row>span:nth-child(2) strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--aaib-primary);font-size:9px}.po-deadline-row>span:nth-child(2) small{display:block;margin-top:3px;color:var(--aaib-text-muted);font-size:7px}
          .po-empty-inline{min-height:126px;display:flex;align-items:center;justify-content:center;gap:10px;padding:18px;border:1px dashed rgba(27,40,30,.13);border-radius:9px;background:rgba(255,255,255,.7)}.po-empty-circle{width:38px;height:38px;flex:0 0 auto;display:grid;place-items:center;border-radius:10px;color:var(--aaib-primary);background:var(--aaib-primary-soft)}.po-empty-circle.success{color:var(--aaib-success);background:var(--aaib-success-soft)}.po-empty-circle.warning{color:var(--aaib-warning);background:var(--aaib-warning-soft)}.po-empty-inline strong{display:block;color:var(--aaib-primary);font-size:10px}.po-empty-inline p{margin:3px 0 0;color:var(--aaib-text-muted);font-size:8px}.po-skeleton{height:55px;border-radius:9px;background:linear-gradient(90deg,#f0f2f4 25%,#f7f8f9 50%,#f0f2f4 75%);background-size:200% 100%;animation:poShimmer 1.2s infinite linear}@keyframes poShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          .po-notification-panel{margin-top:0}.po-notification-empty{display:flex;align-items:center;gap:10px;padding:12px}.po-notification-empty>span:nth-child(2){min-width:0;flex:1}.po-notification-empty strong{display:block;color:var(--aaib-primary);font-size:10px}.po-notification-empty small{display:block;margin-top:3px;color:var(--aaib-text-muted);font-size:8px}
          .po-sidebar-backdrop{display:none}
          @media(max-width:1100px){.po-kpi-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.po-top-grid,.po-middle-grid{grid-template-columns:1fr}}
          @media(max-width:760px){.po-sidebar{transform:translateX(-100%)}.po-mobile-sidebar-open .po-sidebar{transform:translateX(0)}.po-mobile-sidebar-open .po-sidebar-backdrop{display:block;position:fixed;z-index:90;inset:0;background:rgba(20,33,24,.42)}.po-mobile-close{display:grid}.po-collapse-btn{display:none}.po-page,.po-sidebar-collapsed .po-page{margin-left:0}.po-mobile-menu{display:inline-flex}.po-page-heading{align-items:flex-start;flex-direction:column}.po-heading-actions{width:100%}.po-heading-actions .aaib-btn{flex:1}.po-kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
          @media(max-width:500px){.po-main{padding:20px 14px 30px}.po-header{padding:0 14px}.po-header-aaib-logo{width:68px}.po-header-title{font-size:12px}.po-user-details{display:none}.po-kpi-grid{grid-template-columns:1fr}.po-heading-actions{flex-direction:column}.po-heading-actions .aaib-btn{width:100%}.po-panel{padding:16px}.po-section-head{align-items:flex-start;flex-direction:column}.po-row-title{align-items:flex-start;flex-direction:column;gap:3px}.po-list-row{padding:10px 8px}}
        `}</style>
      </div>
    </div>
  );
}
