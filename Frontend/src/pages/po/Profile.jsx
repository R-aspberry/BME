import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { me } from '../../services/authService';
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

    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6" />
        <path d="M3 11h18M10 11v2h4v-2" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 19 6v5c0 4.7-2.9 8-7 10-4.1-2-7-5.3-7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    id: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8" cy="10" r="2" />
        <path d="M5.5 16a2.8 2.8 0 0 1 5 0M13 9h5M13 13h5" />
      </>
    ),

    building: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M3 21h18M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
      </>
    ),

    phone: (
      <path d="M6 3h3l2 5-2.2 1.5a15 15 0 0 0 5.7 5.7L16 13l5 2v3c0 1.1-.9 2-2 2C10.7 20 4 13.3 4 5a2 2 0 0 1 2-2Z" />
    ),

    calendarSmall: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M16 3v4M8 3v4M4 10h16" />
      </>
    ),

    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   HELPERS
========================================================= */

const getValue = (sources, keys, fallback = 'Not provided') => {
  for (const source of sources) {
    if (!source) continue;

    for (const key of keys) {
      const value = source?.[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
      ) {
        return value;
      }
    }
  }

  return fallback;
};

const getEmployeeId = (employee) =>
  getValue([employee], ['id', 'employeeId', 'ID'], null);

const getFullName = (employee, account) => {
  const firstName = getValue(
    [employee, account],
    ['fn', 'firstName', 'FirstName', 'first_name'],
    ''
  );

  const lastName = getValue(
    [employee, account],
    ['ln', 'lastName', 'LastName', 'last_name'],
    ''
  );

  const combined = [firstName, lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    combined ||
    getValue(
      [account, employee],
      ['name', 'userName', 'username'],
      'Product Owner'
    )
  );
};

