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
    'aria-hidden': true,
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
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),

    projects: (
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
    ),

    employees: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M16 11a3 3 0 1 0 0-6" />
        <path d="M17 15a5.3 5.3 0 0 1 3.5 5" />
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

    chevronDown: <path d="m7 10 5 5 5-5" />,

    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.5-4L4 9" />
        <path d="M4 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.5 4L20 15" />
        <path d="M20 20v-5h-5" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
      </>
    ),

    flag: (
      <>
        <path d="M5 21V4" />
        <path d="M5 5c4-3 8 3 14 0v9c-6 3-10-3-14 0" />
      </>
    ),

    calendarSmall: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M16 3v4M8 3v4M4 10h16" />
      </>
    ),

    money: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M7 9h.01M17 15h.01" />
      </>
    ),

    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.7 2.7L16 9" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    alert: (
      <>
        <path d="M12 4 21 20H3L12 4Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

/* =========================================================
   HELPERS
========================================================= */

const getProjectId = (project) =>
  project?.prj_ID ?? project?.projectId ?? project?.id ?? null;

const getProjectName = (project) =>
  project?.project_Name ?? project?.projectName ?? project?.name ?? 'Unnamed Project';

const getStatus = (project) =>
  project?.status ?? project?.Status ?? 'Unknown';

const getFlag = (project) =>
  project?.flag ?? project?.Flag ?? '—';

const getDescription = (project) =>
  project?.description ?? project?.Description ?? '';


const getBudget = (project) =>
  project?.budget ?? project?.Budget ?? null;

const getStartDate = (project) =>
  project?.start_date ?? project?.startDate ?? project?.Start_date ?? null;

const getEndDate = (project) =>
  project?.end_date ??
  project?.endDate ??
  project?.expectedDeliveryDate ??
  project?.End_date ??
  null;

