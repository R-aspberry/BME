import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import { getEmployees } from '../../services/employeeService';
import aaibLogo from '../../assets/images/aaib.png';

const STORAGE_KEY = 'po_resource_requests';

const PO_NAV_ITEMS = [
  { label: 'Dashboard', to: '/po/dashboard', icon: '⌂' },
  { label: 'Project Requests', to: '/po/project-requests', icon: '▤' },
  { label: 'My Projects', to: '/po/my-projects', icon: '◫' },
  { label: 'Employees', to: '/po/employees', icon: '♙' },
  { label: 'Notifications', to: '/po/notifications', icon: '◉' },
  { label: 'Calendar', to: '/po/calendar', icon: '□' },
  { label: 'Profile', to: '/po/profile', icon: '○' },
];

const REQUEST_STATUS = {
  PENDING: 'Pending',
};

function getStoredRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Unable to load resource requests:', error);
    return [];
  }
}

function saveStoredRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function normalizeProjects(projects) {
  if (!Array.isArray(projects)) return [];

  return projects
    .map((project) => ({
      id: project?.prj_ID ?? project?.id ?? project?.projectId,
      name:
        project?.project_Name ??
        project?.projectName ??
        project?.name ??
        `Project ${project?.prj_ID ?? project?.id ?? ''}`,
      status: project?.status ?? 'Unknown',
      flag: project?.flag ?? 'Normal',
      description: project?.description ?? '',
      startDate: project?.start_date ?? project?.startDate ?? null,
      endDate: project?.end_date ?? project?.endDate ?? null,
    }))
    .filter((project) => project.id !== undefined && project.id !== null);
}

function normalizeEmployees(employees) {
  if (!Array.isArray(employees)) return [];

  return employees.map((employee) => ({
    id: employee?.id ?? employee?.employeeId,
    firstName: employee?.fn ?? employee?.firstName ?? '',
    lastName: employee?.ln ?? employee?.lastName ?? '',
    title: employee?.title ?? employee?.jobTitle ?? '',
    department:
      employee?.departmentName ??
      employee?.department ??
      employee?.department_name ??
      '',
  }));
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

function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fullEmployeeName(employee) {
  return `${employee.firstName} ${employee.lastName}`.trim() || 'Unnamed Employee';
}

function findDepartmentHead(department, employees) {
  if (!department) return null;

  const normalizedDepartment = department.trim().toLowerCase();

  const departmentEmployees = employees.filter(
    (employee) =>
      employee.department?.trim().toLowerCase() === normalizedDepartment,
  );

  if (departmentEmployees.length === 0) return null;

  const head = departmentEmployees.find((employee) => {
    const title = employee.title.toLowerCase();
    return (
      title.includes('vertical head') ||
      title.includes('department head') ||
      title.includes('head of') ||
      title === 'head' ||
      title.includes('head')
    );
  });

  return head || null;
}

function requestTotal(request) {
  if (!request?.departments) return 0;

  return Object.values(request.departments).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
}


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
    projects: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />,
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
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="M11 18l-6-6 6-6" />
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
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3.5" />
        <path d="M16 11a3.5 3.5 0 1 0 0-7M21 21v-2a4 4 0 0 0-3-3.87" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M10 11v6M14 11v6" />
        <path d="M6 7l1 13h10l1-13M9 7V4h6v3" />
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
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6M12 7h.01" />
      </>
    ),
    chevronDown: <path d="m6 9 6 6 6-6" />,
  };

  return <svg {...common}>{icons[name]}</svg>;
}

