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

    projects: (
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
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
briefcase: (
  <>
    <rect
      x="3"
      y="6"
      width="18"
      height="14"
      rx="2"
    />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M3 11h18" />
    <path d="M10 11v2h4v-2" />
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
      <path d="M4 6h16M4 12h16M4 18h16" />
    ),

    close: (
      <path d="M6 6l12 12M18 6L6 18" />
    ),

    chevron: (
      <path d="M9 18l6-6-6-6" />
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4 4" />
      </>
    ),

    filter: (
      <>
        <path d="M4 6h16M7 12h10M10 18h4" />
      </>
    ),

    sort: (
      <>
        <path d="M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.8-4L3 9" />
        <path d="M3 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.8 4L21 15" />
        <path d="M21 20v-5h-5" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

/* =========================================================
   HELPERS
========================================================= */

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) return '—';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusType(status) {
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

  if (
    value.includes('progress') ||
    value.includes('active')
  ) {
    return 'active';
  }

  return 'neutral';
}

/* =========================================================
   PAGE
========================================================= */

export default function MyProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('updated');

  const userName =
    localStorage.getItem('userName') || 'User';

  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /* =======================================================
     LOAD PROJECTS
  ======================================================== */

  const loadProjects = () => {
    setIsLoading(true);

    getProjects()
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* =======================================================
     FILTER OPTIONS
  ======================================================== */

  const statuses = useMemo(() => {
    const uniqueStatuses = new Set();

    projects.forEach((project) => {
      if (project.status) {
        uniqueStatuses.add(project.status);
      }
    });

    return ['All', ...Array.from(uniqueStatuses)];
  }, [projects]);

  /* =======================================================
     FILTER + SORT
  ======================================================== */

  const filteredProjects = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = projects.filter((project) => {
      const projectName = (
        project.project_Name || ''
      ).toLowerCase();

      const status = (
        project.status || ''
      ).toLowerCase();

      const poName = (
        project.poName ||
        project.PO_Name ||
        project.po_Name ||
        ''
      ).toLowerCase();

      const matchesSearch =
        !search ||
        projectName.includes(search) ||
        status.includes(search) ||
        poName.includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return (
          (a.project_Name || '').localeCompare(
            b.project_Name || ''
          )
        );
      }

      if (sortBy === 'status') {
        return (
          (a.status || 'Draft').localeCompare(
            b.status || 'Draft'
          )
        );
      }

      /*
        Prefer lastUpdatedDate.
        Fall back to updatedDate / createdDate.
      */
      const dateA =
        parseDate(a.lastUpdatedDate) ||
        parseDate(a.updatedDate) ||
        parseDate(a.createdDate);

      const dateB =
        parseDate(b.lastUpdatedDate) ||
        parseDate(b.updatedDate) ||
        parseDate(b.createdDate);

      return (
        (dateB?.getTime() || 0) -
        (dateA?.getTime() || 0)
      );
    });

    return result;
  }, [
    projects,
    searchTerm,
    statusFilter,
    sortBy,
  ]);

  /* =======================================================
     STATS
  ======================================================== */

  const projectStats = useMemo(() => {
    return {
      total: projects.length,

      active: projects.filter((project) => {
        const status = (
          project.status || ''
        ).toLowerCase();

        return (
          status.includes('active') ||
          status.includes('progress')
        );
      }).length,

      pending: projects.filter((project) => {
        const status = (
          project.status || ''
        ).toLowerCase();

        return (
          status.includes('pending') ||
          status.includes('review')
        );
      }).length,

      completed: projects.filter((project) => {
        const status = (
          project.status || ''
        ).toLowerCase();

        return (
          status.includes('completed') ||
          status.includes('done')
        );
      }).length,
    };
  }, [projects]);

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div
      className={`bo-shell ${
        sidebarCollapsed
          ? 'bo-sidebar-collapsed'
          : ''
      } ${
        mobileSidebarOpen
          ? 'bo-mobile-sidebar-open'
          : ''
      }`}
    >
      {/* ===================================================
          SIDEBAR
      ==================================================== */}

      <aside className="bo-sidebar">
        <div className="bo-sidebar-top">
          <div className="bo-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
            className="bo-collapse-btn"
            onClick={() =>
              setSidebarCollapsed(
                (prev) => !prev
              )
            }
            aria-label="Toggle sidebar"
          >
            <Icon
              name={
                sidebarCollapsed
                  ? 'chevron'
                  : 'menu'
              }
              size={19}
            />
          </button>

          <button
            className="bo-mobile-close"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="bo-sidebar-section-label">
          Business Owner Portal
        </div>

        <nav className="bo-nav">
          <NavLink
            to="/bo/dashboard"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="dashboard" />
            </span>

            <span className="bo-nav-text">
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/bo/projects"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="projects" />
            </span>

            <span className="bo-nav-text">
              My Projects
            </span>
          </NavLink>

          <NavLink
            to="/bo/projects/create"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="create" />
            </span>

            <span className="bo-nav-text">
              Create Project
            </span>
          </NavLink>

          <NavLink
            to="/bo/calendar"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="calendar" />
            </span>

            <span className="bo-nav-text">
              Calendar
            </span>
          </NavLink>

          <NavLink
            to="/bo/notifications"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="notifications" />
            </span>

            <span className="bo-nav-text">
              Notifications
            </span>
          </NavLink>
        </nav>

        <div className="bo-sidebar-bottom">
          <NavLink
            to="/bo/profile"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="profile" />
            </span>

            <span className="bo-nav-text">
              My Profile
            </span>
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

            <span className="bo-nav-text">
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div
        className="bo-sidebar-backdrop"
        onClick={closeMobileSidebar}
      />

      {/* ===================================================
          PAGE
      ==================================================== */}

      <div className="bo-page">

        {/* =================================================
            HEADER
        ================================================== */}

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

  <img
    src={aaibLogo}
    alt="AAIB"
    className="bo-header-aaib-logo"
  />

  <div className="bo-header-title">
    Business Owner Portal
  </div>
