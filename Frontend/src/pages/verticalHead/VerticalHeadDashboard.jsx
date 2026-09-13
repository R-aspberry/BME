import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import { getEmployees } from '../../services/employeeService';
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
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
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
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
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
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    alert: (
      <>
        <path d="M10.3 4.5 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function normalizeProjects(data) {
  if (!Array.isArray(data)) return [];
  return data.filter(Boolean);
}

function normalizeEmployees(data) {
  if (!Array.isArray(data)) return [];
  return data.filter(Boolean);
}

function employeeId(employee) {
  return employee?.ID ?? employee?.id ?? employee?.employeeId ?? null;
}

function employeeName(employee) {
  return (
    `${employee?.FN ?? employee?.fn ?? employee?.firstName ?? ''} ${
      employee?.LN ?? employee?.ln ?? employee?.lastName ?? ''
    }`.trim() || 'Unnamed Employee'
  );
}

function employeeTitle(employee) {
  return employee?.Title ?? employee?.title ?? employee?.jobTitle ?? '';
}

function departmentName(employee) {
  return (
    employee?.DepartmentName ??
    employee?.departmentName ??
    employee?.department ??
    ''
  );
}

function projectId(project) {
  return project?.prj_ID ?? project?.projectId ?? project?.id ?? null;
}

function projectName(project) {
  return (
    project?.project_Name ??
    project?.projectName ??
    project?.name ??
    'Untitled Project'
  );
}

function projectStatus(project) {
  return String(project?.status ?? project?.Status ?? 'Unknown');
}

function projectFlag(project) {
  return project?.flag ?? project?.Flag ?? '';
}

function projectDate(project) {
  return (
    project?.lastUpdatedDate ??
    project?.updatedAt ??
    project?.createdAt ??
    project?.start_date ??
    project?.startDate ??
    null
  );
}

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusType(status) {
  const value = String(status || '').toLowerCase();

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

  if (value.includes('progress') || value.includes('active')) {
    return 'active';
  }

  return 'neutral';
}

