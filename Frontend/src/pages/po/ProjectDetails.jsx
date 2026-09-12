import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getProject } from '../../services/projectService';
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

  const icons = {
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

    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="M11 18l-6-6 6-6" />
      </>
    ),

    arrowRight: (
      <>
        <path d="M5 12h14" />
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

    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </>
    ),

    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3.5" />
        <path d="M16 11a3.5 3.5 0 1 0 0-7M21 21v-2a4 4 0 0 0-3-3.87" />
      </>
    ),

    alert: (
      <>
        <path d="M10.3 4.5 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
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

    usersPlus: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M17 8v6M14 11h6" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   HELPERS
========================================================= */

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);

  if (!date) return '—';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatBudget = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat('en-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStatusType = (status) => {
  const value = String(status || 'Unknown').toLowerCase();

  if (
    value.includes('completed') ||
    value.includes('done') ||
    value.includes('approved')
  ) {
    return 'success';
  }

  if (
    value.includes('pending') ||
    value.includes('review') ||
    value.includes('submitted') ||
    value.includes('new')
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
};

const getFlagType = (flag) => {
  if (!flag) return 'none';

  const value = String(flag).toLowerCase();

  if (
    value.includes('critical') ||
    value.includes('red') ||
    value.includes('urgent')
  ) {
    return 'critical';
  }

  if (
    value.includes('high') ||
    value.includes('attention') ||
    value.includes('warning') ||
    value.includes('yellow')
  ) {
    return 'attention';
  }

  if (value.includes('low')) {
    return 'low';
  }

  return 'info';
};

const getProjectId = (project) =>
  project?.prj_ID ?? project?.projectId ?? project?.id ?? null;

const getProjectName = (project) =>
  project?.project_Name ??
  project?.projectName ??
  project?.name ??
  'Untitled Project';

const getDescription = (project) =>
  project?.description ??
  project?.Description ??
  '';

const getStatus = (project) =>
  project?.status ??
  project?.Status ??
  'Unknown';

const getFlag = (project) =>
  project?.flag ??
  project?.Flag ??
  null;

const getMvp = (project) =>
  project?.mvp ??
  project?.MVP ??
  '—';

const getBudget = (project) =>
  project?.budget ??
  project?.Budget ??
  null;

const getStartDate = (project) =>
  project?.start_date ??
  project?.startDate ??
  project?.Start_date ??
  project?.Start_Date ??
  null;

const getEndDate = (project) =>
  project?.end_date ??
  project?.endDate ??
  project?.End_date ??
  project?.End_Date ??
  project?.expectedDeliveryDate ??
  null;

const getBrd = (project) =>
  project?.brd ??
  project?.BRD ??
  null;

const getBusinessOwnerId = (project) =>
  project?.bO_ID ??
  project?.bo_ID ??
  project?.BO_ID ??
  project?.boId ??
  null;

const canOpenBrd = (value) => {
  if (!value || typeof value !== 'string') return false;

  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  );
};

