import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getEmployees } from '../../services/employeeService';
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

    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="M11 18l-6-6 6-6" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),

    building: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M3 21h18M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
      </>
    ),

    id: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8" cy="10" r="2" />
        <path d="M5.5 16a2.8 2.8 0 0 1 5 0M13 9h5M13 13h5" />
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

const getEmployeeId = (employee) =>
  employee?.id ?? employee?.employeeId ?? employee?.ID ?? null;

const getFullName = (employee) =>
  [employee?.fn, employee?.ln].filter(Boolean).join(' ').trim() ||
  employee?.name ||
  'Unnamed Employee';

const getTitle = (employee) => employee?.title || '—';

const getEmail = (employee) => employee?.email || '—';

const getDepartment = (employee) =>
  employee?.departmentName || employee?.department || '—';

/* =========================================================
   COMPONENT
========================================================= */

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employees, setEmployees] = useState([]);
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
     LOAD EMPLOYEES
  ======================================================== */

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage('');

    getEmployees()
      .then((data) => {
        if (!isMounted) return;

        setEmployees(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error('Failed to load employee details:', error);
        setEmployees([]);
        setErrorMessage(
          'We could not load this employee right now. Please try again.'
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     FIND EMPLOYEE
  ======================================================== */

  const employee = useMemo(() => {
    if (!id || !employees.length) return null;

    const routeId = String(id);

    return (
      employees.find(
        (item) => String(getEmployeeId(item)) === routeId
      ) || null
    );
  }, [employees, id]);

  const employeeName = employee ? getFullName(employee) : 'Employee';

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

            <div className="po-employee-details-header">
              <div className="po-employee-heading">
                <button
                  type="button"
                  className="po-back-button"
                  onClick={() => navigate('/po/employees')}
                >
                  <Icon name="arrowLeft" size={15} />
                  Back to Employees
                </button>

                <div className="po-page-eyebrow">EMPLOYEES</div>

                <h1>Employee Details</h1>

                <p>
                  View employee information and organisational details.
                </p>
              </div>
            </div>

            {/* CONTENT */}

            {isLoading ? (
              <section className="po-employee-state-card">
                <div className="po-state-loader" aria-hidden="true" />
                <h2>Loading employee details</h2>
                <p>
                  Retrieving the employee information from the system.
                </p>
              </section>
            ) : errorMessage ? (
              <section className="po-employee-state-card error">
                <div className="po-state-icon">
                  <Icon name="alert" size={22} />
                </div>

                <h2>Unable to load employee</h2>
                <p>{errorMessage}</p>

                <button
                  type="button"
                  className="aaib-btn aaib-btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </section>
            ) : !employee ? (
              <section className="po-employee-state-card">
                <div className="po-state-icon">
                  <Icon name="employees" size={22} />
                </div>

                <h2>Employee not found</h2>
                <p>
                  The requested employee could not be found in the current
                  employee directory.
                </p>

                <button
                  type="button"
                  className="aaib-btn aaib-btn-primary"
                  onClick={() => navigate('/po/employees')}
                >
                  Back to Employees
                </button>
              </section>
            ) : (
              <>
                {/* EMPLOYEE SUMMARY */}

                <section className="po-employee-profile-card">
                  <div className="po-employee-avatar-large">
                    {getFullName(employee)
                      .split(' ')
                      .filter(Boolean)
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="po-employee-summary">
                    <div className="po-employee-summary-eyebrow">
                      EMPLOYEE
                    </div>

                    <h2>{employeeName}</h2>

                    <p>{getTitle(employee)}</p>

                    <div className="po-employee-summary-meta">
                      <span>
                        <Icon name="building" size={13} />
                        {getDepartment(employee)}
                      </span>

                      <span>
                        <Icon name="id" size={13} />
                        Employee ID: {getEmployeeId(employee)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* DETAILS */}

                <section className="po-employee-details-card">
                  <div className="po-section-heading">
                    <div>
                      <span>EMPLOYEE INFORMATION</span>
                      <h2>Personal &amp; Organisational Details</h2>
                    </div>
                  </div>

                  <div className="po-employee-details-grid">
                    <div className="po-detail-item">
                      <span className="po-detail-label">
                        Employee ID
                      </span>

                      <strong>{getEmployeeId(employee)}</strong>
                    </div>

                    <div className="po-detail-item">
                      <span className="po-detail-label">Full Name</span>

                      <strong>{getFullName(employee)}</strong>
                    </div>

                    <div className="po-detail-item">
                      <span className="po-detail-label">Job Title</span>

                      <strong>{getTitle(employee)}</strong>
                    </div>

                    <div className="po-detail-item">
                      <span className="po-detail-label">Department</span>

                      <strong>{getDepartment(employee)}</strong>
                    </div>

                    <div className="po-detail-item po-detail-item-wide">
                      <span className="po-detail-label">Email</span>

                      <strong className="po-detail-email">
                        <Icon name="mail" size={14} />
                        {getEmail(employee)}
                      </strong>
                    </div>
                  </div>
                </section>

                {/* DATA NOTE */}

                <div className="po-employee-data-note">
                  <Icon name="alert" size={15} />

                  <span>
                    Additional personal and organisational fields from
                    PO-10 will appear here when they are provided by the
                    employee API.
                  </span>
                </div>

                {/* FOOTER ACTION */}

                <div className="po-employee-details-actions">
                  <button
                    type="button"
                    className="aaib-btn aaib-btn-secondary"
                    onClick={() => navigate('/po/employees')}
                  >
                    <Icon name="arrowLeft" size={15} />
                    Back to Employees
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <style>
        {`
          .po-employee-details-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 22px;
          }

          .po-employee-heading {
            min-width: 0;
          }

          .po-back-button {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            border: 0;
            padding: 0;
            margin-bottom: 16px;
            background: transparent;
            color: var(--aaib-text-muted);
            font-size: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: color .18s ease;
          }

          .po-back-button:hover {
            color: var(--aaib-primary);
          }

          .po-page-eyebrow {
            color: var(--aaib-accent);
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .15em;
          }

          .po-employee-heading h1 {
            margin: 4px 0 5px;
            color: var(--aaib-primary);
            font-size: 28px;
            line-height: 1.15;
            letter-spacing: -.03em;
          }

          .po-employee-heading p {
            margin: 0;
            color: var(--aaib-text-muted);
            font-size: 12px;
          }

          .po-employee-profile-card,
          .po-employee-details-card,
          .po-employee-state-card {
            background: var(--aaib-surface);
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            box-shadow: var(--aaib-shadow-card);
          }

          .po-employee-profile-card {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 24px;
            margin-bottom: 18px;
          }

          .po-employee-avatar-large {
            width: 70px;
            height: 70px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 17px;
            background: var(--aaib-primary);
            color: var(--aaib-accent);
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -.03em;
          }

          .po-employee-summary {
            min-width: 0;
          }

          .po-employee-summary-eyebrow,
          .po-section-heading > div > span {
            display: block;
            margin-bottom: 4px;
            color: var(--aaib-accent);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .13em;
          }

          .po-employee-summary h2 {
            margin: 0;
            color: var(--aaib-primary);
            font-size: 23px;
            line-height: 1.2;
            letter-spacing: -.025em;
          }

          .po-employee-summary p {
            margin: 5px 0 12px;
            color: var(--aaib-text-muted);
            font-size: 12px;
          }

          .po-employee-summary-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 13px;
          }

          .po-employee-summary-meta span {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            color: var(--aaib-text-muted);
            font-size: 10px;
            font-weight: 600;
          }

          .po-employee-summary-meta svg {
            color: var(--aaib-primary);
          }

          .po-employee-details-card {
            padding: 23px;
          }

          .po-section-heading {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 20px;
          }

          .po-section-heading h2 {
            margin: 0;
            color: var(--aaib-primary);
            font-size: 18px;
            line-height: 1.2;
            letter-spacing: -.02em;
          }

          .po-employee-details-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            border-top: 1px solid var(--aaib-border);
            border-left: 1px solid var(--aaib-border);
            border-radius: 10px;
            overflow: hidden;
          }

          .po-detail-item {
            min-width: 0;
            padding: 18px;
            border-right: 1px solid var(--aaib-border);
            border-bottom: 1px solid var(--aaib-border);
            background: #fff;
          }

          .po-detail-item-wide {
            grid-column: 1 / -1;
          }

          .po-detail-label {
            display: block;
            margin-bottom: 7px;
            color: var(--aaib-text-muted);
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .08em;
          }

          .po-detail-item strong {
            display: block;
            color: var(--aaib-text);
            font-size: 13px;
            line-height: 1.4;
            font-weight: 700;
          }

          .po-detail-email {
            display: inline-flex !important;
            align-items: center;
            gap: 7px;
            color: var(--aaib-primary) !important;
            word-break: break-word;
          }

          .po-detail-email svg {
            flex: 0 0 auto;
            color: var(--aaib-accent);
          }

          .po-employee-data-note {
            display: flex;
            align-items: flex-start;
            gap: 9px;
            margin-top: 14px;
            padding: 12px 14px;
            border: 1px solid rgba(197,160,89,.28);
            border-radius: 9px;
            background: var(--aaib-accent-soft);
            color: #786121;
            font-size: 10px;
            line-height: 1.5;
          }

          .po-employee-data-note svg {
            flex: 0 0 auto;
            margin-top: 1px;
          }

          .po-employee-details-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 18px;
          }

          .po-employee-state-card {
            min-height: 330px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 35px;
            text-align: center;
          }

          .po-employee-state-card h2 {
            margin: 15px 0 6px;
            color: var(--aaib-primary);
            font-size: 18px;
          }

          .po-employee-state-card p {
            max-width: 430px;
            margin: 0 0 18px;
            color: var(--aaib-text-muted);
            font-size: 11px;
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

          .po-state-loader {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(27,40,30,.1);
            border-top-color: var(--aaib-accent);
            border-radius: 50%;
            animation: poEmployeeSpin .8s linear infinite;
          }

          .po-employee-state-card.error .po-state-icon {
            background: var(--aaib-danger-soft);
            color: var(--aaib-danger);
          }

          @keyframes poEmployeeSpin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 820px) {
            .po-employee-profile-card {
              align-items: flex-start;
            }

            .po-employee-details-grid {
              grid-template-columns: 1fr;
            }

            .po-detail-item-wide {
              grid-column: auto;
            }
          }

          @media (max-width: 560px) {
            .po-employee-profile-card {
              flex-direction: column;
            }

            .po-employee-summary-meta {
              flex-direction: column;
              gap: 7px;
            }

            .po-employee-details-card,
            .po-employee-profile-card {
              padding: 18px;
            }

            .po-employee-details-actions {
              justify-content: stretch;
            }

            .po-employee-details-actions .aaib-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>
    </div>
  );
}