export default function ResourceRequests() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [savedRequests, setSavedRequests] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [activeTab, setActiveTab] = useState('create');

  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError('');

      try {
        const [projectsResponse, employeesResponse] = await Promise.all([
          getProjects(),
          getEmployees(),
        ]);

        if (cancelled) return;

        setProjects(normalizeProjects(projectsResponse));
        setEmployees(normalizeEmployees(employeesResponse));
        setSavedRequests(getStoredRequests());
      } catch (loadError) {
        console.error('Resource Planner load error:', loadError);

        if (!cancelled) {
          setError(
            loadError?.message ||
              'Unable to load the Resource Planner data right now.',
          );
          setSavedRequests(getStoredRequests());
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const departments = useMemo(() => {
    const unique = new Map();

    employees.forEach((employee) => {
      const department = employee.department?.trim();

      if (!department) return;

      const key = department.toLowerCase();

      if (!unique.has(key)) {
        unique.set(key, {
          name: department,
          head: findDepartmentHead(department, employees),
        });
      }
    });

    return Array.from(unique.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [employees]);

  const projectById = useMemo(() => {
    const map = new Map();

    projects.forEach((project) => {
      map.set(String(project.id), project);
    });

    return map;
  }, [projects]);

  const selectedProject = selectedProjectId
    ? projectById.get(String(selectedProjectId))
    : null;

  const filteredProjects = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name.toLowerCase().includes(search) ||
        String(project.id).toLowerCase().includes(search);

      const matchesFilter =
        projectFilter === 'all' ||
        project.status.toLowerCase() === projectFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, projectFilter]);

  const currentTotal = useMemo(
    () =>
      Object.values(departmentCounts).reduce(
        (sum, count) => sum + Number(count || 0),
        0,
      ),
    [departmentCounts],
  );

  const savedProjectIds = useMemo(
    () => new Set(savedRequests.map((request) => String(request.projectId))),
    [savedRequests],
  );

  function clearMessages() {
    setError('');
    setValidationError('');
    setSuccessMessage('');
  }

  function handleProjectSelection(event) {
    const projectId = event.target.value;

    clearMessages();
    setSelectedProjectId(projectId);

    const existing = savedRequests.find(
      (request) => String(request.projectId) === String(projectId),
    );

    if (existing) {
      setDepartmentCounts({ ...(existing.departments || {}) });
    } else {
      setDepartmentCounts({});
    }
  }

  function handleDepartmentCountChange(department, value) {
    clearMessages();

    setDepartmentCounts((current) => ({
      ...current,
      [department]: value,
    }));
  }

  function validateRequest() {
    if (!selectedProjectId) {
      setValidationError('Please select a project before saving the request.');
      return false;
    }

    if (departments.length === 0) {
      setValidationError(
        'No departments are available from the current employee data.',
      );
      return false;
    }

    const enteredDepartments = Object.entries(departmentCounts).filter(
      ([, value]) => String(value).trim() !== '',
    );

    if (enteredDepartments.length === 0) {
      setValidationError(
        'Enter at least one required employee count before saving.',
      );
      return false;
    }

    for (const [department, value] of enteredDepartments) {
      const numericValue = Number(value);

      if (!Number.isInteger(numericValue) || numericValue <= 0) {
        setValidationError(
          `${department} must have a positive whole-number employee count.`,
        );
        return false;
      }
    }

    if (currentTotal <= 0) {
      setValidationError(
        'The total number of requested employees must be greater than zero.',
      );
      return false;
    }

    return true;
  }

  async function handleSaveRequest(event) {
    event.preventDefault();
    clearMessages();

    if (!validateRequest()) return;

    setIsSaving(true);

    try {
      const now = new Date().toISOString();

      const cleanedDepartments = Object.entries(departmentCounts)
        .filter(([, value]) => String(value).trim() !== '')
        .reduce((result, [department, value]) => {
          result[department] = Number(value);
          return result;
        }, {});

      const existingIndex = savedRequests.findIndex(
        (request) => String(request.projectId) === String(selectedProjectId),
      );

      const nextRequest = {
        id:
          existingIndex >= 0
            ? savedRequests[existingIndex].id
            : `local-${Date.now()}`,
        projectId: Number.isNaN(Number(selectedProjectId))
          ? selectedProjectId
          : Number(selectedProjectId),
        departments: cleanedDepartments,
        totalEmployees: Object.values(cleanedDepartments).reduce(
          (sum, count) => sum + count,
          0,
        ),
        status: REQUEST_STATUS.PENDING,
        updatedAt: now,
        createdAt:
          existingIndex >= 0
            ? savedRequests[existingIndex].createdAt || now
            : now,
      };

      const updatedRequests = [...savedRequests];

      if (existingIndex >= 0) {
        updatedRequests[existingIndex] = nextRequest;
      } else {
        updatedRequests.unshift(nextRequest);
      }

      saveStoredRequests(updatedRequests);
      setSavedRequests(updatedRequests);

      setSuccessMessage(
        existingIndex >= 0
          ? 'Resource request updated successfully.'
          : 'Resource request saved successfully.',
      );

      setActiveTab('saved');
    } catch (saveError) {
      console.error('Resource Planner save error:', saveError);
      setError('Unable to save the resource request. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function openSavedRequest(request) {
    setSelectedProjectId(String(request.projectId));
    setDepartmentCounts({ ...(request.departments || {}) });
    setActiveTab('create');
    clearMessages();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function handleDeleteRequest(requestId) {
    const confirmed = window.confirm(
      'Remove this locally saved resource request?',
    );

    if (!confirmed) return;

    const updated = savedRequests.filter((request) => request.id !== requestId);

    saveStoredRequests(updated);
    setSavedRequests(updated);
    setSuccessMessage('Resource request removed.');
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');

    navigate('/login', { replace: true });
  }

  function getProjectName(projectId) {
    return projectById.get(String(projectId))?.name || `Project ${projectId}`;
  }

  return (
    <div
      className={`po-shell resource-planner-page ${
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
            <Icon name="menu" size={19} />
          </button>

          <button
            type="button"
            className="po-mobile-close"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        <div className="po-sidebar-section-label">Product Owner Portal</div>

        <nav className="po-nav">
          <NavLink to="/po/dashboard" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="dashboard" /></span>
            <span className="po-nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/po/project-requests" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="requests" /></span>
            <span className="po-nav-text">Project Requests</span>
          </NavLink>
          <NavLink to="/po/projects" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="projects" /></span>
            <span className="po-nav-text">My Projects</span>
          </NavLink>
          <NavLink to="/po/employees" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="employees" /></span>
            <span className="po-nav-text">Employees</span>
          </NavLink>
          <NavLink to="/po/notifications" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="notifications" /></span>
            <span className="po-nav-text">Notifications</span>
          </NavLink>
          <NavLink to="/po/calendar" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="calendar" /></span>
            <span className="po-nav-text">Calendar</span>
          </NavLink>
          <NavLink to="/po/resource-requests" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="users" /></span>
            <span className="po-nav-text">Resource Requests</span>
          </NavLink>
        </nav>

        <div className="po-sidebar-bottom">
          <NavLink to="/po/profile" className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
            <span className="po-nav-icon"><Icon name="profile" /></span>
            <span className="po-nav-text">My Profile</span>
          </NavLink>
          <button type="button" className="po-nav-item po-logout" onClick={logout}>
            <span className="po-nav-icon"><Icon name="logout" /></span>
            <span className="po-nav-text">Logout</span>
          </button>
        </div>
      </aside>

      <div
        className="po-sidebar-backdrop"
        onClick={() => setMobileSidebarOpen(false)}
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

            <img src={aaibLogo} alt="AAIB" className="po-header-aaib-logo" />
            <div className="po-header-title">Product Owner Portal</div>
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
              <div className="po-user-avatar">
                {(localStorage.getItem('userName') || 'PO')
                  .split(' ')
                  .filter(Boolean)
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="po-user-details">
                <strong>{localStorage.getItem('userName') || 'User'}</strong>
                <span>Product Owner</span>
              </div>
            </button>
          </div>
        </header>

        <main className="po-main">
          <div className="po-content">
            <div className="resource-modern-heading">
              <div>
                <div className="po-page-eyebrow"> </div>
                <h1>Resource Requests</h1>
                <p>
                </p>
              </div>

              <div className="resource-heading-actions">
                {/* <button
                  type="button"
                  className="resource-modern-secondary"
                  onClick={() => navigate('/po/projects')}
                >
                  <Icon name="projects" size={15} />
                  My Projects
                </button>

                <button
                  type="button"
                  className="resource-modern-primary"
                  onClick={() => {
                    setSelectedProjectId('');
                    setDepartmentCounts({});
                    setActiveTab('create');
                    clearMessages();
                  }}
                >
                  <Icon name="plus" size={15} />
                  New Request
                </button> */}
              </div>
            </div>

            <section className="resource-overview-strip">
              <div className="resource-overview-stat">
                <div className="resource-overview-icon">
                  <Icon name="projects" size={17} />
                </div>
                <div>
                  <span>Projects</span>
                  <strong>{projects.length}</strong>
                  <small>Available for planning</small>
                </div>
              </div>

              <div className="resource-overview-divider" />

              <div className="resource-overview-stat">
                <div className="resource-overview-icon gold">
                  <Icon name="users" size={17} />
                </div>
                <div>
                  <span>Departments</span>
                  <strong>{departments.length}</strong>
                  <small>From employee data</small>
                </div>
              </div>

              <div className="resource-overview-divider" />

              <div className="resource-overview-stat">
                <div className="resource-overview-icon green">
                  <Icon name="clock" size={17} />
                </div>
                <div>
                  <span>Saved Requests</span>
                  <strong>{savedRequests.length}</strong>
                  <small>On this device</small>
                </div>
              </div>

              <div className="resource-overview-divider" />

              <div className="resource-overview-stat">
                <div className="resource-overview-icon">
                  <Icon name="check" size={17} />
                </div>
                <div>
                  <span>Current Required</span>
                  <strong>{currentTotal}</strong>
                  <small>Selected project</small>
                </div>
              </div>
            </section>

            {error && (
              <div className="resource-modern-alert error" role="alert">
                <Icon name="info" size={17} />
                <div>
                  <strong>Unable to load all data</strong>
                  <span>{error}</span>
                </div>
                <button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button>
              </div>
            )}

            {successMessage && (
              <div className="resource-modern-alert success" role="status">
                <Icon name="check" size={17} />
                <div>
                  <strong>Request saved</strong>
                  <span>{successMessage}</span>
                </div>
                <button type="button" onClick={() => setSuccessMessage('')} aria-label="Dismiss success message">×</button>
              </div>
            )}

            <div className="resource-modern-tabs">
              <button
                type="button"
                className={activeTab === 'create' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('create');
                  clearMessages();
                }}
              >
                <Icon name="plus" size={15} />
                Create Request
              </button>

              <button
                type="button"
                className={activeTab === 'saved' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('saved');
                  clearMessages();
                }}
              >
                <Icon name="requests" size={15} />
                Saved Requests
                <span>{savedRequests.length}</span>
              </button>
            </div>

            {isLoading ? (
              <section className="resource-modern-state">
                <div className="resource-modern-spinner" />
                <h3>Loading resource planning</h3>
                <p>Retrieving projects and department information...</p>
              </section>
            ) : activeTab === 'create' ? (
              <form onSubmit={handleSaveRequest}>
                <section className="resource-modern-card">
                  <div className="resource-modern-card-header">
                    <div>
                      <span className="resource-modern-eyebrow">STEP 01</span>
                      <h2>Select Project</h2>
                      <p>Choose the project that needs employee capacity.</p>
                    </div>

                    {selectedProject && (
                      <div className="resource-selected-project">
                        <span>Selected project</span>
                        <strong>{selectedProject.name}</strong>
                        <small>
                          PRJ-{String(selectedProject.id).padStart(4, '0')}
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="resource-project-controls">
                    <div className="resource-control search">
                      <label htmlFor="resource-project-search">Search projects</label>
                      <div>
                        <Icon name="search" size={16} />
                        <input
                          id="resource-project-search"
                          type="text"
                          placeholder="Search project name or ID..."
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="resource-control">
                      <label htmlFor="resource-project-filter">Status</label>
                      <div className="resource-select-wrap">
                        <select
                          id="resource-project-filter"
                          value={projectFilter}
                          onChange={(event) => setProjectFilter(event.target.value)}
                        >
                          <option value="all">All statuses</option>
                          {Array.from(new Set(projects.map((project) => project.status)))
                            .sort()
                            .map((projectStatus) => (
                              <option key={projectStatus} value={projectStatus}>
                                {projectStatus}
                              </option>
                            ))}
                        </select>
                        <Icon name="chevronDown" size={14} />
                      </div>
                    </div>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="resource-modern-empty-inline">
                      <div className="resource-modern-empty-icon">
                        <Icon name="search" size={19} />
                      </div>
                      <div>
                        <strong>No matching projects</strong>
                        <span>Try another project name, ID or status.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="resource-project-modern-grid">
                      {filteredProjects.map((project) => {
                        const isSelected =
                          String(selectedProjectId) === String(project.id);
                        const hasSavedRequest = savedProjectIds.has(
                          String(project.id)
                        );

                        return (
                          <button
                            type="button"
                            key={project.id}
                            className={`resource-project-modern-card ${
                              isSelected ? 'selected' : ''
                            }`}
                            onClick={() =>
                              handleProjectSelection({
                                target: { value: String(project.id) },
                              })
                            }
                          >
                            <div className="resource-project-card-topline">
                              <span>
                                PRJ-{String(project.id).padStart(4, '0')}
                              </span>
                              {hasSavedRequest && (
                                <em>
                                  <Icon name="check" size={10} />
                                  Saved
                                </em>
                              )}
                            </div>

                            <h3>{project.name}</h3>

                            <div className="resource-project-card-bottom">
                              <span className={`resource-project-status-pill ${String(project.status).toLowerCase().replace(/\s+/g, '-')}`}>
                                {project.status}
                              </span>
                              <span className="resource-project-open">
                                {isSelected ? 'Selected' : 'Select'}
                                <Icon name="arrowRight" size={13} />
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                {selectedProject && (
                  <>
                    <section className="resource-modern-card">
                      <div className="resource-modern-card-header">
                        <div>
                          <span className="resource-modern-eyebrow">STEP 02</span>
                          <h2>Department Requirements</h2>
                          <p>
                            Enter the required employee count for each department.
                            The corresponding Vertical Head is shown for reference.
                          </p>
                        </div>

                        <div className="resource-total-box">
                          <span>Total Required</span>
                          <strong>{currentTotal}</strong>
                          <small>employees</small>
                        </div>
                      </div>

                      {validationError && (
                        <div className="resource-validation-modern" role="alert">
                          <Icon name="info" size={15} />
                          <span>{validationError}</span>
                        </div>
                      )}

                      {departments.length === 0 ? (
                        <div className="resource-modern-empty-inline">
                          <div className="resource-modern-empty-icon">
                            <Icon name="users" size={19} />
                          </div>
                          <div>
                            <strong>No departments available</strong>
                            <span>
                              Department information will appear when employees
                              are returned from the employee API.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="resource-department-modern-list">
                          <div className="resource-department-modern-head">
                            <span>Department</span>
                            <span>Vertical Head</span>
                            <span>Required Employees</span>
                          </div>

                          {departments.map((department) => {
                            const value =
                              departmentCounts[department.name] ?? '';
                            const numericValue = Number(value);
                            const hasInvalidValue =
                              String(value).trim() !== '' &&
                              (!Number.isInteger(numericValue) ||
                                numericValue <= 0);

                            return (
                              <div
                                key={department.name}
                                className={`resource-department-modern-row ${
                                  hasInvalidValue ? 'invalid' : ''
                                }`}
                              >
                                <div className="resource-department-name">
                                  <div className="resource-department-modern-icon">
                                    {department.name.slice(0, 1).toUpperCase()}
                                  </div>
                                  <div>
                                    <strong>{department.name}</strong>
                                    <span>Employee capacity requirement</span>
                                  </div>
                                </div>

                                <div className="resource-department-vh">
                                  {department.head ? (
                                    <>
                                      <strong>
                                        {fullEmployeeName(department.head)}
                                      </strong>
                                      <span>{department.head.title || 'Vertical Head'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <strong>Not available</strong>
                                      <span>Not found in current employee data</span>
                                    </>
                                  )}
                                </div>

                                <div className="resource-department-modern-input">
                                  <label htmlFor={`count-${department.name}`}>
                                    Required
                                  </label>
                                  <input
                                    id={`count-${department.name}`}
                                    type="number"
                                    min="1"
                                    step="1"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={value}
                                    onChange={(event) =>
                                      handleDepartmentCountChange(
                                        department.name,
                                        event.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>

                    <section className="resource-modern-card resource-review-modern-card">
                      <div className="resource-modern-card-header">
                        <div>
                          <span className="resource-modern-eyebrow">STEP 03</span>
                          <h2>Review Request</h2>
                          <p>
                            Confirm the demand before saving the request.
                          </p>
                        </div>

                        <span className="resource-review-status-pill">
                          <Icon name="clock" size={12} />
                          Pending
                        </span>
                      </div>

                      <div className="resource-review-modern-grid">
                        <div>
                          <span>Project</span>
                          <strong>{selectedProject.name}</strong>
                        </div>
                        <div>
                          <span>Project ID</span>
                          <strong>
                            PRJ-{String(selectedProject.id).padStart(4, '0')}
                          </strong>
                        </div>
                        <div>
                          <span>Departments</span>
                          <strong>
                            {
                              Object.entries(departmentCounts).filter(
                                ([, value]) => Number(value) > 0
                              ).length
                            }
                          </strong>
                        </div>
                        <div>
                          <span>Total Employees</span>
                          <strong>{currentTotal}</strong>
                        </div>
                      </div>

                      {/* <div className="resource-next-stage">
                        <div className="resource-next-stage-icon">
                          <Icon name="users" size={16} />
                        </div>
                        <div>
                          <strong></strong>
                          <span>
                          </span>
                        </div>
                      </div> */}

                      <div className="resource-modern-actions">
                        <button
                          type="button"
                          className="resource-modern-secondary"
                          onClick={() => {
                            setSelectedProjectId('');
                            setDepartmentCounts({});
                            setValidationError('');
                          }}
                        >
                          Clear
                        </button>

                        <button
                          type="submit"
                          className="resource-modern-primary"
                          disabled={isSaving}
                        >
                          <Icon name="check" size={15} />
                          {isSaving
                            ? 'Saving...'
                            : savedProjectIds.has(String(selectedProjectId))
                              ? 'Update Resource Request'
                              : 'Save Resource Request'}
                        </button>
                      </div>
                    </section>
                  </>
                )}
              </form>
            ) : (
              <section className="resource-modern-card">
                <div className="resource-modern-card-header">
                  <div>
                    <span className="resource-modern-eyebrow">REQUESTS</span>
                    <h2>Saved Resource Requests</h2>
                    <p>Review, edit or remove requests saved on this device.</p>
                  </div>

                  <div className="resource-total-box compact">
                    <span>Total Requests</span>
                    <strong>{savedRequests.length}</strong>
                  </div>
                </div>

                {savedRequests.length === 0 ? (
                  <div className="resource-modern-empty-state">
                    <div className="resource-modern-empty-icon large">
                      <Icon name="users" size={25} />
                    </div>
                    <h3>No resource requests yet</h3>
                    <p>
                      Select a project and define department requirements to
                      create your first request.
                    </p>
                    <button
                      type="button"
                      className="resource-modern-primary"
                      onClick={() => setActiveTab('create')}
                    >
                      <Icon name="plus" size={15} />
                      Create Request
                    </button>
                  </div>
                ) : (
                  <div className="resource-saved-modern-list">
                    {savedRequests.map((request) => {
                      const departmentEntries = Object.entries(
                        request.departments || {}
                      ).filter(([, count]) => Number(count) > 0);

                      return (
                        <article
                          key={request.id}
                          className="resource-saved-modern-row"
                        >
                          <div className="resource-saved-main">
                            <div className="resource-saved-project-icon">
                              <Icon name="projects" size={17} />
                            </div>

                            <div>
                              <div className="resource-saved-meta">
                                <span>
                                  PRJ-{String(request.projectId).padStart(4, '0')}
                                </span>
                                <em>
                                  {request.status || REQUEST_STATUS.PENDING}
                                </em>
                              </div>
                              <h3>{getProjectName(request.projectId)}</h3>
                              <p>Updated {formatDateTime(request.updatedAt)}</p>
                            </div>
                          </div>

                          <div className="resource-saved-stats">
                            <div>
                              <span>Departments</span>
                              <strong>{departmentEntries.length}</strong>
                            </div>
                            <div>
                              <span>Employees</span>
                              <strong>{requestTotal(request)}</strong>
                            </div>
                          </div>

                          <div className="resource-saved-departments">
                            {departmentEntries.map(([department, count]) => (
                              <span key={department}>
                                {department}
                                <strong>{count}</strong>
                              </span>
                            ))}
                          </div>

                          <div className="resource-saved-actions">
                            <button
                              type="button"
                              className="resource-icon-action"
                              onClick={() => openSavedRequest(request)}
                              title="Edit request"
                              aria-label="Edit request"
                            >
                              <Icon name="edit" size={15} />
                            </button>

                            <button
                              type="button"
                              className="resource-icon-action danger"
                              onClick={() => handleDeleteRequest(request.id)}
                              title="Remove request"
                              aria-label="Remove request"
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .resource-modern-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 20px;
        }

        .resource-modern-heading h1 {
          margin: 4px 0 6px;
          color: var(--aaib-primary);
          font-size: 31px;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .resource-modern-heading p {
          max-width: 760px;
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 11px;
          line-height: 1.65;
        }

        .resource-heading-actions {
          display: flex;
          gap: 8px;
          flex: 0 0 auto;
        }

        .resource-overview-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: center;
          margin-bottom: 15px;
          padding: 13px 17px;
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          background: #fff;
          box-shadow: var(--aaib-shadow-card);
        }

        .resource-overview-stat {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 2px 7px;
        }

        .resource-overview-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 9px;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
        }

        .resource-overview-icon.gold {
          background: var(--aaib-accent-soft);
          color: #96721d;
        }

        .resource-overview-icon.green {
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
        }

        .resource-overview-stat span {
          display: block;
          color: var(--aaib-text-muted);
          font-size: 7px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .resource-overview-stat strong {
          display: block;
          color: var(--aaib-primary);
          font-size: 18px;
          line-height: 1;
        }

        .resource-overview-stat small {
          display: block;
          margin-top: 3px;
          color: #89938c;
          font-size: 7px;
        }

        .resource-overview-divider {
          width: 1px;
          height: 30px;
          background: var(--aaib-border);
        }

        .resource-modern-alert {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 9px;
          margin-bottom: 12px;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 9px;
        }

        .resource-modern-alert.error {
          background: var(--aaib-danger-soft);
          color: var(--aaib-danger);
        }

        .resource-modern-alert.success {
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
        }

        .resource-modern-alert strong,
        .resource-modern-alert span {
          display: block;
        }

        .resource-modern-alert strong {
          margin-bottom: 1px;
          font-size: 9px;
        }

        .resource-modern-alert button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-size: 17px;
        }

        .resource-modern-tabs {
          display: flex;
          gap: 2px;
          width: fit-content;
          margin-bottom: 14px;
          padding: 3px;
          border: 1px solid var(--aaib-border);
          border-radius: 9px;
          background: var(--aaib-surface-alt);
        }

        .resource-modern-tabs button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 36px;
          padding: 0 12px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: var(--aaib-text-muted);
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .resource-modern-tabs button.active {
          background: #fff;
          color: var(--aaib-primary);
          box-shadow: 0 2px 7px rgba(27,40,30,.07);
        }

        .resource-modern-tabs button > span {
          min-width: 18px;
          height: 18px;
          display: inline-grid;
          place-items: center;
          padding: 0 4px;
          border-radius: 999px;
          background: var(--aaib-accent-soft);
          color: var(--aaib-primary);
          font-size: 7px;
        }

        .resource-modern-card {
          margin-bottom: 13px;
          padding: 20px;
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          background: #fff;
          box-shadow: var(--aaib-shadow-card);
        }

        .resource-modern-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 17px;
        }

        .resource-modern-eyebrow {
          display: block;
          color: var(--aaib-accent);
          font-size: 7px;
          font-weight: 850;
          letter-spacing: .13em;
        }

        .resource-modern-card-header h2 {
          margin: 4px 0;
          color: var(--aaib-primary);
          font-size: 17px;
          line-height: 1.1;
        }

        .resource-modern-card-header p {
          max-width: 650px;
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 9px;
          line-height: 1.55;
        }

        .resource-selected-project {
          min-width: 225px;
          padding: 10px 12px;
          border: 1px solid rgba(197,160,89,.28);
          border-radius: 9px;
          background: var(--aaib-accent-soft);
        }

        .resource-selected-project span,
        .resource-selected-project small {
          display: block;
          color: #876b28;
          font-size: 7px;
        }

        .resource-selected-project strong {
          display: block;
          margin: 3px 0;
          color: var(--aaib-primary);
          font-size: 10px;
        }

        .resource-project-controls {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 180px;
          gap: 10px;
          margin-bottom: 14px;
        }

        .resource-control label {
          display: block;
          margin-bottom: 5px;
          color: var(--aaib-text-muted);
          font-size: 7px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .resource-control > div {
          position: relative;
        }

        .resource-control.search > div {
          display: flex;
          align-items: center;
        }

        .resource-control.search svg {
          position: absolute;
          left: 10px;
          color: var(--aaib-text-muted);
          pointer-events: none;
        }

        .resource-control input,
        .resource-select-wrap select {
          width: 100%;
          min-height: 39px;
          border: 1px solid var(--aaib-border);
          border-radius: 8px;
          outline: none;
          background: #fff;
          color: var(--aaib-text);
          font-size: 9px;
        }

        .resource-control.search input {
          padding: 0 11px 0 31px;
        }

        .resource-select-wrap select {
          padding: 0 28px 0 11px;
          appearance: none;
        }

        .resource-select-wrap svg {
          position: absolute;
          top: 50%;
          right: 10px;
          pointer-events: none;
          color: var(--aaib-text-muted);
          transform: translateY(-50%);
        }

        .resource-control input:focus,
        .resource-select-wrap select:focus,
        .resource-department-modern-input input:focus {
          border-color: rgba(197,160,89,.72);
          box-shadow: 0 0 0 3px rgba(197,160,89,.1);
        }

        .resource-project-modern-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .resource-project-modern-card {
          min-width: 0;
          padding: 14px;
          border: 1px solid var(--aaib-border);
          border-radius: 10px;
          background: #fff;
          text-align: left;
          cursor: pointer;
          transition: .18s ease;
        }

        .resource-project-modern-card:hover {
          border-color: rgba(197,160,89,.5);
          transform: translateY(-1px);
          box-shadow: 0 7px 17px rgba(27,40,30,.06);
        }

        .resource-project-modern-card.selected {
          border-color: var(--aaib-accent);
          background: linear-gradient(180deg, rgba(197,160,89,.08), #fff 65%);
          box-shadow: 0 0 0 2px rgba(197,160,89,.1);
        }

        .resource-project-card-topline,
        .resource-project-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .resource-project-card-topline > span {
          color: var(--aaib-accent);
          font-size: 7px;
          font-weight: 850;
          letter-spacing: .08em;
        }

        .resource-project-card-topline em {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 6px;
          border-radius: 999px;
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
          font-size: 6px;
          font-style: normal;
          font-weight: 850;
        }

        .resource-project-modern-card h3 {
          min-height: 34px;
          margin: 11px 0;
          color: var(--aaib-primary);
          font-size: 11px;
          line-height: 1.45;
        }

        .resource-project-status-pill,
        .resource-review-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 7px;
          border-radius: 999px;
          background: var(--aaib-surface-alt);
          color: var(--aaib-text-muted);
          font-size: 6px;
          font-weight: 800;
        }

        .resource-project-status-pill.in-progress {
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
        }

        .resource-project-status-pill.completed {
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
        }

        .resource-project-status-pill.pending,
        .resource-project-status-pill.submitted {
          background: var(--aaib-accent-soft);
          color: #8b6b21;
        }

        .resource-project-open {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--aaib-primary);
          font-size: 7px;
          font-weight: 850;
        }

        .resource-total-box {
          min-width: 105px;
          padding: 9px 11px;
          border: 1px solid rgba(197,160,89,.25);
          border-radius: 9px;
          background: var(--aaib-accent-soft);
          text-align: right;
        }

        .resource-total-box.compact {
          min-width: 88px;
        }

        .resource-total-box span,
        .resource-total-box small {
          display: block;
          color: #816c40;
          font-size: 7px;
        }

        .resource-total-box strong {
          display: block;
          margin: 2px 0;
          color: var(--aaib-primary);
          font-size: 21px;
          line-height: 1;
        }

        .resource-validation-modern {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 11px;
          padding: 9px 11px;
          border-radius: 8px;
          background: var(--aaib-danger-soft);
          color: var(--aaib-danger);
          font-size: 8px;
        }

        .resource-department-modern-list {
          border: 1px solid var(--aaib-border);
          border-radius: 9px;
          overflow: hidden;
        }

        .resource-department-modern-head,
        .resource-department-modern-row {
          display: grid;
          grid-template-columns: 1.45fr 1fr 150px;
          column-gap: 18px;
          align-items: center;
        }

        .resource-department-modern-head {
          min-height: 34px;
          padding: 0 14px;
          border-bottom: 1px solid var(--aaib-border);
          background: var(--aaib-surface-alt);
        }

        .resource-department-modern-head span {
          color: var(--aaib-text-muted);
          font-size: 6px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .resource-department-modern-row {
          min-height: 63px;
          padding: 9px 14px;
          border-bottom: 1px solid var(--aaib-border);
        }

        .resource-department-modern-row:last-child {
          border-bottom: 0;
        }

        .resource-department-modern-row.invalid {
          background: rgba(201,58,58,.025);
        }

        .resource-department-name {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .resource-department-modern-icon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 8px;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
          font-size: 9px;
          font-weight: 850;
        }

        .resource-department-name strong {
          display: block;
          color: var(--aaib-primary);
          font-size: 9px;
        }

        .resource-department-name span,
        .resource-department-vh span {
          display: block;
          margin-top: 2px;
          color: var(--aaib-text-muted);
          font-size: 7px;
          line-height: 1.3;
        }

        .resource-department-vh {
          min-width: 0;
          padding-left: 2px;
        }

        .resource-department-vh strong {
          display: block;
          overflow: hidden;
          color: var(--aaib-text);
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .resource-department-modern-input label {
          display: block;
          margin-bottom: 4px;
          color: var(--aaib-text-muted);
          font-size: 7px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .resource-department-modern-input input {
          width: 100%;
          height: 34px;
          padding: 0 9px;
          border: 1px solid var(--aaib-border);
          border-radius: 8px;
          outline: none;
          color: var(--aaib-primary);
          text-align: center;
          font-size: 10px;
          font-weight: 850;
        }

        .resource-review-modern-card {
          border-top: 3px solid var(--aaib-primary);
        }

        .resource-review-status-pill {
          background: var(--aaib-accent-soft);
          color: #8b6b21;
          padding: 6px 8px;
        }

        .resource-review-modern-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1px;
          margin-bottom: 12px;
          overflow: hidden;
          border: 1px solid var(--aaib-border);
          border-radius: 9px;
          background: var(--aaib-border);
        }

        .resource-review-modern-grid > div {
          min-height: 62px;
          padding: 11px;
          background: #fff;
        }

        .resource-review-modern-grid span {
          display: block;
          margin-bottom: 4px;
          color: var(--aaib-text-muted);
          font-size: 7px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .resource-review-modern-grid strong {
          display: block;
          overflow: hidden;
          color: var(--aaib-primary);
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .resource-next-stage {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 11px;
          border-radius: 8px;
          background: var(--aaib-surface-alt);
        }

        .resource-next-stage-icon {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 8px;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
        }

        .resource-next-stage strong {
          display: block;
          color: var(--aaib-primary);
          font-size: 8px;
        }

        .resource-next-stage span {
          display: block;
          margin-top: 2px;
          color: var(--aaib-text-muted);
          font-size: 7px;
          line-height: 1.45;
        }

        .resource-modern-actions {
          display: flex;
          justify-content: flex-end;
          gap: 7px;
          margin-top: 13px;
        }

        .resource-modern-empty-inline {
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 16px;
          border: 1px dashed rgba(27,40,30,.13);
          border-radius: 9px;
          background: #fcfdfc;
        }

        .resource-modern-empty-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 9px;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
        }

        .resource-modern-empty-icon.large {
          width: 50px;
          height: 50px;
          border-radius: 13px;
        }

        .resource-modern-empty-inline strong,
        .resource-modern-empty-inline span {
          display: block;
        }

        .resource-modern-empty-inline strong {
          color: var(--aaib-primary);
          font-size: 9px;
        }

        .resource-modern-empty-inline span {
          margin-top: 2px;
          color: var(--aaib-text-muted);
          font-size: 8px;
        }

        .resource-modern-state,
        .resource-modern-empty-state {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          background: #fff;
          box-shadow: var(--aaib-shadow-card);
          text-align: center;
        }

        .resource-modern-state h3,
        .resource-modern-empty-state h3 {
          margin: 13px 0 4px;
          color: var(--aaib-primary);
          font-size: 15px;
        }

        .resource-modern-state p,
        .resource-modern-empty-state p {
          margin: 0 0 14px;
          color: var(--aaib-text-muted);
          font-size: 9px;
        }

        .resource-modern-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid rgba(27,40,30,.1);
          border-top-color: var(--aaib-accent);
          border-radius: 50%;
          animation: resourceModernSpin .8s linear infinite;
        }

        @keyframes resourceModernSpin {
          to { transform: rotate(360deg); }
        }

        .resource-saved-modern-list {
          display: grid;
          gap: 9px;
        }

        .resource-saved-modern-row {
          display: grid;
          grid-template-columns: minmax(240px, 1.35fr) 100px minmax(240px, 1fr) 70px;
          align-items: center;
          gap: 13px;
          padding: 13px;
          border: 1px solid var(--aaib-border);
          border-radius: 10px;
          background: #fff;
          transition: .18s ease;
        }

        .resource-saved-modern-row:hover {
          border-color: rgba(197,160,89,.42);
          box-shadow: 0 6px 14px rgba(27,40,30,.05);
        }

        .resource-saved-main {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .resource-saved-project-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 9px;
          background: var(--aaib-primary-soft);
          color: var(--aaib-primary);
        }

        .resource-saved-meta {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .resource-saved-meta > span {
          color: var(--aaib-accent);
          font-size: 6px;
          font-weight: 850;
          letter-spacing: .07em;
        }

        .resource-saved-meta em {
          padding: 3px 6px;
          border-radius: 999px;
          background: var(--aaib-accent-soft);
          color: #8b6b21;
          font-size: 6px;
          font-style: normal;
          font-weight: 850;
        }

        .resource-saved-main h3 {
          margin: 4px 0 2px;
          color: var(--aaib-primary);
          font-size: 10px;
        }

        .resource-saved-main p {
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 7px;
        }

        .resource-saved-stats {
          display: flex;
          gap: 13px;
        }

        .resource-saved-stats span {
          display: block;
          color: var(--aaib-text-muted);
          font-size: 6px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .resource-saved-stats strong {
          display: block;
          margin-top: 2px;
          color: var(--aaib-primary);
          font-size: 14px;
        }

        .resource-saved-departments {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .resource-saved-departments span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-height: 24px;
          padding: 0 6px;
          border-radius: 7px;
          background: var(--aaib-surface-alt);
          color: var(--aaib-text-muted);
          font-size: 6px;
          font-weight: 700;
        }

        .resource-saved-departments strong {
          color: var(--aaib-primary);
        }

        .resource-saved-actions {
          display: flex;
          justify-content: flex-end;
          gap: 5px;
        }

        .resource-icon-action {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          padding: 0;
          border: 1px solid var(--aaib-border);
          border-radius: 7px;
          background: #fff;
          color: var(--aaib-primary);
          cursor: pointer;
        }

        .resource-icon-action:hover {
          background: var(--aaib-primary-soft);
        }

        .resource-icon-action.danger {
          color: var(--aaib-danger);
        }

        .resource-icon-action.danger:hover {
          background: var(--aaib-danger-soft);
        }

        @media (max-width: 1120px) {
          .resource-project-modern-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .resource-saved-modern-row {
            grid-template-columns: minmax(220px, 1fr) 90px minmax(200px, 1fr);
          }

          .resource-saved-actions {
            grid-column: 1 / -1;
            justify-content: flex-end;
            padding-top: 8px;
            border-top: 1px solid var(--aaib-border);
          }
        }

        @media (max-width: 900px) {
          .resource-overview-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .resource-overview-divider {
            display: none;
          }

          .resource-modern-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .resource-heading-actions {
            width: 100%;
          }

          .resource-heading-actions button {
            flex: 1;
          }

          .resource-project-controls {
            grid-template-columns: 1fr;
          }

          .resource-project-modern-grid {
            grid-template-columns: 1fr;
          }

          .resource-department-modern-head {
            display: none;
          }

          .resource-department-modern-row {
            grid-template-columns: 1fr 150px;
            gap: 10px 16px;
          }

          .resource-department-name {
            grid-column: 1 / -1;
          }

          .resource-review-modern-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .resource-overview-strip {
            grid-template-columns: 1fr;
          }

          .resource-modern-card {
            padding: 15px;
          }

          .resource-modern-card-header {
            flex-direction: column;
          }

          .resource-selected-project {
            width: 100%;
          }

          .resource-department-modern-row {
            grid-template-columns: 1fr;
          }

          .resource-department-modern-input {
            width: 100%;
          }

          .resource-review-modern-grid {
            grid-template-columns: 1fr;
          }

          .resource-modern-actions {
            flex-direction: column-reverse;
          }

          .resource-modern-actions button {
            width: 100%;
          }

          .resource-saved-modern-row {
            grid-template-columns: 1fr;
          }

          .resource-saved-actions {
            grid-column: auto;
          }

          .resource-saved-stats {
            padding: 9px 0;
            border-top: 1px solid var(--aaib-border);
            border-bottom: 1px solid var(--aaib-border);
          }
        }

        @media (max-width: 520px) {
          .resource-modern-heading h1 {
            font-size: 27px;
          }

          .resource-heading-actions {
            flex-direction: column;
          }

          .resource-review-modern-grid {
            grid-template-columns: 1fr;
          }

          .resource-saved-actions {
            justify-content: stretch;
          }

          .resource-icon-action {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}