const getBrdLabel = (value) => {
  if (!value) return 'Business Requirements Document';

  if (
    typeof value === 'string' &&
    !value.startsWith('http') &&
    !value.startsWith('data:') &&
    !value.startsWith('blob:')
  ) {
    return value;
  }

  return 'Business Requirements Document';
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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
     LOAD PROJECT
  ======================================================== */

  const loadProject = () => {
    if (!id) {
      setErrorMessage('No project was specified.');
      setProject(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    getProject(id)
      .then((data) => {
        setProject(data || null);

        if (!data) {
          setErrorMessage('The requested project could not be found.');
        }
      })
      .catch((error) => {
        console.error('Failed to load project details:', error);

        setProject(null);
        setErrorMessage(
          error?.message ||
            'Unable to load this project. Please try again.'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  /* =======================================================
     DERIVED DATA
  ======================================================== */

  const status = getStatus(project);
  const flag = getFlag(project);

  const statusType = useMemo(
    () => getStatusType(status),
    [status]
  );

  const flagType = useMemo(
    () => getFlagType(flag),
    [flag]
  );

  const projectName = getProjectName(project);
  const description = getDescription(project);
  const startDate = getStartDate(project);
  const endDate = getEndDate(project);
  const budget = getBudget(project);
  const mvp = getMvp(project);
  const brd = getBrd(project);
  const businessOwnerId = getBusinessOwnerId(project);

  const brdLabel = getBrdLabel(brd);
  const brdIsOpenable = canOpenBrd(brd);

  const isAwaitingReview =
    String(status).trim().toLowerCase() === 'pending po review' ||
    String(status).trim().toLowerCase() === 'pending review';

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

  /* =======================================================
     LOADING
  ======================================================== */

  if (isLoading) {
    return (
      <div className="po-project-detail-loading-page">
        <div className="po-project-detail-loading-card">
          <div className="po-project-detail-loading-icon">
            <Icon name="refresh" size={20} />
          </div>

          <strong>Loading project</strong>

          <span>Retrieving project details...</span>
        </div>

        <style>
          {`
            .po-project-detail-loading-page {
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: 30px;
              background: var(--aaib-bg);
            }

            .po-project-detail-loading-card {
              width: min(420px, 100%);
              display: grid;
              justify-items: center;
              padding: 35px;
              border: 1px solid var(--aaib-border);
              border-radius: var(--aaib-radius);
              background: #fff;
              box-shadow: var(--aaib-shadow-card);
              text-align: center;
            }

            .po-project-detail-loading-icon {
              width: 44px;
              height: 44px;
              display: grid;
              place-items: center;
              margin-bottom: 12px;
              border-radius: 12px;
              background: var(--aaib-primary-soft);
              color: var(--aaib-primary);
            }

            .po-project-detail-loading-icon svg {
              animation: poProjectDetailsSpin 1s linear infinite;
            }

            .po-project-detail-loading-card strong {
              color: var(--aaib-primary);
              font-size: 15px;
            }

            .po-project-detail-loading-card span {
              margin-top: 5px;
              color: var(--aaib-text-muted);
              font-size: 10px;
            }

            @keyframes poProjectDetailsSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  /* =======================================================
     NOT FOUND / ERROR
  ======================================================== */

  if (!project) {
    return (
      <div className="po-project-error-page">
        <div className="po-project-error-card">
          <div className="po-project-error-icon">
            <Icon name="alert" size={25} />
          </div>

          <h2>Project not found</h2>

          <p>
            {errorMessage ||
              'The requested project could not be loaded.'}
          </p>

          <div className="po-project-error-actions">
            <button
              type="button"
              className="aaib-btn aaib-btn-secondary"
              onClick={() => navigate('/po/projects')}
            >
              <Icon name="arrowLeft" size={15} />
              Back to Projects
            </button>

            <button
              type="button"
              className="aaib-btn aaib-btn-primary"
              onClick={loadProject}
            >
              <Icon name="refresh" size={15} />
              Try Again
            </button>
          </div>
        </div>

        <style>
          {`
            .po-project-error-page {
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: 30px;
              background: var(--aaib-bg);
            }

            .po-project-error-card {
              width: min(460px, 100%);
              display: grid;
              justify-items: center;
              padding: 36px;
              border: 1px solid var(--aaib-border);
              border-radius: var(--aaib-radius);
              background: #fff;
              box-shadow: var(--aaib-shadow-card);
              text-align: center;
            }

            .po-project-error-icon {
              width: 50px;
              height: 50px;
              display: grid;
              place-items: center;
              margin-bottom: 12px;
              border-radius: 13px;
              background: var(--aaib-danger-soft);
              color: var(--aaib-danger);
            }

            .po-project-error-card h2 {
              margin: 0 0 6px;
              color: var(--aaib-primary);
              font-size: 18px;
            }

            .po-project-error-card p {
              max-width: 390px;
              margin: 0 0 18px;
              color: var(--aaib-text-muted);
              font-size: 10px;
              line-height: 1.6;
            }

            .po-project-error-actions {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            @media (max-width: 540px) {
              .po-project-error-actions {
                width: 100%;
                flex-direction: column;
              }

              .po-project-error-actions button {
                width: 100%;
              }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      className={`po-shell ${
        sidebarCollapsed ? 'po-sidebar-collapsed' : ''
      } ${
        mobileSidebarOpen ? 'po-mobile-sidebar-open' : ''
      }`}
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
            {/* =================================================
                TOP BAR
            ================================================== */}

            <div className="po-project-topbar">
              <button
                type="button"
                className="po-back-link"
                onClick={() => navigate('/po/projects')}
              >
                <Icon name="arrowLeft" size={14} />
                Back to Projects
              </button>

              <button
                type="button"
                className="po-detail-refresh"
                onClick={loadProject}
                disabled={isLoading}
              >
                <Icon name="refresh" size={14} />
                Refresh
              </button>
            </div>

            {/* =================================================
                HERO
            ================================================== */}

            <section className="po-project-hero">
              <div className="po-project-hero-left">
                <div>
                  <div className="po-project-eyebrow">
                    PROJECT DETAILS
                  </div>

                  <h1>{projectName}</h1>

                  <div className="po-project-id">
                    PROJECT ID · {getProjectId(project) ?? '—'}
                  </div>
                </div>
              </div>

              <div className="po-project-hero-right">
                <span
                  className={`po-project-status ${statusType}`}
                >
                  {status}
                </span>

                {flag && (
                  <span
                    className={`po-project-flag ${flagType}`}
                  >
                    <Icon name="flag" size={12} />
                    {flag}
                  </span>
                )}
              </div>
            </section>

            {/* =================================================
                REVIEW NOTICE
            ================================================== */}

            {isAwaitingReview && (
              <section className="po-review-notice">
                <div className="po-review-notice-icon">
                  <Icon name="clock" size={18} />
                </div>

                <div>
                  <strong>Awaiting Product Owner Review</strong>

                  <p>
                    This project was submitted by a Business Owner and is
                    currently awaiting your review.
                  </p>
                </div>

                <span className="po-review-notice-status">
                  Action required
                </span>
              </section>
            )}

            {/* =================================================
                ERROR
            ================================================== */}

            {errorMessage && (
              <div className="po-project-inline-error">
                <Icon name="alert" size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* =================================================
                OVERVIEW
            ================================================== */}

            <section className="po-project-overview">
              <div className="po-project-overview-item">
                <div className="po-project-overview-icon">
                  <Icon name="briefcase" size={16} />
                </div>

                <div>
                  <span>STATUS</span>
                  <strong>{status}</strong>
                </div>
              </div>

              <div className="po-project-overview-divider" />

              <div className="po-project-overview-item">
                <div className="po-project-overview-icon gold">
                  <Icon name="users" size={16} />
                </div>

                <div>
                  <span>BUSINESS OWNER</span>
                  <strong>
                    {businessOwnerId === null ||
                    businessOwnerId === undefined
                      ? 'Not available'
                      : `BO #${businessOwnerId}`}
                  </strong>
                </div>
              </div>

              <div className="po-project-overview-divider" />

              <div className="po-project-overview-item">
                <div className="po-project-overview-icon">
                  <Icon name="calendarSmall" size={16} />
                </div>

                <div>
                  <span>START DATE</span>
                  <strong>{formatDate(startDate)}</strong>
                </div>
              </div>

              <div className="po-project-overview-divider" />

              <div className="po-project-overview-item">
                <div className="po-project-overview-icon gold">
                  <Icon name="calendarSmall" size={16} />
                </div>

                <div>
                  <span>END DATE</span>
                  <strong>{formatDate(endDate)}</strong>
                </div>
              </div>
            </section>

            {/* =================================================
                MAIN GRID
            ================================================== */}

            <div className="po-project-details-grid">
              {/* =================================================
                  LEFT COLUMN
              ================================================== */}

              <div className="po-project-main-column">
                {/* DESCRIPTION */}

                <section className="po-project-card">
                  <div className="po-project-section-header">
                    <div className="po-project-section-icon">
                      <Icon name="projects" size={17} />
                    </div>

                    <div>
                      <span>PROJECT INFORMATION</span>
                      <h2>Project Description</h2>
                    </div>
                  </div>

                  <div className="po-project-description">
                    {description ? (
                      description
                    ) : (
                      <span className="po-muted-content">
                        No project description has been provided.
                      </span>
                    )}
                  </div>
                </section>

                {/* PROJECT DETAILS */}

                <section className="po-project-card">
                  <div className="po-project-section-header">
                    <div className="po-project-section-icon gold">
                      <Icon name="briefcase" size={17} />
                    </div>

                    <div>
                      <span>PROJECT SUMMARY</span>
                      <h2>Key Project Information</h2>
                    </div>
                  </div>

                  <div className="po-project-information-grid">
                    <div className="po-project-information-item">
                      <span>Project ID</span>
                      <strong>{getProjectId(project) ?? '—'}</strong>
                    </div>

                    <div className="po-project-information-item">
                      <span>Project Name</span>
                      <strong>{projectName}</strong>
                    </div>

                    <div className="po-project-information-item">
                      <span>Status</span>
                      <strong>{status}</strong>
                    </div>

                    <div className="po-project-information-item">
                      <span>Flag</span>

                      <strong className="po-inline-flag">
                        {flag ? (
                          <>
                            <Icon name="flag" size={12} />
                            {flag}
                          </>
                        ) : (
                          'No flag'
                        )}
                      </strong>
                    </div>

                    <div className="po-project-information-item">
                      <span>Budget</span>

                      <strong>
                        {budget === null || budget === undefined
                          ? '—'
                          : `${formatBudget(budget)} EGP`}
                      </strong>
                    </div>

                    <div className="po-project-information-item">
                      <span>MVP</span>

                      <strong
                        className={
                          String(mvp).toLowerCase() === 'approved'
                            ? 'po-mvp-approved'
                            : ''
                        }
                      >
                        {mvp}
                      </strong>
                    </div>
                  </div>
                </section>

                {/* TIMELINE */}

                <section className="po-project-card">
                  <div className="po-project-section-header">
                    <div className="po-project-section-icon">
                      <Icon name="calendar" size={17} />
                    </div>

                    <div>
                      <span>PROJECT TIMELINE</span>
                      <h2>Schedule</h2>
                    </div>
                  </div>

                  <div className="po-project-timeline">
                    <div className="po-project-timeline-item">
                      <div className="po-timeline-marker start" />

                      <div>
                        <span>START DATE</span>
                        <strong>{formatDate(startDate)}</strong>
                      </div>
                    </div>

                    <div className="po-project-timeline-track" />

                    <div className="po-project-timeline-item">
                      <div className="po-timeline-marker end" />

                      <div>
                        <span>EXPECTED END DATE</span>
                        <strong>{formatDate(endDate)}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="po-project-calendar-link"
                    onClick={() => navigate('/po/calendar')}
                  >
                    Open Calendar
                    <Icon name="arrowRight" size={13} />
                  </button>
                </section>

                {/* RESOURCE PLANNING */}

                <section className="po-project-card po-resource-card">
                  <div className="po-project-section-header">
                    <div className="po-project-section-icon green">
                      <Icon name="usersPlus" size={17} />
                    </div>

                    <div>
                      <span>RESOURCE PLANNING</span>
                      <h2>Employee Requirements</h2>
                    </div>
                  </div>

                  <div className="po-resource-planning-content">
                    <div className="po-resource-planning-message">
                      <strong>Plan project resources</strong>

                      <p>
                        Required employee counts by department are handled
                        through the Resource Requests workflow. Use that
                        page to create and monitor resource requirements for
                        this project.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="aaib-btn aaib-btn-secondary"
                      onClick={() => navigate('/po/resource-requests')}
                    >
                      Open Resource Requests
                      <Icon name="arrowRight" size={14} />
                    </button>
                  </div>
                </section>
              </div>

              {/* =================================================
                  RIGHT COLUMN
              ================================================== */}

              <aside className="po-project-side-column">
                {/* BUSINESS OWNER */}

                <section className="po-project-side-card">
                  <div className="po-side-section-header">
                    <div className="po-side-section-icon">
                      <Icon name="users" size={16} />
                    </div>

                    <div>
                      <span>SUBMITTED BY</span>
                      <h3>Business Owner</h3>
                    </div>
                  </div>

                  <div className="po-owner-box">
                    <span>BUSINESS OWNER ID</span>

                    <strong>
                      {businessOwnerId === null ||
                      businessOwnerId === undefined
                        ? 'Not available'
                        : `BO #${businessOwnerId}`}
                    </strong>

                    <small>
                      Business Owner name is not included in the current
                      project API response.
                    </small>
                  </div>
                </section>

                {/* BRD */}

                <section className="po-project-side-card">
                  <div className="po-side-section-header">
                    <div className="po-side-section-icon gold">
                      <Icon name="file" size={16} />
                    </div>

                    <div>
                      <span>DOCUMENTATION</span>
                      <h3>Business Requirements</h3>
                    </div>
                  </div>

                  {brd ? (
                    brdIsOpenable ? (
                      <a
                        href={brd}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="po-brd-card"
                      >
                        <div className="po-brd-icon">
                          <Icon name="file" size={17} />
                        </div>

                        <div>
                          <strong>{brdLabel}</strong>
                          <span>Open document</span>
                        </div>

                        <Icon name="arrowRight" size={13} />
                      </a>
                    ) : (
                      <div className="po-brd-card unavailable">
                        <div className="po-brd-icon">
                          <Icon name="file" size={17} />
                        </div>

                        <div>
                          <strong>{brdLabel}</strong>
                          <span>
                            Document is available, but the current API
                            response does not provide an openable file URL.
                          </span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="po-brd-none">
                      <Icon name="file" size={18} />

                      <div>
                        <strong>BRD unavailable</strong>
                        <span>
                          No Business Requirements Document is attached to
                          this project.
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                {/* PROJECT FLAG */}

                <section className="po-project-side-card">
                  <div className="po-side-section-header">
                    <div
                      className={`po-side-section-icon ${
                        flag ? 'danger' : 'green'
                      }`}
                    >
                      <Icon
                        name={flag ? 'flag' : 'check'}
                        size={16}
                      />
                    </div>

                    <div>
                      <span>PROJECT FLAG</span>
                      <h3>Attention</h3>
                    </div>
                  </div>

                  {flag ? (
                    <div className={`po-active-flag ${flagType}`}>
                      <span>ACTIVE FLAG</span>

                      <strong>{flag}</strong>

                      <p>
                        Review the project flag together with the current
                        project status.
                      </p>
                    </div>
                  ) : (
                    <div className="po-no-flag">
                      <Icon name="check" size={15} />
                      <span>No active flag</span>
                    </div>
                  )}
                </section>

                {/* REVIEW */}

                <section className="po-project-side-card">
                  <div className="po-side-section-header">
                    <div
                      className={`po-side-section-icon ${
                        isAwaitingReview ? 'gold' : 'green'
                      }`}
                    >
                      <Icon
                        name={isAwaitingReview ? 'clock' : 'check'}
                        size={16}
                      />
                    </div>

                    <div>
                      <span>REVIEW STATUS</span>
                      <h3>PO Review</h3>
                    </div>
                  </div>

                  {isAwaitingReview ? (
                    <div className="po-review-status pending">
                      <strong>Awaiting review</strong>
                      <span>
                        This project is currently in the PO review stage.
                      </span>
                    </div>
                  ) : (
                    <div className="po-review-status completed">
                      <strong>Review stage passed</strong>
                      <span>
                        The current project status is {status}.
                      </span>
                    </div>
                  )}
                </section>
              </aside>
            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="po-project-detail-actions">
              <button
                type="button"
                className="aaib-btn aaib-btn-secondary"
                onClick={() => navigate('/po/projects')}
              >
                <Icon name="arrowLeft" size={15} />
                Back to Projects
              </button>

              {isAwaitingReview && (
                <button
                  type="button"
                  className="aaib-btn aaib-btn-primary"
                  onClick={() => navigate('/po/resource-requests')}
                >
                  Continue to Resource Planning
                  <Icon name="arrowRight" size={15} />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      <style>
        {`
          .po-project-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
          }

          .po-back-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--aaib-text-muted);
            font-size: 10px;
            font-weight: 700;
            cursor: pointer;
          }

          .po-back-link:hover {
            color: var(--aaib-primary);
          }

          .po-detail-refresh {
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
          }

          .po-detail-refresh:hover:not(:disabled) {
            background: var(--aaib-primary-soft);
          }

          .po-detail-refresh:disabled {
            opacity: .55;
            cursor: not-allowed;
          }

          .po-project-hero {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 13px;
            padding: 24px 25px;
            border-radius: var(--aaib-radius);
            background: linear-gradient(135deg, #192d20 0%, #294535 100%);
            color: #fff;
            box-shadow: 0 10px 25px rgba(27,40,30,.12);
          }

          .po-project-hero-left {
            min-width: 0;
          }

          .po-project-eyebrow {
            color: var(--aaib-accent);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .14em;
          }

          .po-project-hero h1 {
            max-width: 760px;
            margin: 4px 0 5px;
            overflow: hidden;
            color: #fff;
            font-size: 23px;
            line-height: 1.15;
            letter-spacing: -.025em;
            text-overflow: ellipsis;
          }

          .po-project-id {
            color: rgba(255,255,255,.58);
            font-size: 8px;
            font-weight: 700;
            letter-spacing: .07em;
          }

          .po-project-hero-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 7px;
            flex: 0 0 auto;
          }

          .po-project-status,
          .po-project-flag {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            min-height: 25px;
            padding: 0 10px;
            border-radius: 999px;
            font-size: 9px;
            font-weight: 800;
            white-space: nowrap;
          }

          .po-project-status.success {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-project-status.warning {
            background: var(--aaib-warning-soft);
            color: var(--aaib-warning);
          }

          .po-project-status.danger {
            background: var(--aaib-danger-soft);
            color: var(--aaib-danger);
          }

          .po-project-status.active {
            background: rgba(255,255,255,.11);
            color: #fff;
          }

          .po-project-status.neutral {
            background: rgba(255,255,255,.11);
            color: #dce5df;
          }

          .po-project-flag {
            background: rgba(201,58,58,.18);
            color: #ffd1d1;
          }

          .po-project-flag.attention {
            background: rgba(197,160,89,.16);
            color: #f3d996;
          }

          .po-project-flag.low {
            background: rgba(92,149,111,.16);
            color: #c9ebd2;
          }

          .po-project-flag.info {
            background: rgba(255,255,255,.11);
            color: #dce5df;
          }

          .po-review-notice {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 13px;
            padding: 13px 15px;
            border: 1px solid rgba(197,160,89,.3);
            border-radius: 10px;
            background: var(--aaib-accent-soft);
          }

          .po-review-notice-icon {
            width: 37px;
            height: 37px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: rgba(255,255,255,.65);
            color: #8a6a1b;
          }

          .po-review-notice > div:nth-child(2) {
            min-width: 0;
            flex: 1;
          }

          .po-review-notice strong {
            display: block;
            margin-bottom: 2px;
            color: var(--aaib-primary);
            font-size: 10px;
            font-weight: 800;
          }

          .po-review-notice p {
            margin: 0;
            color: #7b6b3e;
            font-size: 9px;
            line-height: 1.5;
          }

          .po-review-notice-status {
            flex: 0 0 auto;
            padding: 5px 8px;
            border-radius: 999px;
            background: rgba(255,255,255,.65);
            color: #8a6a1b;
            font-size: 7px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .05em;
          }

          .po-project-inline-error {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 13px;
            padding: 10px 13px;
            border-radius: 8px;
            background: var(--aaib-danger-soft);
            color: var(--aaib-danger);
            font-size: 10px;
          }

          .po-project-overview {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            align-items: center;
            gap: 14px;
            margin-bottom: 16px;
            padding: 15px 18px;
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            background: #fff;
            box-shadow: var(--aaib-shadow-card);
          }

          .po-project-overview-item {
            display: flex;
            align-items: center;
            gap: 9px;
            min-width: 0;
          }

          .po-project-overview-icon {
            width: 32px;
            height: 32px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 8px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-project-overview-icon.gold {
            background: var(--aaib-accent-soft);
            color: #96721d;
          }

          .po-project-overview-item span {
            display: block;
            margin-bottom: 3px;
            color: var(--aaib-text-muted);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .07em;
          }

          .po-project-overview-item strong {
            display: block;
            max-width: 190px;
            overflow: hidden;
            color: var(--aaib-primary);
            font-size: 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-project-overview-divider {
            width: 1px;
            height: 28px;
            background: var(--aaib-border);
          }

          .po-project-details-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.55fr) minmax(285px, .75fr);
            align-items: start;
            gap: 16px;
          }

          .po-project-main-column,
          .po-project-side-column {
            min-width: 0;
            display: grid;
            gap: 13px;
          }

          .po-project-card,
          .po-project-side-card {
            min-width: 0;
            background: var(--aaib-surface);
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            box-shadow: var(--aaib-shadow-card);
          }

          .po-project-card {
            padding: 20px;
          }

          .po-project-side-card {
            padding: 17px;
          }

          .po-project-section-header,
          .po-side-section-header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 15px;
          }

          .po-project-section-icon,
          .po-side-section-icon {
            width: 34px;
            height: 34px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 9px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-project-section-icon.gold,
          .po-side-section-icon.gold {
            background: var(--aaib-accent-soft);
            color: #9b771f;
          }

          .po-project-section-icon.green,
          .po-side-section-icon.green {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-side-section-icon.danger {
            background: var(--aaib-danger-soft);
            color: var(--aaib-danger);
          }

          .po-project-section-header span,
          .po-side-section-header span {
            display: block;
            color: var(--aaib-accent);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .12em;
          }

          .po-project-section-header h2,
          .po-side-section-header h3 {
            margin: 3px 0 0;
            color: var(--aaib-primary);
          }

          .po-project-section-header h2 {
            font-size: 16px;
          }

          .po-side-section-header h3 {
            font-size: 13px;
          }

          .po-project-description {
            margin: 0;
            color: var(--aaib-text);
            font-size: 11px;
            line-height: 1.75;
            white-space: pre-wrap;
          }

          .po-muted-content {
            color: var(--aaib-text-muted);
          }

          .po-project-information-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            border-top: 1px solid var(--aaib-border);
            border-left: 1px solid var(--aaib-border);
            border-radius: 9px;
            overflow: hidden;
          }

          .po-project-information-item {
            min-width: 0;
            padding: 14px;
            border-right: 1px solid var(--aaib-border);
            border-bottom: 1px solid var(--aaib-border);
            background: #fff;
          }

          .po-project-information-item span {
            display: block;
            margin-bottom: 5px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .07em;
          }

          .po-project-information-item strong {
            display: block;
            overflow: hidden;
            color: var(--aaib-text);
            font-size: 10px;
            line-height: 1.45;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-inline-flag {
            display: inline-flex !important;
            align-items: center;
            gap: 5px;
            color: var(--aaib-text) !important;
          }

          .po-mvp-approved {
            color: var(--aaib-success) !important;
          }

          .po-project-timeline {
            padding: 3px 0 4px 1px;
          }

          .po-project-timeline-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }

          .po-timeline-marker {
            width: 9px;
            height: 9px;
            flex: 0 0 auto;
            margin-top: 3px;
            border-radius: 50%;
          }

          .po-timeline-marker.start {
            background: var(--aaib-primary);
          }

          .po-timeline-marker.end {
            background: var(--aaib-accent);
          }

          .po-project-timeline-item > div:last-child span {
            display: block;
            color: var(--aaib-text-muted);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .06em;
          }

          .po-project-timeline-item > div:last-child strong {
            display: block;
            margin-top: 2px;
            color: var(--aaib-primary);
            font-size: 10px;
          }

          .po-project-timeline-track {
            width: 1px;
            height: 25px;
            margin: 2px 0 2px 4px;
            background: var(--aaib-border);
          }

          .po-project-calendar-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-top: 13px;
            padding: 11px 0 0;
            border: 0;
            border-top: 1px solid var(--aaib-border);
            background: transparent;
            color: var(--aaib-primary);
            font-size: 9px;
            font-weight: 700;
            cursor: pointer;
          }

          .po-project-calendar-link:hover {
            color: var(--aaib-accent);
          }

          .po-resource-planning-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 13px;
            border: 1px solid var(--aaib-border);
            border-radius: 9px;
            background: var(--aaib-surface-alt);
          }

          .po-resource-planning-message {
            min-width: 0;
          }

          .po-resource-planning-message strong {
            display: block;
            margin-bottom: 4px;
            color: var(--aaib-primary);
            font-size: 10px;
          }

          .po-resource-planning-message p {
            max-width: 600px;
            margin: 0;
            color: var(--aaib-text-muted);
            font-size: 9px;
            line-height: 1.55;
          }

          .po-resource-planning-content .aaib-btn {
            flex: 0 0 auto;
            white-space: nowrap;
          }

          .po-owner-box {
            padding: 12px;
            border-radius: 9px;
            background: var(--aaib-surface-alt);
          }

          .po-owner-box > span {
            display: block;
            margin-bottom: 5px;
            color: var(--aaib-text-muted);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .08em;
          }

          .po-owner-box strong {
            display: block;
            color: var(--aaib-primary);
            font-size: 12px;
          }

          .po-owner-box small {
            display: block;
            margin-top: 7px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            line-height: 1.45;
          }

          .po-brd-card {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 10px;
            border: 1px solid var(--aaib-border);
            border-radius: 9px;
            background: var(--aaib-surface-alt);
            color: inherit;
            text-decoration: none;
          }

          .po-brd-card:hover {
            border-color: rgba(27,40,30,.16);
            background: var(--aaib-primary-soft);
          }

          .po-brd-card.unavailable {
            align-items: flex-start;
          }

          .po-brd-icon {
            width: 32px;
            height: 32px;
            display: grid;
            place-items: center;
            flex: 0 0 auto;
            border-radius: 8px;
            background: #fff;
            color: var(--aaib-primary);
          }

          .po-brd-card > div:nth-child(2) {
            min-width: 0;
            flex: 1;
          }

          .po-brd-card strong {
            display: block;
            overflow: hidden;
            color: var(--aaib-primary);
            font-size: 9px;
            line-height: 1.4;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-brd-card span {
            display: block;
            margin-top: 3px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            line-height: 1.45;
          }

          .po-brd-card > svg {
            flex: 0 0 auto;
            color: #9ba59f;
          }

          .po-brd-none {
            display: flex;
            align-items: flex-start;
            gap: 9px;
            min-height: 64px;
            padding: 10px;
            border: 1px dashed rgba(27,40,30,.12);
            border-radius: 9px;
            background: #fcfdfc;
            color: var(--aaib-text-muted);
          }

          .po-brd-none > svg {
            flex: 0 0 auto;
            margin-top: 1px;
          }

          .po-brd-none strong {
            display: block;
            margin-bottom: 3px;
            color: var(--aaib-primary);
            font-size: 9px;
          }

          .po-brd-none span {
            display: block;
            font-size: 8px;
            line-height: 1.45;
          }

          .po-active-flag {
            padding: 12px;
            border-radius: 9px;
            background: var(--aaib-danger-soft);
          }

          .po-active-flag.attention {
            background: var(--aaib-warning-soft);
          }

          .po-active-flag.low {
            background: var(--aaib-success-soft);
          }

          .po-active-flag.info {
            background: #eaf2ff;
          }

          .po-active-flag > span {
            display: inline-flex;
            margin-bottom: 7px;
            padding: 4px 7px;
            border-radius: 999px;
            background: rgba(255,255,255,.55);
            color: var(--aaib-danger);
            font-size: 7px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .po-active-flag.attention > span {
            color: var(--aaib-warning);
          }

          .po-active-flag.low > span {
            color: var(--aaib-success);
          }

          .po-active-flag.info > span {
            color: #2c6ba4;
          }

          .po-active-flag strong {
            display: block;
            color: var(--aaib-text);
            font-size: 10px;
            line-height: 1.45;
          }

          .po-active-flag p {
            margin: 7px 0 0;
            color: var(--aaib-text-muted);
            font-size: 8px;
            line-height: 1.5;
          }

          .po-no-flag {
            min-height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            border-radius: 9px;
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
            font-size: 9px;
            font-weight: 700;
          }

          .po-review-status {
            display: grid;
            gap: 4px;
            padding: 12px;
            border-radius: 9px;
          }

          .po-review-status.pending {
            background: var(--aaib-accent-soft);
          }

          .po-review-status.completed {
            background: var(--aaib-success-soft);
          }

          .po-review-status strong {
            color: var(--aaib-primary);
            font-size: 9px;
            font-weight: 800;
          }

          .po-review-status.pending strong {
            color: #8a6a1b;
          }

          .po-review-status.completed strong {
            color: var(--aaib-success);
          }

          .po-review-status span {
            color: var(--aaib-text-muted);
            font-size: 8px;
            line-height: 1.45;
          }

          .po-project-detail-actions {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 18px;
            padding-bottom: 4px;
          }

          @media (max-width: 1080px) {
            .po-project-details-grid {
              grid-template-columns: 1fr;
            }

            .po-project-side-column {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 820px) {
            .po-project-overview {
              grid-template-columns: repeat(2, 1fr);
            }

            .po-project-overview-divider {
              display: none;
            }

            .po-project-side-column {
              grid-template-columns: 1fr;
            }

            .po-project-hero {
              align-items: flex-start;
              flex-direction: column;
            }

            .po-project-hero-right {
              align-items: flex-start;
              flex-direction: row;
              flex-wrap: wrap;
            }

            .po-resource-planning-content {
              align-items: flex-start;
              flex-direction: column;
            }

            .po-resource-planning-content .aaib-btn {
              width: 100%;
              justify-content: center;
            }
          }

          @media (max-width: 650px) {
            .po-project-topbar {
              align-items: flex-start;
            }

            .po-detail-refresh {
              flex: 0 0 auto;
            }

            .po-review-notice {
              align-items: flex-start;
              flex-wrap: wrap;
            }

            .po-review-notice-status {
              margin-left: 49px;
            }

            .po-project-overview {
              grid-template-columns: 1fr;
            }

            .po-project-overview-divider {
              display: none;
            }

            .po-project-information-grid {
              grid-template-columns: 1fr;
            }

            .po-project-card {
              padding: 16px;
            }

            .po-project-side-card {
              padding: 15px;
            }

            .po-project-detail-actions {
              display: grid;
              grid-template-columns: 1fr;
            }

            .po-project-detail-actions button {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>
    </div>
  );
}
