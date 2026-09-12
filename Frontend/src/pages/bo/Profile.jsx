import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getBOS, getBO } from '../../services/boService';
import { me } from '../../services/authService';

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

    briefcase: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6" />
        <path d="M3 11h18" />
        <path d="M10 11v2h4v-2" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 19 6v5c0 4.7-2.9 8-7 10-4.1-2-7-5.3-7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

const getDisplayName = (meInfo, bo) => {
  return (
    bo?.name ||
    meInfo?.userName ||
    meInfo?.username ||
    'Business Owner'
  );
};

const getInitials = (name) => {
  return (
    String(name || 'BO')
      .charAt(0)
      .toUpperCase() || 'BO'
  );
};

const getBusinessArea = (bo) => {
  return (
    bo?.business_Area ||
    bo?.businessArea ||
    bo?.Business_Area ||
    'Not provided'
  );
};

const getEmail = (meInfo, bo) => {
  return (
    bo?.email ||
    bo?.Email ||
    meInfo?.email ||
    meInfo?.Email ||
    'Not provided'
  );
};

const findMatchingBO = (list, meInfo) => {
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }

  const meId =
    meInfo?.id ??
    meInfo?.userId ??
    meInfo?.user_ID ??
    meInfo?.User_ID;

  if (meId == null) {
    return list[0];
  }

  const match = list.find((item) => {
    const boId =
      item?.id ??
      item?.BO_ID ??
      item?.boId ??
      item?.User_ID ??
      item?.user_ID;

    return boId != null && String(boId) === String(meId);
  });

  return match || list[0];
};

