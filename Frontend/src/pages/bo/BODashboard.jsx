import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import { getBOS } from '../../services/boService';
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

    projects: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      </>
    ),

    create: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </>
    ),

    notifications: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
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

    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),

    close: (
      <>
        <path d="M6 6l12 12M18 6L6 18" />
      </>
    ),

    chevron: (
      <>
        <path d="M9 18l6-6-6-6" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4 4" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
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
        <path d="M10.3 4.5L2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h13M13 6l6 6-6 6" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [boName, setBoName] = useState('');

  const userName = localStorage.getItem('userName') || 'User';
  const rawName = userName.split('.')[0] || 'User';
  const FN = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const navigate = useNavigate();

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data || []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    getBOS()
      .then((list) => {
        const currentBO = (list || []).find(
          (bo) => String(bo.user_ID) === String(userId)
        );
        setBoName(currentBO?.name || FN);
      })
      .catch(() => {
        setBoName(FN);
      });
  }, []);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening';

  const stats = {
    total: projects.length,

    inProgress: projects.filter(
      (p) => p.status === 'In Progress' || p.status === 'Active'
    ).length,

    pendingPO: projects.filter(
      (p) => p.status === 'Pending PO Review'
    ).length,

    completed: projects.filter(
      (p) => p.status === 'Done' || p.status === 'Completed'
    ).length,

    requiresAttention: projects.filter(
      (p) => p.flag || p.status === 'Changes Requested'
    ).length,
  };

  const getStatusType = (status) => {
    const value = (status || 'Draft').toLowerCase();

    if (
      value.includes('completed') ||
      value.includes('done') ||
      value.includes('approved')
    ) {
      return 'success';
    }

    if (
      value.includes('pending') ||
      value.includes('review')
    ) {
      return 'warning';
    }

    if (
      value.includes('rejected') ||
      value.includes('changes') ||
      value.includes('attention')
    ) {
      return 'danger';
    }

    return 'neutral';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return 'TBD';
    }

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const displayName = boName || FN;

  const initials = FN
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div
      className={`bo-shell ${
        sidebarCollapsed ? 'bo-sidebar-collapsed' : ''
      } ${mobileSidebarOpen ? 'bo-mobile-sidebar-open' : ''}`}
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="bo-sidebar">
        <div className="bo-sidebar-top">
          <div className="bo-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
            className="bo-collapse-btn"
            onClick={() =>
              setSidebarCollapsed((prev) => !prev)
            }
            aria-label="Toggle sidebar"
          >
            <Icon
              name={sidebarCollapsed ? 'chevron' : 'menu'}
              size={19}
            />
          </button>

          <button
            className="bo-mobile-close"
            onClick={closeMobileSidebar}
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        <div className="bo-sidebar-section-label">
          Business Owner Portal
        </div>

        <nav className="bo-nav">
          <NavLink
            to="/bo/dashboard"
            className={({ isActive }) =>
              `bo-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="dashboard" />
            </span>

            <span className="bo-nav-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/bo/projects"
            className={({ isActive }) =>
              `bo-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="projects" />
            </span>

            <span className="bo-nav-text">My Projects</span>
          </NavLink>

          <NavLink
            to="/bo/projects/create"
            className={({ isActive }) =>
              `bo-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="create" />
            </span>

            <span className="bo-nav-text">Create Project</span>
          </NavLink>

          <NavLink
            to="/bo/calendar"
            className={({ isActive }) =>
              `bo-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="calendar" />
            </span>

            <span className="bo-nav-text">Calendar</span>
          </NavLink>

          <NavLink
            to="/bo/notifications"
            className={({ isActive }) =>
              `bo-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="notifications" />
            </span>

            <span className="bo-nav-text">Notifications</span>
          </NavLink>
        </nav>

        <div className="bo-sidebar-bottom">
          <NavLink
            to="/bo/profile"
            className={({ isActive }) =>
              `bo-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="profile" />
            </span>

            <span className="bo-nav-text">My Profile</span>
          </NavLink>

          <button
            className="bo-nav-item bo-logout"
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            <span className="bo-nav-icon">
              <Icon name="logout" />
            </span>

            <span className="bo-nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      <div
        className="bo-sidebar-backdrop"
        onClick={closeMobileSidebar}
      />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="bo-page">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="bo-header">
          <div className="bo-header-left">
            <button
              className="bo-mobile-menu"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
            >
              <Icon name="menu" size={20} />
            </button>

            <div className="bo-header-brand">
  <img
    src={aaibLogo}
    alt="AAIB"
  />
</div>
          </div>

          <div className="bo-header-right">
            <button
              className="bo-header-icon"
              onClick={() =>
                navigate('/bo/notifications')
              }
              aria-label="Notifications"
            >
              <Icon name="notifications" size={19} />

              <span className="bo-notification-dot" />
            </button>

            <div
              className="bo-header-user"
              onClick={() => navigate('/bo/profile')}
            >
              <div className="bo-user-avatar">
                {initials}
              </div>

              <div className="bo-user-details">
                <strong>{userName}</strong>
                <span>Business Owner</span>
              </div>

              <Icon name="chevron" size={15} />
            </div>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="bo-main">
          <div className="bo-content">

            {/* HERO */}
            <section className="bo-hero">
              <div className="bo-hero-content">
                <div className="bo-eyebrow">
                  WELCOME BACK
                </div>

                <h1>
                  {greeting}, {displayName}
                </h1>

                <p>
                </p>
              </div>

              <div className="bo-hero-mark">
                {initials}
              </div>
            </section>

            {/* ACTION BAR */}
            <section className="bo-action-bar">
              <div>
                <h2>Project Overview</h2>

                <span>
                  A quick overview of your current
                  project portfolio.
                </span>
              </div>

              <div className="bo-action-buttons">
                <button
                  className="aaib-btn aaib-btn-secondary"
                  onClick={() =>
                    navigate('/bo/projects')
                  }
                >
                  View Projects
                </button>

                <button
                  className="aaib-btn aaib-btn-primary"
                  onClick={() =>
                    navigate('/bo/projects/create')
                  }
                >
                  <Icon name="create" size={17} />
                  Create Project
                </button>
              </div>
            </section>

            {/* KPI CARDS */}
<section className="bo-kpi-grid">
  <div className="bo-kpi-card">
    <div className="bo-kpi-top">
      <div className="bo-kpi-icon">
        <Icon name="briefcase" />
      </div>

      <span className="bo-kpi-label">
        Total Projects
      </span>
    </div>

    <strong>
      {isLoading ? '—' : stats.total}
    </strong>

    <span className="bo-kpi-description">
      All projects in your portfolio
    </span>
  </div>

  <div className="bo-kpi-card">
    <div className="bo-kpi-top">
      <div className="bo-kpi-icon green">
        <Icon name="clock" />
      </div>

      <span className="bo-kpi-label">
        In Progress
      </span>
    </div>

    <strong>
      {isLoading ? '—' : stats.inProgress}
    </strong>

    <span className="bo-kpi-description">
      Currently active
    </span>
  </div>

  <div className="bo-kpi-card">
    <div className="bo-kpi-top">
      <div className="bo-kpi-icon gold">
        <Icon name="projects" />
      </div>

      <span className="bo-kpi-label">
        Pending PO
      </span>
    </div>

    <strong>
      {isLoading ? '—' : stats.pendingPO}
    </strong>

    <span className="bo-kpi-description">
      Awaiting PO review
    </span>
  </div>

  <div className="bo-kpi-card">
    <div className="bo-kpi-top">
      <div className="bo-kpi-icon success">
        <Icon name="check" />
      </div>

      <span className="bo-kpi-label">
        Completed
      </span>
    </div>

    <strong>
      {isLoading ? '—' : stats.completed}
    </strong>

    <span className="bo-kpi-description">
      Successfully completed
    </span>
  </div>
</section>

            {/* MAIN GRID */}
            <div className="bo-dashboard-grid">

              {/* PROJECTS */}
              <section className="bo-section">
                <div className="bo-section-header">
                  <div>
                    <span className="bo-section-eyebrow">
                      PORTFOLIO
                    </span>

                    <h2>Recent Projects</h2>

                    <p>
                      Your latest project activity
                    </p>
                  </div>

                  <button
                    className="bo-text-button"
                    onClick={() =>
                      navigate('/bo/projects')
                    }
                  >
                    View all
                    <Icon name="arrow" size={15} />
                  </button>
                </div>

                {isLoading ? (
                  <div className="bo-projects-list">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="bo-project-skeleton aaib-skeleton"
                      />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="bo-empty">
                    <div className="bo-empty-icon">
                      <Icon name="projects" size={26} />
                    </div>

                    <h3>No projects yet</h3>

                    <p>
                      You haven't raised any projects yet.
                    </p>

                    <button
                      className="aaib-btn aaib-btn-primary"
                      onClick={() =>
                        navigate(
                          '/bo/projects/create'
                        )
                      }
                    >
                      Create Project
                    </button>
                  </div>
                ) : (
                  <div className="bo-projects-list">
                    {projects.slice(0, 5).map((project) => {
                      const statusType =
                        getStatusType(
                          project.status
                        );

                      return (
                        <button
                          key={project.prj_ID}
                          className="bo-project-card"
                          onClick={() =>
                            navigate(
                              `/bo/projects/${project.prj_ID}`
                            )
                          }
                        >
                          <div className="bo-project-main">
                            <div className="bo-project-icon">
                              <Icon
                                name="briefcase"
                                size={18}
                              />
                            </div>

                            <div className="bo-project-info">
                              <div className="bo-project-name">
                                {project.project_Name ||
                                  'Untitled Project'}
                              </div>

                              <div className="bo-project-meta">
                                <span>
                                  PO:{' '}
                                  <strong>
                                    {project.poName ||
                                      'Unassigned'}
                                  </strong>
                                </span>

                                <span>
                                  Updated:{' '}
                                  <strong>
                                    {formatDate(
                                      project.lastUpdatedDate
                                    )}
                                  </strong>
                                </span>

                                <span>
                                  Delivery:{' '}
                                  <strong>
                                    {formatDate(
                                      project.expectedDeliveryDate
                                    )}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bo-project-right">
                            <span
                              className={`bo-status ${statusType}`}
                            >
                              {project.status ||
                                'Draft'}
                            </span>

                            <Icon
                              name="chevron"
                              size={17}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* RIGHT COLUMN */}
              <aside className="bo-right-column">

                {/* NOTIFICATIONS */}
                <section className="bo-side-card">
                  <div className="bo-side-card-header">
                    <div className="bo-side-title">
                      <div className="bo-side-icon">
                        <Icon
                          name="notifications"
                          size={17}
                        />
                      </div>

                      <div>
                        <h3>
                          Notifications
                        </h3>

                        <span>
                          Latest updates
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          '/bo/notifications'
                        )
                      }
                    >
                      View all
                    </button>
                  </div>

                  <div className="bo-side-empty">
                    <div className="bo-side-empty-icon">
                      <Icon
                        name="notifications"
                        size={20}
                      />
                    </div>

                    <strong>
                      No new notifications
                    </strong>

                    <span>
                      You're all caught up.
                    </span>
                  </div>
                </section>

                {/* DATES */}
                <section className="bo-side-card">
                  <div className="bo-side-card-header">
                    <div className="bo-side-title">
                      <div className="bo-side-icon gold">
                        <Icon
                          name="calendar"
                          size={17}
                        />
                      </div>

                      <div>
                        <h3>
                          Upcoming Dates
                        </h3>

                        <span>
                          Your schedule
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate('/bo/calendar')
                      }
                    >
                      Calendar
                    </button>
                  </div>

                  <div className="bo-side-empty">
                    <div className="bo-side-empty-icon">
                      <Icon
                        name="calendar"
                        size={20}
                      />
                    </div>

                    <strong>
                      No upcoming deadlines
                    </strong>

                    <span>
                      Nothing is scheduled this
                      week.
                    </span>
                  </div>
                </section>

                {/* QUICK ACTION
                <section className="bo-quick-action">
                  <div className="bo-quick-action-icon">
                    <Icon
                      name="create"
                      size={20}
                    />
                  </div>

                  <span>
                    PROJECT MANAGEMENT
                  </span>

                  <h3>
                    Need to raise a new project?
                  </h3>

                  <p>
                    Start a new project request and
                    submit it for the approval process.
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        '/bo/projects/create'
                      )
                    }
                  >
                    Create Project
                    <Icon name="arrow" size={15} />
                  </button>
                </section> */}

              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}