const getBusinessOwnerId = (project) =>
  project?.bO_ID ?? project?.bo_ID ?? project?.BO_ID ?? project?.boId ?? null;

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatBudget = (value) => {
  if (value === null || value === undefined || value === '') return '—';

  const amount = Number(value);

  if (Number.isNaN(amount)) return String(value);

  return new Intl.NumberFormat('en-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const isAwaitingPOReview = (project) => {
  const status = getStatus(project).trim().toLowerCase();

  return (
    status === 'pending po review' ||
    status === 'pending review'
  );
};

const getStatusClass = (status) => {
  const normalized = String(status).trim().toLowerCase();

  if (
    normalized === 'completed' ||
    normalized === 'done' ||
    normalized === 'approved'
  ) {
    return 'success';
  }

  if (
    normalized === 'in progress' ||
    normalized === 'active'
  ) {
    return 'progress';
  }

  if (
    normalized === 'pending po review' ||
    normalized === 'pending review' ||
    normalized === 'pending' ||
    normalized === 'submitted' ||
    normalized === 'new'
  ) {
    return 'pending';
  }

  if (
    normalized === 'rejected' ||
    normalized === 'requires attention' ||
    normalized === 'changes requested'
  ) {
    return 'danger';
  }

  return 'neutral';
};

const getFlagClass = (flag) => {
  const normalized = String(flag).trim().toLowerCase();

  if (
    normalized.includes('high') ||
    normalized.includes('critical') ||
    normalized.includes('urgent')
  ) {
    return 'high';
  }

  if (normalized.includes('medium')) {
    return 'medium';
  }

  if (normalized.includes('low')) {
    return 'low';
  }

  return 'default';
};

/* =========================================================
   COMPONENT
========================================================= */

export default function MyProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [flagFilter, setFlagFilter] = useState('All Flags');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /* =======================================================
     LOAD PROJECTS
  ======================================================== */

  const loadProjects = () => {
    setIsLoading(true);
    setErrorMessage('');

    getProjects()
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Failed to load projects:', error);
        setProjects([]);
        setErrorMessage(
          'We could not load the project list right now. Please try again.'
        );
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
    const values = new Set();

    projects.forEach((project) => {
      const status = getStatus(project);

      if (status && status !== 'Unknown') {
        values.add(status);
      }
    });

    return ['All Statuses', ...Array.from(values).sort()];
  }, [projects]);

  const flags = useMemo(() => {
    const values = new Set();

    projects.forEach((project) => {
      const flag = getFlag(project);

      if (flag && flag !== '—') {
        values.add(flag);
      }
    });

    return ['All Flags', ...Array.from(values).sort()];
  }, [projects]);

  /* =======================================================
     PROJECT COUNTS
  ======================================================== */

  const awaitingReviewCount = useMemo(
    () => projects.filter(isAwaitingPOReview).length,
    [projects]
  );

  /* =======================================================
     FILTERED PROJECTS
  ======================================================== */

  const displayedProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const inActiveTab =
        activeTab === 'all' || isAwaitingPOReview(project);

      const name = getProjectName(project).toLowerCase();
      const id = String(getProjectId(project) ?? '').toLowerCase();
      const description = getDescription(project).toLowerCase();
      const businessOwnerId = String(
        getBusinessOwnerId(project) ?? ''
      ).toLowerCase();
      const status = getStatus(project);
      const flag = getFlag(project);

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        id.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        businessOwnerId.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'All Statuses' ||
        status === statusFilter;

      const matchesFlag =
        flagFilter === 'All Flags' ||
        flag === flagFilter;

      return (
        inActiveTab &&
        matchesSearch &&
        matchesStatus &&
        matchesFlag
      );
    });
  }, [
    projects,
    activeTab,
    searchTerm,
    statusFilter,
    flagFilter,
  ]);

  /* =======================================================
     NAVIGATION
  ======================================================== */

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const openProject = (project) => {
    const id = getProjectId(project);

    if (id === null || id === undefined) return;

    navigate(`/po/projects/${id}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setFlagFilter('All Flags');
  };

  return (
    <div
      className={`po-shell ${
        sidebarCollapsed ? 'po-sidebar-collapsed' : ''
      } ${mobileSidebarOpen ? 'po-mobile-sidebar-open' : ''}`}
    >
      <aside className="po-sidebar">
        <div className="po-sidebar-top">
          <div className="po-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
            type="button"
            className="po-collapse-btn"
            onClick={() => setSidebarCollapsed((previous) => !previous)}
            aria-label="Toggle sidebar"
          >
            <Icon
              name={sidebarCollapsed ? 'chevron' : 'menu'}
              size={19}
            />
          </button>

          <button
            type="button"
            className="po-mobile-close"
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        <div className="po-sidebar-section-label">
          Product Owner Portal
        </div>

        <nav className="po-nav">
          <NavLink
            to="/po/dashboard"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="dashboard" />
            </span>
            <span className="po-nav-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/po/project-requests"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="requests" />
            </span>
            <span className="po-nav-text">Project Requests</span>
          </NavLink>

          <NavLink
            to="/po/projects"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="projects" />
            </span>
            <span className="po-nav-text">Projects</span>
          </NavLink>

          <NavLink
            to="/po/employees"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="employees" />
            </span>
            <span className="po-nav-text">Employees</span>
          </NavLink>

          <NavLink
            to="/po/notifications"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="notifications" />
            </span>
            <span className="po-nav-text">Notifications</span>
          </NavLink>

          <NavLink
            to="/po/calendar"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
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
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="profile" />
            </span>
            <span className="po-nav-text">My Profile</span>
          </NavLink>

          <button
            type="button"
            className="po-nav-item po-logout"
            onClick={handleLogout}
          >
            <span className="po-nav-icon">
              <Icon name="logout" />
            </span>
            <span className="po-nav-text">Logout</span>
          </button>
        </div>
      </aside>

      <div
        className="po-sidebar-backdrop"
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      <div className="po-page">
        <header className="po-header">
          <div className="po-header-left">
            <button
              type="button"
              className="po-mobile-menu"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" size={20} />
            </button>

            <img
              src={aaibLogo}
              alt="AAIB"
              className="po-header-aaib-logo"
            />

            <div className="po-header-title">
              Product Owner Portal
            </div>
          </div>

          <div className="po-header-right">
            <button
              type="button"
              className="po-header-icon"
              onClick={() => navigate('/po/notifications')}
              aria-label="Open notifications"
            >
              <Icon name="notifications" size={19} />
              <span className="po-notification-dot" />
            </button>

            <button
              type="button"
              className="po-header-user"
              onClick={() => navigate('/po/profile')}
            >
              <div className="po-user-avatar">{initials}</div>

              <div className="po-user-details">
                <strong>{userName}</strong>
                <span>Product Owner</span>
              </div>

              <Icon name="chevronDown" size={15} />
            </button>
          </div>
        </header>

        <main className="po-main">
          <div className="po-content">
            <div className="po-projects-heading">
              <div>
                <div className="po-page-eyebrow"></div>
                <h1>Projects</h1>
                <p>
                </p>
              </div>

              {/* <button
                type="button"
                className="po-project-refresh"
                onClick={loadProjects}
                disabled={isLoading}
              >
                <Icon name="refresh" size={15} />
                Refresh
              </button> */}
            </div>

            <section className="po-project-kpis">
              <div className="po-project-kpi">
                <div className="po-project-kpi-icon">
                  <Icon name="briefcase" size={18} />
                </div>
                <div>
                  <span>Total Projects</span>
                  <strong>{isLoading ? '—' : projects.length}</strong>
                  <small>Across your current portfolio</small>
                </div>
              </div>

              <div className="po-project-kpi review">
                <div className="po-project-kpi-icon">
                  <Icon name="clock" size={18} />
                </div>
                <div>
                  <span>Awaiting Review</span>
                  <strong>{isLoading ? '—' : awaitingReviewCount}</strong>
                  <small>Projects requiring PO attention</small>
                </div>
              </div>

              <div className="po-project-kpi current">
                <div className="po-project-kpi-icon">
                  <Icon name="check" size={18} />
                </div>
                <div>
                  <span>Visible Projects</span>
                  <strong>{isLoading ? '—' : displayedProjects.length}</strong>
                  <small>Matching your current filters</small>
                </div>
              </div>
            </section>

            <section className="po-projects-card">
              <div className="po-projects-card-head">
                <div>
                  <span className="po-projects-kicker">PROJECT DIRECTORY</span>
                  <h2>Project Portfolio</h2>
                  <p>
                    Select a project to inspect its status, timeline, budget,
                    BRD and resource-planning information.
                  </p>
                </div>

                <div className="po-project-count-pill">
                  {isLoading ? '—' : displayedProjects.length}
                  <span>visible</span>
                </div>
              </div>

              <div className="po-project-tabs">
                <button
                  type="button"
                  className={`po-project-tab ${
                    activeTab === 'all' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  All Projects
                  <strong>{projects.length}</strong>
                </button>

                <button
                  type="button"
                  className={`po-project-tab ${
                    activeTab === 'review' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('review')}
                >
                  Awaiting PO Review
                  <strong>{awaitingReviewCount}</strong>
                </button>
              </div>

              <div className="po-project-toolbar">
                <div className="po-project-search">
                  <Icon name="search" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search projects, IDs, descriptions or BO IDs..."
                    aria-label="Search projects"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      className="po-project-search-clear"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="po-project-filter">
                  <label htmlFor="po-status-filter">Status</label>
                  <div>
                    <select
                      id="po-status-filter"
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevronDown" size={13} />
                  </div>
                </div>

                <div className="po-project-filter">
                  <label htmlFor="po-flag-filter">Flag</label>
                  <div>
                    <select
                      id="po-flag-filter"
                      value={flagFilter}
                      onChange={(event) => setFlagFilter(event.target.value)}
                    >
                      {flags.map((flag) => (
                        <option key={flag} value={flag}>
                          {flag}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevronDown" size={13} />
                  </div>
                </div>
              </div>

              {!isLoading && !errorMessage && projects.length > 0 && (
                <div className="po-project-result-meta">
                  <span>
                    Showing <strong>{displayedProjects.length}</strong> of{' '}
                    <strong>
                      {activeTab === 'review'
                        ? awaitingReviewCount
                        : projects.length}
                    </strong>{' '}
                    projects
                  </span>

                  {(searchTerm ||
                    statusFilter !== 'All Statuses' ||
                    flagFilter !== 'All Flags') && (
                    <button type="button" onClick={clearFilters}>
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {isLoading ? (
                <div className="po-project-state">
                  <div className="po-state-loader" aria-hidden="true" />
                  <h3>Loading projects</h3>
                  <p>Retrieving the project directory from the system.</p>
                </div>
              ) : errorMessage ? (
                <div className="po-project-state">
                  <div className="po-state-icon error">
                    <Icon name="alert" size={22} />
                  </div>
                  <h3>Unable to load projects</h3>
                  <p>{errorMessage}</p>
                  <button
                    type="button"
                    className="aaib-btn aaib-btn-primary"
                    onClick={loadProjects}
                  >
                    <Icon name="refresh" size={15} />
                    Try Again
                  </button>
                </div>
              ) : projects.length === 0 ? (
                <div className="po-project-state">
                  <div className="po-state-icon">
                    <Icon name="briefcase" size={22} />
                  </div>
                  <h3>No projects found</h3>
                  <p>
                    There are currently no projects available in the system.
                  </p>
                </div>
              ) : displayedProjects.length === 0 ? (
                <div className="po-project-state compact">
                  <div className="po-state-icon">
                    <Icon name="search" size={22} />
                  </div>
                  <h3>No matching projects</h3>
                  <p>
                    Try changing your search, tab or project filters.
                  </p>
                  <button
                    type="button"
                    className="aaib-btn aaib-btn-secondary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="po-project-list">
                  <div className="po-project-list-head">
                    <span>Project</span>
                    <span>Status</span>
                    <span>Flag</span>
                    <span>Timeline</span>
                    <span>Budget</span>
                    <span>BO</span>
                    <span aria-hidden="true" />
                  </div>

                  {displayedProjects.map((project) => {
                    const id = getProjectId(project);
                    const name = getProjectName(project);
                    const status = getStatus(project);
                    const flag = getFlag(project);
                    const budget = getBudget(project);
                    const boId = getBusinessOwnerId(project);
                    const startDate = getStartDate(project);
                    const endDate = getEndDate(project);
                    const description = getDescription(project);
                    const isPendingReview = isAwaitingPOReview(project);

                    return (
                      <div
                        key={id}
                        className="po-project-row"
                        onClick={() => openProject(project)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            openProject(project);
                          }
                        }}
                      >
                        <div className="po-project-main">
                          <div className="po-project-row-icon">
                            <Icon name="briefcase" size={17} />
                          </div>

                          <div className="po-project-row-copy">
                            <div className="po-project-row-title">
                              <strong>{name}</strong>
                              {isPendingReview && (
                                <span className="po-review-chip">
                                  <Icon name="clock" size={10} />
                                  Review
                                </span>
                              )}
                            </div>

                            <span>Project #{id}</span>

                            {description && (
                              <p title={description}>{description}</p>
                            )}
                          </div>
                        </div>

                        <div className="po-project-cell">
                          <span className="po-cell-label">Status</span>
                          <span
                            className={`po-status-badge ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="po-project-cell">
                          <span className="po-cell-label">Flag</span>
                          <span
                            className={`po-flag-badge ${getFlagClass(flag)}`}
                          >
                            <Icon name="flag" size={11} />
                            {flag}
                          </span>
                        </div>

                        <div className="po-project-cell timeline">
                          <span className="po-cell-label">Timeline</span>
                          <div>
                            <strong>{formatDate(startDate)}</strong>
                            <span>→</span>
                            <strong>{formatDate(endDate)}</strong>
                          </div>
                        </div>

                        <div className="po-project-cell">
                          <span className="po-cell-label">Budget</span>
                          <strong className="po-project-budget">
                            {budget === null || budget === undefined
                              ? '—'
                              : `${formatBudget(budget)} EGP`}
                          </strong>
                        </div>

                        <div className="po-project-cell">
                          <span className="po-cell-label">BO</span>
                          <strong className="po-bo-id">
                            {boId === null || boId === undefined
                              ? '—'
                              : `#${boId}`}
                          </strong>
                        </div>

                        <div className="po-project-action">
                          <span>{isPendingReview ? 'Review' : 'Open'}</span>
                          <span className="po-project-action-icon">
                            <Icon name="arrowRight" size={15} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <style>
        {`
          .po-projects-heading {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 22px;
          }

          .po-projects-heading h1 {
            margin: 5px 0 6px;
            color: var(--aaib-primary);
            font-size: 32px;
            line-height: 1.05;
            letter-spacing: -.035em;
          }

          .po-projects-heading p {
            max-width: 720px;
            margin: 0;
            color: var(--aaib-text-muted);
            font-size: 12px;
            line-height: 1.6;
          }

          .po-project-refresh {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            min-height: 38px;
            padding: 0 14px;
            flex: 0 0 auto;
            border: 1px solid var(--aaib-border);
            border-radius: 10px;
            background: #fff;
            color: var(--aaib-primary);
            font-size: 11px;
            font-weight: 750;
            cursor: pointer;
            box-shadow: var(--aaib-shadow-card);
            transition: .18s ease;
          }

          .po-project-refresh:hover:not(:disabled) {
            border-color: rgba(27,40,30,.18);
            background: var(--aaib-primary-soft);
            transform: translateY(-1px);
          }

          .po-project-refresh:disabled {
            opacity: .55;
            cursor: not-allowed;
          }

          .po-project-kpis {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 18px;
          }

          .po-project-kpi {
            display: flex;
            align-items: center;
            gap: 13px;
            min-width: 0;
            padding: 16px 17px;
            border: 1px solid var(--aaib-border);
            border-radius: 14px;
            background: #fff;
            box-shadow: var(--aaib-shadow-card);
          }

          .po-project-kpi-icon {
            width: 42px;
            height: 42px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 12px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-project-kpi.review .po-project-kpi-icon {
            background: var(--aaib-accent-soft);
            color: #8b6b20;
          }

          .po-project-kpi.current .po-project-kpi-icon {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-project-kpi span {
            display: block;
            color: var(--aaib-text-muted);
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .07em;
            text-transform: uppercase;
          }

          .po-project-kpi strong {
            display: block;
            margin-top: 2px;
            color: var(--aaib-primary);
            font-size: 23px;
            line-height: 1;
            letter-spacing: -.03em;
          }

          .po-project-kpi small {
            display: block;
            margin-top: 4px;
            color: #8a948e;
            font-size: 9px;
            line-height: 1.3;
          }

          .po-projects-card {
            overflow: hidden;
            border: 1px solid var(--aaib-border);
            border-radius: 15px;
            background: #fff;
            box-shadow: var(--aaib-shadow-card);
          }

          .po-projects-card-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 22px 24px 18px;
          }

          .po-projects-kicker {
            display: block;
            margin-bottom: 4px;
            color: var(--aaib-accent);
            font-size: 8px;
            font-weight: 850;
            letter-spacing: .14em;
          }

          .po-projects-card-head h2 {
            margin: 0;
            color: var(--aaib-primary);
            font-size: 21px;
            line-height: 1.1;
            letter-spacing: -.025em;
          }

          .po-projects-card-head p {
            margin: 6px 0 0;
            color: var(--aaib-text-muted);
            font-size: 10px;
            line-height: 1.5;
          }

          .po-project-count-pill {
            display: flex;
            align-items: baseline;
            gap: 5px;
            flex: 0 0 auto;
            padding: 10px 12px;
            border: 1px solid var(--aaib-border);
            border-radius: 10px;
            background: var(--aaib-surface-alt);
            color: var(--aaib-primary);
            font-size: 19px;
            font-weight: 850;
            line-height: 1;
          }

          .po-project-count-pill span {
            color: var(--aaib-text-muted);
            font-size: 9px;
            font-weight: 700;
          }

          .po-project-tabs {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 0 24px;
            border-bottom: 1px solid var(--aaib-border);
          }

          .po-project-tab {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 7px;
            min-height: 44px;
            padding: 0 11px;
            border: 0;
            background: transparent;
            color: var(--aaib-text-muted);
            font-size: 10px;
            font-weight: 750;
            cursor: pointer;
          }

          .po-project-tab strong {
            min-width: 20px;
            height: 19px;
            display: inline-grid;
            place-items: center;
            padding: 0 5px;
            border-radius: 999px;
            background: var(--aaib-surface-alt);
            color: var(--aaib-text-muted);
            font-size: 8px;
          }

          .po-project-tab::after {
            content: '';
            position: absolute;
            right: 8px;
            bottom: -1px;
            left: 8px;
            height: 2px;
            border-radius: 2px 2px 0 0;
            background: transparent;
          }

          .po-project-tab.active {
            color: var(--aaib-primary);
          }

          .po-project-tab.active strong {
            background: var(--aaib-primary);
            color: var(--aaib-accent);
          }

          .po-project-tab.active::after {
            background: var(--aaib-accent);
          }

          .po-project-toolbar {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 155px 145px;
            gap: 10px;
            align-items: end;
            padding: 18px 24px 12px;
          }

          .po-project-search {
            min-height: 42px;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 0 12px;
            border: 1px solid var(--aaib-border);
            border-radius: 10px;
            background: #fff;
            transition: .18s ease;
          }

          .po-project-search > svg {
            flex: 0 0 auto;
            color: var(--aaib-text-muted);
          }

          .po-project-search input {
            min-width: 0;
            flex: 1;
            border: 0;
            outline: 0;
            background: transparent;
            color: var(--aaib-text);
            font: inherit;
            font-size: 10px;
          }

          .po-project-search input::placeholder {
            color: #9ba49f;
          }

          .po-project-search:focus-within {
            border-color: rgba(27,40,30,.2);
            box-shadow: 0 0 0 3px var(--aaib-primary-soft);
          }

          .po-project-search-clear {
            width: 22px;
            height: 22px;
            display: grid;
            place-items: center;
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--aaib-text-muted);
            font-size: 17px;
            cursor: pointer;
          }

          .po-project-filter label {
            display: block;
            margin: 0 0 5px 2px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .06em;
            text-transform: uppercase;
          }

          .po-project-filter > div {
            position: relative;
          }

          .po-project-filter select {
            width: 100%;
            min-height: 42px;
            padding: 0 30px 0 11px;
            border: 1px solid var(--aaib-border);
            border-radius: 10px;
            outline: 0;
            appearance: none;
            background: #fff;
            color: var(--aaib-text);
            font: inherit;
            font-size: 10px;
            cursor: pointer;
          }

          .po-project-filter > div > svg {
            position: absolute;
            top: 50%;
            right: 10px;
            pointer-events: none;
            color: var(--aaib-text-muted);
            transform: translateY(-50%);
          }

          .po-project-result-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 0 24px 13px;
            color: var(--aaib-text-muted);
            font-size: 9px;
          }

          .po-project-result-meta strong {
            color: var(--aaib-primary);
          }

          .po-project-result-meta button {
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--aaib-primary);
            font-size: 9px;
            font-weight: 800;
            cursor: pointer;
          }

          .po-project-list {
            border-top: 1px solid var(--aaib-border);
          }

          .po-project-list-head,
          .po-project-row {
            display: grid;
            grid-template-columns:
              minmax(260px, 2.25fr)
              minmax(100px, .95fr)
              minmax(95px, .85fr)
              minmax(145px, 1.35fr)
              minmax(105px, .95fr)
              minmax(75px, .7fr)
              minmax(58px, .5fr)
              76px;
            gap: 12px;
            align-items: center;
            padding-left: 24px;
            padding-right: 20px;
          }

          .po-project-list-head {
            min-height: 38px;
            background: #f5f7f6;
            border-bottom: 1px solid var(--aaib-border);
          }

          .po-project-list-head span {
            color: #758078;
            font-size: 7px;
            font-weight: 850;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          .po-project-row {
            min-height: 84px;
            border-bottom: 1px solid var(--aaib-border);
            background: #fff;
            cursor: pointer;
            transition: background .16s ease, box-shadow .16s ease;
          }

          .po-project-row:last-child {
            border-bottom: 0;
          }

          .po-project-row:hover {
            background: #fbfcfb;
            box-shadow: inset 3px 0 0 var(--aaib-accent);
          }

          .po-project-row:focus-visible {
            outline: 2px solid rgba(197,160,89,.7);
            outline-offset: -2px;
          }

          .po-project-main {
            display: flex;
            align-items: center;
            gap: 11px;
            min-width: 0;
          }

          .po-project-row-icon {
            width: 39px;
            height: 39px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 11px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-project-row-copy {
            min-width: 0;
          }

          .po-project-row-title {
            display: flex;
            align-items: center;
            gap: 7px;
            min-width: 0;
          }

          .po-project-row-title > strong {
            min-width: 0;
            color: var(--aaib-primary);
            font-size: 11px;
            font-weight: 850;
            line-height: 1.25;
            overflow-wrap: anywhere;
          }

          .po-project-row-copy > span {
            display: block;
            margin-top: 2px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            font-weight: 700;
          }

          .po-project-row-copy p {
            max-width: 320px;
            margin: 4px 0 0;
            overflow: hidden;
            color: #8a948e;
            font-size: 8px;
            line-height: 1.35;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-review-chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            flex: 0 0 auto;
            min-height: 19px;
            padding: 0 6px;
            border-radius: 999px;
            background: var(--aaib-accent-soft);
            color: #87681c;
            font-size: 7px;
            font-weight: 850;
          }

          .po-project-cell {
            min-width: 0;
          }

          .po-cell-label {
            display: none;
          }

          .po-project-cell.timeline > div {
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            white-space: nowrap;
          }

          .po-project-cell.timeline strong {
            color: var(--aaib-text);
            font-size: 8px;
            font-weight: 700;
          }

          .po-project-cell.timeline span {
            color: #9ba49f;
          }

          .po-project-budget {
            color: var(--aaib-text);
            font-size: 9px;
            font-weight: 800;
            white-space: nowrap;
          }

          .po-bo-id {
            color: var(--aaib-text);
            font-size: 9px;
            font-weight: 750;
          }

          .po-project-action {
            display: inline-flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
            color: var(--aaib-primary);
            font-size: 8px;
            font-weight: 850;
            white-space: nowrap;
          }

          .po-project-action-icon {
            width: 31px;
            height: 31px;
            display: grid;
            place-items: center;
            border: 1px solid var(--aaib-border);
            border-radius: 9px;
            background: #fff;
            transition: .16s ease;
          }

          .po-project-row:hover .po-project-action-icon {
            border-color: var(--aaib-primary);
            background: var(--aaib-primary);
            color: #fff;
          }

          .po-status-badge,
          .po-flag-badge,
          .po-mvp-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            min-height: 24px;
            max-width: 100%;
            padding: 0 8px;
            border-radius: 7px;
            font-size: 8px;
            font-weight: 800;
            white-space: nowrap;
          }

          .po-status-badge.success {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-status-badge.progress {
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-status-badge.pending {
            background: var(--aaib-accent-soft);
            color: #8a6a1b;
          }

          .po-status-badge.danger {
            background: var(--aaib-danger-soft);
            color: var(--aaib-danger);
          }

          .po-status-badge.neutral {
            background: var(--aaib-surface-alt);
            color: var(--aaib-text-muted);
          }

          .po-flag-badge {
            background: var(--aaib-surface-alt);
            color: var(--aaib-text-muted);
          }

          .po-flag-badge.high {
            background: var(--aaib-danger-soft);
            color: var(--aaib-danger);
          }

          .po-flag-badge.medium {
            background: var(--aaib-accent-soft);
            color: #8a6a1b;
          }

          .po-flag-badge.low {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-mvp-badge {
            background: var(--aaib-surface-alt);
            color: var(--aaib-text-muted);
          }

          .po-mvp-badge.approved {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-project-state {
            min-height: 310px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 36px 24px;
            text-align: center;
          }

          .po-project-state.compact {
            min-height: 270px;
          }

          .po-project-state h3 {
            margin: 15px 0 6px;
            color: var(--aaib-primary);
            font-size: 17px;
          }

          .po-project-state p {
            max-width: 430px;
            margin: 0 0 18px;
            color: var(--aaib-text-muted);
            font-size: 10px;
            line-height: 1.6;
          }

          @media (max-width: 1200px) {
            .po-project-list-head,
            .po-project-row {
              grid-template-columns:
                minmax(235px, 2fr)
                minmax(95px, .9fr)
                minmax(90px, .8fr)
                minmax(130px, 1.15fr)
                minmax(100px, .85fr)
                minmax(72px, .65fr)
                52px
                70px;
              gap: 9px;
            }

            .po-project-row-copy p {
              max-width: 240px;
            }
          }

          @media (max-width: 980px) {
            .po-project-kpis {
              grid-template-columns: 1fr 1fr;
            }

            .po-project-kpi.current {
              grid-column: 1 / -1;
            }

            .po-project-toolbar {
              grid-template-columns: minmax(0, 1fr) 150px;
            }

            .po-project-search {
              grid-column: 1 / -1;
            }

            .po-project-list-head {
              display: none;
            }

            .po-project-list {
              display: grid;
              gap: 10px;
              padding: 12px;
              background: var(--aaib-surface-alt);
            }

            .po-project-row {
              display: grid;
              grid-template-columns: minmax(0, 1fr) 160px 130px;
              gap: 12px 18px;
              min-height: 0;
              padding: 17px;
              border: 1px solid var(--aaib-border);
              border-radius: 12px;
              background: #fff;
            }

            .po-project-row:last-child {
              border-bottom: 1px solid var(--aaib-border);
            }

            .po-project-cell {
              padding-left: 2px;
            }

            .po-cell-label {
              display: block;
              margin-bottom: 5px;
              color: var(--aaib-text-muted);
              font-size: 7px;
              font-weight: 850;
              letter-spacing: .07em;
              text-transform: uppercase;
            }

            .po-project-row .po-project-main {
              grid-column: 1 / -1;
              padding-bottom: 4px;
            }

            .po-project-row .po-project-action {
              justify-self: end;
              align-self: end;
            }
          }

          @media (max-width: 720px) {
            .po-projects-heading {
              align-items: flex-start;
              flex-direction: column;
            }

            .po-project-refresh {
              width: 100%;
            }

            .po-project-kpis {
              grid-template-columns: 1fr;
            }

            .po-project-kpi.current {
              grid-column: auto;
            }

            .po-projects-card-head {
              align-items: flex-start;
              flex-direction: column;
            }

            .po-project-toolbar {
              grid-template-columns: 1fr;
            }

            .po-project-search {
              grid-column: auto;
            }

            .po-project-tabs {
              overflow-x: auto;
            }

            .po-project-tab {
              flex: 0 0 auto;
            }

            .po-project-row {
              grid-template-columns: 1fr 1fr;
            }

            .po-project-row .po-project-main {
              grid-column: 1 / -1;
            }

            .po-project-row .po-project-action {
              grid-column: 1 / -1;
              justify-self: stretch;
              justify-content: space-between;
              margin-top: 3px;
              padding-top: 11px;
              border-top: 1px solid var(--aaib-border);
            }
          }

          @media (max-width: 520px) {
            .po-projects-heading h1 {
              font-size: 28px;
            }

            .po-projects-card-head,
            .po-project-tabs,
            .po-project-toolbar,
            .po-project-result-meta {
              padding-left: 16px;
              padding-right: 16px;
            }

            .po-project-list {
              padding: 8px;
            }

            .po-project-row {
              grid-template-columns: 1fr;
              gap: 13px;
              padding: 15px;
            }

            .po-project-row .po-project-main,
            .po-project-row .po-project-action {
              grid-column: auto;
            }

            .po-project-row .po-project-action {
              justify-content: space-between;
            }

            .po-project-cell.timeline > div {
              flex-wrap: wrap;
            }
          }

          /* FINAL ALIGNMENT PASS */
          .po-project-list-head,
          .po-project-row {
            grid-template-columns:
              minmax(360px, 3.2fr)
              125px
              110px
              180px
              135px
              65px
              82px !important;
            column-gap: 14px !important;
            align-items: center !important;
          }

          .po-project-list-head > span,
          .po-project-row > * {
            min-width: 0;
          }

          .po-project-list-head > span {
            text-align: left !important;
          }

          .po-project-main {
            width: 100%;
            min-width: 0;
            align-items: center;
          }

          .po-project-row-copy {
            width: 100%;
            min-width: 0;
          }

          .po-project-row-title {
            width: 100%;
            min-width: 0;
          }

          .po-project-row-title > strong {
            max-width: 100%;
          }

          .po-project-row-copy p {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-project-cell {
            width: 100%;
            min-width: 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          .po-project-cell.timeline > div {
            width: 100%;
            justify-content: flex-start;
          }

          .po-project-cell .po-status-badge,
          .po-project-cell .po-flag-badge,
          .po-project-cell .po-mvp-badge {
            margin: 0;
            justify-self: start;
          }

          .po-project-budget,
          .po-bo-id {
            display: block;
            margin: 0;
          }

          .po-project-action {
            width: 100%;
            justify-content: flex-start;
            justify-self: stretch;
          }

          @media (max-width: 1200px) and (min-width: 981px) {
            .po-project-list-head,
            .po-project-row {
              grid-template-columns:
                minmax(310px, 3fr)
                110px
                100px
                155px
                115px
                60px
                76px !important;
              column-gap: 10px !important;
            }
          }

          @media (max-width: 980px) {
            .po-project-list-head,
            .po-project-row {
              grid-template-columns:
                minmax(0, 1fr)
                160px
                130px !important;
              column-gap: 18px !important;
            }
          }

          @media (max-width: 720px) {
            .po-project-row {
              grid-template-columns: 1fr 1fr !important;
              column-gap: 18px !important;
            }
          }

          @media (max-width: 520px) {
            .po-project-row {
              grid-template-columns: 1fr !important;
              column-gap: 0 !important;
            }
          }


          /* =========================================================
             CLEAN FINAL PROJECT GRID ALIGNMENT
             Header and every row use the exact same percentage grid.
             ========================================================= */

          .po-project-list-head,
          .po-project-row {
            display: grid !important;
            width: 100% !important;
            box-sizing: border-box !important;
            grid-template-columns:
              36%
              11%
              10%
              15%
              10%
              6%
              12% !important;
            column-gap: 0 !important;
            align-items: center !important;
          }

          .po-project-list-head {
            min-height: 38px !important;
            padding-left: 24px !important;
            padding-right: 20px !important;
          }

          .po-project-list-head > span {
            min-width: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            text-align: left !important;
          }

          .po-project-row {
            min-height: 88px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .po-project-main,
          .po-project-cell,
          .po-project-action {
            min-width: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .po-project-main {
            display: flex !important;
            align-items: center !important;
            gap: 11px !important;
            padding-right: 14px !important;
          }

          .po-project-row-copy {
            min-width: 0 !important;
            width: 100% !important;
          }

          .po-project-row-title {
            display: flex !important;
            align-items: flex-start !important;
            gap: 7px !important;
            min-width: 0 !important;
            width: 100% !important;
          }

          .po-project-row-title > strong {
            min-width: 0 !important;
            max-width: 100% !important;
            overflow: visible !important;
            text-overflow: clip !important;
            white-space: normal !important;
            word-break: normal !important;
            color: var(--aaib-primary) !important;
            font-size: 11px !important;
            line-height: 1.25 !important;
          }

          .po-project-row-copy > span,
          .po-project-row-copy p {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }

          .po-project-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
          }

          .po-project-cell.timeline > div {
            width: auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 5px !important;
            white-space: nowrap !important;
          }

          .po-project-action {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 7px !important;
            padding-left: 8px !important;
          }

          .po-project-action-icon {
            flex: 0 0 auto !important;
          }

          @media (max-width: 980px) {
            .po-project-list-head {
              display: none !important;
            }

            .po-project-row {
              display: grid !important;
              grid-template-columns: minmax(0, 1fr) 150px 120px !important;
              column-gap: 16px !important;
            }

            .po-project-row .po-project-main {
              grid-column: 1 / -1 !important;
              width: 100% !important;
              padding-right: 0 !important;
            }

            .po-project-row .po-project-cell {
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }

            .po-project-row .po-project-action {
              width: 100% !important;
              justify-content: flex-end !important;
            }
          }

          @media (max-width: 720px) {
            .po-project-row {
              grid-template-columns: 1fr 1fr !important;
              row-gap: 13px !important;
            }

            .po-project-row .po-project-main {
              grid-column: 1 / -1 !important;
            }

            .po-project-row .po-project-action {
              grid-column: 1 / -1 !important;
              justify-content: space-between !important;
              padding-top: 10px !important;
              border-top: 1px solid var(--aaib-border) !important;
            }
          }

          @media (max-width: 520px) {
            .po-project-row {
              grid-template-columns: 1fr !important;
              row-gap: 12px !important;
            }

            .po-project-row .po-project-main,
            .po-project-row .po-project-action {
              grid-column: auto !important;
            }
          }

        `}
      </style>
    </div>
  );
}

