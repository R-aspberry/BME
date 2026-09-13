// ResourceRequests page
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchJson } from '../../services/api';
import { getEmployees } from '../../services/employeeService';
import { getProjects } from '../../services/projectService';
import aaibLogo from '../../assets/images/aaib.png';

/*
  Vertical Head Resource Assignment

  Flow:
  1. /api/auth/me identifies the logged-in VH.
  2. GET /api/employees gives employees + DepartmentName.
  3. GET /api/departments gives D_Name + Availability.
  4. The VH department is determined from the logged-in VH's employee record.
  5. Only employees in that department are shown.
  6. Department Availability is the maximum number of projects each employee
     from that department can be assigned to.
  7. A selected employee is blocked once their current project count reaches
     the department Availability.
  8. Assignment is sent through POST /api/works-on.

  IMPORTANT:
  The POST endpoint/body is isolated in assignEmployeeToProject().
  If your backend uses a different assignment endpoint/body, change ONLY
  that function. Everything else uses your real GET APIs.
*/

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
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    plus: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
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
    chevron: <path d="M9 18l6-6-6-6" />,
    usersPlus: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M17 8v6M14 11h6" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const getEmployeeId = (employee) => employee?.ID ?? employee?.id ?? null;

const getEmployeeName = (employee) =>
  `${employee?.FN ?? employee?.fn ?? ''} ${employee?.LN ?? employee?.ln ?? ''}`.trim() ||
  'Unnamed Employee';

const getEmployeeTitle = (employee) =>
  employee?.Title ?? employee?.title ?? '—';

const getEmployeeDepartment = (employee) =>
  employee?.DepartmentName ?? employee?.departmentName ?? '';

const isDepartmentHead = (employee) => {
  const title = String(
    employee?.Title ?? employee?.title ?? ''
  )
    .trim()
    .toLowerCase();

  return /\bhead\b/.test(title);
};

const getDepartmentName = (department) =>
  department?.D_Name ?? department?.d_Name ?? department?.name ?? '';

