import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import aaibLogo from '../../assets/images/aaib.png';

/* =========================================================
   ICONS
========================================================= */

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

/* =========================================================
   HELPERS (unchanged logic)
========================================================= */

const status = (project) =>
  String(project?.status || '').trim().toLowerCase();

const projectName = (project) =>
  project?.project_Name ||
  project?.projectName ||
  project?.name ||
  'Untitled Project';

const projectId = (project) =>
  project?.prj_ID ?? project?.projectId ?? project?.id;

const boName = (project) =>
  project?.boName ||
  project?.bo_Name ||
  project?.businessOwnerName ||
  'Not assigned';

const deadline = (project) =>
  project?.expectedDeliveryDate ||
  project?.endDate ||
  project?.end_date;

const asDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = asDate(value);
  if (!date) return 'TBD';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusType = (value) => {
  const current = String(value || '').toLowerCase();

  if (
    current.includes('completed') ||
    current.includes('done') ||
    current.includes('approved')
  ) {
    return 'success';
  }

  if (
    current.includes('pending') ||
    current.includes('review') ||
    current.includes('submitted') ||
    current.includes('new')
  ) {
    return 'warning';
  }

  if (
    current.includes('rejected') ||
    current.includes('changes') ||
    current.includes('attention')
  ) {
    return 'danger';
  }

  return 'neutral';
};

/* =========================================================
   DASHBOARD
========================================================= */

