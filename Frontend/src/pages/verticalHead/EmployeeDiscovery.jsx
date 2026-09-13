import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

    chevronDown: <path d="m7 10 5 5 5-5" />,

    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),

    building: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M3 21h18M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
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
        <path d="M12 4 21 20H3L12 4Z" />
        <path d="M12 9v5M12 17h.01" />
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
  };

  return <svg {...common}>{paths[name]}</svg>;
}

/* =========================================================
   HELPERS
========================================================= */

const getEmployeeId = (employee) =>
  employee?.id ??
  employee?.employeeId ??
  employee?.ID ??
  null;

const getFullName = (employee) =>
  [employee?.fn, employee?.ln]
    .filter(Boolean)
    .join(' ')
    .trim() ||
  employee?.name ||
  'Unnamed Employee';

const getTitle = (employee) =>
  employee?.title ||
  employee?.jobTitle ||
  '—';

const getEmail = (employee) =>
  employee?.email || '—';

const getDepartment = (employee) =>
  employee?.departmentName ||
  employee?.department ||
  employee?.department_name ||
  'Unassigned';

/* =========================================================
   COMPONENT
========================================================= */

export default function VHEmployeeDiscovery() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] =
    useState('All Departments');

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const userName =
    localStorage.getItem('userName') || 'User';

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

  const loadEmployees = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getEmployees();

      setEmployees(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load employees:',
        error
      );

      setEmployees([]);

      setErrorMessage(
        'We could not load the employee directory right now. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* =======================================================
     DEPARTMENTS
  ======================================================== */

  const departments = useMemo(() => {
    const uniqueDepartments = new Set();

    employees.forEach((employee) => {
      const department = getDepartment(employee);

      if (
        department &&
        department !== 'Unassigned' &&
        department !== '—'
      ) {
        uniqueDepartments.add(department);
      }
    });

    return [
      'All Departments',
      ...Array.from(uniqueDepartments).sort(),
    ];
  }, [employees]);

  /* =======================================================
     FILTERED EMPLOYEES
  ======================================================== */

  const filteredEmployees = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const fullName =
        getFullName(employee).toLowerCase();

      const title =
        getTitle(employee).toLowerCase();

      const email =
        getEmail(employee).toLowerCase();

      const department =
        getDepartment(employee).toLowerCase();

      const employeeId = String(
        getEmployeeId(employee) ?? ''
      ).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        title.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        department.includes(normalizedSearch) ||
        employeeId.includes(normalizedSearch);

      const matchesDepartment =
        departmentFilter === 'All Departments' ||
        getDepartment(employee) === departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });
  }, [
    employees,
    searchTerm,
    departmentFilter,
  ]);

  /* =======================================================
     SUMMARY
  ======================================================== */

  const departmentCount =
    departments.length - 1;

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

  const openEmployee = (employee) => {
    const id = getEmployeeId(employee);

    if (
      id === null ||
      id === undefined
    ) {
      console.error(
        'Employee ID is missing:',
        employee
      );
      return;
    }

    navigate(
      `/vertical-head/employees/${id}`
    );
  };

  return (
    <div
      className={`po-shell ${
        sidebarCollapsed
          ? 'po-sidebar-collapsed'
          : ''
      } ${
        mobileSidebarOpen
          ? 'po-mobile-sidebar-open'
          : ''
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
            onClick={() =>
              setSidebarCollapsed(
                (previous) => !previous
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
            type="button"
            className="po-mobile-close"
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          >
            <Icon
              name="close"
              size={21}
            />
          </button>

        </div>

        <div className="po-sidebar-section-label">
          Vertical Head Portal
        </div>

        <nav className="po-nav">

          <NavLink
            to="/vertical-head/dashboard"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="dashboard" />
            </span>

            <span className="po-nav-text">
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/vertical-head/resource-requests"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="requests" />
            </span>

            <span className="po-nav-text">
              Resource Requests
            </span>
          </NavLink>

          <NavLink
            to="/vertical-head/my-department"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="building" />
            </span>

            <span className="po-nav-text">
              My Department
            </span>
          </NavLink>

          <NavLink
            to="/vertical-head/employee-discovery"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="employees" />
            </span>

            <span className="po-nav-text">
              Employee Discovery
            </span>
          </NavLink>

          <NavLink
            to="/vertical-head/projects"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="projects" />
            </span>

            <span className="po-nav-text">
              Projects
            </span>
          </NavLink>

          <NavLink
            to="/vertical-head/notifications"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="notifications" />
            </span>

            <span className="po-nav-text">
              Notifications
            </span>
          </NavLink>

          <NavLink
            to="/vertical-head/calendar"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="calendar" />
            </span>

            <span className="po-nav-text">
              Calendar
            </span>
          </NavLink>

        </nav>

        <div className="po-sidebar-bottom">

          <NavLink
            to="/vertical-head/profile"
            className={({ isActive }) =>
              `po-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={closeMobileSidebar}
          >
            <span className="po-nav-icon">
              <Icon name="profile" />
            </span>

            <span className="po-nav-text">
              My Profile
            </span>
          </NavLink>

          <button
            type="button"
            className="po-nav-item po-logout"
            onClick={handleLogout}
          >
            <span className="po-nav-icon">
              <Icon name="logout" />
            </span>

            <span className="po-nav-text">
              Logout
            </span>
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

        {/* =================================================
            HEADER
        ================================================== */}

        <header className="po-header">

          <div className="po-header-left">

            <button
              type="button"
              className="po-mobile-menu"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              <Icon
                name="menu"
                size={20}
              />
            </button>

            <img
              src={aaibLogo}
              alt="AAIB"
              className="po-header-aaib-logo"
            />

            <div className="po-header-title">
              Vertical Head Portal
            </div>

          </div>

          <div className="po-header-right">

            <button
              type="button"
              className="po-header-icon"
              onClick={() =>
                navigate(
                  '/vertical-head/notifications'
                )
              }
              aria-label="Open notifications"
            >
              <Icon
                name="notifications"
                size={19}
              />
              <span className="po-notification-dot" />
            </button>

            <button
              type="button"
              className="po-header-user"
              onClick={() =>
                navigate(
                  '/vertical-head/profile'
                )
              }
            >
              <div className="po-user-avatar">
                {initials}
              </div>

              <div className="po-user-details">
                <strong>
                  {userName}
                </strong>

                <span>
                  Head of Digital Factory
                </span>
              </div>

              <Icon
                name="chevron"
                size={15}
              />
            </button>

          </div>

        </header>

        <main className="po-main">

          <div className="po-content">

            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <div className="po-directory-page-header">

              <div>

                <div className="po-page-eyebrow" />

                <h1>
                  Employee Discovery
                </h1>

                <p>
                  Discover employees across the
                  Digital Factory.
                </p>

              </div>

            </div>

            {/* =================================================
                SUMMARY STRIP
            ================================================== */}

            <section className="po-directory-summary">

              <div className="po-directory-summary-item">

                <div className="po-directory-summary-icon">
                  <Icon
                    name="users"
                    size={18}
                  />
                </div>

                <div>
                  <span>
                    TOTAL EMPLOYEES
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : employees.length}
                  </strong>
                </div>

              </div>

              <div className="po-directory-summary-divider" />

              <div className="po-directory-summary-item">

                <div className="po-directory-summary-icon department">
                  <Icon
                    name="building"
                    size={18}
                  />
                </div>

                <div>
                  <span>
                    DEPARTMENTS
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : departmentCount}
                  </strong>
                </div>

              </div>

              <div className="po-directory-summary-divider" />

              <div className="po-directory-summary-item">

                <div className="po-directory-summary-icon filtered">
                  <Icon
                    name="search"
                    size={18}
                  />
                </div>

                <div>
                  <span>
                    SHOWING
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : filteredEmployees.length}
                  </strong>
                </div>

              </div>

            </section>

            {/* =================================================
                DIRECTORY CARD
            ================================================== */}

            <section className="po-directory-card">

              <div className="po-directory-toolbar">

                <div className="po-directory-toolbar-heading">

                  <span>
                    DIGITAL FACTORY
                  </span>

                  <h2>
                    Employee List
                  </h2>

                </div>

                <button
                  type="button"
                  className="po-refresh-button"
                  onClick={loadEmployees}
                  disabled={isLoading}
                  title="Refresh employee list"
                >
                  <Icon
                    name="refresh"
                    size={15}
                  />

                  Refresh
                </button>

              </div>

              {/* =================================================
                  FILTERS
              ================================================== */}

              <div className="po-directory-filters">

                <div className="po-search-box">

                  <Icon
                    name="search"
                    size={16}
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Search by name, title, email or employee ID..."
                    aria-label="Search employees"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      className="po-search-clear"
                      onClick={() =>
                        setSearchTerm('')
                      }
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}

                </div>

                <div className="po-department-filter">

                  <select
                    value={departmentFilter}
                    onChange={(event) =>
                      setDepartmentFilter(
                        event.target.value
                      )
                    }
                    aria-label="Filter by department"
                  >
                    {departments.map(
                      (department) => (
                        <option
                          key={department}
                          value={department}
                        >
                          {department}
                        </option>
                      )
                    )}
                  </select>

                  <Icon
                    name="chevronDown"
                    size={14}
                  />

                </div>

              </div>

              {/* =================================================
                  RESULT META
              ================================================== */}

              {!isLoading &&
                !errorMessage &&
                employees.length > 0 && (
                  <div className="po-directory-result-meta">

                    <span>
                      Showing{' '}
                      <strong>
                        {filteredEmployees.length}
                      </strong>{' '}
                      of{' '}
                      <strong>
                        {employees.length}
                      </strong>{' '}
                      employees
                    </span>

                    {(searchTerm ||
                      departmentFilter !==
                        'All Departments') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setDepartmentFilter(
                            'All Departments'
                          );
                        }}
                      >
                        Clear filters
                      </button>
                    )}

                  </div>
                )}

              {/* =================================================
                  CONTENT STATES
              ================================================== */}

              {isLoading ? (

                <div className="po-directory-state">

                  <div
                    className="po-state-loader"
                    aria-hidden="true"
                  />

                  <h3>
                    Loading employees
                  </h3>

                  <p>
                    Retrieving the employee
                    directory from the system.
                  </p>

                </div>

              ) : errorMessage ? (

                <div className="po-directory-state">

                  <div className="po-state-icon error">
                    <Icon
                      name="alert"
                      size={22}
                    />
                  </div>

                  <h3>
                    Unable to load employee
                    directory
                  </h3>

                  <p>
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    className="aaib-btn aaib-btn-primary"
                    onClick={loadEmployees}
                  >
                    <Icon
                      name="refresh"
                      size={15}
                    />

                    Try Again
                  </button>

                </div>

              ) : employees.length === 0 ? (

                <div className="po-directory-state">

                  <div className="po-state-icon">
                    <Icon
                      name="users"
                      size={22}
                    />
                  </div>

                  <h3>
                    No employees found
                  </h3>

                  <p>
                    There are currently no
                    employees available in
                    the system.
                  </p>

                </div>

              ) : filteredEmployees.length === 0 ? (

                <div className="po-directory-state compact">

                  <div className="po-state-icon">
                    <Icon
                      name="search"
                      size={22}
                    />
                  </div>

                  <h3>
                    No matching employees
                  </h3>

                  <p>
                    Try changing your search
                    or department filter.
                  </p>

                  <button
                    type="button"
                    className="aaib-btn aaib-btn-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setDepartmentFilter(
                        'All Departments'
                      );
                    }}
                  >
                    Clear Filters
                  </button>

                </div>

              ) : (

                <div className="po-employee-table-wrap">

                  <table className="po-employee-table">

                    <thead>
                      <tr>
                        <th>
                          Employee
                        </th>

                        <th>
                          Employee ID
                        </th>

                        <th>
                          Title
                        </th>

                        <th>
                          Department
                        </th>

                        <th>
                          Email
                        </th>

                        <th
                          aria-label="Action"
                        />
                      </tr>
                    </thead>

                    <tbody>

                      {filteredEmployees.map(
                        (employee) => {

                          const employeeId =
                            getEmployeeId(
                              employee
                            );

                          const fullName =
                            getFullName(
                              employee
                            );

                          const title =
                            getTitle(
                              employee
                            );

                          const department =
                            getDepartment(
                              employee
                            );

                          const email =
                            getEmail(
                              employee
                            );

                          const employeeInitials =
                            fullName
                              .split(' ')
                              .filter(Boolean)
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .join('')
                              .slice(0, 2)
                              .toUpperCase();

                          return (
                            <tr
                              key={employeeId}
                              className="po-employee-row"
                              onClick={() =>
                                openEmployee(
                                  employee
                                )
                              }
                            >

                              <td>

                                <div className="po-table-employee">

                                  <div className="po-table-avatar">
                                    {
                                      employeeInitials
                                    }
                                  </div>

                                  <div>

                                    <strong>
                                      {fullName}
                                    </strong>

                                    <span>
                                      {email}
                                    </span>

                                  </div>

                                </div>

                              </td>

                              <td>

                                <span className="po-employee-id">
                                  #{employeeId}
                                </span>

                              </td>

                              <td>

                                <span className="po-employee-title">
                                  {title}
                                </span>

                              </td>

                              <td>

                                <span className="po-department-badge">

                                  <Icon
                                    name="building"
                                    size={12}
                                  />

                                  {department}

                                </span>

                              </td>

                              <td>

                                <span className="po-table-email">
                                  {email}
                                </span>

                              </td>

                              <td>

                                <button
                                  type="button"
                                  className="po-view-employee"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openEmployee(
                                      employee
                                    );
                                  }}
                                  aria-label={`View ${fullName}`}
                                  title="View employee details"
                                >
                                  <Icon
                                    name="eye"
                                    size={15}
                                  />

                                  <Icon
                                    name="chevron"
                                    size={14}
                                  />
                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </div>

        </main>

      </div>

      {/* =========================================================
          PAGE-SPECIFIC STYLES
      ========================================================= */}

      <style>
        {`
          .po-directory-page-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 20px;
          }

          .po-page-eyebrow {
            color: var(--aaib-accent);
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .15em;
          }

          .po-directory-page-header h1 {
            margin: 4px 0 5px;
            color: var(--aaib-primary);
            font-size: 28px;
            line-height: 1.15;
            letter-spacing: -.03em;
          }

          .po-directory-page-header p {
            margin: 0;
            color: var(--aaib-text-muted);
            font-size: 12px;
          }

          .po-directory-summary {
            display: grid;
            grid-template-columns: 1fr auto 1fr auto 1fr;
            align-items: center;
            gap: 16px;
            margin-bottom: 18px;
            padding: 16px 18px;
            background: var(--aaib-surface);
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            box-shadow: var(--aaib-shadow-card);
          }

          .po-directory-summary-item {
            display: flex;
            align-items: center;
            gap: 11px;
            min-width: 0;
          }

          .po-directory-summary-icon {
            width: 37px;
            height: 37px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-directory-summary-icon.department {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-directory-summary-icon.filtered {
            background: var(--aaib-accent-soft);
            color: #96721d;
          }

          .po-directory-summary-item span {
            display: block;
            margin-bottom: 2px;
            color: var(--aaib-text-muted);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .08em;
          }

          .po-directory-summary-item strong {
            display: block;
            color: var(--aaib-primary);
            font-size: 17px;
            line-height: 1.1;
          }

          .po-directory-summary-divider {
            width: 1px;
            height: 32px;
            background: var(--aaib-border);
          }

          .po-directory-card {
            overflow: hidden;
            background: var(--aaib-surface);
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            box-shadow: var(--aaib-shadow-card);
          }

          .po-directory-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 21px 23px 17px;
          }

          .po-directory-toolbar-heading > span {
            display: block;
            margin-bottom: 4px;
            color: var(--aaib-accent);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .13em;
          }

          .po-directory-toolbar-heading h2 {
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

          .po-directory-filters {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 210px;
            gap: 10px;
            padding: 0 23px 16px;
          }

          .po-search-box,
          .po-department-filter {
            position: relative;
            display: flex;
            align-items: center;
            min-height: 38px;
            border: 1px solid var(--aaib-border);
            border-radius: 9px;
            background: #fff;
          }

          .po-search-box {
            padding: 0 11px;
            gap: 8px;
          }

          .po-search-box > svg {
            flex: 0 0 auto;
            color: var(--aaib-text-muted);
          }

          .po-search-box input {
            min-width: 0;
            flex: 1;
            border: 0;
            outline: 0;
            background: transparent;
            color: var(--aaib-text);
            font: inherit;
            font-size: 10px;
          }

          .po-search-box input::placeholder {
            color: #9aa39e;
          }

          .po-search-box:focus-within {
            border-color: rgba(27,40,30,.2);
            box-shadow: 0 0 0 3px var(--aaib-primary-soft);
          }

          .po-search-clear {
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

          .po-department-filter {
            padding: 0 10px;
          }

          .po-department-filter select {
            width: 100%;
            height: 36px;
            padding: 0 25px 0 0;
            border: 0;
            outline: 0;
            appearance: none;
            background: transparent;
            color: var(--aaib-text);
            font: inherit;
            font-size: 10px;
            cursor: pointer;
          }

          .po-department-filter > svg {
            position: absolute;
            right: 9px;
            pointer-events: none;
            color: var(--aaib-text-muted);
          }

          .po-directory-result-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 0 23px 12px;
            color: var(--aaib-text-muted);
            font-size: 9px;
          }

          .po-directory-result-meta strong {
            color: var(--aaib-primary);
          }

          .po-directory-result-meta button {
            border: 0;
            padding: 0;
            background: transparent;
            color: var(--aaib-primary);
            font-size: 9px;
            font-weight: 700;
            cursor: pointer;
          }

          .po-employee-table-wrap {
            width: 100%;
            overflow-x: auto;
            border-top: 1px solid var(--aaib-border);
          }

          .po-employee-table {
            width: 100%;
            min-width: 840px;
            border-collapse: collapse;
            table-layout: auto;
          }

          .po-employee-table thead th {
            padding: 11px 15px;
            border-bottom: 1px solid var(--aaib-border);
            background: var(--aaib-surface-alt);
            color: #7b8780;
            font-size: 8px;
            font-weight: 800;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: .07em;
            white-space: nowrap;
          }

          .po-employee-table thead th:first-child {
            padding-left: 23px;
          }

          .po-employee-table thead th:last-child {
            width: 72px;
            padding-right: 23px;
          }

          .po-employee-table tbody td {
            padding: 14px 15px;
            border-bottom: 1px solid var(--aaib-border);
            vertical-align: middle;
          }

          .po-employee-table tbody tr:last-child td {
            border-bottom: 0;
          }

          .po-employee-row {
            cursor: pointer;
            transition: background .16s ease;
          }

          .po-employee-row:hover {
            background: var(--aaib-primary-soft);
          }

          .po-employee-table tbody td:first-child {
            padding-left: 23px;
          }

          .po-employee-table tbody td:last-child {
            padding-right: 23px;
          }

          .po-table-employee {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 205px;
          }

          .po-table-avatar {
            width: 35px;
            height: 35px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 9px;
            background: var(--aaib-primary);
            color: var(--aaib-accent);
            font-size: 10px;
            font-weight: 800;
          }

          .po-table-employee > div:last-child {
            min-width: 0;
          }

          .po-table-employee strong {
            display: block;
            overflow: hidden;
            color: var(--aaib-primary);
            font-size: 10px;
            font-weight: 800;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-table-employee span {
            display: block;
            max-width: 190px;
            margin-top: 3px;
            overflow: hidden;
            color: var(--aaib-text-muted);
            font-size: 8px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-employee-id {
            color: var(--aaib-text-muted);
            font-size: 9px;
            font-weight: 700;
          }

          .po-employee-title {
            display: block;
            max-width: 190px;
            color: var(--aaib-text);
            font-size: 9px;
            font-weight: 600;
            line-height: 1.4;
          }

          .po-department-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 7px;
            border-radius: 6px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
            font-size: 8px;
            font-weight: 700;
            white-space: nowrap;
          }

          .po-department-badge svg {
            color: var(--aaib-accent);
          }

          .po-table-email {
            display: block;
            max-width: 230px;
            overflow: hidden;
            color: var(--aaib-text-muted);
            font-size: 9px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-view-employee {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            width: 40px;
            height: 32px;
            border: 1px solid var(--aaib-border);
            border-radius: 8px;
            background: #fff;
            color: var(--aaib-primary);
            cursor: pointer;
            transition: background .16s ease, border-color .16s ease;
          }

          .po-view-employee:hover {
            background: var(--aaib-primary);
            border-color: var(--aaib-primary);
            color: #fff;
          }

          .po-directory-state {
            min-height: 320px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 35px 24px;
            border-top: 1px solid var(--aaib-border);
            text-align: center;
          }

          .po-directory-state.compact {
            min-height: 250px;
          }

          .po-directory-state h3 {
            margin: 15px 0 6px;
            color: var(--aaib-primary);
            font-size: 17px;
          }

          .po-directory-state p {
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

          .po-state-loader {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(27,40,30,.1);
            border-top-color: var(--aaib-accent);
            border-radius: 50%;
            animation: poDirectorySpin .8s linear infinite;
          }

          @keyframes poDirectorySpin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 900px) {
            .po-directory-summary {
              grid-template-columns: 1fr 1fr 1fr;
            }

            .po-directory-summary-divider {
              display: none;
            }

            .po-directory-filters {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 650px) {
            .po-directory-summary {
              grid-template-columns: 1fr;
            }

            .po-directory-summary-item {
              padding: 2px 0;
            }

            .po-directory-toolbar {
              align-items: flex-start;
              flex-direction: column;
            }

            .po-refresh-button {
              width: 100%;
              justify-content: center;
            }

            .po-directory-result-meta {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>

    </div>
  );
}