export default function Profile() {
  const navigate = useNavigate();

  const [meInfo, setMeInfo] = useState(null);
  const [bo, setBo] = useState(null);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const userName =
    localStorage.getItem('userName') || 'User';

  const displayName = useMemo(
    () => getDisplayName(meInfo, bo),
    [meInfo, bo]
  );

  const initials = useMemo(
    () => getInitials(displayName),
    [displayName]
  );

  const email = useMemo(
    () => getEmail(meInfo, bo),
    [meInfo, bo]
  );

  const businessArea = useMemo(
    () => getBusinessArea(bo),
    [bo]
  );

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const meData = await me();

        if (!mounted) return;

        setMeInfo(meData);

        try {
          const boList = await getBOS();

          if (!mounted) return;

          setBo(findMatchingBO(boList, meData));
        } catch {
          // Keep the user account information available
          // even if the BO-specific request fails.
          if (mounted) {
            setBo(null);
          }
        }
      } catch {
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

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="bo-profile-loading-page">
        <div className="bo-profile-loading-card">
          <div className="bo-profile-loading-avatar">
            <Icon name="profile" size={22} />
          </div>

          <strong>Loading Profile</strong>
          <span>Retrieving your account information...</span>
        </div>
      </div>
    );
  }

  if (hasError || !meInfo) {
    return (
      <div className="bo-profile-loading-page">
        <div className="bo-profile-loading-card">
          <div className="bo-profile-loading-avatar danger">
            !
          </div>

          <strong>Unable to load profile</strong>

          <span>
            Your profile information could not be retrieved.
          </span>

          <button
            className="aaib-btn aaib-btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="bo-sidebar">
        <div className="bo-sidebar-top">
          <div className="bo-sidebar-logo">
            <span className="aaib-logo-light" />
          </div>

          <button
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
            className="bo-mobile-close"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
            aria-label="Close navigation"
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
            className="bo-nav-item bo-logout"
            onClick={logout}
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

      {mobileSidebarOpen && (
        <div
          className="bo-sidebar-backdrop"
          onClick={closeMobileSidebar}
        />
      )}

      {/* =========================
          PAGE
      ========================== */}

      <div
        className={`bo-page ${
          sidebarCollapsed
            ? 'bo-page-collapsed'
            : ''
        }`}
      >
        <header className="bo-header">
          <div className="bo-header-left">
            <button
              className="bo-mobile-menu"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
            >
              <Icon name="menu" size={20} />
            </button>

            <div className="bo-header-title">
              Business Owner Portal
            </div>
          </div>

          <div className="bo-header-right">
            <button
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

        <main className="bo-main">
          <div className="bo-content">
            {/* PAGE HEADING */}

            <div className="bo-profile-page-heading">
              <div>
                <span className="bo-eyebrow">
                  ACCOUNT
                </span>

                <h1>
                  My Profile
                </h1>

                <p>
                  Manage and review your Business Owner
                  account information.
                </p>
              </div>
            </div>

            {/* PROFILE HERO */}

            <section className="bo-profile-hero">
              <div className="bo-profile-avatar">
                {initials}
              </div>

              <div className="bo-profile-hero-info">
                <span>
                  BUSINESS OWNER
                </span>

                <h2>
                  {displayName}
                </h2>

                <p>
                  {email}
                </p>
              </div>

              <div className="bo-profile-role-badge">
                <Icon name="shield" size={14} />
                {meInfo.role || 'BO'}
              </div>
            </section>

            {/* INFORMATION GRID */}

            <div className="bo-profile-grid">
              {/* ACCOUNT */}

              <section className="bo-profile-card">
                <div className="bo-profile-card-header">
                  <div className="bo-profile-card-icon">
                    <Icon
                      name="user"
                      size={18}
                    />
                  </div>

                  <div>
                    <span>
                      ACCOUNT INFORMATION
                    </span>

                    <h2>
                      Account Details
                    </h2>
                  </div>
                </div>

                <div className="bo-profile-info-list">
                  <div className="bo-profile-info-row">
                    <span>
                      USERNAME
                    </span>

                    <strong>
                      {meInfo.userName ||
                        meInfo.username ||
                        userName}
                    </strong>
                  </div>

                  <div className="bo-profile-info-row">
                    <span>
                      EMAIL
                    </span>

                    <strong>
                      {email}
                    </strong>
                  </div>

                  <div className="bo-profile-info-row">
                    <span>
                      ROLE
                    </span>

                    <strong>
                      {meInfo.role ||
                        'Business Owner'}
                    </strong>
                  </div>
                </div>
              </section>

              {/* BUSINESS OWNER */}

              <section className="bo-profile-card">
                <div className="bo-profile-card-header">
                  <div className="bo-profile-card-icon gold">
                    <Icon
                      name="briefcase"
                      size={18}
                    />
                  </div>

                  <div>
                    <span>
                      BUSINESS PROFILE
                    </span>

                    <h2>
                      Business Owner Details
                    </h2>
                  </div>
                </div>

                {bo ? (
                  <div className="bo-profile-info-list">
                    <div className="bo-profile-info-row">
                      <span>
                        NAME
                      </span>

                      <strong>
                        {bo.name ||
                          displayName}
                      </strong>
                    </div>

                    {/* <div className="bo-profile-info-row">
                      <span>
                        EMAIL
                      </span>

                      <strong>
                        {bo.email ||
                          email}
                      </strong>
                    </div> */}

                    <div className="bo-profile-info-row">
                      <span>
                        BUSINESS AREA
                      </span>

                      <strong>
                        {businessArea}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className="bo-profile-empty">
                    <Icon
                      name="briefcase"
                      size={18}
                    />

                    <span>
                      No Business Owner record was found.
                    </span>
                  </div>
                )}
              </section>
            </div>

            {/* ROLE / ACCESS */}

            <section className="bo-profile-access-card">
              <div className="bo-profile-access-icon">
                <Icon
                  name="shield"
                  size={20}
                />
              </div>

              <div className="bo-profile-access-content">
                <span>
                  PORTAL ACCESS
                </span>

                <h2>
                  Business Owner Access
                </h2>

                <p>
                  Your account is currently registered
                  with the role{' '}
                  <strong>
                    {meInfo.role ||
                      'Business Owner'}
                  </strong>
                  .
                </p>
              </div>

              <div className="bo-profile-access-status">
                <span />
                Active
              </div>
            </section>

            {/* QUICK ACTIONS */}

            <section className="bo-profile-quick-card">
              <div>
                <span>
                  QUICK ACTIONS
                </span>

                <h2>
                  Continue Working
                </h2>

                <p>
                  Access the main areas of your Business
                  Owner workspace.
                </p>
              </div>

              <div className="bo-profile-quick-actions">
                <button
                  type="button"
                  className="bo-profile-quick-action"
                  onClick={() =>
                    navigate('/bo/projects')
                  }
                >
                  <Icon
                    name="projects"
                    size={16}
                  />

                  My Projects

                  <Icon
                    name="arrow"
                    size={13}
                  />
                </button>

                <button
                  type="button"
                  className="bo-profile-quick-action"
                  onClick={() =>
                    navigate('/bo/calendar')
                  }
                >
                  <Icon
                    name="calendar"
                    size={16}
                  />

                  Calendar

                  <Icon
                    name="arrow"
                    size={13}
                  />
                </button>

                <button
                  type="button"
                  className="bo-profile-quick-action"
                  onClick={() =>
                    navigate('/bo/projects/create')
                  }
                >
                  <Icon
                    name="create"
                    size={16}
                  />

                  Create Project

                  <Icon
                    name="arrow"
                    size={13}
                  />
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}