const getDepartmentAvailability = (department) => {
  const value = department?.Availability ?? department?.availability;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getProjectId = (project) =>
  project?.prj_ID ?? project?.projectId ?? project?.id ?? null;

const getProjectName = (project) =>
  project?.project_Name ?? project?.projectName ?? project?.name ?? 'Untitled Project';

/*
  Works_ON is the actual database join table linking employees to projects.
  The frontend uses the dedicated /api/works-on controller.
*/
async function assignEmployeeToProject(projectId, employeeId) {
  return fetchJson('/api/works-on', {
    method: 'POST',
    body: JSON.stringify({
      Employee_ID: Number(employeeId),
      Prj_ID: Number(projectId),
    }),
  });
}

async function getCurrentAssignments() {
  const data = await fetchJson('/api/works-on');
  return Array.isArray(data) ? data : [];
}

export default function VHResourceAssignment() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [departmentName, setDepartmentName] = useState('');

  const storedUserName = localStorage.getItem('userName') || 'User';

  const initials = storedUserName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [
          meResponse,
          employeeResponse,
          departmentResponse,
          projectResponse,
          assignmentResponse,
        ] = await Promise.all([
          fetchJson('/api/auth/me'),
          getEmployees(),
          fetchJson('/api/departments'),
          getProjects(),
          getCurrentAssignments(),
        ]);


        if (!mounted) return;

        setCurrentUser(meResponse || null);
        setEmployees(Array.isArray(employeeResponse) ? employeeResponse : []);
        setDepartments(
          Array.isArray(departmentResponse) ? departmentResponse : []
        );
        setProjects(Array.isArray(projectResponse) ? projectResponse : []);
        setAssignments(
          Array.isArray(assignmentResponse) ? assignmentResponse : []
        );

        /*
          /api/auth/me gives:
          { userId: 2, userName: "sarah.lee", role: "Head" }

          The employee API gives the employee's name + DepartmentName.
          Normalize "sarah.lee" -> "sarah lee" and find the employee record.
        */
        const apiUserName = String(
          meResponse?.userName || storedUserName
        )
          .trim()
          .toLowerCase()
          .replace(/[._-]+/g, ' ')
          .replace(/\s+/g, ' ');

        const employeeForUser = employeeResponse.find((employee) => {
          const name = getEmployeeName(employee)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ');

          return name === apiUserName;
        });

        const resolvedDepartment = getEmployeeDepartment(employeeForUser);

        setDepartmentName(resolvedDepartment);

      } catch (error) {
        if (!mounted) return;

        console.error('Failed to load resource assignment data:', error);
        setErrorMessage(
          error?.message ||
            'Unable to load resource assignment data.'
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [storedUserName]);

  const departmentRecord = useMemo(() => {
    const normalized = departmentName.trim().toLowerCase();

    return (
      departments.find(
        (department) =>
          getDepartmentName(department).trim().toLowerCase() === normalized
      ) || null
    );
  }, [departments, departmentName]);

  const departmentCapacity = getDepartmentAvailability(departmentRecord);

  const myDepartmentEmployees = useMemo(() => {
    const normalized = departmentName.trim().toLowerCase();

    if (!normalized) return [];

    const search = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const sameDepartment =
        getEmployeeDepartment(employee).trim().toLowerCase() === normalized;

      if (!sameDepartment) return false;

      // Never show department heads in the employee assignment list.
      if (isDepartmentHead(employee)) return false;

      if (!search) return true;

      return (
        getEmployeeName(employee).toLowerCase().includes(search) ||
        getEmployeeTitle(employee).toLowerCase().includes(search) ||
        String(getEmployeeId(employee) ?? '')
          .toLowerCase()
          .includes(search)
      );
    });
  }, [employees, departmentName, searchTerm]);

  const getAssignmentCount = (employeeId) => {
    return assignments.filter((assignment) => {
      const assignedEmployeeId =
        assignment?.Employee_ID ??
        assignment?.employee_ID ??
        assignment?.employeeId ??
        assignment?.employee?.ID ??
        assignment?.Employee?.ID;

      return String(assignedEmployeeId) === String(employeeId);
    }).length;
  };

  const getRemainingCapacity = (employeeId) => {
    if (departmentCapacity <= 0) return 0;

    return Math.max(
      0,
      departmentCapacity - getAssignmentCount(employeeId)
    );
  };

  const toggleEmployee = (employeeId) => {
    const employee = myDepartmentEmployees.find(
      (item) => String(getEmployeeId(item)) === String(employeeId)
    );

    if (!employee) return;

    const remaining = getRemainingCapacity(employeeId);

    if (remaining <= 0) return;

    setSelectedEmployeeIds((previous) =>
      previous.includes(employeeId)
        ? previous.filter((id) => id !== employeeId)
        : [...previous, employeeId]
    );
  };

  const removeSelectedEmployee = (employeeId) => {
    setSelectedEmployeeIds((previous) =>
      previous.filter((id) => String(id) !== String(employeeId))
    );
  };

  const selectedProject = projects.find(
    (project) =>
      String(getProjectId(project)) === String(selectedProjectId)
  );

  const assignSelectedEmployees = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedProjectId) {
      setErrorMessage('Please select a project first.');
      return;
    }

    if (selectedEmployeeIds.length === 0) {
      setErrorMessage('Select at least one employee.');
      return;
    }

    const invalidEmployee = selectedEmployeeIds.find(
      (employeeId) => getRemainingCapacity(employeeId) <= 0
    );

    if (invalidEmployee !== undefined) {
      setErrorMessage(
        'One or more selected employees have reached their project capacity.'
      );
      return;
    }

    setIsAssigning(true);

    try {
      await Promise.all(
        selectedEmployeeIds.map((employeeId) =>
          assignEmployeeToProject(selectedProjectId, employeeId)
        )
      );

      /*
        Optimistically add the successful assignments to local state.
        This immediately updates the capacity badges without requiring
        another GET call.
      */
      const optimisticAssignments = selectedEmployeeIds.map((employeeId) => ({
        Employee_ID: employeeId,
        Prj_ID: Number(selectedProjectId),
      }));

      setAssignments((previous) => [
        ...previous,
        ...optimisticAssignments,
      ]);

      const assignedCount = selectedEmployeeIds.length;

      setSelectedEmployeeIds([]);
      setSuccessMessage(
        `${assignedCount} employee${
          assignedCount === 1 ? '' : 's'
        } assigned successfully to ${
          getProjectName(selectedProject)
        }.`
      );
    } catch (error) {
      console.error('Failed to assign employees:', error);

      setErrorMessage(
        error?.message ||
          'Employee assignment is unavailable until the backend assignment endpoint is configured.'
      );
    } finally {
      setIsAssigning(false);
    }
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
              Vertical Head Portal
            </div>
          </div>

          <div className="po-header-right">
            <button
              type="button"
              className="po-header-icon"
              onClick={() =>
                navigate('/vertical-head/notifications')
              }
              aria-label="Open notifications"
            >
              <Icon name="notifications" size={19} />
              <span className="po-notification-dot" />
            </button>

            <button
              type="button"
              className="po-header-user"
              onClick={() => navigate('/vertical-head/profile')}
            >
              <div className="po-user-avatar">{initials}</div>

              <div className="po-user-details">
                <strong>{storedUserName}</strong>
                <span>Vertical Head</span>
              </div>

              <Icon name="chevron" size={15} />
            </button>
          </div>
        </header>

        <main className="po-main">
          <div className="po-content">
            <div className="vh-assignment-header">
              <div>
                <div className="vh-assignment-eyebrow">
                  RESOURCE ALLOCATION
                </div>
                <h1>Assign Employees</h1>
                <p>
                  Assign employees from your department to project work.
                </p>
              </div>

              <div className="vh-department-chip">
                <span>YOUR DEPARTMENT</span>
                <strong>
                  {departmentName || 'Loading...'}
                </strong>
              </div>
            </div>

            {successMessage && (
              <div className="vh-assignment-alert success">
                <Icon name="check" size={17} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="vh-assignment-alert error">
                <Icon name="alert" size={17} />
                <span>{errorMessage}</span>
              </div>
            )}

            <section className="vh-assignment-kpis">
              <div className="vh-assignment-kpi">
                <div className="vh-kpi-label">DEPARTMENT</div>
                <strong>
                  {departmentName || '—'}
                </strong>
              </div>

              <div className="vh-assignment-kpi">
                <div className="vh-kpi-label">MAX PROJECTS / EMPLOYEE</div>
                <strong>
                  {isLoading ? '—' : departmentCapacity}
                </strong>
                <span>
                  Based on department availability
                </span>
              </div>

              <div className="vh-assignment-kpi">
                <div className="vh-kpi-label">EMPLOYEES</div>
                <strong>
                  {isLoading ? '—' : myDepartmentEmployees.length}
                </strong>
                <span>
                  In your department
                </span>
              </div>

              <div className="vh-assignment-kpi">
                <div className="vh-kpi-label">SELECTED</div>
                <strong>{selectedEmployeeIds.length}</strong>
                <span>
                  Ready to assign
                </span>
              </div>
            </section>

            <section className="vh-assignment-card">
              <div className="vh-assignment-card-header">
                <div>
                  <div className="vh-assignment-kicker">
                    PROJECT ASSIGNMENT
                  </div>
                  <h2>Select a project</h2>
                  <p>
                    Choose the project that the selected department
                    employees will be assigned to.
                  </p>
                </div>
              </div>

              <div className="vh-project-selector">
                <label htmlFor="vh-project-select">
                  Project
                </label>

                <select
                  id="vh-project-select"
                  value={selectedProjectId}
                  onChange={(event) => {
                    setSelectedProjectId(event.target.value);
                    setSuccessMessage('');
                    setErrorMessage('');
                  }}
                  disabled={isLoading || isAssigning}
                >
                  <option value="">
                    Select a project...
                  </option>

                  {projects.map((project) => {
                    const id = getProjectId(project);

                    return (
                      <option key={id} value={id}>
                        {getProjectName(project)} — #{id}
                      </option>
                    );
                  })}
                </select>
              </div>
            </section>

            <section className="vh-assignment-card">
              <div className="vh-assignment-card-header employees-header">
                <div>
                  <div className="vh-assignment-kicker">
                    {departmentName || 'MY DEPARTMENT'}
                  </div>
                  <h2>Available Employees</h2>
                  <p>
                    Department heads are excluded. Employees can be assigned while their project count
                    remains below the department availability limit.
                  </p>
                </div>

                <div className="vh-assignment-search">
                  <Icon name="search" size={15} />
                  <input
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search employees..."
                    aria-label="Search employees"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="vh-assignment-state">
                  <strong>Loading employees...</strong>
                  <span>Retrieving department capacity and employees.</span>
                </div>
              ) : !departmentName ? (
                <div className="vh-assignment-state error">
                  <Icon name="alert" size={22} />
                  <strong>Department could not be identified.</strong>
                  <span>
                    The logged-in user was not matched to an employee record.
                  </span>
                </div>
              ) : myDepartmentEmployees.length === 0 ? (
                <div className="vh-assignment-state">
                  <strong>
                    {searchTerm
                      ? 'No employees match your search.'
                      : 'No employees found in your department.'}
                  </strong>
                  <span>
                    {searchTerm
                      ? 'Try another employee name, title, or ID.'
                      : `No employee records were returned for ${departmentName}.`}
                  </span>
                </div>
              ) : (
                <div className="vh-employee-assignment-list">
                  {myDepartmentEmployees.map((employee) => {
                    const employeeId = getEmployeeId(employee);
                    const projectCount = getAssignmentCount(employeeId);
                    const remaining = getRemainingCapacity(employeeId);
                    const selected = selectedEmployeeIds.includes(
                      employeeId
                    );

                    const canAssign =
                      Boolean(selectedProjectId) && remaining > 0;

                    return (
                      <button
                        type="button"
                        key={employeeId}
                        className={`vh-employee-assignment-row ${
                          selected ? 'selected' : ''
                        } ${!canAssign ? 'disabled' : ''}`}
                        onClick={() => {
                          if (!selectedProjectId) {
                            setErrorMessage(
                              'Select a project before selecting employees.'
                            );
                            return;
                          }

                          toggleEmployee(employeeId);
                        }}
                        disabled={
                          isAssigning ||
                          (!selected && remaining <= 0)
                        }
                      >
                        <div className="vh-employee-assignment-check">
                          {selected ? (
                            <Icon name="check" size={16} />
                          ) : (
                            <span />
                          )}
                        </div>

                        <div className="vh-assignment-avatar">
                          {getEmployeeName(employee)
                            .split(' ')
                            .filter(Boolean)
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="vh-assignment-employee-main">
                          <strong>
                            {getEmployeeName(employee)}
                          </strong>
                          <span>
                            {getEmployeeTitle(employee)} · ID #
                            {employeeId}
                          </span>
                        </div>

                        <div className="vh-capacity-block">
                          <span>PROJECTS</span>
                          <strong>
                            {projectCount} / {departmentCapacity}
                          </strong>
                        </div>

                        <div
                          className={`vh-capacity-pill ${
                            remaining === 0
                              ? 'full'
                              : remaining <= 1
                                ? 'low'
                                : 'available'
                          }`}
                        >
                          {remaining === 0
                            ? 'At capacity'
                            : `${remaining} remaining`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="vh-assignment-footer">
                <div>
                  <strong>
                    {selectedEmployeeIds.length} selected
                  </strong>

                  {selectedProject ? (
                    <span>
                      for {getProjectName(selectedProject)}
                    </span>
                  ) : (
                    <span>Select a project to continue</span>
                  )}
                </div>

                <button
                  type="button"
                  className="aaib-btn aaib-btn-primary"
                  onClick={assignSelectedEmployees}
                  disabled={
                    isAssigning ||
                    !selectedProjectId ||
                    selectedEmployeeIds.length === 0
                  }
                >
                  <Icon
                    name="usersPlus"
                    size={15}
                  />

                  {isAssigning
                    ? 'Assigning...'
                    : 'Assign Employees'}
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      <style>{`
        .vh-assignment-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .vh-assignment-eyebrow {
          margin-bottom: 5px;
          color: var(--aaib-accent);
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .14em;
        }

        .vh-assignment-header h1 {
          margin: 0 0 6px;
          color: var(--aaib-primary);
          font-size: 30px;
          line-height: 1.1;
          letter-spacing: -.035em;
        }

        .vh-assignment-header p {
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 11px;
        }

        .vh-department-chip {
          min-width: 190px;
          padding: 12px 14px;
          border: 1px solid var(--aaib-border);
          border-radius: 11px;
          background: #fff;
          box-shadow: var(--aaib-shadow-card);
        }

        .vh-department-chip span {
          display: block;
          color: var(--aaib-text-muted);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .08em;
        }

        .vh-department-chip strong {
          display: block;
          margin-top: 4px;
          color: var(--aaib-primary);
          font-size: 12px;
        }

        .vh-assignment-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
          padding: 10px 13px;
          border-radius: 9px;
          font-size: 10px;
        }

        .vh-assignment-alert.success {
          border: 1px solid rgba(71, 126, 88, .2);
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
        }

        .vh-assignment-alert.error {
          border: 1px solid rgba(193, 72, 72, .2);
          background: var(--aaib-danger-soft);
          color: var(--aaib-danger);
        }

        .vh-assignment-kpis {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .vh-assignment-kpi {
          min-width: 0;
          padding: 15px 16px;
          border: 1px solid var(--aaib-border);
          border-radius: 12px;
          background: #fff;
          box-shadow: var(--aaib-shadow-card);
        }

        .vh-kpi-label {
          margin-bottom: 6px;
          color: var(--aaib-text-muted);
          font-size: 7px;
          font-weight: 850;
          letter-spacing: .09em;
        }

        .vh-assignment-kpi strong {
          display: block;
          color: var(--aaib-primary);
          font-size: 19px;
          line-height: 1.1;
        }

        .vh-assignment-kpi span {
          display: block;
          margin-top: 4px;
          color: #8b948f;
          font-size: 8px;
        }

        .vh-assignment-card {
          overflow: hidden;
          margin-bottom: 14px;
          border: 1px solid var(--aaib-border);
          border-radius: 14px;
          background: #fff;
          box-shadow: var(--aaib-shadow-card);
        }

        .vh-assignment-card-header {
          padding: 19px 21px 15px;
          border-bottom: 1px solid var(--aaib-border);
        }

        .vh-assignment-card-header.employees-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
        }

        .vh-assignment-kicker {
          margin-bottom: 4px;
          color: var(--aaib-accent);
          font-size: 7px;
          font-weight: 850;
          letter-spacing: .12em;
        }

        .vh-assignment-card-header h2 {
          margin: 0 0 5px;
          color: var(--aaib-primary);
          font-size: 17px;
          letter-spacing: -.025em;
        }

        .vh-assignment-card-header p {
          max-width: 700px;
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 9px;
          line-height: 1.5;
        }

        .vh-project-selector {
          padding: 17px 21px 20px;
        }

        .vh-project-selector label {
          display: block;
          margin: 0 0 6px 2px;
          color: var(--aaib-text-muted);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .vh-project-selector select {
          width: 100%;
          min-height: 42px;
          padding: 0 12px;
          border: 1px solid var(--aaib-border);
          border-radius: 9px;
          outline: none;
          background: #fff;
          color: var(--aaib-text);
          font-size: 10px;
        }

        .vh-project-selector select:focus {
          border-color: rgba(27,40,30,.22);
          box-shadow: 0 0 0 3px var(--aaib-primary-soft);
        }

        .vh-assignment-search {
          width: 250px;
          min-height: 36px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 10px;
          border: 1px solid var(--aaib-border);
          border-radius: 8px;
          background: #fff;
          color: var(--aaib-text-muted);
        }

        .vh-assignment-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--aaib-text);
          font-size: 9px;
        }

        .vh-assignment-search:focus-within {
          border-color: rgba(27,40,30,.2);
          box-shadow: 0 0 0 3px var(--aaib-primary-soft);
        }

        .vh-employee-assignment-list {
          display: grid;
        }

        .vh-employee-assignment-row {
          width: 100%;
          min-height: 72px;
          display: grid;
          grid-template-columns: 28px 38px minmax(0, 1fr) 95px 105px;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border: 0;
          border-bottom: 1px solid var(--aaib-border);
          background: #fff;
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: background .16s ease, box-shadow .16s ease;
        }

        .vh-employee-assignment-row:hover:not(:disabled) {
          background: #fbfcfb;
          box-shadow: inset 3px 0 0 var(--aaib-accent);
        }

        .vh-employee-assignment-row.selected {
          background: var(--aaib-primary-soft);
          box-shadow: inset 3px 0 0 var(--aaib-primary);
        }

        .vh-employee-assignment-row.disabled {
          cursor: not-allowed;
          opacity: .58;
        }

        .vh-employee-assignment-row:disabled {
          color: inherit;
        }

        .vh-employee-assignment-row:last-child {
          border-bottom: 0;
        }

        .vh-employee-assignment-check {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(27,40,30,.18);
          border-radius: 6px;
          color: #fff;
        }

        .vh-employee-assignment-row.selected
        .vh-employee-assignment-check {
          border-color: var(--aaib-primary);
          background: var(--aaib-primary);
        }

        .vh-employee-assignment-check span {
          width: 7px;
          height: 7px;
          border-radius: 2px;
        }

        .vh-assignment-avatar {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
          font-size: 9px;
          font-weight: 850;
        }

        .vh-assignment-employee-main {
          min-width: 0;
        }

        .vh-assignment-employee-main strong {
          display: block;
          overflow: hidden;
          margin-bottom: 3px;
          color: var(--aaib-primary);
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vh-assignment-employee-main span {
          display: block;
          overflow: hidden;
          color: var(--aaib-text-muted);
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vh-capacity-block span {
          display: block;
          color: var(--aaib-text-muted);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: .06em;
        }

        .vh-capacity-block strong {
          display: block;
          margin-top: 3px;
          color: var(--aaib-primary);
          font-size: 10px;
        }

        .vh-capacity-pill {
          justify-self: end;
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 850;
          white-space: nowrap;
        }

        .vh-capacity-pill.available {
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
        }

        .vh-capacity-pill.low {
          background: var(--aaib-accent-soft);
          color: #896a1d;
        }

        .vh-capacity-pill.full {
          background: var(--aaib-danger-soft);
          color: var(--aaib-danger);
        }

        .vh-assignment-state {
          min-height: 230px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 30px;
          text-align: center;
        }

        .vh-assignment-state strong {
          color: var(--aaib-primary);
          font-size: 12px;
        }

        .vh-assignment-state span {
          color: var(--aaib-text-muted);
          font-size: 9px;
        }

        .vh-assignment-state.error {
          color: var(--aaib-danger);
        }

        .vh-assignment-state.error strong {
          color: var(--aaib-danger);
        }

        .vh-assignment-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 14px 20px;
          border-top: 1px solid var(--aaib-border);
          background: var(--aaib-surface-alt);
        }

        .vh-assignment-footer > div strong {
          color: var(--aaib-primary);
          font-size: 10px;
        }

        .vh-assignment-footer > div span {
          margin-left: 6px;
          color: var(--aaib-text-muted);
          font-size: 9px;
        }

        @media (max-width: 1050px) {
          .vh-assignment-kpis {
            grid-template-columns: 1fr 1fr;
          }

          .vh-employee-assignment-row {
            grid-template-columns: 28px 38px minmax(0, 1fr) 95px;
          }

          .vh-capacity-pill {
            display: none;
          }
        }

        @media (max-width: 780px) {
          .vh-assignment-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .vh-department-chip {
            width: 100%;
          }

          .vh-assignment-card-header.employees-header {
            align-items: stretch;
            flex-direction: column;
          }

          .vh-assignment-search {
            width: 100%;
          }

          .vh-employee-assignment-row {
            grid-template-columns: 26px 36px minmax(0, 1fr) 75px;
            gap: 9px;
            padding: 11px 13px;
          }

          .vh-capacity-block {
            text-align: right;
          }

          .vh-assignment-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .vh-assignment-footer button {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .vh-assignment-kpis {
            grid-template-columns: 1fr;
          }

          .vh-employee-assignment-row {
            grid-template-columns: 25px 34px minmax(0, 1fr);
          }

          .vh-capacity-block {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
