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

export default function ResourceRequests() {
  const navigate = useNavigate();

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
    return (
      projectById.get(String(projectId))?.name || `Project ${projectId}`
    );
  }

  return (
    <div className="po-shell resource-planner-page">
      <aside className="po-sidebar">
        <div className="po-sidebar-brand">
          <img src={aaibLogo} alt="AAIB" className="po-sidebar-logo" />
          <div>
            <div className="po-sidebar-title">AAIB</div>
            <div className="po-sidebar-subtitle">Product Owner Portal</div>
          </div>
        </div>

        <nav className="po-sidebar-nav" aria-label="Product Owner navigation">
          {PO_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `po-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="po-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <NavLink
            to="/po/resource-requests"
            className={({ isActive }) =>
              `po-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="po-nav-icon" aria-hidden="true">
              ◒
            </span>
            <span>Resource Requests</span>
          </NavLink>
        </nav>

        <button
          type="button"
          className="po-sidebar-logout"
          onClick={logout}
        >
          <span className="po-nav-icon" aria-hidden="true">
            ↪
          </span>
          <span>Logout</span>
        </button>
      </aside>

      <main className="po-main">
        <header className="po-header">
          <div className="po-header-left">
            <img
              src={aaibLogo}
              alt="AAIB"
              className="po-header-aaib-logo"
            />
            <div className="po-header-title">Product Owner Portal</div>
          </div>

          <div className="po-header-right">
            <div className="po-header-role">Resource Planner</div>
            <div className="po-header-avatar">PO</div>
          </div>
        </header>

        <div className="po-content">
          <div className="resource-page-heading">
            <div>
              <div className="po-breadcrumb">
                Product Owner <span>/</span> Resource Planner
              </div>
              <h1>Resource Planner</h1>
              <p>
                Define the number of employees required for each department
                before the Vertical Head allocation stage.
              </p>
            </div>

            <button
              type="button"
              className="resource-secondary-button"
              onClick={() => navigate('/po/my-projects')}
            >
              View My Projects
            </button>
          </div>

          <div className="resource-info-banner">
            <div className="resource-info-icon">i</div>
            <div>
              <strong>Frontend-only request storage</strong>
              <p>
                Resource-request tables and APIs are not implemented in the
                current database. Requests on this page are therefore saved
                locally in this browser until the backend is available.
              </p>
            </div>
          </div>

          {error && (
            <div className="resource-alert resource-alert-error" role="alert">
              <span>!</span>
              <div>{error}</div>
              <button
                type="button"
                onClick={() => setError('')}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {successMessage && (
            <div
              className="resource-alert resource-alert-success"
              role="status"
            >
              <span>✓</span>
              <div>{successMessage}</div>
              <button
                type="button"
                onClick={() => setSuccessMessage('')}
                aria-label="Dismiss success message"
              >
                ×
              </button>
            </div>
          )}

          <div className="resource-tabs">
            <button
              type="button"
              className={activeTab === 'create' ? 'active' : ''}
              onClick={() => {
                setActiveTab('create');
                clearMessages();
              }}
            >
              Create / Edit Request
            </button>

            <button
              type="button"
              className={activeTab === 'saved' ? 'active' : ''}
              onClick={() => {
                setActiveTab('saved');
                clearMessages();
              }}
            >
              Saved Requests
              <span className="resource-tab-count">{savedRequests.length}</span>
            </button>
          </div>

          {isLoading ? (
            <div className="resource-state-card">
              <div className="resource-spinner" />
              <h3>Loading Resource Planner</h3>
              <p>Retrieving projects and available department data…</p>
            </div>
          ) : activeTab === 'create' ? (
            <form onSubmit={handleSaveRequest}>
              <section className="resource-card">
                <div className="resource-card-header">
                  <div>
                    <span className="resource-eyebrow">STEP 01</span>
                    <h2>Select Project</h2>
                    <p>
                      Choose the project for which employee capacity is being
                      requested.
                    </p>
                  </div>

                  {selectedProject && (
                    <span className="resource-project-status">
                      {selectedProject.status}
                    </span>
                  )}
                </div>

                <div className="resource-project-selector">
                  <label htmlFor="resource-project-search">
                    Search projects
                  </label>
                  <div className="resource-search-wrap">
                    <span aria-hidden="true">⌕</span>
                    <input
                      id="resource-project-search"
                      type="text"
                      placeholder="Search by project name or ID"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>

                  <label htmlFor="resource-project-filter">
                    Status
                  </label>
                  <select
                    id="resource-project-filter"
                    value={projectFilter}
                    onChange={(event) => setProjectFilter(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {Array.from(
                      new Set(projects.map((project) => project.status)),
                    )
                      .sort()
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="resource-empty-inline">
                    <span>◌</span>
                    <div>
                      <strong>No matching projects</strong>
                      <p>
                        No project matched the current search and filter.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="resource-project-grid">
                    {filteredProjects.map((project) => {
                      const isSelected =
                        String(selectedProjectId) === String(project.id);
                      const hasSavedRequest = savedProjectIds.has(
                        String(project.id),
                      );

                      return (
                        <button
                          type="button"
                          key={project.id}
                          className={`resource-project-card ${
                            isSelected ? 'selected' : ''
                          }`}
                          onClick={() => {
                            handleProjectSelection({
                              target: { value: String(project.id) },
                            });
                          }}
                        >
                          <div className="resource-project-top">
                            <span className="resource-project-id">
                              PRJ-{String(project.id).padStart(4, '0')}
                            </span>
                            {hasSavedRequest && (
                              <span className="resource-saved-badge">
                                Saved
                              </span>
                            )}
                          </div>

                          <h3>{project.name}</h3>

                          <div className="resource-project-meta">
                            <span>{project.status}</span>
                            <span>{project.flag}</span>
                          </div>

                          <div className="resource-project-dates">
                            <span>
                              Start <strong>{formatDate(project.startDate)}</strong>
                            </span>
                            <span>
                              End <strong>{formatDate(project.endDate)}</strong>
                            </span>
                          </div>

                          <div className="resource-project-select-indicator">
                            {isSelected ? 'Selected ✓' : 'Select project →'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {selectedProject && (
                <>
                  <section className="resource-card">
                    <div className="resource-card-header">
                      <div>
                        <span className="resource-eyebrow">STEP 02</span>
                        <h2>Department Requirements</h2>
                        <p>
                          Enter the number of employees required from each
                          department. Leave departments blank when no resource
                          is required.
                        </p>
                      </div>

                      <div className="resource-total-chip">
                        <span>Total Required</span>
                        <strong>{currentTotal}</strong>
                        <small>employees</small>
                      </div>
                    </div>

                    {validationError && (
                      <div className="resource-validation" role="alert">
                        <span>!</span>
                        {validationError}
                      </div>
                    )}

                    {departments.length === 0 ? (
                      <div className="resource-empty-inline">
                        <span>◌</span>
                        <div>
                          <strong>No departments available</strong>
                          <p>
                            Department information will appear once employees
                            are returned from the employee API.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="resource-department-list">
                        {departments.map((department) => {
                          const value = departmentCounts[department.name] ?? '';
                          const numericValue = Number(value);
                          const hasInvalidValue =
                            String(value).trim() !== '' &&
                            (!Number.isInteger(numericValue) ||
                              numericValue <= 0);

                          return (
                            <div
                              key={department.name}
                              className={`resource-department-row ${
                                hasInvalidValue ? 'invalid' : ''
                              }`}
                            >
                              <div className="resource-department-main">
                                <div className="resource-department-icon">
                                  {department.name.slice(0, 1).toUpperCase()}
                                </div>
                                <div>
                                  <h3>{department.name}</h3>
                                  <p>
                                    {department.head ? (
                                      <>
                                        Vertical Head:{' '}
                                        <strong>
                                          {fullEmployeeName(department.head)}
                                        </strong>
                                      </>
                                    ) : (
                                      'Vertical Head not available in current employee data'
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="resource-department-input-group">
                                <label htmlFor={`count-${department.name}`}>
                                  Required employees
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
                                      event.target.value,
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

                  <section className="resource-card resource-review-card">
                    <div className="resource-card-header">
                      <div>
                        <span className="resource-eyebrow">STEP 03</span>
                        <h2>Review Request</h2>
                        <p>
                          Confirm the project and requested capacity before
                          saving.
                        </p>
                      </div>
                    </div>

                    <div className="resource-review-grid">
                      <div>
                        <span>Project</span>
                        <strong>{selectedProject.name}</strong>
                      </div>
                      <div>
                        <span>Project Status</span>
                        <strong>{selectedProject.status}</strong>
                      </div>
                      <div>
                        <span>Total Departments</span>
                        <strong>
                          {
                            Object.entries(departmentCounts).filter(
                              ([, value]) => Number(value) > 0,
                            ).length
                          }
                        </strong>
                      </div>
                      <div>
                        <span>Total Employees</span>
                        <strong>{currentTotal}</strong>
                      </div>
                    </div>

                    <div className="resource-review-note">
                      <span>◒</span>
                      <div>
                        <strong>Next workflow stage</strong>
                        <p>
                          After the backend resource-request workflow is
                          implemented, each requested department can be routed
                          to its respective Vertical Head for employee
                          allocation.
                        </p>
                      </div>
                    </div>

                    <div className="resource-form-actions">
                      <button
                        type="button"
                        className="resource-cancel-button"
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
                        className="resource-primary-button"
                        disabled={isSaving}
                      >
                        {isSaving
                          ? 'Saving…'
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
            <section className="resource-card">
              <div className="resource-card-header">
                <div>
                  <span className="resource-eyebrow">RESOURCE REQUESTS</span>
                  <h2>Saved Requests</h2>
                  <p>
                    Requests currently stored in this browser while the
                    backend resource-request functionality is being developed.
                  </p>
                </div>
                <div className="resource-total-chip compact">
                  <span>Requests</span>
                  <strong>{savedRequests.length}</strong>
                </div>
              </div>

              {savedRequests.length === 0 ? (
                <div className="resource-empty-state">
                  <div className="resource-empty-icon">◒</div>
                  <h3>No resource requests yet</h3>
                  <p>
                    Create a project resource request to see it appear here.
                  </p>
                  <button
                    type="button"
                    className="resource-primary-button"
                    onClick={() => setActiveTab('create')}
                  >
                    Create First Request
                  </button>
                </div>
              ) : (
                <div className="resource-request-list">
                  {savedRequests.map((request) => (
                    <article
                      key={request.id}
                      className="resource-request-card"
                    >
                      <div className="resource-request-main">
                        <div className="resource-request-heading">
                          <span className="resource-project-id">
                            PRJ-
                            {String(request.projectId).padStart(4, '0')}
                          </span>
                          <span className="resource-pending-badge">
                            {request.status || REQUEST_STATUS.PENDING}
                          </span>
                        </div>

                        <h3>{getProjectName(request.projectId)}</h3>

                        <p>
                          Updated {formatDateTime(request.updatedAt)}
                        </p>
                      </div>

                      <div className="resource-request-summary">
                        <div>
                          <span>Departments</span>
                          <strong>
                            {
                              Object.entries(request.departments || {}).filter(
                                ([, count]) => Number(count) > 0,
                              ).length
                            }
                          </strong>
                        </div>
                        <div>
                          <span>Employees</span>
                          <strong>{requestTotal(request)}</strong>
                        </div>
                      </div>

                      <div className="resource-request-departments">
                        {Object.entries(request.departments || {})
                          .filter(([, count]) => Number(count) > 0)
                          .map(([department, count]) => (
                            <div key={department}>
                              <span>{department}</span>
                              <strong>{count}</strong>
                            </div>
                          ))}
                      </div>

                      <div className="resource-request-actions">
                        <button
                          type="button"
                          className="resource-secondary-button"
                          onClick={() => openSavedRequest(request)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="resource-delete-button"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <style>{`
        .resource-planner-page {
          --resource-border: rgba(23, 33, 43, 0.09);
          --resource-soft: #f4f6f5;
          --resource-muted: #687483;
        }

        .resource-planner-page .po-sidebar {
          display: flex;
          flex-direction: column;
        }

        .resource-planner-page .po-sidebar-nav {
          flex: 1;
        }

        .resource-planner-page .po-sidebar-logout {
          margin-top: auto;
        }

        .resource-page-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .resource-page-heading h1 {
          margin: 4px 0 8px;
          color: var(--aaib-text);
          font-size: 31px;
          line-height: 1.1;
          font-weight: 750;
          letter-spacing: -0.03em;
        }

        .resource-page-heading p {
          margin: 0;
          max-width: 720px;
          color: var(--resource-muted);
          line-height: 1.65;
          font-size: 14px;
        }

        .po-breadcrumb {
          color: var(--resource-muted);
          font-size: 12px;
          font-weight: 650;
          letter-spacing: 0.02em;
        }

        .po-breadcrumb span {
          padding: 0 6px;
          color: var(--aaib-accent);
        }

        .resource-info-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 15px 17px;
          margin-bottom: 18px;
          border: 1px solid rgba(197, 160, 89, 0.28);
          border-radius: 14px;
          background: rgba(197, 160, 89, 0.09);
        }

        .resource-info-icon {
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          flex: 0 0 26px;
          border-radius: 50%;
          background: var(--aaib-accent);
          color: white;
          font-size: 13px;
          font-weight: 800;
        }

        .resource-info-banner strong {
          display: block;
          color: var(--aaib-primary);
          font-size: 13px;
          margin-bottom: 3px;
        }

        .resource-info-banner p {
          margin: 0;
          color: #5d6470;
          font-size: 12px;
          line-height: 1.55;
        }

        .resource-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-size: 13px;
          font-weight: 650;
        }

        .resource-alert > span:first-child {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          flex: 0 0 22px;
          font-size: 11px;
          font-weight: 800;
        }

        .resource-alert button {
          margin-left: auto;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          color: inherit;
          opacity: 0.65;
        }

        .resource-alert-error {
          color: #8f2525;
          background: rgba(205, 57, 57, 0.08);
          border: 1px solid rgba(205, 57, 57, 0.16);
        }

        .resource-alert-error > span:first-child {
          background: rgba(205, 57, 57, 0.16);
        }

        .resource-alert-success {
          color: #236140;
          background: rgba(38, 133, 85, 0.08);
          border: 1px solid rgba(38, 133, 85, 0.15);
        }

        .resource-alert-success > span:first-child {
          background: rgba(38, 133, 85, 0.16);
        }

        .resource-tabs {
          display: flex;
          gap: 5px;
          padding: 4px;
          width: fit-content;
          margin-bottom: 20px;
          border: 1px solid var(--resource-border);
          border-radius: 12px;
          background: var(--resource-soft);
        }

        .resource-tabs button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          border: 0;
          border-radius: 9px;
          padding: 0 15px;
          color: var(--resource-muted);
          background: transparent;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .resource-tabs button.active {
          color: var(--aaib-primary);
          background: #fff;
          box-shadow: 0 2px 8px rgba(20, 33, 24, 0.07);
        }

        .resource-tab-count {
          min-width: 21px;
          height: 21px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: var(--aaib-primary);
          background: var(--aaib-accent-soft);
          font-size: 11px;
          font-weight: 800;
        }

        .resource-card {
          border: 1px solid var(--resource-border);
          border-radius: 18px;
          background: var(--aaib-surface);
          box-shadow: var(--aaib-shadow-soft);
          padding: 24px;
          margin-bottom: 18px;
        }

        .resource-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .resource-eyebrow {
          color: var(--aaib-accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .resource-card-header h2 {
          margin: 5px 0 7px;
          color: var(--aaib-text);
          font-size: 20px;
          letter-spacing: -0.02em;
        }

        .resource-card-header p {
          margin: 0;
          max-width: 760px;
          color: var(--resource-muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .resource-project-selector {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 190px;
          gap: 8px 14px;
          align-items: center;
          margin-bottom: 18px;
        }

        .resource-project-selector label {
          grid-row: 1;
          color: #6b7280;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .resource-project-selector label + .resource-search-wrap,
        .resource-project-selector select {
          grid-row: 2;
        }

        .resource-search-wrap {
          position: relative;
        }

        .resource-search-wrap > span {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #88919c;
          font-size: 17px;
          pointer-events: none;
        }

        .resource-search-wrap input,
        .resource-project-selector select,
        .resource-department-input-group input {
          width: 100%;
          border: 1px solid rgba(23, 33, 43, 0.12);
          border-radius: 11px;
          background: #fff;
          color: var(--aaib-text);
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          box-sizing: border-box;
        }

        .resource-search-wrap input,
        .resource-project-selector select {
          min-height: 44px;
          padding: 0 13px;
          font: inherit;
          font-size: 13px;
        }

        .resource-search-wrap input {
          padding-left: 36px;
        }

        .resource-search-wrap input:focus,
        .resource-project-selector select:focus,
        .resource-department-input-group input:focus {
          border-color: rgba(197, 160, 89, 0.85);
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.12);
        }

        .resource-project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .resource-project-card {
          text-align: left;
          padding: 16px;
          min-width: 0;
          border: 1px solid rgba(23, 33, 43, 0.1);
          border-radius: 14px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.18s ease, transform 0.18s ease,
            box-shadow 0.18s ease;
          font: inherit;
        }

        .resource-project-card:hover {
          transform: translateY(-1px);
          border-color: rgba(197, 160, 89, 0.55);
          box-shadow: 0 8px 22px rgba(20, 33, 24, 0.06);
        }

        .resource-project-card.selected {
          border-color: var(--aaib-accent);
          background: linear-gradient(
            180deg,
            rgba(197, 160, 89, 0.08),
            #fff 55%
          );
          box-shadow: 0 0 0 2px rgba(197, 160, 89, 0.12);
        }

        .resource-project-top,
        .resource-project-meta,
        .resource-project-dates {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .resource-project-id {
          color: var(--aaib-accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .resource-saved-badge,
        .resource-pending-badge,
        .resource-project-status {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
        }

        .resource-saved-badge {
          color: #3c614c;
          background: rgba(38, 133, 85, 0.08);
        }

        .resource-pending-badge,
        .resource-project-status {
          color: #7b622c;
          background: rgba(197, 160, 89, 0.14);
        }

        .resource-project-card h3 {
          margin: 11px 0 11px;
          color: var(--aaib-text);
          font-size: 15px;
          line-height: 1.35;
        }

        .resource-project-meta {
          justify-content: flex-start;
          flex-wrap: wrap;
          color: var(--resource-muted);
          font-size: 11px;
        }

        .resource-project-meta span {
          padding-right: 8px;
          border-right: 1px solid rgba(23, 33, 43, 0.12);
        }

        .resource-project-meta span:last-child {
          border-right: 0;
        }

        .resource-project-dates {
          margin-top: 17px;
          padding-top: 13px;
          border-top: 1px solid rgba(23, 33, 43, 0.07);
          justify-content: flex-start;
          font-size: 10px;
          color: #858d98;
        }

        .resource-project-dates span {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .resource-project-dates strong {
          color: #4b5563;
          font-size: 11px;
        }

        .resource-project-select-indicator {
          margin-top: 14px;
          color: var(--aaib-primary);
          font-size: 11px;
          font-weight: 800;
        }

        .resource-total-chip {
          min-width: 124px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 11px 13px;
          border: 1px solid rgba(197, 160, 89, 0.25);
          border-radius: 13px;
          background: rgba(197, 160, 89, 0.08);
        }

        .resource-total-chip span {
          color: #816c40;
          font-size: 10px;
          font-weight: 750;
        }

        .resource-total-chip strong {
          color: var(--aaib-primary);
          font-size: 24px;
          line-height: 1.05;
          margin-top: 2px;
        }

        .resource-total-chip small {
          color: #7a7f86;
          font-size: 9px;
        }

        .resource-total-chip.compact {
          min-width: 82px;
          align-items: center;
        }

        .resource-department-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid rgba(23, 33, 43, 0.07);
        }

        .resource-department-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 4px;
          border-bottom: 1px solid rgba(23, 33, 43, 0.07);
        }

        .resource-department-row:last-child {
          border-bottom: 0;
        }

        .resource-department-row.invalid {
          background: rgba(205, 57, 57, 0.025);
        }

        .resource-department-main {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .resource-department-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex: 0 0 38px;
          border-radius: 11px;
          color: var(--aaib-primary);
          background: var(--aaib-primary-soft);
          font-size: 13px;
          font-weight: 850;
        }

        .resource-department-main h3 {
          margin: 0 0 3px;
          color: var(--aaib-text);
          font-size: 14px;
        }

        .resource-department-main p {
          margin: 0;
          color: var(--resource-muted);
          font-size: 11px;
          line-height: 1.5;
        }

        .resource-department-main strong {
          color: #4d5966;
        }

        .resource-department-input-group {
          width: 180px;
          flex: 0 0 180px;
        }

        .resource-department-input-group label {
          display: block;
          margin-bottom: 6px;
          color: #68727e;
          font-size: 10px;
          font-weight: 750;
        }

        .resource-department-input-group input {
          height: 44px;
          padding: 0 12px;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
        }

        .resource-review-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          margin-bottom: 16px;
          overflow: hidden;
          border: 1px solid rgba(23, 33, 43, 0.08);
          border-radius: 13px;
          background: rgba(23, 33, 43, 0.08);
        }

        .resource-review-grid > div {
          min-height: 78px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 13px 15px;
          background: #fff;
        }

        .resource-review-grid span {
          color: #838b95;
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .resource-review-grid strong {
          color: var(--aaib-text);
          font-size: 14px;
        }

        .resource-review-note {
          display: flex;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 12px;
          background: var(--aaib-surface-alt);
        }

        .resource-review-note > span {
          color: var(--aaib-accent);
          font-size: 18px;
          line-height: 1;
        }

        .resource-review-note strong {
          display: block;
          color: var(--aaib-text);
          font-size: 12px;
          margin-bottom: 3px;
        }

        .resource-review-note p {
          margin: 0;
          color: var(--resource-muted);
          font-size: 11px;
          line-height: 1.6;
        }

        .resource-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 19px;
        }

        .resource-primary-button,
        .resource-secondary-button,
        .resource-cancel-button,
        .resource-delete-button {
          min-height: 40px;
          padding: 0 15px;
          border-radius: 10px;
          font: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            border-color 0.18s ease;
        }

        .resource-primary-button {
          border: 1px solid var(--aaib-primary);
          background: var(--aaib-primary);
          color: #fff;
        }

        .resource-primary-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(20, 33, 24, 0.14);
        }

        .resource-primary-button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        .resource-secondary-button,
        .resource-cancel-button {
          border: 1px solid rgba(23, 33, 43, 0.12);
          background: #fff;
          color: var(--aaib-primary);
        }

        .resource-secondary-button:hover,
        .resource-cancel-button:hover {
          border-color: rgba(197, 160, 89, 0.6);
        }

        .resource-delete-button {
          border: 1px solid rgba(205, 57, 57, 0.16);
          background: rgba(205, 57, 57, 0.05);
          color: #9b2c2c;
        }

        .resource-delete-button:hover {
          border-color: rgba(205, 57, 57, 0.32);
        }

        .resource-validation {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          margin-bottom: 12px;
          border: 1px solid rgba(205, 57, 57, 0.16);
          border-radius: 10px;
          background: rgba(205, 57, 57, 0.06);
          color: #8e2b2b;
          font-size: 12px;
          font-weight: 650;
        }

        .resource-validation > span {
          width: 19px;
          height: 19px;
          display: grid;
          place-items: center;
          flex: 0 0 19px;
          border-radius: 50%;
          background: rgba(205, 57, 57, 0.12);
          font-size: 10px;
          font-weight: 800;
        }

        .resource-empty-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 108px;
          border: 1px dashed rgba(23, 33, 43, 0.13);
          border-radius: 12px;
          color: var(--resource-muted);
          background: rgba(248, 249, 250, 0.65);
        }

        .resource-empty-inline > span {
          font-size: 26px;
          color: var(--aaib-accent);
        }

        .resource-empty-inline strong {
          display: block;
          color: var(--aaib-text);
          font-size: 13px;
          margin-bottom: 3px;
        }

        .resource-empty-inline p {
          margin: 0;
          color: var(--resource-muted);
          font-size: 11px;
        }

        .resource-state-card,
        .resource-empty-state {
          min-height: 290px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
          border: 1px solid var(--resource-border);
          border-radius: 18px;
          background: #fff;
          box-shadow: var(--aaib-shadow-soft);
        }

        .resource-state-card h3,
        .resource-empty-state h3 {
          margin: 13px 0 5px;
          color: var(--aaib-text);
          font-size: 18px;
        }

        .resource-state-card p,
        .resource-empty-state p {
          margin: 0 0 17px;
          color: var(--resource-muted);
          font-size: 12px;
        }

        .resource-spinner {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid rgba(23, 33, 43, 0.1);
          border-top-color: var(--aaib-accent);
          animation: resource-spin 0.8s linear infinite;
        }

        @keyframes resource-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .resource-empty-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          color: var(--aaib-primary);
          background: var(--aaib-primary-soft);
          font-size: 28px;
        }

        .resource-request-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .resource-request-card {
          display: grid;
          grid-template-columns: minmax(250px, 1.25fr) 130px minmax(250px, 1fr) auto;
          align-items: center;
          gap: 17px;
          padding: 17px;
          border: 1px solid rgba(23, 33, 43, 0.09);
          border-radius: 14px;
          background: #fff;
        }

        .resource-request-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .resource-request-main h3 {
          margin: 7px 0 4px;
          color: var(--aaib-text);
          font-size: 15px;
        }

        .resource-request-main p {
          margin: 0;
          color: #88919c;
          font-size: 10px;
        }

        .resource-request-summary {
          display: grid;
          grid-template-columns: 1fr;
          gap: 9px;
        }

        .resource-request-summary div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .resource-request-summary span {
          color: #8b939d;
          font-size: 9px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .resource-request-summary strong {
          color: var(--aaib-primary);
          font-size: 16px;
        }

        .resource-request-departments {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
        }

        .resource-request-departments div {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 30px;
          padding: 0 9px;
          border-radius: 9px;
          background: var(--aaib-surface-alt);
          color: #58626d;
          font-size: 10px;
          font-weight: 650;
        }

        .resource-request-departments strong {
          color: var(--aaib-primary);
        }

        .resource-request-actions {
          display: flex;
          gap: 7px;
          justify-content: flex-end;
        }

        @media (max-width: 1180px) {
          .resource-project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .resource-request-card {
            grid-template-columns: 1fr 1fr;
          }

          .resource-request-actions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 900px) {
          .resource-page-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .resource-project-grid {
            grid-template-columns: 1fr;
          }

          .resource-review-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .resource-department-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .resource-department-input-group {
            width: 100%;
            flex-basis: auto;
          }
        }

        @media (max-width: 640px) {
          .resource-planner-page .po-content {
            padding: 18px 14px 26px;
          }

          .resource-card {
            padding: 17px;
            border-radius: 14px;
          }

          .resource-project-selector {
            grid-template-columns: 1fr;
          }

          .resource-project-selector label + .resource-search-wrap,
          .resource-project-selector select {
            grid-row: auto;
          }

          .resource-review-grid {
            grid-template-columns: 1fr;
          }

          .resource-review-grid > div {
            min-height: 62px;
          }

          .resource-request-card {
            grid-template-columns: 1fr;
          }

          .resource-request-actions {
            width: 100%;
          }

          .resource-request-actions button {
            flex: 1;
          }

          .resource-form-actions {
            flex-direction: column-reverse;
          }

          .resource-form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