</div>

          <div className="bo-header-right">
            <button
              className="bo-header-icon"
              onClick={() =>
                navigate('/bo/notifications')
              }
            >
              <Icon
                name="notifications"
                size={19}
              />

              <span className="bo-notification-dot" />
            </button>

            <div
              className="bo-header-user"
              onClick={() =>
                navigate('/bo/profile')
              }
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

        {/* =================================================
            MAIN
        ================================================== */}

        <main className="bo-main">
          <div className="bo-content">

            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <div className="bo-projects-page-header">
              <div>
                <div className="bo-projects-eyebrow">
                  PROJECT MANAGEMENT
                </div>

                <h1>My Projects</h1>

                <p>
                  
                </p>
              </div>

              <button
                className="aaib-btn aaib-btn-primary"
                onClick={() =>
                  navigate(
                    '/bo/projects/create'
                  )
                }
              >
                <Icon name="create" size={16} />
                Create Project
              </button>
            </div>

            {/* =================================================
                SUMMARY
            ================================================== */}

            <section className="bo-project-summary">
              <div className="bo-project-summary-item">
                <div className="bo-project-summary-icon">
                  <Icon
                    name="briefcase"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    TOTAL PROJECTS
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : projectStats.total}
                  </strong>
                </div>
              </div>

              <div className="bo-project-summary-divider" />

              <div className="bo-project-summary-item">
                <div className="bo-project-summary-icon active">
                  <Icon
                    name="projects"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    IN PROGRESS
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : projectStats.active}
                  </strong>
                </div>
              </div>

              <div className="bo-project-summary-divider" />

              <div className="bo-project-summary-item">
                <div className="bo-project-summary-icon pending">
                  <Icon
                    name="clock"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    PENDING REVIEW
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : projectStats.pending}
                  </strong>
                </div>
              </div>

              <div className="bo-project-summary-divider" />

              <div className="bo-project-summary-item">
                <div className="bo-project-summary-icon completed">
                  <Icon
                    name="check"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    COMPLETED
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : projectStats.completed}
                  </strong>
                </div>
              </div>
            </section>

            {/* =================================================
                TOOLBAR
            ================================================== */}

            <section className="bo-project-toolbar">

              <div className="bo-project-search">
                <Icon
                  name="search"
                  size={17}
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  placeholder="Search projects, status or PO..."
                  aria-label="Search projects"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchTerm('')
                    }
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="bo-project-toolbar-controls">

                <div className="bo-select-wrap">
                  <Icon
                    name="filter"
                    size={15}
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value
                      )
                    }
                    aria-label="Filter by status"
                  >
                    {statuses.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status === 'All'
                            ? 'All Statuses'
                            : status}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="bo-select-wrap">
                  <Icon
                    name="sort"
                    size={15}
                  />

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value
                      )
                    }
                    aria-label="Sort projects"
                  >
                    <option value="updated">
                      Recently Updated
                    </option>

                    <option value="name">
                      Project Name
                    </option>

                    <option value="status">
                      Status
                    </option>
                  </select>
                </div>

                {/* <button
                  className="bo-refresh-button"
                  onClick={loadProjects}
                  disabled={isLoading}
                  title="Refresh projects"
                >
                  <Icon
                    name="refresh"
                    size={16}
                  />

                  <span>Refresh</span>
                </button> */}
              </div>
            </section>

            {/* =================================================
                PROJECT LIST
            ================================================== */}

            <section className="bo-project-list-section">

              <div className="bo-project-list-header">
                <div>
                  <h2>
                    Projects
                  </h2>

                  <span>
                    {isLoading
                      ? 'Loading projects...'
                      : `${filteredProjects.length} ${
                          filteredProjects.length ===
                          1
                            ? 'project'
                            : 'projects'
                        }`}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="bo-my-projects-list">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="bo-my-project-skeleton aaib-skeleton"
                      />
                    )
                  )}
                </div>
              ) : filteredProjects.length ===
                0 ? (
                <div className="bo-my-projects-empty">
                  <div className="bo-my-projects-empty-icon">
                    <Icon
                      name="projects"
                      size={25}
                    />
                  </div>

                  <h3>
                    {projects.length === 0
                      ? 'No projects yet'
                      : 'No projects found'}
                  </h3>

                  <p>
                    {projects.length === 0
                      ? "You haven't raised any projects yet."
                      : 'Try changing your search or filter.'}
                  </p>

                  {projects.length === 0 ? (
                    <button
                      className="aaib-btn aaib-btn-primary"
                      onClick={() =>
                        navigate(
                          '/bo/projects/create'
                        )
                      }
                    >
                      <Icon
                        name="create"
                        size={15}
                      />
                      Create Project
                    </button>
                  ) : (
                    <button
                      className="aaib-btn aaib-btn-secondary"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter(
                          'All'
                        );
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="bo-my-projects-list">
                  {filteredProjects.map(
                    (project) => {
                      const statusType =
                        getStatusType(
                          project.status
                        );

                      const projectName =
                        project.project_Name ||
                        'Untitled Project';

                      const poName =
                        project.poName ||
                        project.PO_Name ||
                        project.po_Name ||
                        'Unassigned';

                      const updatedDate =
                        project.lastUpdatedDate ||
                        project.updatedDate ||
                        project.createdDate;

                      const startDate =
                        project.start_date ||
                        project.startDate ||
                        project.Start_Date;

                      const endDate =
                        project.end_date ||
                        project.endDate ||
                        project.End_Date ||
                        project.expectedDeliveryDate;

                      return (
                        <button
                          type="button"
                          className="bo-my-project-card"
                          key={project.prj_ID}
                          onClick={() =>
                            navigate(
                              `/bo/projects/${project.prj_ID}`
                            )
                          }
                        >
                          <div className="bo-my-project-left">

                            <div className="bo-my-project-icon">
                              <Icon
                                name="briefcase"
                                size={18}
                              />
                            </div>

                            <div className="bo-my-project-content">

                              <div className="bo-my-project-title-row">
                                <h3>
                                  {projectName}
                                </h3>

                                <span
                                  className={`bo-project-status ${statusType}`}
                                >
                                  {project.status ||
                                    'Draft'}
                                </span>
                              </div>

                              <div className="bo-my-project-meta">

                                <span>
                                  <small>
                                    PROJECT ID
                                  </small>

                                  <strong>
                                    {project.prj_ID ||
                                      '—'}
                                  </strong>
                                </span>

                                <span>
                                  <small>
                                    PO
                                  </small>

                                  <strong>
                                    {poName}
                                  </strong>
                                </span>

                                <span>
                                  <small>
                                    START
                                  </small>

                                  <strong>
                                    {formatDate(
                                      startDate
                                    )}
                                  </strong>
                                </span>

                                <span>
                                  <small>
                                    DELIVERY
                                  </small>

                                  <strong>
                                    {formatDate(
                                      endDate
                                    )}
                                  </strong>
                                </span>

                                <span>
                                  <small>
                                    UPDATED
                                  </small>

                                  <strong>
                                    {formatDate(
                                      updatedDate
                                    )}
                                  </strong>
                                </span>

                              </div>
                            </div>
                          </div>

                          <div className="bo-my-project-arrow">
                            <Icon
                              name="chevron"
                              size={17}
                            />
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* =====================================================
          PAGE-SPECIFIC CSS
      ====================================================== */}

      <style>
        {`

        /* ==================================================
           PAGE HEADER
        ================================================== */

        .bo-projects-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 21px;
        }

        .bo-projects-eyebrow {
          color: var(--aaib-accent);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .bo-projects-page-header h1 {
          margin: 4px 0 5px;
          color: var(--aaib-primary);
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: -.03em;
        }

        .bo-projects-page-header p {
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 12px;
        }

        /* ==================================================
           SUMMARY
        ================================================== */

        .bo-project-summary {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);

          align-items: center;
          gap: 18px;

          padding: 15px 18px;
          margin-bottom: 17px;

          background: #fff;

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius);

          box-shadow:
            var(--aaib-shadow-card);
        }

        .bo-project-summary-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bo-project-summary-icon {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 9px;

          color: var(--aaib-primary);
          background: var(--aaib-primary-soft);
        }

        .bo-project-summary-icon.active {
          color: var(--aaib-success);
          background: var(--aaib-success-soft);
        }

        .bo-project-summary-icon.pending {
          color: var(--aaib-warning);
          background: var(--aaib-warning-soft);
        }

        .bo-project-summary-icon.completed {
          color: var(--aaib-success);
          background: var(--aaib-success-soft);
        }

        .bo-project-summary-item span {
          display: block;

          color: var(--aaib-text-muted);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .05em;
        }

        .bo-project-summary-item strong {
          display: block;

          margin-top: 2px;

          color: var(--aaib-primary);

          font-size: 18px;
          line-height: 1;
        }

        .bo-project-summary-divider {
          width: 1px;
          height: 30px;

          background:
            var(--aaib-border);
        }

        /* ==================================================
           TOOLBAR
        ================================================== */

        .bo-project-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 14px;

          padding: 12px;

          margin-bottom: 14px;

          background:
            rgba(255,255,255,.75);

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius-sm);
        }

        .bo-project-search {
          min-width: 260px;
          flex: 1;

          height: 37px;

          display: flex;
          align-items: center;

          gap: 8px;

          padding: 0 10px;

          border:
            1px solid
            rgba(148,163,184,.3);

          border-radius: 8px;

          background: #fff;

          color: #8a9690;
        }

        .bo-project-search:focus-within {
          border-color:
            rgba(27,40,30,.3);

          box-shadow:
            0 0 0 3px
            rgba(27,40,30,.06);
        }

        .bo-project-search input {
          min-width: 0;
          flex: 1;

          border: 0;
          outline: none;

          background: transparent;

          color: var(--aaib-text);

          font-size: 11px;
        }

        .bo-project-search input::placeholder {
          color: #9aa49f;
        }

        .bo-project-search > button {
          width: 22px;
          height: 22px;

          display: grid;
          place-items: center;

          border: 0;
          border-radius: 5px;

          background: #f1f3f2;

          color: #718078;

          cursor: pointer;

          font-size: 16px;
          line-height: 1;
        }

        .bo-project-toolbar-controls {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .bo-select-wrap {
          height: 37px;

          display: flex;
          align-items: center;

          gap: 7px;

          padding: 0 9px;

          border:
            1px solid
            rgba(148,163,184,.3);

          border-radius: 8px;

          background: #fff;

          color: #68776f;
        }

        .bo-select-wrap select {
          border: 0;
          outline: none;

          background: transparent;

          color: var(--aaib-primary);

          font-size: 10px;
          font-weight: 600;

          cursor: pointer;
        }

        .bo-refresh-button {
          height: 37px;

          display: flex;
          align-items: center;

          gap: 6px;

          padding: 0 11px;

          border:
            1px solid
            var(--aaib-border);

          border-radius: 8px;

          background:
            var(--aaib-surface);

          color:
            var(--aaib-primary);

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-refresh-button:hover {
          background:
            var(--aaib-primary-soft);
        }

        .bo-refresh-button:disabled {
          opacity: .55;
          cursor: default;
        }

        /* ==================================================
           LIST
        ================================================== */

        .bo-project-list-section {
          background:
            var(--aaib-surface);

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius);

          box-shadow:
            var(--aaib-shadow-card);

          padding: 19px;
        }

        .bo-project-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding-bottom: 14px;
          margin-bottom: 3px;

          border-bottom:
            1px solid
            var(--aaib-border);
        }

        .bo-project-list-header h2 {
          margin: 0 0 2px;

          color:
            var(--aaib-primary);

          font-size: 16px;
        }

        .bo-project-list-header span {
          color:
            var(--aaib-text-muted);

          font-size: 9px;
        }

        .bo-my-projects-list {
          display: grid;
          gap: 8px;

          padding-top: 10px;
        }

        /* ==================================================
           PROJECT CARD
        ================================================== */

        .bo-my-project-card {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          padding: 14px 15px;

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius-sm);

          background: #fff;

          color: inherit;

          text-align: left;

          cursor: pointer;

          transition:
            transform .18s ease,
            box-shadow .18s ease,
            border-color .18s ease;
        }

        .bo-my-project-card:hover {
          transform:
            translateY(-1px);

          border-color:
            rgba(27,40,30,.16);

          box-shadow:
            0 7px 17px
            rgba(27,40,30,.07);
        }

        .bo-my-project-left {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 12px;

          flex: 1;
        }

        .bo-my-project-icon {
          width: 38px;
          height: 38px;

          flex: 0 0 auto;

          display: grid;
          place-items: center;

          border-radius: 9px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-my-project-content {
          min-width: 0;
          width: 100%;
        }

        .bo-my-project-title-row {
          display: flex;
          align-items: center;

          gap: 9px;

          margin-bottom: 7px;
        }

        .bo-my-project-title-row h3 {
          min-width: 0;

          margin: 0;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          color:
            var(--aaib-primary);

          font-size: 13px;
          font-weight: 750;
        }

        .bo-project-status {
          flex: 0 0 auto;

          display: inline-flex;
          align-items: center;

          min-height: 23px;

          padding: 0 8px;

          border-radius: 999px;

          font-size: 8px;
          font-weight: 800;
        }

        .bo-project-status.success {
          color: var(--aaib-success);
          background: var(--aaib-success-soft);
        }

        .bo-project-status.warning {
          color: var(--aaib-warning);
          background: var(--aaib-warning-soft);
        }

        .bo-project-status.danger {
          color: var(--aaib-danger);
          background: var(--aaib-danger-soft);
        }

        .bo-project-status.active {
          color: var(--aaib-primary);
          background: var(--aaib-primary-soft);
        }

        .bo-project-status.neutral {
          color: #51616b;
          background: #edf1f4;
        }

        .bo-my-project-meta {
          display: flex;
          align-items: center;

          flex-wrap: wrap;

          gap: 0;
        }

        .bo-my-project-meta > span {
          display: flex;
          align-items: center;

          gap: 4px;

          min-height: 28px;

          padding:
            0 15px;

          border-right:
            1px solid
            var(--aaib-border);
        }

        .bo-my-project-meta > span:first-child {
          padding-left: 0;
        }

        .bo-my-project-meta > span:last-child {
          border-right: 0;
        }

        .bo-my-project-meta small {
          color:
            var(--aaib-text-muted);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .bo-my-project-meta strong {
          color:
            #4d5d65;

          font-size: 9px;
          font-weight: 700;
        }

        .bo-my-project-arrow {
          width: 29px;
          height: 29px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 8px;

          color: #9ba59f;

          background:
            #f7f8f7;

          transition:
            all .18s ease;
        }

        .bo-my-project-card:hover
        .bo-my-project-arrow {
          background:
            var(--aaib-primary-soft);

          color:
            var(--aaib-primary);
        }

        /* ==================================================
           SKELETON
        ================================================== */

        .bo-my-project-skeleton {
          height: 83px;

          border-radius:
            var(--aaib-radius-sm);
        }

        /* ==================================================
           EMPTY
        ================================================== */

        .bo-my-projects-empty {
          display: grid;
          place-items: center;

          padding: 55px 20px;

          text-align: center;
        }

        .bo-my-projects-empty-icon {
          width: 52px;
          height: 52px;

          display: grid;
          place-items: center;

          margin-bottom: 12px;

          border-radius: 13px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-my-projects-empty h3 {
          margin: 0 0 5px;

          color:
            var(--aaib-primary);

          font-size: 15px;
        }

        .bo-my-projects-empty p {
          margin: 0 0 16px;

          color:
            var(--aaib-text-muted);

          font-size: 11px;
        }

        .bo-my-projects-empty .aaib-btn {
          font-size: 10px;
          padding: 9px 13px;
        }

        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 1050px) {
          .bo-project-summary {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .bo-project-summary-divider {
            display: none;
          }

          .bo-project-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .bo-project-toolbar-controls {
            width: 100%;
          }

          .bo-select-wrap {
            flex: 1;
          }

          .bo-select-wrap select {
            width: 100%;
          }

          .bo-refresh-button {
            flex: 0 0 auto;
          }
        }

        @media (max-width: 760px) {
          .bo-projects-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .bo-projects-page-header
          .aaib-btn {
            width: 100%;
          }

          .bo-project-summary {
            grid-template-columns: 1fr 1fr;
          }

          .bo-project-toolbar-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .bo-refresh-button {
            grid-column: span 2;
          }

          .bo-my-project-meta > span {
            padding: 0;
            border-right: 0;
            min-height: auto;
          }

          .bo-my-project-meta {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 5px 14px;
          }
        }

        @media (max-width: 500px) {
          .bo-project-summary {
            grid-template-columns: 1fr;
          }

          .bo-project-toolbar-controls {
            grid-template-columns: 1fr;
          }

          .bo-refresh-button {
            grid-column: auto;
          }

          .bo-project-list-section {
            padding: 14px;
          }

          .bo-my-project-card {
            align-items: flex-start;
          }

          .bo-my-project-left {
            align-items: flex-start;
          }

          .bo-my-project-title-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .bo-project-status {
            align-self: flex-start;
          }

          .bo-my-project-arrow {
            margin-top: 4px;
          }

          .bo-my-project-meta {
            grid-template-columns: 1fr;
          }
        }

        `}
      </style>
    </div>
  );
}