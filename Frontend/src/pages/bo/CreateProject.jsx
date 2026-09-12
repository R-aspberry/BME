import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { createProject } from '../../services/projectService';
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

    upload: (
      <>
        <path d="M12 16V4" />
        <path d="M7 9l5-5 5 5" />
        <path d="M5 20h14a2 2 0 0 0 2-2v-2" />
        <path d="M3 16v2a2 2 0 0 0 2 2" />
      </>
    ),

    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h6" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.7 2.7L16 9" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6" />
        <path d="M3 11h18" />
        <path d="M10 11v2h4v-2" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h12l2 2v16H5z" />
        <path d="M8 3v6h8V3" />
        <path d="M8 21v-7h8v7" />
      </>
    ),

    alert: (
      <>
        <path d="M10.3 4.5L2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
  };

  return (
    <svg {...common}>
      {paths[name]}
    </svg>
  );
}

/* =========================================================
   INITIAL FORM
   ========================================================= */

const initialForm = {
  project_Name: '',
  description: '',
  businessProblem: '',
  businessObjective: '',
  expectedOutcome: '',
  mustHave: '',
  niceToHave: '',
  mvp: '',
  businessJustification: '',
  expectedBenefits: '',
  successMetrics: '',
  start_date: '',
  end_date: '',
  budget: '',
};

