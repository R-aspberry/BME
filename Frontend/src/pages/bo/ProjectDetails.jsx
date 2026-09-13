import React, { useEffect, useMemo, useState } from 'react';
import {
  NavLink,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  getProject,
  updateProject,
} from '../../services/projectService';

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

    projects: (
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
    ),

    create: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
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

    menu: (
      <path d="M4 6h16M4 12h16M4 18h16" />
    ),

    close: (
      <path d="M6 6l12 12M18 6L6 18" />
    ),

    chevron: (
      <path d="M9 18l6-6-6-6" />
    ),

    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="M11 18l-6-6 6-6" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),

    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h12l2 2v16H5z" />
        <path d="M8 3v6h8V3" />
        <path d="M8 21v-7h8v7" />
      </>
    ),

    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h6" />
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
        <path d="M8 12l2.7 2.7L16 9" />
      </>
    ),

    alert: (
      <>
        <path d="M10.3 4.5L2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
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
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   HELPERS
========================================================= */

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatDate = (value) => {
  const date = parseDate(value);

  if (!date) {
    return '—';
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value) => {
  const date = parseDate(value);

  if (!date) {
    return '—';
  }

  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusType = (status) => {
  const value = (status || 'Draft').toLowerCase();

  if (
    value.includes('completed') ||
    value.includes('done') ||
    value.includes('approved')
  ) {
    return 'success';
  }

  if (
    value.includes('pending') ||
    value.includes('review')
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
    value.includes('red')
  ) {
    return 'critical';
  }

  if (
    value.includes('attention') ||
    value.includes('warning') ||
    value.includes('yellow')
  ) {
    return 'attention';
  }

  return 'info';
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [form, setForm] = useState({});

  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] =
    useState('');

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const userName =
    localStorage.getItem('userName') || 'User';

  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /* =======================================================
     LOAD PROJECT
  ======================================================== */

  const loadProject = () => {
    if (!id) return;

    setIsLoading(true);
    setError('');

    getProject(id)
      .then((data) => {
        setProject(data);
        setForm(data || {});
      })
      .catch((err) => {
        setProject(null);

        setError(
          err?.message ||
            'Unable to load this project.'
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
     FORM
  ======================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setSuccessMessage('');
  };

  /* =======================================================
     SAVE
  ======================================================== */

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    if (!form.project_Name?.trim()) {
      setError('Project Name is required.');
      return;
    }

    try {
      setIsSaving(true);

      await updateProject(id, form);

      setProject(form);
      setEditing(false);

      setSuccessMessage(
        'Project updated successfully.'
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 2500);
    } catch (err) {
      setError(
        err?.message ||
          String(err) ||
          'Unable to update the project.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     CANCEL EDIT
  ======================================================== */

  const cancelEditing = () => {
    setForm(project || {});
    setEditing(false);
    setError('');
    setSuccessMessage('');
  };

  /* =======================================================
     DERIVED DATA
  ======================================================== */

  const statusType = useMemo(
    () => getStatusType(project?.status),
    [project?.status]
  );

  const flagType = useMemo(
    () => getFlagType(project?.flag),
    [project?.flag]
  );

  if (isLoading) {
    return (
      <div className="bo-detail-loading-page">
        <div className="bo-detail-loading">
          <div className="bo-detail-loading-spinner">
            <Icon
              name="refresh"
              size={20}
            />
          </div>

          <strong>
            Loading project
          </strong>

          <span>
            Retrieving project details...
          </span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bo-shell">
        <div className="bo-detail-error-page">
          <div className="bo-detail-error-card">
            <div className="bo-detail-error-icon">
              <Icon
                name="alert"
                size={26}
              />
            </div>

            <h2>
              Project not found
            </h2>

            <p>
              {error ||
                'The requested project could not be loaded.'}
            </p>

            <div className="bo-detail-error-actions">
              <button
                className="aaib-btn aaib-btn-secondary"
                onClick={() =>
                  navigate('/bo/projects')
                }
              >
                Back to My Projects
              </button>

              <button
                className="aaib-btn aaib-btn-primary"
                onClick={loadProject}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     PROJECT FIELDS
  ======================================================== */

  const projectName =
    project.project_Name ||
    'Untitled Project';

  const description =
    project.description ||
    'No project description has been provided.';

  const startDate =
    project.start_date ||
    project.startDate ||
    project.Start_Date;

  const endDate =
    project.end_date ||
    project.endDate ||
    project.End_Date ||
    project.expectedDeliveryDate;

  const poName =
    project.poName ||
    project.PO_Name ||
    project.po_Name ||
    'Not assigned';

  const projectFlag = project.flag;

  const brd = project.brd;

  return (
    <div className="bo-shell">
      {/* ===================================================
          SIDEBAR
      ==================================================== */}

      <aside
        className={`bo-sidebar ${
          sidebarCollapsed
            ? 'bo-sidebar-collapsed-inner'
            : ''
        }`}
      >
        <div className="bo-sidebar-top">
          <div className="bo-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
            className="bo-collapse-btn"
            onClick={() =>
              setSidebarCollapsed(
                (prev) => !prev
              )
            }
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
            className="bo-mobile-close"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="bo-sidebar-section-label">
          Business Owner Portal
        </div>

        <nav className="bo-nav">
          <NavLink
            to="/bo/dashboard"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <span className="bo-nav-icon">
              <Icon name="dashboard" />
            </span>

            <span className="bo-nav-text">
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/bo/projects"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <span className="bo-nav-icon">
              <Icon name="projects" />
            </span>

            <span className="bo-nav-text">
              My Projects
            </span>
          </NavLink>

          <NavLink
            to="/bo/projects/create"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <span className="bo-nav-icon">
              <Icon name="create" />
            </span>

            <span className="bo-nav-text">
              Create Project
            </span>
          </NavLink>

          <NavLink
            to="/bo/calendar"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <span className="bo-nav-icon">
              <Icon name="calendar" />
            </span>

            <span className="bo-nav-text">
              Calendar
            </span>
          </NavLink>

          <NavLink
            to="/bo/notifications"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <span className="bo-nav-icon">
              <Icon name="notifications" />
            </span>

            <span className="bo-nav-text">
              Notifications
            </span>
          </NavLink>
        </nav>

        <div className="bo-sidebar-bottom">
          <NavLink
            to="/bo/profile"
            className={({ isActive }) =>
              `bo-nav-item ${
                isActive ? 'active' : ''
              }`
            }
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <span className="bo-nav-icon">
              <Icon name="profile" />
            </span>

            <span className="bo-nav-text">
              My Profile
            </span>
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

            <span className="bo-nav-text">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="bo-sidebar-backdrop"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}

      {/* ===================================================
          PAGE
      ==================================================== */}

      <div
        className={`bo-page ${
          sidebarCollapsed
            ? 'bo-page-collapsed'
            : ''
        }`}
      >
        {/* HEADER */}

        <header className="bo-header">
          <div className="bo-header-left">
            <button
              className="bo-mobile-menu"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
            >
              <Icon
                name="menu"
                size={20}
              />
            </button>

            <div className="bo-header-title">
              Business Owner Portal
            </div>
          </div>

          <div className="bo-header-right">
            <button
              className="bo-header-icon"
              onClick={() =>
                navigate(
                  '/bo/notifications'
                )
              }
            >
              <Icon
                name="notifications"
                size={19}
              />

              <span className="bo-notification-dot" />
            </button>

            <div
              className="bo-header-user"
              onClick={() =>
                navigate('/bo/profile')
              }
            >
              <div className="bo-user-avatar">
                {initials}
              </div>

              <div className="bo-user-details">
                <strong>{userName}</strong>

                <span>
                  Business Owner
                </span>
              </div>

              <Icon
                name="chevron"
                size={15}
              />
            </div>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================== */}

        <main className="bo-main">
          <div className="bo-content">

            {/* =================================================
                BREADCRUMB / TOP ACTIONS
            ================================================== */}

            <div className="bo-detail-topbar">
              <button
                className="bo-back-link"
                onClick={() =>
                  navigate('/bo/projects')
                }
              >
                <Icon
                  name="arrowLeft"
                  size={14}
                />

                Back to My Projects
              </button>

              {/* <button
                className="bo-detail-refresh"
                onClick={loadProject}
                disabled={isLoading}
              >
                <Icon
                  name="refresh"
                  size={14}
                />

                Refresh
              </button> */}
            </div>

            {/* =================================================
                PROJECT HERO
            ================================================== */}

            <section className="bo-detail-hero">

              <div className="bo-detail-hero-left">

                {/* <div className="bo-detail-project-icon">
                  <Icon
                    name="briefcase"
                    size={23}
                  />
                </div> */}

                <div>
                  <div className="bo-detail-eyebrow">
                    PROJECT DETAILS
                  </div>

                  <h1>
                    {projectName}
                  </h1>

                  <div className="bo-detail-id">
                    PROJECT ID ·{' '}
                    {project.prj_ID || '—'}
                  </div>
                </div>

              </div>

              <div className="bo-detail-hero-right">

                <span
                  className={`bo-detail-status ${statusType}`}
                >
                  {project.status ||
                    'Draft'}
                </span>

                {projectFlag && (
                  <span
                    className={`bo-detail-flag ${flagType}`}
                  >
                    <Icon
                      name="alert"
                      size={13}
                    />

                    {projectFlag}
                  </span>
                )}

              </div>
            </section>

            {/* =================================================
                MESSAGES
            ================================================== */}

            {error && (
              <div className="bo-detail-message error">
                <Icon
                  name="alert"
                  size={16}
                />

                <span>
                  {error}
                </span>
              </div>
            )}

            {successMessage && (
              <div className="bo-detail-message success">
                <Icon
                  name="check"
                  size={16}
                />

                <span>
                  {successMessage}
                </span>
              </div>
            )}

            {/* =================================================
                PROJECT OVERVIEW STRIP
            ================================================== */}

            <section className="bo-detail-overview">

              <div className="bo-detail-overview-item">
                <span>
                  STATUS
                </span>

                <strong>
                  {project.status ||
                    'Draft'}
                </strong>
              </div>

              <div className="bo-detail-overview-divider" />

              <div className="bo-detail-overview-item">
                <span>
                  PO
                </span>

                <strong>
                  {poName}
                </strong>
              </div>

              <div className="bo-detail-overview-divider" />

              <div className="bo-detail-overview-item">
                <span>
                  START DATE
                </span>

                <strong>
                  {formatDate(startDate)}
                </strong>
              </div>

              <div className="bo-detail-overview-divider" />

              <div className="bo-detail-overview-item">
                <span>
                  DELIVERY
                </span>

                <strong>
                  {formatDate(endDate)}
                </strong>
              </div>

            </section>

            {/* =================================================
                EDIT BAR
            ================================================== */}

            {editing && (
              <div className="bo-edit-notice">
                <div>
                  <strong>
                    Editing Project
                  </strong>

                  <span>
                    Update the fields below and save
                    your changes.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={cancelEditing}
                >
                  Cancel editing
                </button>
              </div>
            )}

            {/* =================================================
                MAIN DETAIL GRID
            ================================================== */}

            <div className="bo-detail-grid">

              {/* =================================================
                  LEFT COLUMN
              ================================================== */}

              <div className="bo-detail-main">

                {/* PROJECT DESCRIPTION */}

                <section className="bo-detail-card">

                  <div className="bo-detail-section-header">
                    <div className="bo-detail-section-icon">
                      <Icon
                        name="projects"
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        PROJECT INFORMATION
                      </span>

                      <h2>
                        Project Description
                      </h2>
                    </div>
                  </div>

                  {editing ? (
                    <div className="bo-detail-edit-field">
                      <label>
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={
                          form.description || ''
                        }
                        onChange={handleChange}
                        className="aaib-textarea"
                        rows={7}
                      />
                    </div>
                  ) : (
                    <p className="bo-detail-description">
                      {description}
                    </p>
                  )}

                </section>

                {/* BUSINESS REQUIREMENTS */}

                <section className="bo-detail-card">

                  <div className="bo-detail-section-header">
                    <div className="bo-detail-section-icon gold">
                      <Icon
                        name="briefcase"
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        BUSINESS REQUIREMENTS
                      </span>

                      <h2>
                        Requirements & Scope
                      </h2>
                    </div>
                  </div>

                  <div className="bo-business-info-grid">

                    <div className="bo-business-info">
                      <span>
                        BUSINESS PROBLEM
                      </span>

                      {editing ? (
                        <textarea
                          name="businessProblem"
                          value={
                            form.businessProblem ||
                            ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={5}
                        />
                      ) : (
                        <p>
                          {project.businessProblem ||
                            'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="bo-business-info">
                      <span>
                        BUSINESS OBJECTIVE
                      </span>

                      {editing ? (
                        <textarea
                          name="businessObjective"
                          value={
                            form.businessObjective ||
                            ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={5}
                        />
                      ) : (
                        <p>
                          {project.businessObjective ||
                            'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="bo-business-info">
                      <span>
                        EXPECTED OUTCOME
                      </span>

                      {editing ? (
                        <textarea
                          name="expectedOutcome"
                          value={
                            form.expectedOutcome ||
                            ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={5}
                        />
                      ) : (
                        <p>
                          {project.expectedOutcome ||
                            'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="bo-business-info">
                      <span>
                        MVP SCOPE
                      </span>

                      {editing ? (
                        <textarea
                          name="mvp"
                          value={
                            form.mvp || ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={5}
                        />
                      ) : (
                        <p>
                          {project.mvp ||
                            'Not provided'}
                        </p>
                      )}
                    </div>

                  </div>

                </section>

                {/* REQUIREMENTS */}

                <section className="bo-detail-card">

                  <div className="bo-detail-section-header">
                    <div className="bo-detail-section-icon">
                      <Icon
                        name="check"
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        SCOPE DEFINITION
                      </span>

                      <h2>
                        Must-Have & Nice-to-Have
                      </h2>
                    </div>
                  </div>

                  <div className="bo-scope-grid">

                    <div className="bo-scope-card must">
                      <div>
                        <span>
                          MUST-HAVE
                        </span>

                        <strong>
                          Required
                        </strong>
                      </div>

                      {editing ? (
                        <textarea
                          name="mustHave"
                          value={
                            form.mustHave ||
                            ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={7}
                        />
                      ) : (
                        <p>
                          {project.mustHave ||
                            'No must-have requirements provided.'}
                        </p>
                      )}
                    </div>

                    <div className="bo-scope-card nice">
                      <div>
                        <span>
                          NICE-TO-HAVE
                        </span>

                        <strong>
                          Optional
                        </strong>
                      </div>

                      {editing ? (
                        <textarea
                          name="niceToHave"
                          value={
                            form.niceToHave ||
                            ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={7}
                        />
                      ) : (
                        <p>
                          {project.niceToHave ||
                            'No nice-to-have requirements provided.'}
                        </p>
                      )}
                    </div>

                  </div>

                </section>

                {/* BENEFITS / SUCCESS */}

                <section className="bo-detail-card">

                  <div className="bo-detail-section-header">
                    <div className="bo-detail-section-icon green">
                      <Icon
                        name="check"
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        PROJECT OUTCOMES
                      </span>

                      <h2>
                        Benefits & Success Metrics
                      </h2>
                    </div>
                  </div>

                  <div className="bo-business-info-grid">

                    <div className="bo-business-info">
                      <span>
                        EXPECTED BENEFITS
                      </span>

                      {editing ? (
                        <textarea
                          name="expectedBenefits"
                          value={
                            form.expectedBenefits ||
                            ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={5}
                        />
                      ) : (
                        <p>
                          {project.expectedBenefits ||
                            'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="bo-business-info">
                      <span>
                        SUCCESS METRICS
                      </span>

                      {editing ? (
                        <textarea
                          name="successMetrics"
                          value={
                            form.successMetrics ||
                            ''
                          }
                          onChange={handleChange}
                          className="aaib-textarea"
                          rows={5}
                        />
                      ) : (
                        <p>
                          {project.successMetrics ||
                            'Not provided'}
                        </p>
                      )}
                    </div>

                  </div>

                </section>

              </div>

              {/* =================================================
                  RIGHT COLUMN
              ================================================== */}

              <aside className="bo-detail-side">

                {/* PO CARD */}

                <section className="bo-detail-side-card">

                  <div className="bo-side-detail-header">
                    <div className="bo-side-detail-icon">
                      <Icon
                        name="user"
                        size={17}
                      />
                    </div>

                    <div>
                      <span>
                        PROJECT OWNER
                      </span>

                      <h3>
                        PO Information
                      </h3>
                    </div>
                  </div>

                  <div className="bo-po-info">

                    <span>
                      ASSIGNED PO
                    </span>

                    <strong>
                      {poName}
                    </strong>

                    <small>
                      {project.poEmail ||
                        project.PO_Email ||
                        'Contact information unavailable'}
                    </small>

                  </div>

                  {/* PO RESPONSE */}

                  <div className="bo-po-response">
                    <span>
                      PO RESPONSE
                    </span>

                    {project.poResponse ||
                    project.PO_Response ||
                    project.poDecision ? (
                      <>
                        <strong>
                          {project.poResponse ||
                            project.PO_Response ||
                            project.poDecision}
                        </strong>

                        {(
                          project.poComment ||
                          project.PO_Comment ||
                          project.poFeedback
                        ) && (
                          <p>
                            {project.poComment ||
                              project.PO_Comment ||
                              project.poFeedback}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="bo-po-pending">
                        <Icon
                          name="clock"
                          size={14}
                        />

                        <span>
                          Awaiting PO response
                        </span>
                      </div>
                    )}
                  </div>

                </section>

                {/* TIMELINE */}

                <section className="bo-detail-side-card">

                  <div className="bo-side-detail-header">
                    <div className="bo-side-detail-icon gold">
                      <Icon
                        name="calendar"
                        size={17}
                      />
                    </div>

                    <div>
                      <span>
                        TIMELINE
                      </span>

                      <h3>
                        Project Dates
                      </h3>
                    </div>
                  </div>

                  <div className="bo-timeline">

                    <div className="bo-timeline-item">
                      <span className="bo-timeline-dot start" />

                      <div>
                        <span>
                          START DATE
                        </span>

                        <strong>
                          {formatDate(startDate)}
                        </strong>
                      </div>
                    </div>

                    <div className="bo-timeline-line" />

                    <div className="bo-timeline-item">
                      <span className="bo-timeline-dot end" />

                      <div>
                        <span>
                          EXPECTED DELIVERY
                        </span>

                        <strong>
                          {formatDate(endDate)}
                        </strong>
                      </div>
                    </div>

                  </div>

                  <button
                    className="bo-side-link"
                    onClick={() =>
                      navigate('/bo/calendar')
                    }
                  >
                    Open Calendar
                    <Icon
                      name="arrow"
                      size={13}
                    />
                  </button>

                </section>

                {/* BRD */}

                <section className="bo-detail-side-card">

                  <div className="bo-side-detail-header">
                    <div className="bo-side-detail-icon">
                      <Icon
                        name="file"
                        size={17}
                      />
                    </div>

                    <div>
                      <span>
                        DOCUMENTATION
                      </span>

                      <h3>
                        Business Requirements
                      </h3>
                    </div>
                  </div>

                  {brd ? (
                    <a
                      href={brd}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bo-brd-card"
                    >
                      <div className="bo-brd-icon">
                        <Icon
                          name="file"
                          size={18}
                        />
                      </div>

                      <div>
                        <strong>
                          Business Requirements
                          Document
                        </strong>

                        <span>
                          Open document
                        </span>
                      </div>

                      <Icon
                        name="arrow"
                        size={14}
                      />
                    </a>
                  ) : (
                    <div className="bo-brd-none">
                      <Icon
                        name="file"
                        size={18}
                      />

                      <span>
                        No BRD attached
                      </span>
                    </div>
                  )}

                </section>

                {/* FLAG */}

                {/* <section
                  className={`bo-detail-side-card bo-flag-card ${
                    projectFlag
                      ? flagType
                      : ''
                  }`}
                >

                  <div className="bo-side-detail-header">
                    <div
                      className={`bo-side-detail-icon ${
                        projectFlag
                          ? 'danger'
                          : ''
                      }`}
                    >
                      <Icon
                        name="alert"
                        size={17}
                      />
                    </div>

                    <div>
                      <span>
                        PROJECT FLAG
                      </span>

                      <h3>
                        Attention
                      </h3>
                    </div>
                  </div>

                  {projectFlag ? (
                    <div>
                      <div className="bo-active-flag">
                        <span
                          className={`bo-active-flag-badge ${flagType}`}
                        >
                          Active
                        </span>

                        <strong>
                          {projectFlag}
                        </strong>
                      </div>

                      <p className="bo-flag-note">
                        This project has an
                        active flag.
                      </p>
                    </div>
                  ) : (
                    <div className="bo-no-flag">
                      <Icon
                        name="check"
                        size={16}
                      />

                      <span>
                        No active flags
                      </span>
                    </div>
                  )}

                </section> */}

              </aside>

            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="bo-detail-actions">

              {/* <button
                type="button"
                className="aaib-btn aaib-btn-secondary"
                onClick={() =>
                  navigate('/bo/projects')
                }
              >
                Back to Projects
              </button> */}

              {!editing ? (
                <button
                  type="button"
                  className="aaib-btn aaib-btn-primary"
                  onClick={() => {
                    setEditing(true);
                    setError('');
                    setSuccessMessage('');
                  }}
                >
                  <Icon
                    name="edit"
                    size={16}
                  />

                  Edit Project
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="aaib-btn aaib-btn-secondary"
                    onClick={cancelEditing}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="aaib-btn aaib-btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Icon
                      name="save"
                      size={16}
                    />

                    {isSaving
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>
                </>
              )}

            </div>

          </div>
        </main>
      </div>

      {/* =====================================================
          PAGE-SPECIFIC CSS
      ====================================================== */}

      <style>
        {`

        /* ==================================================
           LOADING / ERROR
        ================================================== */

        .bo-detail-loading-page,
        .bo-detail-error-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: var(--aaib-bg);
          padding: 30px;
        }

        .bo-detail-loading,
        .bo-detail-error-card {
          width: min(430px, 100%);
          display: grid;
          justify-items: center;
          text-align: center;
          padding: 35px;
          background: #fff;
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          box-shadow: var(--aaib-shadow-card);
        }

        .bo-detail-loading-spinner {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          color: var(--aaib-primary);
          background: var(--aaib-primary-soft);
          border-radius: 12px;
        }

        .bo-detail-loading-spinner svg {
          animation: boSpin 1s linear infinite;
        }

        @keyframes boSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .bo-detail-loading strong,
        .bo-detail-error-card h2 {
          color: var(--aaib-primary);
          font-size: 15px;
        }

        .bo-detail-loading span,
        .bo-detail-error-card p {
          color: var(--aaib-text-muted);
          font-size: 11px;
        }

        .bo-detail-error-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 13px;
          color: var(--aaib-danger);
          background: var(--aaib-danger-soft);
        }

        .bo-detail-error-card h2 {
          margin: 0 0 5px;
        }

        .bo-detail-error-card p {
          margin: 0 0 17px;
        }

        .bo-detail-error-actions {
          display: flex;
          gap: 8px;
        }

        /* ==================================================
           TOP BAR
        ================================================== */

        .bo-detail-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .bo-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          background: transparent;
          padding: 0;
          color: var(--aaib-text-muted);
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .bo-back-link:hover {
          color: var(--aaib-primary);
        }

        .bo-detail-refresh {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--aaib-border);
          border-radius: 8px;
          background: #fff;
          color: var(--aaib-primary);
          height: 32px;
          padding: 0 10px;
          font-size: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .bo-detail-refresh:hover {
          background: var(--aaib-primary-soft);
        }

        /* ==================================================
           HERO
        ================================================== */

        .bo-detail-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;

          padding: 23px 25px;

          margin-bottom: 13px;

          border-radius: var(--aaib-radius);

          background:
            linear-gradient(
              135deg,
              #192d20 0%,
              #294535 100%
            );

          color: #fff;

          box-shadow:
            0 10px 25px
            rgba(27,40,30,.12);
        }

        .bo-detail-hero-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .bo-detail-project-icon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 12px;

          color: var(--aaib-accent);
          background: rgba(197,160,89,.12);

          border:
            1px solid
            rgba(197,160,89,.28);
        }

        .bo-detail-eyebrow {
          color: var(--aaib-accent);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .14em;
        }

        .bo-detail-hero h1 {
          overflow: hidden;
          text-overflow: ellipsis;

          margin: 3px 0 4px;

          font-size: 22px;
          line-height: 1.15;

          letter-spacing: -.025em;
        }

        .bo-detail-id {
          color: rgba(255,255,255,.58);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .07em;
        }

        .bo-detail-hero-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 7px;
          flex-shrink: 0;
        }

        .bo-detail-status,
        .bo-detail-flag {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          min-height: 25px;

          padding: 0 10px;

          border-radius: 999px;

          font-size: 9px;
          font-weight: 800;
        }

        .bo-detail-status.success {
          background: var(--aaib-success-soft);
          color: var(--aaib-success);
        }

        .bo-detail-status.warning {
          background: var(--aaib-warning-soft);
          color: var(--aaib-warning);
        }

        .bo-detail-status.danger {
          background: var(--aaib-danger-soft);
          color: var(--aaib-danger);
        }

        .bo-detail-status.active {
          background: rgba(255,255,255,.11);
          color: #fff;
        }

        .bo-detail-status.neutral {
          background: rgba(255,255,255,.11);
          color: #dce5df;
        }

        .bo-detail-flag {
          color: #ffd1d1;
          background: rgba(201,58,58,.18);
        }

        /* ==================================================
           MESSAGE
        ================================================== */

        .bo-detail-message {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 12px;

          padding:
            10px 13px;

          border-radius: 8px;

          font-size: 10px;
        }

        .bo-detail-message.error {
          color: var(--aaib-danger);
          background: var(--aaib-danger-soft);
        }

        .bo-detail-message.success {
          color: var(--aaib-success);
          background: var(--aaib-success-soft);
        }

        /* ==================================================
           OVERVIEW
        ================================================== */

        .bo-detail-overview {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          align-items: center;

          padding: 14px 18px;

          margin-bottom: 16px;

          background: #fff;

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius);

          box-shadow:
            var(--aaib-shadow-card);
        }

        .bo-detail-overview-item span {
          display: block;

          margin-bottom: 3px;

          color: var(--aaib-text-muted);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .06em;
        }

        .bo-detail-overview-item strong {
          display: block;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          color: var(--aaib-primary);

          font-size: 11px;
        }

        .bo-detail-overview-divider {
          width: 1px;
          height: 27px;

          background:
            var(--aaib-border);
        }

        /* ==================================================
           EDIT NOTICE
        ================================================== */

        .bo-edit-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          margin-bottom: 13px;

          padding: 11px 14px;

          border-left:
            3px solid
            var(--aaib-accent);

          border-radius:
            8px;

          background:
            var(--aaib-accent-soft);
        }

        .bo-edit-notice strong {
          display: block;

          margin-bottom: 2px;

          color:
            var(--aaib-primary);

          font-size: 10px;
        }

        .bo-edit-notice span {
          display: block;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-edit-notice button {
          border: 0;
          background: transparent;

          color:
            var(--aaib-primary);

          font-size: 9px;
          font-weight: 700;

          cursor: pointer;
        }

        /* ==================================================
           DETAIL GRID
        ================================================== */

        .bo-detail-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(285px, .75fr);

          align-items: start;

          gap: 16px;
        }

        .bo-detail-main {
          min-width: 0;

          display: grid;

          gap: 13px;
        }

        .bo-detail-side {
          min-width: 0;

          display: grid;

          gap: 13px;
        }

        /* ==================================================
           CARDS
        ================================================== */

        .bo-detail-card,
        .bo-detail-side-card {
          background:
            var(--aaib-surface);

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius);

          box-shadow:
            var(--aaib-shadow-card);
        }

        .bo-detail-card {
          padding:
            20px;
        }

        .bo-detail-side-card {
          padding:
            17px;
        }

        .bo-detail-section-header,
        .bo-side-detail-header {
          display: flex;
          align-items: flex-start;

          gap: 10px;

          margin-bottom: 15px;
        }

        .bo-detail-section-icon,
        .bo-side-detail-icon {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 9px;

          color: var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-detail-section-icon.gold,
        .bo-side-detail-icon.gold {
          color: #9b771f;

          background:
            var(--aaib-accent-soft);
        }

        .bo-detail-section-icon.green {
          color: var(--aaib-success);

          background:
            var(--aaib-success-soft);
        }

        .bo-side-detail-icon.danger {
          color: var(--aaib-danger);

          background:
            var(--aaib-danger-soft);
        }

        .bo-detail-section-header span,
        .bo-side-detail-header span {
          display: block;

          color:
            var(--aaib-accent);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .12em;
        }

        .bo-detail-section-header h2,
        .bo-side-detail-header h3 {
          margin: 3px 0 0;

          color:
            var(--aaib-primary);
        }

        .bo-detail-section-header h2 {
          font-size: 16px;
        }

        .bo-side-detail-header h3 {
          font-size: 13px;
        }

        /* ==================================================
           DESCRIPTION
        ================================================== */

        .bo-detail-description {
          margin: 0;

          color:
            var(--aaib-text-muted);

          font-size: 12px;

          line-height: 1.75;

          white-space: pre-wrap;
        }

        .bo-detail-edit-field label {
          display: block;

          margin-bottom: 6px;

          color:
            var(--aaib-primary);

          font-size: 10px;
          font-weight: 700;
        }

        /* ==================================================
           BUSINESS INFO
        ================================================== */

        .bo-business-info-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 11px;
        }

        .bo-business-info {
          min-width: 0;

          padding: 13px;

          border:
            1px solid
            var(--aaib-border);

          border-radius: 9px;

          background:
            var(--aaib-surface-alt);
        }

        .bo-business-info > span {
          display: block;

          margin-bottom: 7px;

          color:
            var(--aaib-text-muted);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .07em;
        }

        .bo-business-info p {
          margin: 0;

          color:
            var(--aaib-text);

          font-size: 10px;

          line-height: 1.55;

          white-space: pre-wrap;
        }

        .bo-business-info .aaib-textarea {
          background: #fff;

          min-height: 95px;

          font-size: 10px;
        }

        /* ==================================================
           SCOPE
        ================================================== */

        .bo-scope-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 11px;
        }

        .bo-scope-card {
          padding: 14px;

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            9px;
        }

        .bo-scope-card.must {
          border-top:
            3px solid
            var(--aaib-primary);
        }

        .bo-scope-card.nice {
          border-top:
            3px solid
            var(--aaib-accent);
        }

        .bo-scope-card > div {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          margin-bottom: 10px;
        }

        .bo-scope-card > div span {
          display: block;

          color:
            var(--aaib-primary);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .1em;
        }

        .bo-scope-card.nice > div span {
          color:
            #99751f;
        }

        .bo-scope-card > div strong {
          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-scope-card p {
          margin: 0;

          color:
            var(--aaib-text-muted);

          font-size: 10px;

          line-height: 1.6;

          white-space: pre-wrap;
        }

        /* ==================================================
           PO
        ================================================== */

        .bo-po-info {
          padding:
            12px;

          border-radius: 9px;

          background:
            var(--aaib-surface-alt);
        }

        .bo-po-info > span,
        .bo-po-response > span {
          display: block;

          color:
            var(--aaib-text-muted);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .08em;
        }

        .bo-po-info strong {
          display: block;

          margin-top: 5px;

          color:
            var(--aaib-primary);

          font-size: 12px;
        }

        .bo-po-info small {
          display: block;

          margin-top: 3px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-po-response {
          margin-top: 13px;

          padding-top: 13px;

          border-top:
            1px solid
            var(--aaib-border);
        }

        .bo-po-response > strong {
          display: inline-block;

          margin-top: 7px;

          padding:
            5px 8px;

          border-radius: 999px;

          color:
            var(--aaib-success);

          background:
            var(--aaib-success-soft);

          font-size: 8px;
          font-weight: 800;
        }

        .bo-po-response p {
          margin: 8px 0 0;

          color:
            var(--aaib-text-muted);

          font-size: 9px;

          line-height: 1.5;
        }

        .bo-po-pending {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-top: 8px;

          color:
            var(--aaib-warning);

          font-size: 9px;
        }

        /* ==================================================
           TIMELINE
        ================================================== */

        .bo-timeline {
          position: relative;

          padding:
            3px 0 4px 1px;
        }

        .bo-timeline-item {
          display: flex;

          align-items: flex-start;

          gap: 10px;
        }

        .bo-timeline-dot {
          width: 9px;
          height: 9px;

          flex: 0 0 auto;

          margin-top: 3px;

          border-radius: 50%;
        }

        .bo-timeline-dot.start {
          background:
            var(--aaib-primary);
        }

        .bo-timeline-dot.end {
          background:
            var(--aaib-accent);
        }

        .bo-timeline-item > div span {
          display: block;

          color:
            var(--aaib-text-muted);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .06em;
        }

        .bo-timeline-item > div strong {
          display: block;

          margin-top: 2px;

          color:
            var(--aaib-primary);

          font-size: 10px;
        }

        .bo-timeline-line {
          width: 1px;
          height: 24px;

          margin:
            2px 0
            2px 4px;

          background:
            var(--aaib-border);
        }

        .bo-side-link {
          display: flex;
          align-items: center;
          justify-content: space-between;

          width: 100%;

          margin-top: 13px;

          padding-top: 11px;

          border:
            0;
          border-top:
            1px solid
            var(--aaib-border);

          background:
            transparent;

          color:
            var(--aaib-primary);

          font-size: 9px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-side-link:hover {
          color:
            var(--aaib-accent);
        }

        /* ==================================================
           BRD
        ================================================== */

        .bo-brd-card {
          display: flex;
          align-items: center;

          gap: 9px;

          padding: 10px;

          border:
            1px solid
            var(--aaib-border);

          border-radius: 9px;

          background:
            var(--aaib-surface-alt);

          text-decoration: none;
        }

        .bo-brd-card:hover {
          border-color:
            rgba(27,40,30,.16);

          background:
            var(--aaib-primary-soft);
        }

        .bo-brd-icon {
          width: 32px;
          height: 32px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 8px;

          color:
            var(--aaib-primary);

          background:
            #fff;
        }

        .bo-brd-card > div:nth-child(2) {
          min-width: 0;
          flex: 1;
        }

        .bo-brd-card strong {
          display: block;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          color:
            var(--aaib-primary);

          font-size: 9px;
        }

        .bo-brd-card span {
          display: block;

          margin-top: 2px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-brd-card > svg {
          color:
            #9ba59f;
        }

        .bo-brd-none {
          min-height: 62px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          border:
            1px dashed
            rgba(27,40,30,.12);

          border-radius: 9px;

          color:
            var(--aaib-text-muted);

          background:
            #fcfdfc;

          font-size: 9px;
        }

        /* ==================================================
           FLAGS
        ================================================== */

        .bo-active-flag {
          display: grid;

          gap: 7px;

          padding: 11px;

          border-radius: 9px;

          background:
            var(--aaib-danger-soft);
        }

        .bo-active-flag-badge {
          display: inline-flex;

          width: fit-content;

          padding:
            4px 7px;

          border-radius: 999px;

          font-size: 7px;
          font-weight: 800;

          text-transform: uppercase;
        }

        .bo-active-flag-badge.critical,
        .bo-active-flag-badge.danger {
          color:
            var(--aaib-danger);

          background:
            rgba(201,58,58,.09);
        }

        .bo-active-flag-badge.attention {
          color:
            var(--aaib-warning);

          background:
            var(--aaib-warning-soft);
        }

        .bo-active-flag-badge.info {
          color:
            #2c6ba4;

          background:
            #eaf2ff;
        }

        .bo-active-flag strong {
          color:
            var(--aaib-danger);

          font-size: 10px;

          line-height: 1.45;
        }

        .bo-flag-note {
          margin: 7px 0 0;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-no-flag {
          min-height: 62px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          border-radius: 9px;

          background:
            var(--aaib-success-soft);

          color:
            var(--aaib-success);

          font-size: 9px;
          font-weight: 700;
        }

        /* ==================================================
           ACTIONS
        ================================================== */

        .bo-detail-actions {
          display: flex;
          justify-content: flex-end;

          gap: 8px;

          padding:
            17px 0 4px;
        }

        .bo-detail-actions .aaib-btn {
          min-height: 60px;

          font-size: 15px;
        }

        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 1050px) {
          .bo-detail-grid {
            grid-template-columns:
              1fr;
          }

          .bo-detail-side {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .bo-flag-card {
            grid-column:
              span 2;
          }
        }

        @media (max-width: 760px) {
          .bo-detail-overview {
            grid-template-columns:
              repeat(2, 1fr);

            gap: 14px;
          }

          .bo-detail-overview-divider {
            display: none;
          }

          .bo-detail-side {
            grid-template-columns:
              1fr;
          }

          .bo-flag-card {
            grid-column:
              auto;
          }

          .bo-business-info-grid,
          .bo-scope-grid {
            grid-template-columns:
              1fr;
          }

          .bo-detail-hero {
            align-items: flex-start;
            flex-direction: column;
          }

          .bo-detail-hero-right {
            align-items: flex-start;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .bo-edit-notice {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .bo-detail-hero {
            padding:
              19px;
          }

          .bo-detail-hero h1 {
            font-size: 19px;
          }

          .bo-detail-overview {
            grid-template-columns:
              1fr;
          }

          .bo-detail-card {
            padding:
              16px;
          }

          .bo-detail-actions {
            display: grid;

            grid-template-columns:
              1fr;
          }

          .bo-detail-actions button {
            width: 100%;
          }

          .bo-detail-error-actions {
            width: 100%;
            flex-direction: column;
          }

          .bo-detail-error-actions button {
            width: 100%;
          }
        }
          .bo-detail-actions {
  transform: translateY(-80px);
}

        `}
      </style>
    </div>
  );
}