export default function VerticalHeadDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';
  const rawName = userName.split('.')[0] || 'User';
  const displayName =
    rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const initials = displayName
    .split(' ')
    .filter(Boolean)
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

  const loadData = () => {
    setIsLoading(true);

    Promise.all([getProjects(), getEmployees()])
      .then(([projectData, employeeData]) => {
        setProjects(normalizeProjects(projectData));
        setEmployees(normalizeEmployees(employeeData));
      })
      .catch((error) => {
        console.error('Failed to load Vertical Head dashboard:', error);
        setProjects([]);
        setEmployees([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let mounted = true;

    setIsLoading(true);

    Promise.all([getProjects(), getEmployees()])
      .then(([projectData, employeeData]) => {
        if (!mounted) return;
        setProjects(normalizeProjects(projectData));
        setEmployees(normalizeEmployees(employeeData));
      })
      .catch((error) => {
        if (!mounted) return;
        console.error('Failed to load Vertical Head dashboard:', error);
        setProjects([]);
        setEmployees([]);
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const loggedInEmployee = useMemo(() => {
    const storedUser = localStorage.getItem('user');
    let user = {};

    try {
      user = storedUser ? JSON.parse(storedUser) : {};
    } catch {
      user = {};
    }

    const storedIds = [
      user?.employeeId,
      user?.employee_ID,
      user?.employeeID,
      user?.employee?.id,
    ]
      .filter((value) => value !== undefined && value !== null)
      .map(String);

    const storedName = String(
      localStorage.getItem('userName') ||
        user?.userName ||
        user?.name ||
        '',
    )
      .trim()
      .toLowerCase();

    return (
      employees.find((employee) =>
        storedIds.includes(String(employeeId(employee))),
      ) ||
      employees.find(
        (employee) =>
          storedName &&
          employeeName(employee).toLowerCase() === storedName,
      ) ||
      employees.find((employee) =>
        /vertical head|head of|department head|^head$/i.test(
          employeeTitle(employee),
        ),
      ) ||
      null
    );
  }, [employees]);

  const myDepartment = departmentName(loggedInEmployee);

  const departmentEmployees = useMemo(() => {
    if (!myDepartment) return [];

    return employees.filter(
      (employee) =>
        departmentName(employee).trim().toLowerCase() ===
        myDepartment.trim().toLowerCase(),
    );
  }, [employees, myDepartment]);

  const resourceRequests = useMemo(() => {
    try {
      const raw = localStorage.getItem('po_resource_requests');
      const parsed = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (request) =>
          Number(request?.departments?.[myDepartment] || 0) > 0,
      );
    } catch {
      return [];
    }
  }, [myDepartment]);

  const assignments = useMemo(() => {
    try {
      const raw = localStorage.getItem('vh_assignments_demo');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const assignedEmployeeIds = useMemo(
    () =>
      new Set(
        assignments.map((assignment) => String(assignment?.employeeId)),
      ),
    [assignments],
  );

  const assignedCount = departmentEmployees.filter((employee) =>
    assignedEmployeeIds.has(String(employeeId(employee))),
  ).length;

  const hasAvailabilityData = departmentEmployees.some(
    (employee) =>
      employee?.availability !== undefined ||
      employee?.Availability !== undefined ||
      employee?.isAvailable !== undefined ||
      employee?.IsAvailable !== undefined,
  );

  const availableCount = hasAvailabilityData
    ? departmentEmployees.filter((employee) => {
        const value =
          employee?.availability ??
          employee?.Availability ??
          employee?.isAvailable ??
          employee?.IsAvailable;

        return (
          value === true ||
          String(value).toLowerCase() === 'available' ||
          String(value).toLowerCase() === 'true'
        );
      }).length
    : null;

  const unavailableCount = hasAvailabilityData
    ? departmentEmployees.length - availableCount
    : null;

  const pendingRequests = resourceRequests.filter(
    (request) =>
      String(request?.status || 'Pending').toLowerCase() === 'pending',
  );

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (a, b) =>
            new Date(projectDate(b) || 0).getTime() -
            new Date(projectDate(a) || 0).getTime(),
        )
        .slice(0, 5),
    [projects],
  );

  const attentionProjects = useMemo(
    () =>
      projects
        .filter(
          (project) =>
            Boolean(projectFlag(project)) ||
            ['changes requested', 'rejected', 'requires attention'].includes(
              projectStatus(project).toLowerCase(),
            ),
        )
        .slice(0, 4),
    [projects],
  );

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
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
            className="po-collapse-btn"
            type="button"
            onClick={() => setSidebarCollapsed((previous) => !previous)}
            aria-label="Toggle sidebar"
          >
            <Icon
              name={sidebarCollapsed ? 'chevron' : 'menu'}
              size={19}
            />
          </button>

          <button
            className="po-mobile-close"
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        <div className="po-sidebar-section-label">
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
              <Icon name="requests" />
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

        <div className="po-sidebar-bottom">
          <NavLink
            to="/vertical-head/profile"
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
            className="po-nav-item po-logout"
            type="button"
            onClick={logout}
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
              className="po-mobile-menu"
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" size={20} />
            </button>

            <div className="po-header-brand">
              <img src={aaibLogo} alt="AAIB" />
            </div>
          </div>

          <div className="po-header-right">
            <button
              className="po-header-icon"
              type="button"
              onClick={() => navigate('/vertical-head/notifications')}
              aria-label="Notifications"
            >
              <Icon name="notifications" size={19} />
              <span className="po-notification-dot" />
            </button>

            <button
              className="po-header-user"
              type="button"
              onClick={() => navigate('/vertical-head/profile')}
            >
              <div className="po-user-avatar">{initials}</div>

              <div className="po-user-details">
                <strong>{userName}</strong>
                <span>Vertical Head</span>
              </div>

              <Icon name="chevron" size={15} />
            </button>
          </div>
        </header>

        <main className="po-main">
          <div className="po-content">
            <section className="po-hero">
              <div className="po-hero-content">
                <div className="po-eyebrow">
                  VERTICAL HEAD WORKSPACE
                </div>

                <h1>
                  {greeting}, {displayName}
                </h1>

                <p>
                  Monitor your department, review employee resource
                  requests, and keep project allocation moving.
                </p>
              </div>

              <div className="po-hero-mark">{initials}</div>
            </section>

            <section className="po-action-bar">
              <div>
                <h2>Department Overview</h2>
                <span>
                  {myDepartment
                    ? `${myDepartment} resource and project activity.`
                    : 'Your department resource and project activity.'}
                </span>
              </div>

              <div className="po-action-buttons">
                <button
                  className="aaib-btn aaib-btn-secondary"
                  type="button"
                  onClick={() =>
                    navigate('/vertical-head/my-department')
                  }
                >
                  My Department
                </button>

                <button
                  className="aaib-btn aaib-btn-primary"
                  type="button"
                  onClick={() =>
                    navigate('/vertical-head/resource-requests')
                  }
                >
                  <Icon name="requests" size={17} />
                  Review Resource Requests
                </button>
              </div>
            </section>

            <section className="po-kpi-grid">
              <button
                type="button"
                className="po-kpi-card"
                onClick={() =>
                  navigate('/vertical-head/resource-requests')
                }
              >
                <div className="po-kpi-top">
                  <div className="po-kpi-icon gold">
                    <Icon name="requests" />
                  </div>
                  <span className="po-kpi-label">
                    Pending Requests
                  </span>
                </div>

                <strong>
                  {isLoading ? '—' : pendingRequests.length}
                </strong>

                <span className="po-kpi-description">
                  Awaiting department action
                </span>
              </button>

              <button
                type="button"
                className="po-kpi-card"
                onClick={() =>
                  navigate('/vertical-head/my-department')
                }
              >
                <div className="po-kpi-top">
                  <div className="po-kpi-icon">
                    <Icon name="employees" />
                  </div>
                  <span className="po-kpi-label">
                    Department Employees
                  </span>
                </div>

                <strong>
                  {isLoading ? '—' : departmentEmployees.length}
                </strong>

                <span className="po-kpi-description">
                  Employees in your department
                </span>
              </button>

              <button
                type="button"
                className="po-kpi-card"
                onClick={() =>
                  navigate('/vertical-head/my-department')
                }
              >
                <div className="po-kpi-top">
                  <div className="po-kpi-icon green">
                    <Icon name="check" />
                  </div>
                  <span className="po-kpi-label">Available</span>
                </div>

                <strong>
                  {isLoading
                    ? '—'
                    : availableCount === null
                    ? '—'
                    : availableCount}
                </strong>

                <span className="po-kpi-description">
                  {hasAvailabilityData
                    ? 'Currently available'
                    : 'Availability not exposed by current API'}
                </span>
              </button>

              <button
                type="button"
                className="po-kpi-card"
                onClick={() =>
                  navigate('/vertical-head/resource-requests')
                }
              >
                <div className="po-kpi-top">
                  <div className="po-kpi-icon success">
                    <Icon name="projects" />
                  </div>
                  <span className="po-kpi-label">
                    Assigned Employees
                  </span>
                </div>

                <strong>
                  {isLoading ? '—' : assignedCount}
                </strong>

                <span className="po-kpi-description">
                  Tracked department allocations
                </span>
              </button>
            </section>

            <div className="po-dashboard-grid">
              <section className="po-section">
                <div className="po-section-header">
                  <div>
                    <span className="po-section-eyebrow">
                      RESOURCE WORKFLOW
                    </span>
                    <h2>Pending Resource Requests</h2>
                    <p>
                      Employee demand submitted for your department
                    </p>
                  </div>

                  <button
                    className="po-text-button"
                    type="button"
                    onClick={() =>
                      navigate('/vertical-head/resource-requests')
                    }
                  >
                    View all
                    <Icon name="arrow" size={15} />
                  </button>
                </div>

                {isLoading ? (
                  <div className="po-projects-list">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="po-project-skeleton aaib-skeleton"
                      />
                    ))}
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="po-empty">
                    <div className="po-empty-icon">
                      <Icon name="requests" size={26} />
                    </div>
                    <h3>No pending resource requests</h3>
                    <p>
                      New requests for your department will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="po-projects-list">
                    {pendingRequests.slice(0, 5).map((request) => (
                      <button
                        key={request.id}
                        className="po-project-card"
                        type="button"
                        onClick={() =>
                          navigate('/vertical-head/resource-requests')
                        }
                      >
                        <div className="po-project-main">
                          <div className="po-project-icon">
                            <Icon name="requests" size={18} />
                          </div>

                          <div className="po-project-info">
                            <div className="po-project-name">
                              Project #{request.projectId}
                            </div>

                            <div className="po-project-meta">
                              <span>
                                Department:{' '}
                                <strong>{myDepartment || '—'}</strong>
                              </span>

                              <span>
                                Required:{' '}
                                <strong>
                                  {request.departments?.[myDepartment] || 0}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="po-project-right">
                          <span className="aaib-badge aaib-badge-warning">
                            {request.status || 'Pending'}
                          </span>
                          <Icon name="arrow" size={15} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* <section className="po-section">
                <div className="po-section-header">
                  <div>
                    <span className="po-section-eyebrow">PEOPLE</span>
                    <h2>Department Snapshot</h2>
                    <p>Current employee availability and allocation</p>
                  </div>

                  <button
                    className="po-text-button"
                    type="button"
                    onClick={() =>
                      navigate('/vertical-head/my-department')
                    }
                  >
                    Open
                    <Icon name="arrow" size={15} />
                  </button>
                </div>

                <div className="po-list">
                  <div className="po-attention-row">
                    <div className="po-attention-main">
                      <div className="po-attention-icon green">
                        <Icon name="check" size={17} />
                      </div>
                      <div>
                        <strong>Available Employees</strong>
                        <span>
                          {hasAvailabilityData
                            ? 'Ready for allocation'
                            : 'Not exposed by current API'}
                        </span>
                      </div>
                    </div>

                    <strong className="po-attention-count">
                      {hasAvailabilityData ? availableCount : '—'}
                    </strong>
                  </div>

                  <div className="po-attention-row">
                    <div className="po-attention-main">
                      <div className="po-attention-icon">
                        <Icon name="clock" size={17} />
                      </div>
                      <div>
                        <strong>Assigned Employees</strong>
                        <span>Tracked in the current allocation view</span>
                      </div>
                    </div>

                    <strong className="po-attention-count">
                      {assignedCount}
                    </strong>
                  </div>

                  <div className="po-attention-row">
                    <div className="po-attention-main">
                      <div className="po-attention-icon danger">
                        <Icon name="alert" size={17} />
                      </div>
                      <div>
                        <strong>Unavailable Employees</strong>
                        <span>
                          {hasAvailabilityData
                            ? 'Currently unavailable'
                            : 'Not exposed by current API'}
                        </span>
                      </div>
                    </div>

                    <strong className="po-attention-count">
                      {hasAvailabilityData ? unavailableCount : '—'}
                    </strong>
                  </div>
                </div>
              </section> */}
            </div>

            <section className="po-section">
              <div className="po-section-header">
                <div>
                  <span className="po-section-eyebrow">
                    PORTFOLIO
                  </span>
                  <h2>Recent Projects</h2>
                  <p>Latest project activity visible to you</p>
                </div>

                <button
                  className="po-text-button"
                  type="button"
                  onClick={() =>
                    navigate('/vertical-head/projects')
                  }
                >
                  View all
                  <Icon name="arrow" size={15} />
                </button>
              </div>

              {isLoading ? (
                <div className="po-projects-list">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="po-project-skeleton aaib-skeleton"
                    />
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
                  {recentProjects.map((project) => (
                    <button
                      key={projectId(project)}
                      className="po-project-card"
                      type="button"
                      onClick={() =>
                        navigate(
                          `/vertical-head/projects/${projectId(project)}`,
                        )
                      }
                    >
                      <div className="po-project-main">
                        <div className="po-project-icon">
                          <Icon name="projects" size={18} />
                        </div>

                        <div className="po-project-info">
                          <div className="po-project-name">
                            {projectName(project)}
                          </div>

                          <div className="po-project-meta">
                            <span>
                              Project ID:{' '}
                              <strong>#{projectId(project)}</strong>
                            </span>

                            <span>
                              Updated:{' '}
                              <strong>
                                {formatDate(projectDate(project))}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="po-project-right">
                        <span
                          className={`aaib-badge aaib-badge-${getStatusType(
                            projectStatus(project),
                          )}`}
                        >
                          {projectStatus(project)}
                        </span>

                        <Icon name="arrow" size={15} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
{/* 
            <section className="po-section">
              <div className="po-section-header">
                <div>
                  <span className="po-section-eyebrow">
                    ATTENTION
                  </span>
                  <h2>Projects Requiring Attention</h2>
                  <p>Flags and statuses that may need follow-up</p>
                </div>

                <button
                  className="po-text-button"
                  type="button"
                  onClick={() =>
                    navigate('/vertical-head/projects')
                  }
                >
                  Open projects
                  <Icon name="arrow" size={15} />
                </button>
              </div>

              {attentionProjects.length === 0 ? (
                <div className="po-empty">
                  <div className="po-empty-icon">
                    <Icon name="check" size={26} />
                  </div>
                  <h3>No attention items</h3>
                  <p>
                    There are no flagged projects in the current data.
                  </p>
                </div>
              ) : (
                <div className="po-list">
                  {attentionProjects.map((project) => (
                    <button
                      key={projectId(project)}
                      className="po-attention-row"
                      type="button"
                      onClick={() =>
                        navigate(
                          `/vertical-head/projects/${projectId(project)}`,
                        )
                      }
                    >
                      <div className="po-attention-main">
                        <div className="po-attention-icon danger">
                          <Icon name="alert" size={17} />
                        </div>

                        <div>
                          <strong>{projectName(project)}</strong>
                          <span>
                            Project #{projectId(project)} ·{' '}
                            {projectStatus(project)}
                          </span>
                        </div>
                      </div>

                      <span className="aaib-badge aaib-badge-danger">
                        {projectFlag(project) || 'Attention'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section> */}

            <section className="po-section">
              <div className="po-section-header">
                <div>
                  <span className="po-section-eyebrow">
                    QUICK ACCESS
                  </span>
                  <h2>Department Actions</h2>
                  <p>Move directly to the areas you use most</p>
                </div>
              </div>

              <div className="po-quick-actions">
                <button
                  className="po-quick-action"
                  type="button"
                  onClick={() =>
                    navigate('/vertical-head/resource-requests')
                  }
                >
                  <div className="po-quick-action-icon gold">
                    <Icon name="requests" size={19} />
                  </div>
                  <div>
                    <strong>Resource Requests</strong>
                    <span>
                      Review incoming staffing requirements
                    </span>
                  </div>
                  <Icon name="arrow" size={15} />
                </button>

                <button
                  className="po-quick-action"
                  type="button"
                  onClick={() =>
                    navigate('/vertical-head/my-department')
                  }
                >
                  <div className="po-quick-action-icon green">
                    <Icon name="employees" size={19} />
                  </div>
                  <div>
                    <strong>My Department</strong>
                    <span>Review your department employees</span>
                  </div>
                  <Icon name="arrow" size={15} />
                </button>

                <button
                  className="po-quick-action"
                  type="button"
                  onClick={() =>
                    navigate('/vertical-head/employee-discovery')
                  }
                >
                  <div className="po-quick-action-icon">
                    <Icon name="search" size={19} />
                  </div>
                  <div>
                    <strong>Employee Discovery</strong>
                    <span>Explore Digital Factory employees</span>
                  </div>
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            </section>

            <section className="po-dashboard-footnote">
              <Icon name="alert" size={15} />
              <span>
                Employee availability, assignment persistence, and
                notification counts are shown from the data currently
                exposed to the frontend. The existing backend has not
                been modified.
              </span>
              <button
                type="button"
                onClick={loadData}
                className="po-text-button"
              >
                Refresh
                <Icon name="arrow" size={13} />
              </button>
            </section>
          </div>
        </main>
      </div>

      <style>{`
        .po-dashboard-footnote {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
          padding: 10px 12px;
          border-radius: 9px;
          background: var(--aaib-surface-alt);
          color: var(--aaib-text-muted);
          font-size: 8px;
        }

        .po-dashboard-footnote > span {
          flex: 1;
        }

        .po-quick-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .po-quick-action {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 13px;
          border: 1px solid var(--aaib-border);
          border-radius: 10px;
          background: var(--aaib-surface);
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .po-quick-action:hover {
          transform: translateY(-1px);
          border-color: rgba(197,160,89,.38);
          box-shadow: var(--aaib-shadow-hover);
        }

        .po-quick-action-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
        }

        .po-quick-action-icon.gold {
          background: var(--aaib-accent-soft);
          color: #96721d;
        }

        .po-quick-action-icon.green {
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
        }

        .po-quick-action strong {
          display: block;
          color: var(--aaib-primary);
          font-size: 9px;
        }

        .po-quick-action span {
          display: block;
          margin-top: 2px;
          color: var(--aaib-text-muted);
          font-size: 7px;
          line-height: 1.4;
        }

        .po-quick-action > svg {
          color: var(--aaib-text-muted);
        }

        @media (max-width: 950px) {
          .po-quick-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .po-dashboard-footnote {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
