import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getEmployees } from '../../services/employeeService';
import { me } from '../../services/authService';
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
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h10" />
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
        <path d="M16 14a5 5 0 0 1 5 5" />
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
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l5 5" />
      </>
    ),
    chevron: <path d="M9 18l6-6-6-6" />,
    usersPlus: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M18 8v6M15 11h6" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

export default function MyDepartment() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || 'User'
  );
  const [userDepartment, setUserDepartment] = useState('');

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    let isMounted = true;

    async function loadDepartmentEmployees() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        // Get the authenticated user from the real auth API.
        const currentUser = await me();

        if (!isMounted) return;

        const apiUserName =
          currentUser?.userName ||
          localStorage.getItem('userName') ||
          '';

        setUserName(apiUserName || 'User');

        // Load employees from the real employees GET endpoint.
        const data = await getEmployees();

        if (!isMounted) return;

        const employeeData = Array.isArray(data) ? data : [];
        setEmployees(employeeData);

        /*
         * /api/auth/me returns:
         * { userId, userName, role }
         *
         * The employees GET response currently exposes the employee's
         * first/last name and department, but not User_ID.
         *
         * Therefore we match the authenticated username, such as
         * "sarah.lee", to the employee name "Sarah Lee".
         * This is only used to discover Sarah's department; the actual
         * department employee list still comes entirely from GET /api/employees.
         */
        const normalizedUserName = String(apiUserName)
          .trim()
          .toLowerCase()
          .replace(/[._-]+/g, ' ')
          .replace(/\s+/g, ' ');

        const currentEmployee = employeeData.find((employee) => {
          const firstName = String(
            employee.FN ?? employee.fn ?? ''
          )
            .trim()
            .toLowerCase();

          const lastName = String(
            employee.LN ?? employee.ln ?? ''
          )
            .trim()
            .toLowerCase();

          const fullName = `${firstName} ${lastName}`
            .trim()
            .replace(/\s+/g, ' ');

          return fullName === normalizedUserName;
        });

        const department =
          currentEmployee?.DepartmentName ??
          currentEmployee?.departmentName ??
          '';

        setUserDepartment(String(department).trim());
      } catch (error) {
        if (!isMounted) return;

        console.error('Failed to load My Department:', error);
        setEmployees([]);
        setUserDepartment('');
        setErrorMessage(
          'Unable to load your department employees right now.'
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDepartmentEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedDepartment = userDepartment.trim().toLowerCase();

  const departmentEmployees = useMemo(() => {
    const filteredByDepartment = normalizedDepartment
      ? employees.filter(
          (employee) =>
            String(
              employee.departmentName ?? employee.DepartmentName ?? ''
            )
              .trim()
              .toLowerCase() === normalizedDepartment
        )
      : [];

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return filteredByDepartment;

    return filteredByDepartment.filter((employee) => {
      const fullName = `${employee.FN ?? employee.fn ?? ''} ${
        employee.LN ?? employee.ln ?? ''
      }`
        .trim()
        .toLowerCase();

      const title = String(
        employee.Title ?? employee.title ?? ''
      ).toLowerCase();

      const email = String(
        employee.Email ?? employee.email ?? ''
      ).toLowerCase();

      const id = String(
        employee.ID ?? employee.id ?? ''
      ).toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        title.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        id.includes(normalizedSearch)
      );
    });
  }, [employees, normalizedDepartment, searchTerm]);

  const displayDepartment = userDepartment || 'Department not found';

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const handleEmployeeClick = (employee) => {
    const id = employee.ID ?? employee.id;
    if (id !== undefined && id !== null) {
      navigate(`/vertical-head/employees/${id}`);
    }
  };

  return (
    <div
      className={`bo-shell ${
        sidebarCollapsed ? 'bo-sidebar-collapsed' : ''
      } ${mobileSidebarOpen ? 'bo-mobile-sidebar-open' : ''}`}
    >
      <aside className="bo-sidebar">
        <div className="bo-sidebar-top">
          <div className="bo-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
            className="bo-collapse-btn"
            onClick={() => setSidebarCollapsed((previous) => !previous)}
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
            aria-label="Close menu"
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        <div className="bo-sidebar-section-label">
          Vertical Head Portal
        </div>

        <nav className="po-nav">
          <NavLink
            to="/vertical-head/dashboard"
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
            to="/vertical-head/resource-requests"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="usersPlus" />
            </span>
            <span className="po-nav-text">Resource Requests</span>
          </NavLink>

          <NavLink
            to="/vertical-head/my-department"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="employees" />
            </span>
            <span className="po-nav-text">My Department</span>
          </NavLink>

          <NavLink
            to="/vertical-head/employee-discovery"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="search" />
            </span>
            <span className="po-nav-text">Employee Discovery</span>
          </NavLink>

          <NavLink
            to="/vertical-head/projects"
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
            to="/vertical-head/notifications"
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
            to="/vertical-head/calendar"
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

        <div className="bo-sidebar-bottom">
          <NavLink
            to="/vertical-head/profile"
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

      <div className="bo-sidebar-backdrop" onClick={closeMobileSidebar} />

      <div className="bo-page">
        <header className="bo-header">
          <div className="bo-header-left">
            <button
              className="bo-mobile-menu"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" size={20} />
            </button>

            <img
              src={aaibLogo}
              alt="AAIB"
              className="bo-header-aaib-logo"
            />

            <div className="bo-header-title">
              Vertical Head Portal
            </div>
          </div>

          <div className="bo-header-right">
            <button
              className="bo-header-icon"
              onClick={() => navigate('/vertical-head/notifications')}
              aria-label="Notifications"
            >
              <Icon name="notifications" size={19} />
              <span className="bo-notification-dot" />
            </button>

            <div
              className="bo-header-user"
              onClick={() => navigate('/vertical-head/profile')}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  navigate('/vertical-head/profile');
                }
              }}
            >
              <div className="bo-user-avatar">{initials}</div>

              <div className="bo-user-details">
                <strong>{userName}</strong>
                <span>Vertical Head</span>
              </div>

              <Icon name="chevron" size={15} />
            </div>
          </div>
        </header>

        <main className="bo-main">
          <div className="bo-content">
            <div className="vh-page-header">
              <div>
                <div className="vh-page-eyebrow">TEAM MANAGEMENT</div>
                <h1>My Department</h1>
                <p>
                  View all employees assigned to your department.
                </p>
              </div>

              <div className="vh-department-badge">
                <span>DEPARTMENT</span>
                <strong>{displayDepartment}</strong>
              </div>
            </div>

            <section className="vh-department-summary">
              <div className="vh-summary-card">
                <div className="vh-summary-label">MY DEPARTMENT</div>
                <div className="vh-summary-value">
                  {displayDepartment}
                </div>
              </div>

              <div className="vh-summary-card">
                <div className="vh-summary-label">TOTAL EMPLOYEES</div>
                <div className="vh-summary-value">
                  {isLoading ? '—' : departmentEmployees.length}
                </div>
              </div>

              <div className="vh-summary-card">
                <div className="vh-summary-label">DISPLAYED</div>
                <div className="vh-summary-value">
                  {isLoading ? '—' : departmentEmployees.length}
                </div>
              </div>
            </section>

            <section className="vh-department-card">
              <div className="vh-department-toolbar">
                <div>
                  <h2>Department Employees</h2>
                  <span>
                    {isLoading
                      ? 'Loading employees...'
                      : `${departmentEmployees.length} employee${
                          departmentEmployees.length === 1 ? '' : 's'
                        } found`}
                  </span>
                </div>

                <div className="vh-search-box">
                  <Icon name="search" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search employees..."
                    aria-label="Search employees"
                  />
                </div>
              </div>

              {errorMessage ? (
                <div className="vh-state-message error">
                  <strong>{errorMessage}</strong>
                  <span>Refresh the page and try again.</span>
                </div>
              ) : isLoading ? (
                <div className="vh-state-message">
                  <strong>Loading department employees...</strong>
                  <span>Please wait.</span>
                </div>
              ) : departmentEmployees.length === 0 ? (
                <div className="vh-state-message">
                  <strong>
                    {!userDepartment
                      ? 'Your department could not be identified.'
                      : searchTerm
                        ? 'No employees match your search.'
                        : 'No employees found in your department.'}
                  </strong>
                  <span>
                    {!userDepartment
                      ? `The employee "${userName}" was not matched to a department in the GET /api/employees response.`
                      : searchTerm
                        ? 'Try another name, title, email, or employee ID.'
                        : `No employee records are currently available in ${displayDepartment}.`}
                  </span>
                </div>
              ) : (
                <div className="vh-table-wrapper">
                  <table className="vh-employee-table">
                    <thead>
                      <tr>
                        <th>EMPLOYEE</th>
                        <th>EMPLOYEE ID</th>
                        <th>TITLE</th>
                        <th>EMAIL</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {departmentEmployees.map((employee) => {
                        const id = employee.ID ?? employee.id;
                        const firstName =
                          employee.FN ?? employee.fn ?? '';
                        const lastName =
                          employee.LN ?? employee.ln ?? '';
                        const title =
                          employee.Title ?? employee.title ?? '—';
                        const email =
                          employee.Email ?? employee.email ?? '—';

                        return (
                          <tr
                            key={id}
                            onClick={() => handleEmployeeClick(employee)}
                            className="vh-employee-row"
                          >
                            <td>
                              <div className="vh-employee-main">
                                <div className="vh-employee-avatar">
                                  {`${firstName} ${lastName}`
                                    .trim()
                                    .split(' ')
                                    .filter(Boolean)
                                    .map((part) => part[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase() || '?'}
                                </div>

                                <div>
                                  <strong>
                                    {`${firstName} ${lastName}`.trim() ||
                                      'Unnamed Employee'}
                                  </strong>
                                  <span>{displayDepartment}</span>
                                </div>
                              </div>
                            </td>

                            <td>{id ?? '—'}</td>
                            <td>{title}</td>
                            <td>{email}</td>

                            <td>
                              <button
                                type="button"
                                className="vh-view-button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEmployeeClick(employee);
                                }}
                              >
                                View
                                <Icon name="chevron" size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <style>{`
        .vh-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .vh-page-eyebrow {
          color: var(--aaib-accent);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .15em;
          margin-bottom: 5px;
        }

        .vh-page-header h1 {
          margin: 0 0 6px;
          color: var(--aaib-primary);
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: -.03em;
        }

        .vh-page-header p {
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 12px;
        }

        .vh-department-badge {
          min-width: 185px;
          padding: 12px 14px;
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          background: var(--aaib-surface);
          box-shadow: var(--aaib-shadow-card);
        }

        .vh-department-badge span,
        .vh-summary-label {
          display: block;
          color: var(--aaib-text-muted);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .1em;
        }

        .vh-department-badge strong {
          display: block;
          margin-top: 4px;
          color: var(--aaib-primary);
          font-size: 13px;
        }

        .vh-department-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .vh-summary-card {
          padding: 17px 18px;
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          background: var(--aaib-surface);
          box-shadow: var(--aaib-shadow-card);
        }

        .vh-summary-value {
          margin-top: 6px;
          color: var(--aaib-primary);
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.02em;
        }

        .vh-department-card {
          overflow: hidden;
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          background: var(--aaib-surface);
          box-shadow: var(--aaib-shadow-card);
        }

        .vh-department-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 19px 20px;
          border-bottom: 1px solid var(--aaib-border);
        }

        .vh-department-toolbar h2 {
          margin: 0 0 4px;
          color: var(--aaib-primary);
          font-size: 16px;
          letter-spacing: -.02em;
        }

        .vh-department-toolbar span {
          color: var(--aaib-text-muted);
          font-size: 10px;
        }

        .vh-search-box {
          width: min(320px, 100%);
          height: 36px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border: 1px solid var(--aaib-border);
          border-radius: 8px;
          background: #fff;
          color: var(--aaib-text-muted);
        }

        .vh-search-box:focus-within {
          border-color: rgba(27, 40, 30, .25);
          box-shadow: 0 0 0 3px var(--aaib-primary-soft);
        }

        .vh-search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--aaib-text);
          font-size: 11px;
        }

        .vh-search-box input::placeholder {
          color: #9aa49f;
        }

        .vh-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .vh-employee-table {
          width: 100%;
          border-collapse: collapse;
        }

        .vh-employee-table th {
          padding: 11px 18px;
          border-bottom: 1px solid var(--aaib-border);
          color: #89958e;
          background: var(--aaib-surface-alt);
          text-align: left;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .08em;
          white-space: nowrap;
        }

        .vh-employee-table td {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(27, 40, 30, .06);
          color: var(--aaib-text);
          font-size: 10px;
          vertical-align: middle;
        }

        .vh-employee-row {
          cursor: pointer;
          transition: background .16s ease;
        }

        .vh-employee-row:hover {
          background: var(--aaib-primary-soft);
        }

        .vh-employee-row:last-child td {
          border-bottom: 0;
        }

        .vh-employee-main {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 220px;
        }

        .vh-employee-avatar {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
          font-size: 9px;
          font-weight: 800;
        }

        .vh-employee-main strong {
          display: block;
          margin-bottom: 3px;
          color: var(--aaib-primary);
          font-size: 11px;
        }

        .vh-employee-main span {
          color: var(--aaib-text-muted);
          font-size: 9px;
        }

        .vh-view-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 0;
          background: transparent;
          color: var(--aaib-primary);
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .vh-view-button:hover {
          color: var(--aaib-accent);
        }

        .vh-state-message {
          min-height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 30px;
          text-align: center;
        }

        .vh-state-message strong {
          color: var(--aaib-primary);
          font-size: 13px;
        }

        .vh-state-message span {
          color: var(--aaib-text-muted);
          font-size: 10px;
        }

        .vh-state-message.error strong {
          color: var(--aaib-danger);
        }

        @media (max-width: 900px) {
          .vh-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .vh-department-summary {
            grid-template-columns: 1fr;
          }

          .vh-department-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .vh-search-box {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