export default function PODashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';
  const rawName = userName.split('.')[0] || 'User';
  const FN = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const initials = FN
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening';

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
    () =>
      projects.filter((project) =>
        [
          'pending po review',
          'pending review',
          'new',
          'submitted',
          'pending',
        ].includes(status(project))
      ),
    [projects]
  );

  const pendingReview = useMemo(
    () =>
      projects.filter((project) =>
        ['pending po review', 'pending review'].includes(status(project))
      ),
    [projects]
  );

  const inProgress = useMemo(
    () =>
      projects.filter((project) =>
        ['in progress', 'active'].includes(status(project))
      ),
    [projects]
  );

  const completed = useMemo(
    () =>
      projects.filter((project) =>
        ['completed', 'done'].includes(status(project))
      ),
    [projects]
  );

  const attention = useMemo(
    () =>
      projects.filter(
        (project) =>
          Boolean(project?.flag) ||
          ['changes requested', 'rejected', 'requires attention'].includes(
            status(project)
          )
      ),
    [projects]
  );

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const aDate =
          asDate(a?.lastUpdatedDate || a?.updatedAt || a?.createdAt)?.getTime() || 0;
        const bDate =
          asDate(b?.lastUpdatedDate || b?.updatedAt || b?.createdAt)?.getTime() || 0;
        return bDate - aDate;
      })
      .slice(0, 5);
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

  const goToProject = (project) => {
    const id = projectId(project);
    if (id !== undefined && id !== null) {
      navigate(`/po/projects/${id}`);
    }
  };

  return (
    <div
      className={`po-shell ${
        sidebarCollapsed ? 'po-sidebar-collapsed' : ''
      } ${mobileSidebarOpen ? 'po-mobile-sidebar-open' : ''}`}
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="po-sidebar">
        <div className="po-sidebar-top">
          <div className="po-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
            className="po-collapse-btn"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <Icon name={sidebarCollapsed ? 'chevron' : 'menu'} size={19} />
          </button>

          <button className="po-mobile-close" onClick={closeMobileSidebar}>
            <Icon name="close" size={21} />
          </button>
        </div>

        <div className="po-sidebar-section-label">Product Owner Portal</div>

        <nav className="po-nav">
          <NavLink
            to="/po/dashboard"
            className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="dashboard" />
            </span>
            <span className="po-nav-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/po/project-requests"
            className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="requests" />
            </span>
            <span className="po-nav-text">Project Requests</span>
          </NavLink>

          <NavLink
            to="/po/projects"
            className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="projects" />
            </span>
            <span className="po-nav-text">My Projects</span>
          </NavLink>

          <NavLink
            to="/po/employees"
            className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="employees" />
            </span>
            <span className="po-nav-text">Employees</span>
          </NavLink>

          <NavLink
            to="/po/notifications"
            className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="notifications" />
            </span>
            <span className="po-nav-text">Notifications</span>
          </NavLink>

          <NavLink
            to="/po/calendar"
            className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="calendar" />
            </span>
            <span className="po-nav-text">Calendar</span>
          </NavLink>
        </nav>

        <div className="po-sidebar-bottom">
          <NavLink
            to="/po/profile"
            className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="profile" />
            </span>
            <span className="po-nav-text">My Profile</span>
          </NavLink>

          <button
            className="po-nav-item po-logout"
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            <span className="po-nav-icon">
              <Icon name="logout" />
            </span>
            <span className="po-nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      <div className="po-sidebar-backdrop" onClick={closeMobileSidebar} />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="po-page">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="po-header">
          <div className="po-header-left">
            <button className="po-mobile-menu" onClick={() => setMobileSidebarOpen(true)}>
              <Icon name="menu" size={20} />
            </button>

            <div className="po-header-brand">
              <img src={aaibLogo} alt="AAIB" />
            </div>
          </div>

          <div className="po-header-right">
            <button
              className="po-header-icon"
              onClick={() => navigate('/po/notifications')}
              aria-label="Notifications"
            >
              <Icon name="notifications" size={19} />
              <span className="po-notification-dot" />
            </button>

            <div className="po-header-user" onClick={() => navigate('/po/profile')}>
              <div className="po-user-avatar">{initials}</div>

              <div className="po-user-details">
                <strong>{userName}</strong>
                <span>Product Owner</span>
              </div>

              <Icon name="chevron" size={15} />
            </div>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="po-main">
          <div className="po-content">

            {/* HERO */}
            <section className="po-hero">
              <div className="po-hero-content">
                <div className="po-eyebrow">WELCOME BACK</div>

                <h1>
                  {greeting}, {FN}
                </h1>

                <p></p>
              </div>

              <div className="po-hero-mark">{initials}</div>
            </section>

            {/* ACTION BAR */}
            <section className="po-action-bar">
              <div>
                <h2>Project Overview</h2>
                <span>A quick overview of your current project portfolio.</span>
              </div>

              <div className="po-action-buttons">
                <button
                  className="aaib-btn aaib-btn-secondary"
                  onClick={() => navigate('/po/projects')}
                >
                  View Projects
                </button>

                <button
                  className="aaib-btn aaib-btn-primary"
                  onClick={() => navigate('/po/project-requests')}
                >
                  <Icon name="requests" size={17} />
                  Review Requests
                </button>
              </div>
            </section>

            {/* KPI CARDS */}
            <section className="po-kpi-grid">
              <button className="po-kpi-card" onClick={() => navigate('/po/project-requests')}>
                <div className="po-kpi-top">
                  <div className="po-kpi-icon gold">
                    <Icon name="requests" />
                  </div>
                  <span className="po-kpi-label">New Requests</span>
                </div>

                <strong>{isLoading ? '—' : newRequests.length}</strong>

                <span className="po-kpi-description">Awaiting your review</span>
              </button>

              <button className="po-kpi-card" onClick={() => navigate('/po/project-requests')}>
                <div className="po-kpi-top">
                  <div className="po-kpi-icon gold">
                    <Icon name="clock" />
                  </div>
                  <span className="po-kpi-label">Pending PO Review</span>
                </div>

                <strong>{isLoading ? '—' : pendingReview.length}</strong>

                <span className="po-kpi-description">Decision still required</span>
              </button>

              <button className="po-kpi-card" onClick={() => navigate('/po/projects')}>
                <div className="po-kpi-top">
                  <div className="po-kpi-icon green">
                    <Icon name="briefcase" />
                  </div>
                  <span className="po-kpi-label">In Progress</span>
                </div>

                <strong>{isLoading ? '—' : inProgress.length}</strong>

                <span className="po-kpi-description">Currently active</span>
              </button>

              <button className="po-kpi-card" onClick={() => navigate('/po/projects')}>
                <div className="po-kpi-top">
                  <div className="po-kpi-icon success">
                    <Icon name="check" />
                  </div>
                  <span className="po-kpi-label">Completed</span>
                </div>

                <strong>{isLoading ? '—' : completed.length}</strong>

                <span className="po-kpi-description">Successfully completed</span>
              </button>
            </section>

            {/* MAIN GRID */}
            <div className="po-dashboard-grid">

              {/* PROJECTS */}
              <section className="po-section">
                <div className="po-section-header">
                  <div>
                    <span className="po-section-eyebrow">PORTFOLIO</span>
                    <h2>Recent Projects</h2>
                    <p>Your latest project activity</p>
                  </div>

                  <button className="po-text-button" onClick={() => navigate('/po/projects')}>
                    View all
                    <Icon name="arrow" size={15} />
                  </button>
                </div>

                {isLoading ? (
                  <div className="po-projects-list">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="po-project-skeleton aaib-skeleton" />
                    ))}
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="po-empty">
                    <div className="po-empty-icon">
                      <Icon name="projects" size={26} />
                    </div>
                    <h3>No projects available</h3>
                    <p>Available projects will appear here.</p>
                  </div>
                ) : (
                  <div className="po-projects-list">
                    {recentProjects.map((project) => {
                      const statusType = getStatusType(project.status);

                      return (
                        <button
                          key={projectId(project)}
                          className="po-project-card"
                          onClick={() => goToProject(project)}
                        >
                          <div className="po-project-main">
                            <div className="po-project-icon">
                              <Icon name="briefcase" size={18} />
                            </div>

                            <div className="po-project-info">
                              <div className="po-project-name">{projectName(project)}</div>

                              <div className="po-project-meta">
                                <span>
                                  BO: <strong>{boName(project)}</strong>
                                </span>
                                <span>
                                  Updated:{' '}
                                  <strong>
                                    {formatDate(
                                      project?.lastUpdatedDate ||
                                        project?.updatedAt ||
                                        project?.createdAt
                                    )}
                                  </strong>
                                </span>
                                <span>
                                  Delivery: <strong>{formatDate(deadline(project))}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="po-project-right">
                            <span className={`po-status ${statusType}`}>
                              {project.status || 'Open'}
                            </span>
                            <Icon name="chevron" size={17} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* RIGHT COLUMN */}
              <aside className="po-right-column">

                {/* ATTENTION */}
                <section className="po-side-card">
                  <div className="po-side-card-header">
                    <div className="po-side-title">
                      <div className="po-side-icon gold">
                        <Icon name="alert" size={17} />
                      </div>
                      <div>
                        <h3>Requires Attention</h3>
                        <span>Flagged projects</span>
                      </div>
                    </div>

                    <button onClick={() => navigate('/po/projects')}>View all</button>
                  </div>

                  {isLoading ? (
                    <div className="po-side-empty">
                      <span>Loading…</span>
                    </div>
                  ) : attention.length === 0 ? (
                    <div className="po-side-empty">
                      <div className="po-side-empty-icon">
                        <Icon name="check" size={20} />
                      </div>
                      <strong>Nothing needs attention</strong>
                      <span>No flagged projects right now.</span>
                    </div>
                  ) : (
                    <div className="po-projects-list">
                      {attention.slice(0, 3).map((project) => (
                        <button
                          key={projectId(project)}
                          className="po-project-card"
                          onClick={() => goToProject(project)}
                        >
                          <div className="po-project-main">
                            <div className="po-project-icon">
                              <Icon name="alert" size={16} />
                            </div>
                            <div className="po-project-info">
                              <div className="po-project-name">{projectName(project)}</div>
                              <div className="po-project-meta">
                                <span>
                                  BO: <strong>{boName(project)}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                          <Icon name="chevron" size={15} />
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                {/* DEADLINES */}
                <section className="po-side-card">
                  <div className="po-side-card-header">
                    <div className="po-side-title">
                      <div className="po-side-icon">
                        <Icon name="calendar" size={17} />
                      </div>
                      <div>
                        <h3>Upcoming Deadlines</h3>
                        <span>Your schedule</span>
                      </div>
                    </div>

                    <button onClick={() => navigate('/po/calendar')}>Calendar</button>
                  </div>

                  {isLoading ? (
                    <div className="po-side-empty">
                      <span>Loading…</span>
                    </div>
                  ) : upcomingProjects.length === 0 ? (
                    <div className="po-side-empty">
                      <div className="po-side-empty-icon">
                        <Icon name="calendar" size={20} />
                      </div>
                      <strong>No upcoming deadlines</strong>
                      <span>Nothing is scheduled this week.</span>
                    </div>
                  ) : (
                    <div className="po-projects-list">
                      {upcomingProjects.map(({ project, date }) => (
                        <button
                          key={projectId(project)}
                          className="po-project-card"
                          onClick={() => goToProject(project)}
                        >
                          <div className="po-project-main">
                            <div className="po-project-icon">
                              <Icon name="calendar" size={16} />
                            </div>
                            <div className="po-project-info">
                              <div className="po-project-name">{projectName(project)}</div>
                              <div className="po-project-meta">
                                <span>
                                  Delivery: <strong>{formatDate(date)}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                          <Icon name="chevron" size={15} />
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </aside>
            </div>

            {/* NEW PROJECT REQUESTS */}
            <section className="po-section po-requests-section">
              <div className="po-section-header">
                <div>
                  <span className="po-section-eyebrow">INCOMING</span>
                  <h2>New Project Requests</h2>
                  <p>Projects submitted by Business Owners awaiting your review</p>
                </div>

                <button
                  className="po-text-button"
                  onClick={() => navigate('/po/project-requests')}
                >
                  View all
                  <Icon name="arrow" size={15} />
                </button>
              </div>

              {isLoading ? (
                <div className="po-projects-list">
                  <div className="po-project-skeleton aaib-skeleton" />
                  <div className="po-project-skeleton aaib-skeleton" />
                </div>
              ) : newRequests.length === 0 ? (
                <div className="po-empty">
                  <div className="po-empty-icon">
                    <Icon name="requests" size={26} />
                  </div>
                  <h3>No new requests</h3>
                  <p>New BO submissions will appear here.</p>
                </div>
              ) : (
                <div className="po-projects-list">
                  {newRequests.slice(0, 4).map((project) => (
                    <button
                      key={projectId(project)}
                      className="po-project-card"
                      onClick={() => goToProject(project)}
                    >
                      <div className="po-project-main">
                        <div className="po-project-icon">
                          <Icon name="requests" size={18} />
                        </div>
                        <div className="po-project-info">
                          <div className="po-project-name">{projectName(project)}</div>
                          <div className="po-project-meta">
                            <span>
                              Submitted by: <strong>{boName(project)}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="po-project-right">
                        <span className="po-status warning">Pending</span>
                        <Icon name="chevron" size={17} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}