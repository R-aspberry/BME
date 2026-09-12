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

const isProjectRequest = (project) => {
  const status = getStatus(project).trim().toLowerCase();

  return (
    status === 'pending po review' ||
    status === 'pending review' ||
    status === 'submitted' ||
    status === 'new' ||
    status === 'pending'
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ProjectRequests() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
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
     LOAD REQUESTS
  ======================================================== */

  const loadProjects = () => {
    setIsLoading(true);
    setErrorMessage('');

    getProjects()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProjects(list.filter(isProjectRequest));
      })
      .catch((error) => {
        console.error('Failed to load project requests:', error);
        setProjects([]);
        setErrorMessage(
          'We could not load project requests right now. Please try again.'
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
     SEARCH
  ======================================================== */

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return projects;

    return projects.filter((project) => {
      const name = getProjectName(project).toLowerCase();
      const id = String(getProjectId(project) ?? '').toLowerCase();
      const description = getDescription(project).toLowerCase();
      const ownerId = String(
        getBusinessOwnerId(project) ?? ''
      ).toLowerCase();
      const status = getStatus(project).toLowerCase();
      const flag = getFlag(project).toLowerCase();

      return (
        name.includes(normalizedSearch) ||
        id.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        ownerId.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        flag.includes(normalizedSearch)
      );
    });
  }, [projects, searchTerm]);

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

  return (
    <div
      className={`po-shell ${
        sidebarCollapsed ? 'po-sidebar-collapsed' : ''
      } ${mobileSidebarOpen ? 'po-mobile-sidebar-open' : ''}`}
    >
      {/* ===================================================
          SIDEBAR
      ==================================================== */}

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
            <span className="po-nav-text">My Projects</span>
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

      {/* ===================================================
          PAGE
      ==================================================== */}

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

              <Icon name="chevron" size={15} />
            </button>
          </div>
        </header>

        <main className="po-main">
          <div className="po-content">
            {/* PAGE HEADER */}

            <div className="po-request-page-header">
              <div>
                <div className="po-page-eyebrow">PROJECT WORKFLOW</div>

                <h1>Project Requests</h1>

                <p>
                  Review project submissions received from Business Owners
                  before moving them through the project workflow.
                </p>
              </div>

              <div className="po-request-count">
                <span>OPEN REQUESTS</span>
                <strong>{isLoading ? '—' : projects.length}</strong>
              </div>
            </div>

            {/* REQUEST INTRO */}

            <section className="po-request-banner">
              <div className="po-request-banner-icon">
                <Icon name="requests" size={20} />
              </div>

              <div>
                <strong>Requests awaiting Product Owner review</strong>
                <p>
                  Select a request to open the full project details and
                  review the information submitted by the Business Owner.
                </p>
              </div>
            </section>

            {/* REQUEST LIST */}

            <section className="po-request-card">
              <div className="po-request-card-header">
                <div>
                  <span>SUBMITTED BY BUSINESS OWNERS</span>
                  <h2>Incoming Project Requests</h2>
                </div>

                <button
                  type="button"
                  className="po-refresh-button"
                  onClick={loadProjects}
                  disabled={isLoading}
                >
                  <Icon name="refresh" size={15} />
                  Refresh
                </button>
              </div>

              <div className="po-request-search-row">
                <div className="po-request-search">
                  <Icon name="search" size={16} />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search project name, ID, BO ID, status or flag..."
                    aria-label="Search project requests"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      className="po-request-search-clear"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {!isLoading && !errorMessage && projects.length > 0 && (
                <div className="po-request-result-meta">
                  <span>
                    Showing <strong>{filteredRequests.length}</strong> of{' '}
                    <strong>{projects.length}</strong> open requests
                  </span>

                  {searchTerm && (
                    <button type="button" onClick={() => setSearchTerm('')}>
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {isLoading ? (
                <div className="po-request-state">
                  <div className="po-state-loader" aria-hidden="true" />
                  <h3>Loading project requests</h3>
                  <p>
                    Retrieving project submissions from the system.
                  </p>
                </div>
              ) : errorMessage ? (
                <div className="po-request-state">
                  <div className="po-state-icon error">
                    <Icon name="alert" size={22} />
                  </div>

                  <h3>Unable to load project requests</h3>
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
                <div className="po-request-state">
                  <div className="po-state-icon success">
                    <Icon name="check" size={22} />
                  </div>

                  <h3>No project requests</h3>
                  <p>
                    There are currently no project submissions waiting for
                    Product Owner review.
                  </p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="po-request-state compact">
                  <div className="po-state-icon">
                    <Icon name="search" size={22} />
                  </div>

                  <h3>No matching requests</h3>
                  <p>
                    No project request matches your current search.
                  </p>

                  <button
                    type="button"
                    className="aaib-btn aaib-btn-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="po-request-list">
                  {filteredRequests.map((project) => {
                    const id = getProjectId(project);
                    const name = getProjectName(project);
                    const status = getStatus(project);
                    const flag = getFlag(project);
                    const boId = getBusinessOwnerId(project);
                    const startDate = getStartDate(project);
                    const endDate = getEndDate(project);
                    const description = getDescription(project);
                    const budget = getBudget(project);

                    return (
                      <button
                        type="button"
                        key={id}
                        className="po-request-item"
                        onClick={() => openProject(project)}
                      >
                        <div className="po-request-project-icon">
                          <Icon name="briefcase" size={17} />
                        </div>

                        <div className="po-request-project-info">
                          <div className="po-request-project-top">
                            <span className="po-request-eyebrow">
                              PROJECT #{id}
                            </span>

                            <span className="po-request-status">
                              <Icon name="clock" size={11} />
                              {status}
                            </span>
                          </div>

                          <h3>{name}</h3>

                          {description && (
                            <p>{description}</p>
                          )}

                          <div className="po-request-meta">
                            <span>
                              <strong>Business Owner</strong>
                              {boId === null || boId === undefined
                                ? '—'
                                : `BO #${boId}`}
                            </span>

                            <span>
                              <strong>Timeline</strong>
                              {formatDate(startDate)} → {formatDate(endDate)}
                            </span>

                            <span>
                              <strong>Budget</strong>
                              {budget === null || budget === undefined
                                ? '—'
                                : `${formatBudget(budget)} EGP`}
                            </span>

                            <span
                              className={`po-request-flag ${
                                String(flag).toLowerCase().includes('high')
                                  ? 'high'
                                  : ''
                              }`}
                            >
                              <strong>Flag</strong>
                              <span>
                                <Icon name="flag" size={10} />
                                {flag}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="po-request-open">
                          <span>Review</span>
                          <span className="po-request-open-icon">
                            <Icon name="arrowRight" size={15} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {!isLoading && !errorMessage && projects.length > 0 && (
                <div className="po-request-footer">
                  <span>
                    {projects.length === 1
                      ? '1 project request'
                      : `${projects.length} project requests`}{' '}
                    awaiting review
                  </span>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <style>
        {`
          .po-request-page-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 20px;
          }

          .po-page-eyebrow {
            color: var(--aaib-accent);
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .15em;
          }

          .po-request-page-header h1 {
            margin: 4px 0 5px;
            color: var(--aaib-primary);
            font-size: 28px;
            line-height: 1.15;
            letter-spacing: -.03em;
          }

          .po-request-page-header p {
            max-width: 680px;
            margin: 0;
            color: var(--aaib-text-muted);
            font-size: 12px;
            line-height: 1.55;
          }

          .po-request-count {
            min-width: 105px;
            padding: 11px 14px;
            border: 1px solid var(--aaib-border);
            border-radius: 10px;
            background: var(--aaib-surface);
            box-shadow: var(--aaib-shadow-card);
            text-align: right;
          }

          .po-request-count span {
            display: block;
            margin-bottom: 3px;
            color: var(--aaib-text-muted);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .1em;
          }

          .po-request-count strong {
            color: var(--aaib-primary);
            font-size: 20px;
            line-height: 1;
          }

          .po-request-banner {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
            padding: 14px 16px;
            border: 1px solid rgba(197,160,89,.28);
            border-radius: 10px;
            background: var(--aaib-accent-soft);
          }

          .po-request-banner-icon {
            width: 38px;
            height: 38px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: rgba(255,255,255,.65);
            color: #8a6a1b;
          }

          .po-request-banner strong {
            display: block;
            margin-bottom: 2px;
            color: var(--aaib-primary);
            font-size: 10px;
            font-weight: 800;
          }

          .po-request-banner p {
            margin: 0;
            color: #7b6b3e;
            font-size: 9px;
            line-height: 1.5;
          }

          .po-request-card {
            overflow: hidden;
            background: var(--aaib-surface);
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            box-shadow: var(--aaib-shadow-card);
          }

          .po-request-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 21px 23px 16px;
          }

          .po-request-card-header > div > span {
            display: block;
            margin-bottom: 4px;
            color: var(--aaib-accent);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .13em;
          }

          .po-request-card-header h2 {
            margin: 0;
            color: var(--aaib-primary);
            font-size: 18px;
            line-height: 1.2;
            letter-spacing: -.02em;
          }

          .po-refresh-button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            min-height: 32px;
            padding: 0 10px;
            border: 1px solid var(--aaib-border);
            border-radius: 8px;
            background: #fff;
            color: var(--aaib-primary);
            font-size: 9px;
            font-weight: 700;
            cursor: pointer;
            transition: background .18s ease, border-color .18s ease;
          }

          .po-refresh-button:hover:not(:disabled) {
            background: var(--aaib-primary-soft);
            border-color: rgba(27,40,30,.15);
          }

          .po-refresh-button:disabled {
            opacity: .55;
            cursor: not-allowed;
          }

          .po-request-search-row {
            padding: 0 23px 13px;
          }

          .po-request-search {
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 38px;
            padding: 0 11px;
            border: 1px solid var(--aaib-border);
            border-radius: 9px;
            background: #fff;
          }

          .po-request-search > svg {
            flex: 0 0 auto;
            color: var(--aaib-text-muted);
          }

          .po-request-search input {
            min-width: 0;
            flex: 1;
            border: 0;
            outline: 0;
            background: transparent;
            color: var(--aaib-text);
            font: inherit;
            font-size: 10px;
          }

          .po-request-search input::placeholder {
            color: #9aa39e;
          }

          .po-request-search:focus-within {
            border-color: rgba(27,40,30,.2);
            box-shadow: 0 0 0 3px var(--aaib-primary-soft);
          }

          .po-request-search-clear {
            width: 22px;
            height: 22px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border: 0;
            background: transparent;
            color: var(--aaib-text-muted);
            font-size: 16px;
            line-height: 1;
            cursor: pointer;
          }

          .po-request-result-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 0 23px 12px;
            color: var(--aaib-text-muted);
            font-size: 9px;
          }

          .po-request-result-meta strong {
            color: var(--aaib-primary);
          }

          .po-request-result-meta button {
            border: 0;
            padding: 0;
            background: transparent;
            color: var(--aaib-primary);
            font-size: 9px;
            font-weight: 700;
            cursor: pointer;
          }

          .po-request-list {
            border-top: 1px solid var(--aaib-border);
          }

          .po-request-item {
            position: relative;
            display: grid;
            grid-template-columns: 38px minmax(0, 1fr) auto;
            align-items: center;
            gap: 13px;
            width: 100%;
            padding: 17px 23px;
            border: 0;
            border-bottom: 1px solid var(--aaib-border);
            background: #fff;
            color: inherit;
            text-align: left;
            cursor: pointer;
            transition: background .16s ease;
          }

          .po-request-item:last-child {
            border-bottom: 0;
          }

          .po-request-item:hover {
            background: var(--aaib-primary-soft);
          }

          .po-request-project-icon {
            width: 38px;
            height: 38px;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-request-project-info {
            min-width: 0;
          }

          .po-request-project-top {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 7px;
            margin-bottom: 4px;
          }

          .po-request-eyebrow {
            color: var(--aaib-text-muted);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .08em;
          }

          .po-request-status {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            min-height: 18px;
            padding: 0 6px;
            border-radius: 5px;
            background: var(--aaib-accent-soft);
            color: #8a6a1b;
            font-size: 7px;
            font-weight: 800;
          }

          .po-request-project-info h3 {
            margin: 0;
            color: var(--aaib-primary);
            font-size: 13px;
            line-height: 1.25;
            font-weight: 800;
          }

          .po-request-project-info p {
            max-width: 710px;
            margin: 5px 0 10px;
            overflow: hidden;
            color: var(--aaib-text-muted);
            font-size: 9px;
            line-height: 1.5;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-request-meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px 17px;
          }

          .po-request-meta > span {
            display: inline-flex;
            align-items: baseline;
            gap: 4px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            white-space: nowrap;
          }

          .po-request-meta strong {
            color: var(--aaib-text);
            font-size: 8px;
            font-weight: 800;
          }

          .po-request-flag > span {
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .po-request-flag.high > span {
            color: var(--aaib-danger);
            font-weight: 800;
          }

          .po-request-open {
            display: flex;
            align-items: center;
            gap: 7px;
            color: var(--aaib-primary);
            font-size: 8px;
            font-weight: 800;
            white-space: nowrap;
          }

          .po-request-open-icon {
            width: 30px;
            height: 30px;
            display: grid;
            place-items: center;
            border: 1px solid var(--aaib-border);
            border-radius: 8px;
            background: #fff;
            transition: background .16s ease, border-color .16s ease, color .16s ease;
          }

          .po-request-item:hover .po-request-open-icon {
            background: var(--aaib-primary);
            border-color: var(--aaib-primary);
            color: #fff;
          }

          .po-request-footer {
            padding: 11px 23px;
            border-top: 1px solid var(--aaib-border);
            color: var(--aaib-text-muted);
            font-size: 8px;
          }

          .po-request-state {
            min-height: 320px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 35px 24px;
            border-top: 1px solid var(--aaib-border);
            text-align: center;
          }

          .po-request-state.compact {
            min-height: 250px;
          }

          .po-request-state h3 {
            margin: 15px 0 6px;
            color: var(--aaib-primary);
            font-size: 17px;
          }

          .po-request-state p {
            max-width: 430px;
            margin: 0 0 18px;
            color: var(--aaib-text-muted);
            font-size: 10px;
            line-height: 1.6;
          }

          .po-state-icon {
            width: 48px;
            height: 48px;
            display: grid;
            place-items: center;
            border-radius: 13px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-state-icon.error {
            background: var(--aaib-danger-soft);
            color: var(--aaib-danger);
          }

          .po-state-icon.success {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-state-loader {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(27,40,30,.1);
            border-top-color: var(--aaib-accent);
            border-radius: 50%;
            animation: poRequestSpin .8s linear infinite;
          }

          @keyframes poRequestSpin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 850px) {
            .po-request-page-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .po-request-count {
              min-width: 100%;
              text-align: left;
            }

            .po-request-item {
              grid-template-columns: 38px minmax(0, 1fr);
            }

            .po-request-open {
              grid-column: 2;
              justify-content: flex-start;
              margin-top: -2px;
            }
          }

          @media (max-width: 600px) {
            .po-request-card-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .po-refresh-button {
              width: 100%;
              justify-content: center;
            }

            .po-request-item {
              padding: 15px 16px;
              gap: 10px;
            }

            .po-request-search-row,
            .po-request-result-meta {
              padding-left: 16px;
              padding-right: 16px;
            }

            .po-request-meta {
              align-items: flex-start;
              flex-direction: column;
              gap: 6px;
            }

            .po-request-result-meta {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
}