const formatDate = (value) => {
  if (!value) return 'Not provided';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Profile() {
  const navigate = useNavigate();

  const [meInfo, setMeInfo] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';

  /* =======================================================
     LOAD PROFILE
  ======================================================== */

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const meData = await me();

        if (!mounted) return;

        setMeInfo(meData);

        /*
         * The current employee endpoint returns a list, so we use it
         * only to enrich the authenticated account when a matching
         * employee record is available.
         *
         * The page never invents missing values.
         */
        try {
          const employeeList = await getEmployees();

          if (!mounted) return;

          const currentId = getValue(
            [meData],
            ['id', 'employeeId', 'userId', 'user_ID', 'User_ID'],
            null
          );

          const match = Array.isArray(employeeList)
            ? employeeList.find((item) => {
                const employeeId = getEmployeeId(item);

                return (
                  currentId !== null &&
                  currentId !== undefined &&
                  employeeId !== null &&
                  String(employeeId) === String(currentId)
                );
              })
            : null;

          setEmployee(match || null);
        } catch {
          if (mounted) {
            setEmployee(null);
          }
        }
      } catch (error) {
        console.error('Failed to load PO profile:', error);

        if (mounted) {
          setHasError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     PROFILE VALUES
  ======================================================== */

  const displayName = useMemo(
    () => getFullName(employee, meInfo),
    [employee, meInfo]
  );

  const initials = useMemo(() => {
    const words = String(displayName || 'PO')
      .split(' ')
      .filter(Boolean);

    return (
      words
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'PO'
    );
  }, [displayName]);

  const role = getValue(
    [meInfo, employee],
    ['role', 'Role'],
    'Product Owner'
  );

  const firstName = getValue(
    [employee, meInfo],
    ['fn', 'firstName', 'FirstName', 'first_name'],
    'Not provided'
  );

  const lastName = getValue(
    [employee, meInfo],
    ['ln', 'lastName', 'LastName', 'last_name'],
    'Not provided'
  );

  const title = getValue(
    [employee, meInfo],
    ['title', 'Title', 'jobTitle'],
    'Not provided'
  );

  const dob = getValue(
    [employee, meInfo],
    ['dob', 'DOB', 'dateOfBirth', 'date_of_birth'],
    null
  );

  const email = getValue(
    [employee, meInfo],
    ['email', 'Email'],
    'Not provided'
  );

  const phone = getValue(
    [employee, meInfo],
    ['phone', 'Phone'],
    'Not provided'
  );

  const employeeId = getValue(
    [employee, meInfo],
    ['id', 'employeeId', 'ID'],
    'Not provided'
  );

  const userId = getValue(
    [meInfo, employee],
    ['userId', 'user_ID', 'User_ID', 'id'],
    'Not provided'
  );

  const managerId = getValue(
    [employee, meInfo],
    ['managerId', 'manager_ID', 'Manager_ID'],
    'Not provided'
  );

  const department = getValue(
    [employee, meInfo],
    ['departmentName', 'department', 'Department'],
    'Not provided'
  );

  const isOse = getValue(
    [employee, meInfo],
    ['isOse', 'is_OSE', 'Is_OSE'],
    'Not provided'
  );

  const hiringDate = getValue(
    [employee, meInfo],
    ['hiredDate', 'hired_Date', 'Hired_Date', 'hiringDate'],
    null
  );

  const vendorName = getValue(
    [employee, meInfo],
    ['vendorName', 'vendor_Name', 'Vendor_Name'],
    'Not provided'
  );

  const contractType = getValue(
    [employee, meInfo],
    [
      'typeOfContractId',
      'type_of_contract_ID',
      'Type_of_contract_ID',
      'contractTypeId',
    ],
    'Not provided'
  );

  const yearsExperience = getValue(
    [employee, meInfo],
    ['yearsOfExperience', 'years_OF_Experience', 'Years_OF_Experience'],
    'Not provided'
  );

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="po-profile-loading-page">
        <div className="po-profile-loading-card">
          <div className="po-profile-loading-avatar">
            <Icon name="profile" size={22} />
          </div>

          <strong>Loading Profile</strong>
          <span>Retrieving your account information...</span>
        </div>

        <style>
          {`
            .po-profile-loading-page {
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: 30px;
              background: var(--aaib-bg);
            }

            .po-profile-loading-card {
              width: min(430px, 100%);
              display: grid;
              justify-items: center;
              padding: 35px;
              border: 1px solid var(--aaib-border);
              border-radius: var(--aaib-radius);
              background: #fff;
              box-shadow: var(--aaib-shadow-card);
              text-align: center;
            }

            .po-profile-loading-avatar {
              width: 50px;
              height: 50px;
              display: grid;
              place-items: center;
              margin-bottom: 12px;
              border-radius: 13px;
              background: var(--aaib-primary-soft);
              color: var(--aaib-primary);
            }

            .po-profile-loading-card strong {
              color: var(--aaib-primary);
              font-size: 15px;
            }

            .po-profile-loading-card span {
              margin-top: 5px;
              color: var(--aaib-text-muted);
              font-size: 10px;
            }
          `}
        </style>
      </div>
    );
  }

  if (hasError || !meInfo) {
    return (
      <div className="po-profile-loading-page">
        <div className="po-profile-loading-card">
          <div className="po-profile-loading-avatar danger">!</div>

          <strong>Unable to load profile</strong>

          <span>
            Your Product Owner profile information could not be
            retrieved.
          </span>

          <button
            type="button"
            className="aaib-btn aaib-btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>

        <style>
          {`
            .po-profile-loading-avatar.danger {
              background: var(--aaib-danger-soft);
              color: var(--aaib-danger);
              font-weight: 800;
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
            aria-label="Close navigation"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="po-sidebar-section-label">
          Product Owner Portal
        </div>

        <nav className="po-nav">
                  <NavLink
                    to="/po/dashboard"
                    className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileSidebar}
                  >
                    <span className="po-nav-icon">
                      <Icon name="dashboard" />
                    </span>
                    <span className="po-nav-text">Dashboard</span>
                  </NavLink>
        
                  <NavLink
                    to="/po/project-requests"
                    className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileSidebar}
                  >
                    <span className="po-nav-icon">
                      <Icon name="requests" />
                    </span>
                    <span className="po-nav-text">Project Requests</span>
                  </NavLink>
        
                  <NavLink
                    to="/po/projects"
                    className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileSidebar}
                  >
                    <span className="po-nav-icon">
                      <Icon name="projects" />
                    </span>
                    <span className="po-nav-text">My Projects</span>
                  </NavLink>
        
                  <NavLink
                    to="/po/employees"
                    className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileSidebar}
                  >
                    <span className="po-nav-icon">
                      <Icon name="employees" />
                    </span>
                    <span className="po-nav-text">Employees</span>
                  </NavLink>
        
                  <NavLink
                    to="/po/notifications"
                    className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileSidebar}
                  >
                    <span className="po-nav-icon">
                      <Icon name="notifications" />
                    </span>
                    <span className="po-nav-text">Notifications</span>
                  </NavLink>
        
                  <NavLink
                    to="/po/calendar"
                    className={({ isActive }) => `po-nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileSidebar}
                  >
                    <span className="po-nav-icon">
                      <Icon name="calendar" />
                    </span>
                    <span className="po-nav-text">Calendar</span>
                  </NavLink>
        
                  <NavLink
          to="/po/resource-requests"
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
              aria-label="Notifications"
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
            {/* PAGE HEADING */}

            <div className="po-profile-page-heading">
              <div>
                <span className="po-profile-eyebrow">ACCOUNT</span>

                <h1>My Profile</h1>

                <p>
                  Review your Product Owner account and employment
                  information.
                </p>
              </div>
            </div>

            {/* PROFILE HERO */}

            <section className="po-profile-hero">
              <div className="po-profile-avatar">{initials}</div>

              <div className="po-profile-hero-info">
                <span>PRODUCT OWNER</span>

                <h2>{displayName}</h2>

                <p>{email}</p>
              </div>

              <div className="po-profile-role-badge">
                <Icon name="shield" size={14} />
                {role}
              </div>
            </section>

            {/* PERSONAL DETAILS */}

            <section className="po-profile-card po-profile-card-full">
              <div className="po-profile-card-header">
                <div className="po-profile-card-icon">
                  <Icon name="user" size={18} />
                </div>

                <div>
                  <span>PERSONAL INFORMATION</span>
                  <h2>Personal Details</h2>
                </div>
              </div>

              <div className="po-profile-info-grid">
                <div className="po-profile-info-item">
                  <span>FIRST NAME</span>
                  <strong>{firstName}</strong>
                </div>

                <div className="po-profile-info-item">
                  <span>LAST NAME</span>
                  <strong>{lastName}</strong>
                </div>

                <div className="po-profile-info-item">
                  <span>TITLE</span>
                  <strong>{title}</strong>
                </div>

                <div className="po-profile-info-item">
                  <span>DATE OF BIRTH</span>
                  <strong>{formatDate(dob)}</strong>
                </div>

                <div className="po-profile-info-item">
                  <span>EMAIL</span>
                  <strong className="po-profile-email">
                    <Icon name="mail" size={13} />
                    {email}
                  </strong>
                </div>

                <div className="po-profile-info-item">
                  <span>PHONE</span>
                  <strong className="po-profile-email">
                    <Icon name="phone" size={13} />
                    {phone}
                  </strong>
                </div>
              </div>
            </section>

            <div className="po-profile-grid">
              {/* ORGANISATION */}

              <section className="po-profile-card">
                <div className="po-profile-card-header">
                  <div className="po-profile-card-icon gold">
                    <Icon name="building" size={18} />
                  </div>

                  <div>
                    <span>ORGANISATION</span>
                    <h2>Organisational Details</h2>
                  </div>
                </div>

                <div className="po-profile-info-list">
                  <div className="po-profile-info-row">
                    <span>EMPLOYEE ID</span>
                    <strong>{employeeId}</strong>
                  </div>

                  <div className="po-profile-info-row">
                    <span>USER ID</span>
                    <strong>{userId}</strong>
                  </div>

                  <div className="po-profile-info-row">
                    <span>MANAGER ID</span>
                    <strong>{managerId}</strong>
                  </div>

                  <div className="po-profile-info-row">
                    <span>DEPARTMENT</span>
                    <strong>{department}</strong>
                  </div>

                  <div className="po-profile-info-row">
                    <span>IS OSE</span>
                    <strong>{String(isOse)}</strong>
                  </div>
                </div>
              </section>

              {/* EMPLOYMENT */}

              <section className="po-profile-card">
                <div className="po-profile-card-header">
                  <div className="po-profile-card-icon green">
                    <Icon name="briefcase" size={18} />
                  </div>

                  <div>
                    <span>EMPLOYMENT</span>
                    <h2>Employment Details</h2>
                  </div>
                </div>

                <div className="po-profile-info-list">
                  <div className="po-profile-info-row">
                    <span>HIRING DATE</span>
                    <strong>{formatDate(hiringDate)}</strong>
                  </div>

                  <div className="po-profile-info-row">
                    <span>VENDOR NAME</span>
                    <strong>{vendorName}</strong>
                  </div>

                  <div className="po-profile-info-row">
                    <span>TYPE OF CONTRACT ID</span>
                    <strong>{contractType}</strong>
                  </div>

                  <div className="po-profile-info-row">
                    <span>YEARS OF EXPERIENCE</span>
                    <strong>{String(yearsExperience)}</strong>
                  </div>
                </div>
              </section>
            </div>

            {/* PROFILE ACCESS / EDIT NOTE */}

            <section className="po-profile-access-card">
              <div className="po-profile-access-icon">
                <Icon name="shield" size={20} />
              </div>

              <div className="po-profile-access-content">
                <span>PROFILE ACCESS</span>

                <h2>Product Owner Account</h2>

                <p>
                  Your authenticated account is registered with the role{' '}
                  <strong>{role}</strong>.
                  Profile information shown here is retrieved from the
                  current account and employee services.
                </p>
              </div>

              <div className="po-profile-access-status">
                <span />
                Active
              </div>
            </section>

            {/* EDIT WORKFLOW PLACEHOLDER */}

            <section className="po-profile-edit-note">
              <div className="po-profile-edit-note-icon">
                <Icon name="edit" size={16} />
              </div>

              <div>
                <span>PROFILE UPDATES</span>
                <strong>Editable details are controlled by the account service.</strong>
                <p>
                  The current frontend services expose profile retrieval but
                  do not yet expose a confirmed update endpoint. No edit
                  operation is performed until the backend update API is
                  available.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <style>
        {`
          .po-profile-page-heading {
            margin-bottom: 20px;
          }

          .po-profile-eyebrow {
            display: block;
            color: var(--aaib-accent);
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .15em;
          }

          .po-profile-page-heading h1 {
            margin: 4px 0 5px;
            color: var(--aaib-primary);
            font-size: 28px;
            line-height: 1.15;
            letter-spacing: -.03em;
          }

          .po-profile-page-heading p {
            margin: 0;
            color: var(--aaib-text-muted);
            font-size: 12px;
          }

          .po-profile-hero {
            display: flex;
            align-items: center;
            gap: 17px;
            margin-bottom: 17px;
            padding: 22px 24px;
            border-radius: var(--aaib-radius);
            background: linear-gradient(135deg, #192d20 0%, #294535 100%);
            box-shadow: 0 10px 25px rgba(27,40,30,.12);
          }

          .po-profile-avatar {
            width: 62px;
            height: 62px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 15px;
            background: rgba(197,160,89,.12);
            border: 1px solid rgba(197,160,89,.28);
            color: var(--aaib-accent);
            font-size: 19px;
            font-weight: 800;
          }

          .po-profile-hero-info {
            min-width: 0;
            flex: 1;
          }

          .po-profile-hero-info > span {
            display: block;
            color: var(--aaib-accent);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .14em;
          }

          .po-profile-hero-info h2 {
            margin: 3px 0 4px;
            overflow: hidden;
            color: #fff;
            font-size: 21px;
            line-height: 1.2;
            letter-spacing: -.025em;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-profile-hero-info p {
            margin: 0;
            overflow: hidden;
            color: rgba(255,255,255,.62);
            font-size: 9px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-profile-role-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            flex: 0 0 auto;
            min-height: 27px;
            padding: 0 10px;
            border: 1px solid rgba(197,160,89,.28);
            border-radius: 999px;
            background: rgba(197,160,89,.1);
            color: #efd694;
            font-size: 8px;
            font-weight: 800;
          }

          .po-profile-card {
            min-width: 0;
            padding: 20px;
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            background: var(--aaib-surface);
            box-shadow: var(--aaib-shadow-card);
          }

          .po-profile-card-full {
            margin-bottom: 13px;
          }

          .po-profile-card-header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 16px;
          }

          .po-profile-card-icon {
            width: 34px;
            height: 34px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 9px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-profile-card-icon.gold {
            background: var(--aaib-accent-soft);
            color: #9b771f;
          }

          .po-profile-card-icon.green {
            background: var(--aaib-success-soft);
            color: var(--aaib-success);
          }

          .po-profile-card-header span {
            display: block;
            color: var(--aaib-accent);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .12em;
          }

          .po-profile-card-header h2 {
            margin: 3px 0 0;
            color: var(--aaib-primary);
            font-size: 16px;
          }

          .po-profile-info-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            border-top: 1px solid var(--aaib-border);
            border-left: 1px solid var(--aaib-border);
            border-radius: 9px;
            overflow: hidden;
          }

          .po-profile-info-item {
            min-width: 0;
            padding: 14px;
            border-right: 1px solid var(--aaib-border);
            border-bottom: 1px solid var(--aaib-border);
            background: #fff;
          }

          .po-profile-info-item span {
            display: block;
            margin-bottom: 6px;
            color: var(--aaib-text-muted);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .08em;
          }

          .po-profile-info-item strong {
            display: block;
            overflow: hidden;
            color: var(--aaib-text);
            font-size: 10px;
            line-height: 1.5;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-profile-email {
            display: inline-flex !important;
            align-items: center;
            gap: 5px;
            color: var(--aaib-primary) !important;
            word-break: break-word;
          }

          .po-profile-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 13px;
          }

          .po-profile-info-list {
            display: grid;
          }

          .po-profile-info-row {
            display: grid;
            grid-template-columns: minmax(105px, .7fr) minmax(0, 1.3fr);
            align-items: center;
            gap: 12px;
            padding: 11px 0;
            border-bottom: 1px solid var(--aaib-border);
          }

          .po-profile-info-row:first-child {
            padding-top: 0;
          }

          .po-profile-info-row:last-child {
            padding-bottom: 0;
            border-bottom: 0;
          }

          .po-profile-info-row > span {
            color: var(--aaib-text-muted);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .07em;
          }

          .po-profile-info-row > strong {
            overflow: hidden;
            color: var(--aaib-text);
            font-size: 9px;
            font-weight: 700;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .po-profile-access-card {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-top: 13px;
            padding: 15px 17px;
            border: 1px solid var(--aaib-border);
            border-radius: var(--aaib-radius);
            background: var(--aaib-surface);
            box-shadow: var(--aaib-shadow-card);
          }

          .po-profile-access-icon {
            width: 38px;
            height: 38px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: var(--aaib-primary-soft);
            color: var(--aaib-primary);
          }

          .po-profile-access-content {
            min-width: 0;
            flex: 1;
          }

          .po-profile-access-content > span,
          .po-profile-edit-note > div:last-child > span {
            display: block;
            margin-bottom: 3px;
            color: var(--aaib-accent);
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .11em;
          }

          .po-profile-access-content h2 {
            margin: 0 0 4px;
            color: var(--aaib-primary);
            font-size: 12px;
          }

          .po-profile-access-content p {
            max-width: 700px;
            margin: 0;
            color: var(--aaib-text-muted);
            font-size: 8px;
            line-height: 1.5;
          }

          .po-profile-access-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            flex: 0 0 auto;
            color: var(--aaib-success);
            font-size: 8px;
            font-weight: 800;
          }

          .po-profile-access-status span {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--aaib-success);
          }

          .po-profile-edit-note {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-top: 13px;
            padding: 13px 15px;
            border-left: 3px solid var(--aaib-accent);
            border-radius: 8px;
            background: var(--aaib-accent-soft);
          }

          .po-profile-edit-note-icon {
            width: 29px;
            height: 29px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 8px;
            background: rgba(255,255,255,.55);
            color: #8a6a1b;
          }

          .po-profile-edit-note strong {
            display: block;
            margin-bottom: 3px;
            color: var(--aaib-primary);
            font-size: 9px;
          }

          .po-profile-edit-note p {
            max-width: 850px;
            margin: 0;
            color: #7b6b3e;
            font-size: 8px;
            line-height: 1.5;
          }

          @media (max-width: 900px) {
            .po-profile-info-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .po-profile-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 650px) {
            .po-profile-hero {
              align-items: flex-start;
              flex-wrap: wrap;
            }

            .po-profile-role-badge {
              margin-left: 79px;
            }

            .po-profile-info-grid {
              grid-template-columns: 1fr;
            }

            .po-profile-card {
              padding: 16px;
            }

            .po-profile-access-card {
              align-items: flex-start;
              flex-wrap: wrap;
            }

            .po-profile-access-status {
              margin-left: 51px;
            }

            .po-profile-info-row {
              grid-template-columns: 1fr;
              gap: 4px;
            }

            .po-profile-info-row > strong {
              text-align: left;
            }
          }
        `}
      </style>
    </div>
  );
}