export default function ProjectCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [brdFile, setBrdFile] = useState(null);
  const [brdData, setBrdData] = useState('');

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* =======================================================
     USER
     ======================================================== */

  const userName =
    localStorage.getItem('userName') || 'User';

  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /* =======================================================
     FORM HANDLERS
     ======================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setSuccessMessage('');

    setFieldErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const updated = { ...previous };
      delete updated[name];

      return updated;
    });
  };

  /* =======================================================
     BRD UPLOAD
     ======================================================== */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setBrdFile(null);
      setBrdData('');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions = [
      '.pdf',
      '.doc',
      '.docx',
    ];

    const fileName = file.name.toLowerCase();

    const validType =
      !file.type ||
      allowedTypes.includes(file.type);

    const validExtension =
      allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      );

    if (!validType && !validExtension) {
      setError(
        'Please upload a PDF, DOC, or DOCX file.'
      );

      e.target.value = '';
      setBrdFile(null);
      setBrdData('');
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        'The BRD file must be smaller than 10 MB.'
      );

      e.target.value = '';
      setBrdFile(null);
      setBrdData('');
      return;
    }

    setError('');
    setSuccessMessage('');

    setFieldErrors((previous) => {
      if (!previous.brd) {
        return previous;
      }

      const updated = { ...previous };
      delete updated.brd;

      return updated;
    });

    setBrdFile(file);

    /*
      Keep the existing BRD approach used by your page:
      convert the selected file to a Data URL.
    */
    const reader = new FileReader();

    reader.onload = () => {
      setBrdData(reader.result || '');
    };

    reader.onerror = () => {
      setError(
        'The BRD could not be read. Please try again.'
      );

      setBrdFile(null);
      setBrdData('');
    };

    reader.readAsDataURL(file);
  };

  const removeBrd = () => {
    setBrdFile(null);
    setBrdData('');

    setFieldErrors((previous) => {
      if (!previous.brd) {
        return previous;
      }

      const updated = { ...previous };
      delete updated.brd;

      return updated;
    });

    const input =
      document.getElementById('brd-upload');

    if (input) {
      input.value = '';
    }
  };

  /* =======================================================
     VALIDATION
     ======================================================== */

  const validateForm = ({
    requireBrd = false,
  } = {}) => {
    const errors = {};

    if (!form.project_Name.trim()) {
      errors.project_Name =
        'Project Name is required.';
    }

    if (!form.description.trim()) {
      errors.description =
        'Project Description is required.';
    }

    if (!form.businessProblem.trim()) {
      errors.businessProblem =
        'Business Problem is required.';
    }

    if (!form.businessObjective.trim()) {
      errors.businessObjective =
        'Business Objective is required.';
    }

    if (!form.expectedOutcome.trim()) {
      errors.expectedOutcome =
        'Expected Outcome is required.';
    }

    if (!form.mustHave.trim()) {
      errors.mustHave =
        'Must-Have Requirements are required.';
    }

    if (!form.mvp.trim()) {
      errors.mvp =
        'MVP Scope is required.';
    }

    if (!form.successMetrics.trim()) {
      errors.successMetrics =
        'Success Metrics are required.';
    }

    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);

      if (end < start) {
        errors.end_date =
          'End date cannot be before the start date.';
      }
    }

    if (
      form.budget &&
      Number(form.budget) < 0
    ) {
      errors.budget =
        'Budget cannot be negative.';
    }

    if (
      requireBrd &&
      !brdData
    ) {
      errors.brd =
        'Please attach the BRD before submitting the project to the PO.';
    }

    return errors;
  };

  /* =======================================================
     PAYLOAD
     ======================================================== */

  const buildPayload = (status) => ({
    project_Name:
      form.project_Name.trim(),

    description:
      form.description.trim(),

    businessProblem:
      form.businessProblem.trim(),

    businessObjective:
      form.businessObjective.trim(),

    expectedOutcome:
      form.expectedOutcome.trim(),

    mustHave:
      form.mustHave.trim(),

    niceToHave:
      form.niceToHave.trim(),

    mvp:
      form.mvp.trim(),

    businessJustification:
      form.businessJustification.trim(),

    expectedBenefits:
      form.expectedBenefits.trim(),

    successMetrics:
      form.successMetrics.trim(),

    brd: brdData || '',

    start_date:
      form.start_date || null,

    end_date:
      form.end_date || null,

    budget:
      form.budget
        ? parseFloat(form.budget)
        : null,

    status,
  });

  /* =======================================================
     SUBMIT PROJECT
     ======================================================== */

  const handleSubmitToPO = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError('');
    setSuccessMessage('');

    const errors = validateForm({
      requireBrd: false,
    });

    setFieldErrors(errors);

    const errorFields = Object.keys(errors);

    /*
      Show every missing/invalid field and
      move the user to the first one.
    */
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];

      setTimeout(() => {
        const element =
          document.getElementById(firstErrorField);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          element.focus();
          return;
        }

        if (firstErrorField === 'brd') {
          const brdArea =
            document.getElementById(
              'brd-upload-area'
            );

          if (brdArea) {
            brdArea.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }
      }, 50);

      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * POST TO PROJECT API.
       * Do not redirect until this request succeeds.
       */
      const createdProject =
        await createProject(
          buildPayload('Pending PO Review')
        );

      console.log(
        'Project created successfully:',
        createdProject
      );

      /*
       * The project has now been created in the
       * backend. Go back to My Projects so its
       * fresh GET request can display it.
       */
      navigate('/bo/projects', {
        state: {
          projectCreated: true,
          createdProject,
        },
      });
    } catch (err) {
      console.error(
        'Create project error:',
        err
      );

      let message =
        'Unable to create the project. Please try again.';

      if (err?.response?.data) {
        if (
          typeof err.response.data === 'string'
        ) {
          message = err.response.data;
        } else if (
          err.response.data.message
        ) {
          message =
            err.response.data.message;
        } else if (
          err.response.data.title
        ) {
          message =
            err.response.data.title;
        }
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  /* =======================================================
     RENDER
     ======================================================== */

  return (
    <div
      className={`bo-shell ${
        sidebarCollapsed
          ? 'bo-sidebar-collapsed'
          : ''
      } ${
        mobileSidebarOpen
          ? 'bo-mobile-sidebar-open'
          : ''
      }`}
    >

      {/* ===================================================
          SIDEBAR
          =================================================== */}

      <aside className="bo-sidebar">

        <div className="bo-sidebar-top">

          <div className="bo-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
            type="button"
            className="bo-collapse-btn"
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
            className="bo-mobile-close"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
          >
            <Icon
              name="close"
              size={20}
            />
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
            onClick={closeMobileSidebar}
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
            onClick={closeMobileSidebar}
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
            onClick={closeMobileSidebar}
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
            onClick={closeMobileSidebar}
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
            onClick={closeMobileSidebar}
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
            onClick={closeMobileSidebar}
          >
            <span className="bo-nav-icon">
              <Icon name="profile" />
            </span>

            <span className="bo-nav-text">
              My Profile
            </span>
          </NavLink>

          <button
            type="button"
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

      <div
        className="bo-sidebar-backdrop"
        onClick={closeMobileSidebar}
      />

      {/* ===================================================
          PAGE
          =================================================== */}

      <div className="bo-page">

        {/* =================================================
            HEADER
            ================================================= */}

        <header className="bo-header">

          <div className="bo-header-left">

  <button
    type="button"
    className="bo-mobile-menu"
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
    className="bo-header-aaib-logo"
  />

  <div className="bo-header-title">
    Business Owner Portal
  </div>

</div>

          <div className="bo-header-right">

            <button
              type="button"
              className="bo-header-icon"
              onClick={() =>
                navigate('/bo/notifications')
              }
              aria-label="Notifications"
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

                <strong>
                  {userName}
                </strong>

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
            MAIN
            ================================================= */}

        <main className="bo-main">

          <div className="bo-content">

            {/* =================================================
                PAGE HEADER
                ================================================= */}

            <div className="bo-create-header">

              <div>

                <button
                  type="button"
                  className="bo-back-link"
                  onClick={() =>
                    navigate('/bo/projects')
                  }
                >
                  ← Back to My Projects
                </button>

                <div className="bo-create-eyebrow">
                  PROJECT MANAGEMENT
                </div>

                <h1>
                  Create Project
                </h1>

                <p>
                  Submit a new project
                  for Product Owner
                  review.
                </p>

              </div>

            </div>

            {/* =================================================
                WORKFLOW
                ================================================= */}

            <div className="bo-create-workflow">

              <div className="bo-create-step active">

                <div className="bo-create-step-number">
                  1
                </div>

                <div>
                  <strong>
                    Project Information
                  </strong>

                  <span>
                    Basic details
                  </span>
                </div>

              </div>

              <div className="bo-create-step-line" />

              <div className="bo-create-step">

                <div className="bo-create-step-number">
                  2
                </div>

                <div>
                  <strong>
                    Business Requirements
                  </strong>

                  <span>
                    Scope and objectives
                  </span>
                </div>

              </div>

              <div className="bo-create-step-line" />

              <div className="bo-create-step">

                <div className="bo-create-step-number">
                  3
                </div>

                <div>
                  <strong>
                    BRD & Submission
                  </strong>

                  <span>
                    Attach and submit
                  </span>
                </div>

              </div>

            </div>

            {/* =================================================
                MESSAGES
                ================================================= */}

            {error && (
              <div className="bo-create-message error">

                <Icon
                  name="alert"
                  size={17}
                />

                <span>
                  {error}
                </span>

              </div>
            )}

            {successMessage && (
              <div className="bo-create-message success">

                <Icon
                  name="check"
                  size={17}
                />

                <span>
                  {successMessage}
                </span>

              </div>
            )}

            {/* =================================================
                FORM
                ================================================= */}

            <form
              onSubmit={handleSubmitToPO}
              noValidate
            >

              {/* =================================================
                  SECTION 1
                  ================================================= */}

              <section className="bo-create-section">

                <div className="bo-create-section-header">

                  {/* FIX:
                      GOLD instead of green
                      AND briefcase now exists
                  */}

                  <div className="bo-create-section-icon gold">

                    <Icon
                      name="briefcase"
                      size={19}
                    />

                  </div>

                  <div>

                    <span>
                      SECTION 01
                    </span>

                    <h2>
                      Project Information
                    </h2>

                    <p>
                      Start with the basic
                      information about
                      the project.
                    </p>

                  </div>

                </div>

                <div className="bo-create-form-grid">

                  <div
                    className={`bo-create-field full ${
                      fieldErrors.project_Name
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="project_Name">
                      Project Name
                      <span>*</span>
                    </label>

                    <input
                      id="project_Name"
                      name="project_Name"
                      value={form.project_Name}
                      onChange={handleChange}
                      className="aaib-input"
                      placeholder="Enter the project name"
                      required
                    />

                    {fieldErrors.project_Name && (
                      <span className="bo-field-error">
                        {fieldErrors.project_Name}
                      </span>
                    )}

                    <small>
                      Use a clear and
                      descriptive name.
                    </small>

                  </div>

                  <div
                    className={`bo-create-field full ${
                      fieldErrors.description
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="description">
                      Project Description
                      <span>*</span>
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder="Describe what the project is about..."
                      rows={4}
                      required
                    />

                    {fieldErrors.description && (
                      <span className="bo-field-error">
                        {fieldErrors.description}
                      </span>
                    )}

                    <small>
                      Provide a concise overview
                      of the project and what it
                      aims to deliver.
                    </small>

                  </div>

                </div>

              </section>

              {/* =================================================
                  SECTION 2
                  ================================================= */}

              <section className="bo-create-section">

                <div className="bo-create-section-header">

                  <div className="bo-create-section-icon gold">

                    <Icon
                      name="projects"
                      size={19}
                    />

                  </div>

                  <div>

                    <span>
                      SECTION 02
                    </span>

                    <h2>
                      Business Requirements
                    </h2>

                    <p>
                      Define the business problem,
                      objective, scope and
                      expected outcome.
                    </p>

                  </div>

                </div>

                <div className="bo-create-form-grid">

                  <div
                    className={`bo-create-field ${
                      fieldErrors.businessProblem
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="businessProblem">
                      Business Problem
                      <span>*</span>
                    </label>

                    <textarea
                      id="businessProblem"
                      name="businessProblem"
                      value={form.businessProblem}
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder="What business problem is this project solving?"
                      rows={5}
                      required
                    />

                    {fieldErrors.businessProblem && (
                      <span className="bo-field-error">
                        {fieldErrors.businessProblem}
                      </span>
                    )}

                  </div>

                  <div
                    className={`bo-create-field ${
                      fieldErrors.businessObjective
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="businessObjective">
                      Business Objective
                      <span>*</span>
                    </label>

                    <textarea
                      id="businessObjective"
                      name="businessObjective"
                      value={form.businessObjective}
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder="What should the project achieve?"
                      rows={5}
                      required
                    />

                    {fieldErrors.businessObjective && (
                      <span className="bo-field-error">
                        {fieldErrors.businessObjective}
                      </span>
                    )}

                  </div>

                  <div
                    className={`bo-create-field ${
                      fieldErrors.expectedOutcome
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="expectedOutcome">
                      Expected Outcome
                      <span>*</span>
                    </label>

                    <textarea
                      id="expectedOutcome"
                      name="expectedOutcome"
                      value={form.expectedOutcome}
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder="What should the final outcome look like?"
                      rows={5}
                      required
                    />

                    {fieldErrors.expectedOutcome && (
                      <span className="bo-field-error">
                        {fieldErrors.expectedOutcome}
                      </span>
                    )}

                  </div>

                  <div className="bo-create-field">

                    <label htmlFor="businessJustification">
                      Business Justification
                    </label>

                    <textarea
                      id="businessJustification"
                      name="businessJustification"
                      value={
                        form.businessJustification
                      }
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder="Why is this project important?"
                      rows={5}
                    />

                  </div>

                </div>

              </section>

              {/* =================================================
                  SECTION 3
                  ================================================= */}

              <section className="bo-create-section">

                <div className="bo-create-section-header">

                  <div className="bo-create-section-icon">

                    <Icon
                      name="check"
                      size={19}
                    />

                  </div>

                  <div>

                    <span>
                      SECTION 03
                    </span>

                    <h2>
                      Scope & Requirements
                    </h2>

                    <p>
                      Clearly separate the essential
                      requirements from optional
                      features.
                    </p>

                  </div>

                </div>

                <div className="bo-requirement-grid">

                  <div
                    className={`bo-requirement-card must ${
                      fieldErrors.mustHave
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <div className="bo-requirement-header">

                      <div>

                        <span>
                          MUST-HAVE
                        </span>

                        <h3>
                          Required Requirements
                        </h3>

                      </div>

                      <div className="bo-requirement-count">
                        01
                      </div>

                    </div>

                    <textarea
                      name="mustHave"
                      value={form.mustHave}
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder={
                        'List the essential requirements..'
                      }
                      rows={8}
                      required
                    />

                    {fieldErrors.mustHave && (
                      <span className="bo-field-error">
                        {fieldErrors.mustHave}
                      </span>
                    )}

                  </div>

                  <div className="bo-requirement-card nice">

                    <div className="bo-requirement-header">

                      <div>

                        <span>
                          NICE-TO-HAVE
                        </span>

                        <h3>
                          Optional Requirements
                        </h3>

                      </div>

                      <div className="bo-requirement-count">
                        02
                      </div>

                    </div>

                    <textarea
                      name="niceToHave"
                      value={form.niceToHave}
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder={
                        'List additional features..'
                      }
                      rows={8}
                    />

                  </div>

                </div>

                <div
                  className={`bo-create-field bo-mvp-field ${
                    fieldErrors.mvp
                      ? 'bo-field-has-error'
                      : ''
                  }`}
                >

                  <label htmlFor="mvp">
                    MVP Scope
                    <span>*</span>
                  </label>

                  <textarea
                    id="mvp"
                    name="mvp"
                    value={form.mvp}
                    onChange={handleChange}
                    className="aaib-textarea"
                    placeholder="Define what must be included in the initial MVP release..."
                    rows={5}
                    required
                  />

                  {fieldErrors.mvp && (
                    <span className="bo-field-error">
                      {fieldErrors.mvp}
                    </span>
                  )}

                  <small>
                    Clearly define the minimum viable
                    scope for the first release.
                  </small>

                </div>

              </section>

              {/* =================================================
                  SECTION 4
                  ================================================= */}

              <section className="bo-create-section">

                <div className="bo-create-section-header">

                  <div className="bo-create-section-icon green">

                    <Icon
                      name="check"
                      size={19}
                    />

                  </div>

                  <div>

                    <span>
                      SECTION 04
                    </span>

                    <h2>
                      Expected Benefits & Success
                    </h2>

                    <p>
                      Explain how success will
                      be measured.
                    </p>

                  </div>

                </div>

                <div className="bo-create-form-grid">

                  <div className="bo-create-field">

                    <label htmlFor="expectedBenefits">
                      Expected Benefits
                    </label>

                    <textarea
                      id="expectedBenefits"
                      name="expectedBenefits"
                      value={
                        form.expectedBenefits
                      }
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder="What benefits will the organization receive?"
                      rows={5}
                    />

                  </div>

                  <div
                    className={`bo-create-field ${
                      fieldErrors.successMetrics
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="successMetrics">
                      Success Metrics
                      <span>*</span>
                    </label>

                    <textarea
                      id="successMetrics"
                      name="successMetrics"
                      value={
                        form.successMetrics
                      }
                      onChange={handleChange}
                      className="aaib-textarea"
                      placeholder="How will you know the project has been successful?"
                      rows={5}
                      required
                    />

                    {fieldErrors.successMetrics && (
                      <span className="bo-field-error">
                        {fieldErrors.successMetrics}
                      </span>
                    )}

                  </div>

                </div>

              </section>

              {/* =================================================
                  SECTION 5
                  ================================================= */}

              <section className="bo-create-section">

                <div className="bo-create-section-header">

                  <div className="bo-create-section-icon gold">

                    <Icon
                      name="calendar"
                      size={19}
                    />

                  </div>

                  <div>

                    <span>
                      SECTION 05
                    </span>

                    <h2>
                      Timeline & Budget
                    </h2>

                    <p>
                      Provide the expected project
                      timeline and estimated budget.
                    </p>

                  </div>

                </div>

                <div className="bo-timeline-grid">

                  <div className="bo-create-field">

                    <label htmlFor="start_date">
                      Expected Start Date
                    </label>

                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={form.start_date}
                      onChange={handleChange}
                      className="aaib-input"
                    />

                  </div>

                  <div
                    className={`bo-create-field ${
                      fieldErrors.end_date
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="end_date">
                      Expected Delivery Date
                    </label>

                    <input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={form.end_date}
                      onChange={handleChange}
                      className="aaib-input"
                    />

                    {fieldErrors.end_date && (
                      <span className="bo-field-error">
                        {fieldErrors.end_date}
                      </span>
                    )}

                  </div>

                  <div
                    className={`bo-create-field ${
                      fieldErrors.budget
                        ? 'bo-field-has-error'
                        : ''
                    }`}
                  >

                    <label htmlFor="budget">
                      Estimated Budget
                    </label>

                    <div className="bo-budget-input">

                      <span>
                        EGP
                      </span>

                      <input
                        id="budget"
                        name="budget"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.budget}
                        onChange={handleChange}
                        className="aaib-input"
                        placeholder="0.00"
                      />

                      {fieldErrors.budget && (
                        <span className="bo-field-error">
                          {fieldErrors.budget}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  SECTION 6 — BRD
                  ================================================= */}

              <section className="bo-create-section">

                <div className="bo-create-section-header">

                  <div className="bo-create-section-icon gold">

                    <Icon
                      name="file"
                      size={19}
                    />

                  </div>

                  <div>

                    <span>
                      SECTION 06
                    </span>

                    <h2>
                      Business Requirements
                      Document
                    </h2>

                    <p>
                      Attach the BRD so the PO
                      can review the complete
                      business requirements.
                    </p>

                  </div>

                </div>

                <div
                  id="brd-upload-area"
                  className={`bo-brd-upload ${
                    brdFile
                      ? 'has-file'
                      : ''
                  } ${
                    fieldErrors.brd
                      ? 'bo-brd-has-error'
                      : ''
                  }`}
                >

                  {!brdFile ? (

                    <>

                      <div className="bo-brd-upload-icon">

                        <Icon
                          name="upload"
                          size={24}
                        />

                      </div>

                      <h3>
                        Upload your BRD
                      </h3>

                      <p>
                        PDF, DOC or DOCX
                        files up to 10 MB.
                      </p>

                      <label
                        htmlFor="brd-upload"
                        className="bo-upload-button"
                      >

                        <Icon
                          name="upload"
                          size={15}
                        />

                        Choose File

                      </label>

                      <input
                        id="brd-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        hidden
                      />

                      <small>
                        The BRD is required before
                        submission to the PO.
                      </small>

                    </>

                  ) : (

                    <div className="bo-uploaded-file">

                      <div className="bo-uploaded-file-icon">

                        <Icon
                          name="file"
                          size={20}
                        />

                      </div>

                      <div className="bo-uploaded-file-info">

                        <strong>
                          {brdFile.name}
                        </strong>

                        <span>
                          {(
                            brdFile.size /
                            1024 /
                            1024
                          ).toFixed(2)}{' '}
                          MB
                        </span>

                      </div>

                      <div className="bo-uploaded-file-actions">

                        <label
                          htmlFor="brd-upload-replace"
                          className="bo-replace-file"
                        >
                          Replace
                        </label>

                        <button
                          type="button"
                          className="bo-remove-file"
                          onClick={removeBrd}
                        >
                          Remove
                        </button>

                      </div>

                      <input
                        id="brd-upload-replace"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        hidden
                      />

                    </div>

                  )}

                  {fieldErrors.brd && (
                    <span className="bo-field-error bo-brd-error">
                      {fieldErrors.brd}
                    </span>
                  )}

                </div>

              </section>

              {/* =================================================
                  SUBMISSION PREVIEW
                  ================================================= */}

              {/* <section className="bo-submit-preview">

                <div className="bo-submit-preview-icon">

                  <Icon
                    name="arrow"
                    size={20}
                  />

                </div>

                <div>

                  <span>
                    READY FOR REVIEW
                  </span>

                  <h3>
                    Submit this project
                    to the PO
                  </h3>

                  <p>
                    Once submitted, the project
                    will enter{' '}
                    <strong>
                      Pending PO Review
                    </strong>{' '}
                    status and become available
                    to the Product Owner.
                  </p>

                </div>

              </section> */}

              {/* =================================================
                  ACTIONS
                  ================================================= */}

              <div className="bo-create-actions">

                <button
                  type="button"
                  className="aaib-btn aaib-btn-secondary"
                  onClick={() =>
                    navigate('/bo/projects')
                  }
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="aaib-btn aaib-btn-primary bo-submit-button"
                  disabled={isSubmitting}
                >

                  <Icon
                    name="arrow"
                    size={16}
                  />

                  {isSubmitting
                    ? 'Submitting...'
                    : 'Submit to PO'}

                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

      {/* =====================================================
          PAGE CSS
          ====================================================== */}

      <style>
        {`

        /* ==================================================
           HEADER
           ================================================== */

        .bo-create-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 18px;
        }

        .bo-back-link {
          display: inline-flex;
          align-items: center;

          padding: 0;
          margin-bottom: 12px;

          border: 0;
          background: transparent;

          color: var(--aaib-text-muted);

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-back-link:hover {
          color: var(--aaib-primary);
        }

        .bo-create-eyebrow {
          color: var(--aaib-accent);

          font-size: 9px;
          font-weight: 800;

          letter-spacing: .14em;
        }

        .bo-create-header h1 {
          margin: 4px 0 5px;

          color: var(--aaib-primary);

          font-size: 28px;
          line-height: 1.15;

          letter-spacing: -.03em;
        }

        .bo-create-header p {
          margin: 0;

          color: var(--aaib-text-muted);

          font-size: 12px;
        }


        /* ==================================================
           WORKFLOW
           ================================================== */

        .bo-create-workflow {
          display: flex;
          align-items: center;

          padding: 12px 15px;

          margin-bottom: 15px;

          background: #fff;

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius);

          box-shadow:
            var(--aaib-shadow-card);
        }

        .bo-create-step {
          display: flex;
          align-items: center;

          gap: 8px;

          min-width: 0;
        }

        .bo-create-step-number {
  width: 27px;
  height: 27px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 50%;

  background: #eef1ef;

  color: #75827b;

  font-size: 10px;
  font-weight: 800;
}

/* Keep ALL step numbers identical */
.bo-create-step.active .bo-create-step-number {
  background: #eef1ef;
  color: #75827b;
}

        .bo-create-step strong {
          display: block;

          color:
            var(--aaib-primary);

          font-size: 10px;
        }

        .bo-create-step span {
          display: block;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-create-step-line {
          flex: 1;

          height: 1px;

          margin: 0 15px;

          background:
            var(--aaib-border);
        }


        /* ==================================================
           FIELD VALIDATION
           ================================================== */

        .bo-field-error {
          display: block;
          margin-top: 6px;

          color: #c93a3a;

          font-size: 9px;
          font-weight: 600;
          line-height: 1.35;
        }

        .bo-field-has-error .aaib-input,
        .bo-field-has-error .aaib-textarea {
          border-color: #c93a3a !important;

          box-shadow:
            0 0 0 1px rgba(201, 58, 58, 0.08);
        }

        .bo-field-has-error .aaib-input:focus,
        .bo-field-has-error .aaib-textarea:focus {
          border-color: #c93a3a !important;

          box-shadow:
            0 0 0 3px rgba(201, 58, 58, 0.10);
        }

        .bo-brd-has-error {
          border-color: #c93a3a !important;

          box-shadow:
            0 0 0 1px rgba(201, 58, 58, 0.08);
        }

        .bo-brd-error {
          text-align: center;
        }


        /* ==================================================
           MESSAGES
           ================================================== */

        .bo-create-message {
          display: flex;
          align-items: center;

          gap: 9px;

          margin-bottom: 14px;

          padding: 10px 13px;

          border-radius: 9px;

          font-size: 11px;
        }

        .bo-create-message.error {
          color:
            var(--aaib-danger);

          background:
            var(--aaib-danger-soft);

          border:
            1px solid
            rgba(201,58,58,.16);
        }

        .bo-create-message.success {
          color:
            var(--aaib-success);

          background:
            var(--aaib-success-soft);

          border:
            1px solid
            rgba(46,125,50,.15);
        }


        /* ==================================================
           SECTIONS
           ================================================== */

        .bo-create-section {
          margin-bottom: 15px;

          padding: 22px;

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

        .bo-create-section-header {
          display: flex;
          align-items: flex-start;

          gap: 11px;

          margin-bottom: 19px;

          padding-bottom: 15px;

          border-bottom:
            1px solid
            var(--aaib-border);
        }

        .bo-create-section-icon {
          width: 35px;
          height: 35px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 9px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        /* GOLD = used for Section 1 */
        .bo-create-section-icon.gold {
          color: #9b771e;

          background:
            var(--aaib-accent-soft);
        }

        .bo-create-section-icon.green {
          color:
            var(--aaib-success);

          background:
            var(--aaib-success-soft);
        }

        .bo-create-section-header > div:last-child {
          min-width: 0;
        }

        .bo-create-section-header span {
          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .12em;
        }

        .bo-create-section-header h2 {
          margin: 3px 0 3px;

          color:
            var(--aaib-primary);

          font-size: 17px;

          letter-spacing: -.02em;
        }

        .bo-create-section-header p {
          margin: 0;

          color:
            var(--aaib-text-muted);

          font-size: 10px;
        }


        /* ==================================================
           FORM GRID
           ================================================== */

        .bo-create-form-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 16px;
        }

        .bo-create-field {
          min-width: 0;
        }

        .bo-create-field.full {
          grid-column:
            1 / -1;
        }

        .bo-create-field label {
          display: block;

          margin-bottom: 7px;

          color:
            var(--aaib-primary);

          font-size: 11px;
          font-weight: 700;
        }

        .bo-create-field label span {
          margin-left: 3px;

          color:
            var(--aaib-danger);
        }

        .bo-create-field small {
          display: block;

          margin-top: 5px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-create-field textarea {
          min-height: 112px;
        }


        /* ==================================================
           REQUIREMENTS
           ================================================== */

        .bo-requirement-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 14px;

          margin-bottom: 16px;
        }

        .bo-requirement-card {
          padding: 15px;

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius-sm);

          background:
            var(--aaib-surface-alt);
        }

        .bo-requirement-card.must {
          border-top:
            3px solid
            var(--aaib-primary);
        }

        .bo-requirement-card.nice {
          border-top:
            3px solid
            var(--aaib-accent);
        }

        .bo-requirement-header {
          display: flex;

          justify-content:
            space-between;

          align-items:
            flex-start;

          gap: 10px;

          margin-bottom: 11px;
        }

        .bo-requirement-header span {
          display: block;

          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .11em;
        }

        .bo-requirement-card.must
        .bo-requirement-header span {
          color:
            var(--aaib-primary);
        }

        .bo-requirement-header h3 {
          margin: 2px 0 0;

          color:
            var(--aaib-primary);

          font-size: 12px;
        }

        .bo-requirement-count {
          width: 28px;
          height: 28px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 8px;

          background: #fff;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
          font-weight: 800;
        }

        .bo-mvp-field {
          margin-top: 2px;
        }


        /* ==================================================
           TIMELINE
           ================================================== */

        .bo-timeline-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 14px;
        }

        .bo-budget-input {
          position: relative;
        }

        .bo-budget-input > span {
          position: absolute;

          left: 12px;
          top: 50%;

          transform:
            translateY(-50%);

          z-index: 2;

          color:
            var(--aaib-text-muted);

          font-size: 10px;
          font-weight: 700;
        }

        .bo-budget-input .aaib-input {
          padding-left: 43px;
        }


        /* ==================================================
           BRD
           ================================================== */

        .bo-brd-upload {
          min-height: 190px;

          display: grid;
          place-items: center;
          align-content: center;

          padding: 22px;

          border:
            1px dashed
            rgba(27,40,30,.18);

          border-radius:
            var(--aaib-radius);

          background:
            #fbfcfb;

          text-align: center;
        }

        .bo-brd-upload-icon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          margin-bottom: 9px;

          border-radius: 12px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-brd-upload h3 {
          margin: 0 0 4px;

          color:
            var(--aaib-primary);

          font-size: 14px;
        }

        .bo-brd-upload p {
          margin: 0 0 14px;

          color:
            var(--aaib-text-muted);

          font-size: 10px;
        }

        .bo-upload-button {
          display: inline-flex;
          align-items: center;

          gap: 7px;

          padding: 9px 13px;

          border-radius: 8px;

          background:
            var(--aaib-primary);

          color:
            #fff;

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;

          transition:
            all .2s ease;
        }

        .bo-upload-button:hover {
          background:
            var(--aaib-primary-strong);

          transform:
            translateY(-1px);
        }

        .bo-brd-upload > small {
          display: block;

          margin-top: 10px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-brd-upload.has-file {
          min-height: auto;

          display: block;

          padding: 14px;

          background:
            var(--aaib-surface-alt);

          border-style: solid;
        }

        .bo-uploaded-file {
          display: flex;
          align-items: center;

          gap: 11px;
        }

        .bo-uploaded-file-icon {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border-radius: 9px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-uploaded-file-info {
          min-width: 0;
          flex: 1;

          text-align: left;
        }

        .bo-uploaded-file-info strong {
          display: block;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color:
            var(--aaib-primary);

          font-size: 11px;
        }

        .bo-uploaded-file-info span {
          display: block;

          margin-top: 3px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-uploaded-file-actions {
          display: flex;

          gap: 6px;
        }

        .bo-replace-file,
        .bo-remove-file {
          border: 0;

          background: transparent;

          font-size: 9px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-replace-file {
          color:
            var(--aaib-primary);
        }

        .bo-remove-file {
          color:
            var(--aaib-danger);
        }


        /* ==================================================
           SUBMISSION PREVIEW
           ================================================== */

        .bo-submit-preview {
          position: relative;

          display: flex;
          align-items: center;

          gap: 13px;

          margin-bottom: 14px;

          padding: 16px 18px;

          border-radius:
            var(--aaib-radius);

          background:
            var(--aaib-primary);

          color: #fff;

          overflow: hidden;
        }

        .bo-submit-preview::after {
          content: '';

          position: absolute;

          width: 160px;
          height: 160px;

          right: -75px;
          top: -85px;

          border:
            1px solid
            rgba(197,160,89,.22);

          border-radius: 50%;
        }

        .bo-submit-preview-icon {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border:
            1px solid
            rgba(197,160,89,.35);

          border-radius: 10px;

          color:
            var(--aaib-accent);

          background:
            rgba(197,160,89,.08);
        }

        .bo-submit-preview span {
          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .12em;
        }

        .bo-submit-preview h3 {
          margin: 3px 0 3px;

          font-size: 14px;
        }

        .bo-submit-preview p {
          margin: 0;

          color:
            rgba(255,255,255,.72);

          font-size: 10px;
        }


        /* ==================================================
           ACTIONS
           ================================================== */

        .bo-create-actions {
          display: flex;

          justify-content: flex-end;

          align-items: center;

          gap: 10px;

          padding: 5px 0 25px;
        }

        .bo-submit-button {
          min-width: 145px;
        }


        /* ==================================================
           RESPONSIVE
           ================================================== */

        @media (max-width: 900px) {

          .bo-create-form-grid {
            grid-template-columns: 1fr;
          }

          .bo-timeline-grid {
            grid-template-columns: 1fr;
          }

          .bo-requirement-grid {
            grid-template-columns: 1fr;
          }

          .bo-create-step-line {
            margin: 0 8px;
          }

        }

        @media (max-width: 700px) {

          .bo-create-workflow {
            overflow-x: auto;
          }

          .bo-create-step {
            flex: 0 0 auto;
          }

          .bo-create-section {
            padding: 17px;
          }

          .bo-uploaded-file {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .bo-uploaded-file-actions {
            width: 100%;
            margin-left: 51px;
          }

          .bo-create-actions {
            flex-direction: column-reverse;
            align-items: stretch;
          }

          .bo-create-actions button {
            width: 100%;
          }

          .bo-submit-preview {
            align-items: flex-start;
          }

        }

        `}
      </style>

    </div>
  );
}