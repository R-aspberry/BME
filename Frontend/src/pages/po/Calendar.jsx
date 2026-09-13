import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
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

    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="M11 18l-6-6 6-6" />
      </>
    ),

    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
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

    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M7 7l1 14h8l1-14" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),

    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

/* =========================================================
   CALENDAR HELPERS
========================================================= */

const monthFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
});

const dayFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const shortMonthFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
});

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);

  const startingDay =
    firstDay.getDay() === 0
      ? 6
      : firstDay.getDay() - 1;

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  const previousMonthDays =
    new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = startingDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(
        year,
        month - 1,
        previousMonthDays - i
      ),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (cells.length < 42) {
    cells.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });

    nextDay++;
  }

  return cells;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function POCalendar() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
  );

  const [selectedDate, setSelectedDate] =
    useState(null);

  /* =======================================================
     REMINDERS
  ======================================================== */

  const [reminders, setReminders] = useState([]);

  const [showReminderForm, setShowReminderForm] =
    useState(false);

  const [editingReminderId, setEditingReminderId] =
    useState(null);

  const [reminderForm, setReminderForm] =
    useState({
      title: '',
      date: '',
      time: '',
      type: 'To-do',
      notes: '',
    });

  const userName =
    localStorage.getItem('userName') || 'User';

  /* =======================================================
     LOAD PROJECTS
  ======================================================== */

  useEffect(() => {
    setIsLoading(true);

    getProjects()
      .then((data) => {
        setProjects(data || []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /* =======================================================
     LOAD REMINDERS
  ======================================================== */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          'po_calendar_reminders'
        );

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setReminders(parsed);
        }
      }
    } catch {
      setReminders([]);
    }
  }, []);

  /* =======================================================
     SAVE REMINDERS
  ======================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        'po_calendar_reminders',
        JSON.stringify(reminders)
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [reminders]);

  /* =======================================================
     USER INFO
  ======================================================== */

  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /* =======================================================
     CALENDAR DATA
  ======================================================== */

  const calendarDays = useMemo(() => {
    return getMonthDays(
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    );
  }, [currentMonth]);

  /*
    Project delivery events
  */
  const datedProjects = useMemo(() => {
    return projects
      .map((project) => {
        const date = parseDate(
          project.expectedDeliveryDate ||
            project.end_date ||
            project.endDate ||
            project.End_date ||
            project.EndDate
        );

        if (!date) {
          return null;
        }

        return {
          ...project,
          eventDate: date,
          dateKey: getDateKey(date),
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          a.eventDate.getTime() -
          b.eventDate.getTime()
      );
  }, [projects]);

  /*
    Group project events by date
  */
  const projectEventsByDate = useMemo(() => {
    const grouped = {};

    datedProjects.forEach((project) => {
      if (!grouped[project.dateKey]) {
        grouped[project.dateKey] = [];
      }

      grouped[project.dateKey].push(project);
    });

    return grouped;
  }, [datedProjects]);

  /*
    Group reminders by date
  */
  const remindersByDate = useMemo(() => {
    const grouped = {};

    reminders.forEach((reminder) => {
      if (!reminder.date) return;

      if (!grouped[reminder.date]) {
        grouped[reminder.date] = [];
      }

      grouped[reminder.date].push(reminder);
    });

    return grouped;
  }, [reminders]);

  /* =======================================================
     MONTH EVENTS
  ======================================================== */

  const monthProjectEvents = useMemo(() => {
    return datedProjects.filter((project) => {
      return (
        project.eventDate.getFullYear() ===
          currentMonth.getFullYear() &&
        project.eventDate.getMonth() ===
          currentMonth.getMonth()
      );
    });
  }, [datedProjects, currentMonth]);

  const monthReminders = useMemo(() => {
    return reminders.filter((reminder) => {
      if (!reminder.date) return false;

      const date = new Date(
        `${reminder.date}T12:00:00`
      );

      return (
        date.getFullYear() ===
          currentMonth.getFullYear() &&
        date.getMonth() ===
          currentMonth.getMonth()
      );
    });
  }, [reminders, currentMonth]);

  /* =======================================================
     UPCOMING PROJECT EVENTS
  ======================================================== */

  const upcomingProjects = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return datedProjects
      .filter(
        (project) =>
          project.eventDate >= today
      )
      .slice(0, 5);
  }, [datedProjects]);

  /* =======================================================
     UPCOMING REMINDERS
  ======================================================== */

  const upcomingReminders = useMemo(() => {
    const now = new Date();

    return reminders
      .map((reminder) => ({
        ...reminder,
        dateObject: reminder.date
          ? new Date(
              `${reminder.date}T${
                reminder.time || '23:59'
              }:00`
            )
          : null,
      }))
      .filter(
        (reminder) =>
          !reminder.dateObject ||
          reminder.dateObject >= now
      )
      .sort((a, b) => {
        if (!a.dateObject) return 1;
        if (!b.dateObject) return -1;

        return (
          a.dateObject.getTime() -
          b.dateObject.getTime()
        );
      })
      .slice(0, 5);
  }, [reminders]);

  /* =======================================================
     CALENDAR NAVIGATION
  ======================================================== */

  const changeMonth = (amount) => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + amount,
          1
        )
    );

    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setSelectedDate(getDateKey(today));
  };

  const isToday = (date) => {
    const today = new Date();

    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  };

  const formatUpcomingDate = (date) => {
    return {
      day: date.getDate(),
      month: shortMonthFormatter.format(date),
    };
  };

  const formatReminderDate = (dateString) => {
    const date = new Date(
      `${dateString}T12:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return 'No date';
    }

    return dayFormatter.format(date);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  /* =======================================================
     REMINDER FORM
  ======================================================== */

  const openNewReminder = () => {
    setEditingReminderId(null);

    setReminderForm({
      title: '',
      date: selectedDate || '',
      time: '',
      type: 'To-do',
      notes: '',
    });

    setShowReminderForm(true);
  };

  const openEditReminder = (reminder) => {
    setEditingReminderId(reminder.id);

    setReminderForm({
      title: reminder.title || '',
      date: reminder.date || '',
      time: reminder.time || '',
      type: reminder.type || 'To-do',
      notes: reminder.notes || '',
    });

    setShowReminderForm(true);
  };

  const closeReminderForm = () => {
    setShowReminderForm(false);
    setEditingReminderId(null);
  };

  const handleReminderChange = (e) => {
    const { name, value } = e.target;

    setReminderForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveReminder = (e) => {
    e.preventDefault();

    if (!reminderForm.title.trim()) {
      return;
    }

    if (!reminderForm.date) {
      return;
    }

    if (editingReminderId) {
      setReminders((previous) =>
        previous.map((reminder) =>
          reminder.id === editingReminderId
            ? {
                ...reminder,
                ...reminderForm,
                title:
                  reminderForm.title.trim(),
              }
            : reminder
        )
      );
    } else {
      const newReminder = {
        id: Date.now(),
        ...reminderForm,
        title:
          reminderForm.title.trim(),
        completed: false,
      };

      setReminders((previous) => [
        ...previous,
        newReminder,
      ]);
    }

    closeReminderForm();
  };

  const deleteReminder = (id) => {
    setReminders((previous) =>
      previous.filter(
        (reminder) => reminder.id !== id
      )
    );
  };

  const toggleReminder = (id) => {
    setReminders((previous) =>
      previous.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              completed: !reminder.completed,
            }
          : reminder
      )
    );
  };

  /* =======================================================
     REMINDER TYPE LABEL
  ======================================================== */

  const getReminderTypeClass = (type) => {
    if (type === 'Meeting') return 'meeting';
    if (type === 'Deadline') return 'deadline';
    return 'todo';
  };

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
      ==================================================== */}

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
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        <div className="bo-sidebar-section-label">
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

        <div className="bo-sidebar-bottom">
          <NavLink
            to="/po/profile"
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
      ==================================================== */}

      <div className="bo-page">

        {/* =================================================
            HEADER
        ================================================== */}

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

            <img
  src={aaibLogo}
  alt="AAIB"
  className="bo-header-aaib-logo"
/>

<div className="bo-header-title">
  Product Owner Portal
</div>
          </div>

          <div className="bo-header-right">
            <button
              className="bo-header-icon"
              onClick={() =>
                navigate(
                  '/po/notifications'
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
                navigate('/po/profile')
              }
            >
              <div className="bo-user-avatar">
                {initials}
              </div>

              <div className="bo-user-details">
                <strong>{userName}</strong>

                <span>
                  Product Owner
                </span>
              </div>

              <Icon name="chevron" size={15} />
            </div>
          </div>
        </header>

        {/* =================================================
            MAIN
        ================================================== */}

        <main className="bo-main">
          <div className="bo-content">

            {/* PAGE HEADER */}

            <div className="bo-calendar-page-header">
              <div>
                <div className="bo-calendar-eyebrow">
                  
                </div>

                <h1>
                  Calendar
                </h1>

                <p>
                </p>
              </div>
            </div>

            {/* =================================================
                MAIN CALENDAR AREA
            ================================================== */}

            <div className="bo-calendar-layout">

              {/* =================================================
                  CALENDAR
              ================================================== */}

              <section className="bo-calendar-card">

                <div className="bo-calendar-card-header">

                  <div>
                    <div className="bo-calendar-month">
                      {monthFormatter.format(
                        currentMonth
                      )}
                    </div>

                    <span>
                      {monthProjectEvents.length}{' '}
                      project{' '}
                      {monthProjectEvents.length ===
                      1
                        ? 'date'
                        : 'dates'}
                      {' · '}
                      {monthReminders.length}{' '}
                      reminder
                      {monthReminders.length ===
                      1
                        ? ''
                        : 's'}
                    </span>
                  </div>

                  <div className="bo-calendar-controls">


                    <button
                      className="bo-today-button"
                      onClick={goToToday}
                    >
                      Today
                    </button>

                    <button
                      onClick={() =>
                        changeMonth(-1)
                      }
                      aria-label="Previous month"
                    >
                      <Icon
                        name="arrowLeft"
                        size={16}
                      />
                    </button>

                    

                    <button
                      onClick={() =>
                        changeMonth(1)
                      }
                      aria-label="Next month"
                    >
                      <Icon
                        name="arrowRight"
                        size={16}
                      />
                    </button>

  
                  </div>
                </div>

                {/* LEGEND */}

                <div className="bo-calendar-legend">

                  <span>
                    <i className="project-dot" />
                    Project Delivery
                  </span>

                  <span>
                    <i className="reminder-dot" />
                    My Reminder
                  </span>

                  <span>
                    <i className="today-dot" />
                    Today
                  </span>

                </div>

                {/* WEEKDAYS */}

                <div className="bo-calendar-weekdays">
                  {[
                    'MON',
                    'TUE',
                    'WED',
                    'THU',
                    'FRI',
                    'SAT',
                    'SUN',
                  ].map((day) => (
                    <span key={day}>
                      {day}
                    </span>
                  ))}
                </div>

                {/* DAYS */}

                <div className="bo-calendar-days">

                  {calendarDays.map(
                    ({
                      date,
                      currentMonth: isCurrentMonth,
                    }) => {
                      const dateKey =
                        getDateKey(date);

                      const projectsForDate =
                        projectEventsByDate[
                          dateKey
                        ] || [];

                      const remindersForDate =
                        remindersByDate[
                          dateKey
                        ] || [];

                      const hasEvents =
                        projectsForDate.length >
                          0 ||
                        remindersForDate.length >
                          0;

                      const today =
                        isToday(date);

                      const selected =
                        selectedDate ===
                        dateKey;

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          className={`
                            bo-calendar-day
                            ${
                              !isCurrentMonth
                                ? 'muted'
                                : ''
                            }
                            ${
                              today
                                ? 'today'
                                : ''
                            }
                            ${
                              selected
                                ? 'selected'
                                : ''
                            }
                            ${
                              hasEvents
                                ? 'has-events'
                                : ''
                            }
                          `}
                          onClick={() =>
                            setSelectedDate(
                              dateKey
                            )
                          }
                        >
                          <span className="bo-calendar-day-number">
                            {date.getDate()}
                          </span>

                          {hasEvents && (
                            <div className="bo-day-indicators">

                              {projectsForDate.length >
                                0 && (
                                <span className="bo-day-project">
                                  {projectsForDate.length}
                                </span>
                              )}

                              {remindersForDate.length >
                                0 && (
                                <span className="bo-day-reminder">
                                  {remindersForDate.length}
                                </span>
                              )}

                            </div>
                          )}
                        </button>
                      );
                    }
                  )}

                </div>

                {/* =================================================
                    SELECTED DATE
                ================================================== */}

                {selectedDate && (
                  <div className="bo-selected-date">

                    <div className="bo-selected-date-header">
                      <div>
                        <span>
                          SELECTED DATE
                        </span>

                        <strong>
                          {dayFormatter.format(
                            new Date(
                              `${selectedDate}T12:00:00`
                            )
                          )}
                        </strong>
                      </div>

                      <button
                        className="bo-add-reminder-small"
                        onClick={
                          openNewReminder
                        }
                      >
                        <Icon
                          name="plus"
                          size={13}
                        />

                        Add Reminder
                      </button>
                    </div>

                    {/* PROJECT EVENTS */}

                    {(
                      projectEventsByDate[
                        selectedDate
                      ] || []
                    ).length > 0 && (
                      <div className="bo-selected-group">

                        <div className="bo-selected-group-label">
                          PROJECT DELIVERY
                        </div>

                        <div className="bo-selected-events">

                          {(
                            projectEventsByDate[
                              selectedDate
                            ] || []
                          ).map(
                            (project) => (
                              <button
                                key={
                                  project.prj_ID
                                }
                                className="bo-selected-event project"
                                onClick={() =>
                                  navigate(
                                    `/po/projects/${project.prj_ID}`
                                  )
                                }
                              >
                                <span className="bo-selected-event-icon">
                                  <Icon
                                    name="briefcase"
                                    size={14}
                                  />
                                </span>

                                <span className="bo-selected-event-info">
                                  <strong>
                                    {
                                      project.project_Name
                                    }
                                  </strong>

                                  <small>
                                    Project deadline
                                  </small>
                                </span>

                                <Icon
                                  name="chevron"
                                  size={14}
                                />
                              </button>
                            )
                          )}

                        </div>
                      </div>
                    )}

                    {/* REMINDERS */}

                    {(
                      remindersByDate[
                        selectedDate
                      ] || []
                    ).length > 0 && (
                      <div className="bo-selected-group">

                        <div className="bo-selected-group-label">
                          MY REMINDERS
                        </div>

                        <div className="bo-selected-reminders">

                          {(
                            remindersByDate[
                              selectedDate
                            ] || []
                          ).map(
                            (reminder) => (
                              <div
                                key={
                                  reminder.id
                                }
                                className={`bo-selected-reminder ${
                                  reminder.completed
                                    ? 'completed'
                                    : ''
                                }`}
                              >
                                <button
                                  className="bo-reminder-check"
                                  onClick={() =>
                                    toggleReminder(
                                      reminder.id
                                    )
                                  }
                                >
                                  {reminder.completed
                                    ? '✓'
                                    : ''}
                                </button>

                                <div className="bo-selected-reminder-info">

                                  <strong>
                                    {
                                      reminder.title
                                    }
                                  </strong>

                                  <span>
                                    {
                                      reminder.type
                                    }

                                    {reminder.time
                                      ? ` · ${reminder.time}`
                                      : ''}
                                  </span>

                                  {reminder.notes && (
                                    <small>
                                      {
                                        reminder.notes
                                      }
                                    </small>
                                  )}

                                </div>

                                <div className="bo-reminder-actions">

                                  <button
                                    onClick={() =>
                                      openEditReminder(
                                        reminder
                                      )
                                    }
                                    title="Edit reminder"
                                  >
                                    <Icon
                                      name="edit"
                                      size={13}
                                    />
                                  </button>

                                  <button
                                    onClick={() =>
                                      deleteReminder(
                                        reminder.id
                                      )
                                    }
                                    title="Delete reminder"
                                  >
                                    <Icon
                                      name="trash"
                                      size={13}
                                    />
                                  </button>

                                </div>
                              </div>
                            )
                          )}

                        </div>
                      </div>
                    )}

                    {/* NOTHING */}

                    {(
                      projectEventsByDate[
                        selectedDate
                      ] || []
                    ).length === 0 &&
                      (
                        remindersByDate[
                          selectedDate
                        ] || []
                      ).length === 0 && (
                        <div className="bo-selected-empty">
                          Nothing is scheduled for
                          this day.
                        </div>
                      )}

                  </div>
                )}

              </section>

              {/* =================================================
                  RIGHT SIDE — REMINDERS
              ================================================== */}

              <aside className="bo-upcoming-card">

                <div className="bo-upcoming-header">

                  <div>
                    <span>
                      PERSONAL SCHEDULE
                    </span>

                    <h2>
                      My Reminders
                    </h2>
                  </div>

                  <div >
                  </div>

                </div>

                <button
                  className="bo-main-add-reminder"
                  onClick={openNewReminder}
                >
                  <Icon
                    name="plus"
                    size={15}
                  />

                  Add Reminder
                </button>

                {upcomingReminders.length ===
                0 ? (
                  <div className="bo-calendar-empty">

                    <div className="bo-calendar-empty-icon">
                      <Icon
                        name="calendar"
                        size={23}
                      />
                    </div>

                    <strong>
                      No reminders yet
                    </strong>

                    <p>
                      Add meetings, deadlines,
                      follow-ups or personal to-dos
                      to keep yourself organised.
                    </p>

                    <button
                      className="aaib-btn aaib-btn-secondary"
                      onClick={
                        openNewReminder
                      }
                    >
                      Add your first reminder
                    </button>

                  </div>
                ) : (
                  <div className="bo-reminder-list">

                    {upcomingReminders.map(
                      (reminder) => {
                        const reminderDate =
                          formatReminderDate(
                            reminder.date
                          );

                        return (
                          <div
                            key={reminder.id}
                            className={`bo-reminder-card ${
                              reminder.completed
                                ? 'completed'
                                : ''
                            }`}
                          >

                            <button
                              className="bo-reminder-card-check"
                              onClick={() =>
                                toggleReminder(
                                  reminder.id
                                )
                              }
                            >
                              {reminder.completed
                                ? '✓'
                                : ''}
                            </button>

                            <div className="bo-reminder-card-content">

                              <div className="bo-reminder-card-top">

                                <span
                                  className={`bo-reminder-type ${getReminderTypeClass(
                                    reminder.type
                                  )}`}
                                >
                                  {
                                    reminder.type
                                  }
                                </span>

                                <span className="bo-reminder-date">
                                  {reminderDate}
                                </span>

                              </div>

                              <strong>
                                {reminder.title}
                              </strong>

                              {reminder.time && (
                                <span className="bo-reminder-time">
                                  {reminder.time}
                                </span>
                              )}

                              {reminder.notes && (
                                <p>
                                  {reminder.notes}
                                </p>
                              )}

                              <div className="bo-reminder-card-actions">

                                <button
                                  onClick={() =>
                                    openEditReminder(
                                      reminder
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="danger"
                                  onClick={() =>
                                    deleteReminder(
                                      reminder.id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

                <div className="bo-upcoming-footer">

                  <span>
                    {reminders.length}{' '}
                    total reminder
                    {reminders.length === 1
                      ? ''
                      : 's'}
                  </span>

                  

                </div>

              </aside>
            </div>

            {/* =================================================
                SUMMARY
            ================================================== */}

            <section className="bo-calendar-summary">

              <div className="bo-calendar-summary-item">

                <div className="bo-calendar-summary-icon">
                  <Icon
                    name="calendar"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    THIS MONTH
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : monthProjectEvents.length +
                        monthReminders.length}
                  </strong>
                </div>

              </div>

              <div className="bo-calendar-summary-divider" />

              <div className="bo-calendar-summary-item">

                <div className="bo-calendar-summary-icon green">
                  <Icon
                    name="briefcase"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    PROJECTS
                  </span>

                  <strong>
                    {isLoading
                      ? '—'
                      : datedProjects.length}
                  </strong>
                </div>

              </div>

              <div className="bo-calendar-summary-divider" />

              <div className="bo-calendar-summary-item">

                <div className="bo-calendar-summary-icon gold">
                  <Icon
                    name="bell"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    MY REMINDERS
                  </span>

                  <strong>
                    {reminders.length}
                  </strong>
                </div>

              </div>

            </section>

          </div>
        </main>
      </div>

      {/* =====================================================
          ADD / EDIT REMINDER MODAL
      ====================================================== */}

      {showReminderForm && (
        <div
          className="bo-reminder-modal-backdrop"
          onClick={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeReminderForm();
            }
          }}
        >

          <div className="bo-reminder-modal">

            <div className="bo-reminder-modal-header">

              <div>
                <span>
                  PERSONAL SCHEDULE
                </span>

                <h2>
                  {editingReminderId
                    ? 'Edit Reminder'
                    : 'Add Reminder'}
                </h2>

                <p>
                  Add a meeting, deadline,
                  follow-up or task to your
                  calendar.
                </p>
              </div>

              <button
                className="bo-reminder-modal-close"
                onClick={closeReminderForm}
              >
                <Icon
                  name="close"
                  size={18}
                />
              </button>

            </div>

            <form
              className="bo-reminder-form"
              onSubmit={saveReminder}
            >

              <div className="bo-reminder-form-field full">

                <label>
                  Reminder Title
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={reminderForm.title}
                  onChange={handleReminderChange}
                  className="aaib-input"
                  placeholder="e.g. Meeting with PO"
                  required
                  autoFocus
                />

              </div>

              <div className="bo-reminder-form-grid">

                <div className="bo-reminder-form-field">

                  <label>
                    Date
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={reminderForm.date}
                    onChange={handleReminderChange}
                    className="aaib-input"
                    required
                  />

                </div>

                <div className="bo-reminder-form-field">

                  <label>
                    Time
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={reminderForm.time}
                    onChange={handleReminderChange}
                    className="aaib-input"
                  />

                </div>

              </div>

              <div className="bo-reminder-form-field full">

                <label>
                  Type
                </label>

                <div className="bo-reminder-type-options">

                  {[
                    'Meeting',
                    'Deadline',
                    'To-do',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`bo-reminder-type-option ${
                        reminderForm.type ===
                        type
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        setReminderForm(
                          (previous) => ({
                            ...previous,
                            type,
                          })
                        )
                      }
                    >
                      {type}
                    </button>
                  ))}

                </div>

              </div>

              <div className="bo-reminder-form-field full">

                <label>
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={reminderForm.notes}
                  onChange={handleReminderChange}
                  className="aaib-textarea"
                  rows={4}
                  placeholder="Add any useful details..."
                />

              </div>

              <div className="bo-reminder-form-actions">

                <button
                  type="button"
                  className="aaib-btn aaib-btn-secondary"
                  onClick={closeReminderForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="aaib-btn aaib-btn-primary"
                >
                  <Icon
                    name="check"
                    size={15}
                  />

                  {editingReminderId
                    ? 'Save Changes'
                    : 'Add Reminder'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          CSS
      ====================================================== */}

      <style>
        {`

        /* ==================================================
           PAGE HEADER
        ================================================== */

        .bo-calendar-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .bo-calendar-page-header h1 {
          margin: 4px 0 5px;
          color: var(--aaib-primary);
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: -.03em;
        }

        .bo-calendar-page-header p {
          margin: 0;
          color: var(--aaib-text-muted);
          font-size: 12px;
        }

        .bo-calendar-eyebrow {
          color: var(--aaib-accent);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        /* ==================================================
           LAYOUT
        ================================================== */

        .bo-calendar-layout {
          display: grid;

          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(300px, .75fr);

          gap: 20px;

          align-items: start;
        }

        .bo-calendar-card,
        .bo-upcoming-card {
          background: var(--aaib-surface);
          border: 1px solid var(--aaib-border);
          border-radius: var(--aaib-radius);
          box-shadow: var(--aaib-shadow-card);
        }

        .bo-calendar-card {
          padding: 23px;
        }

        /* ==================================================
           CALENDAR HEADER
        ================================================== */

        .bo-calendar-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          margin-bottom: 14px;
        }

        .bo-calendar-month {
          color: var(--aaib-primary);

          font-size: 20px;
          font-weight: 800;

          letter-spacing: -.025em;
        }

        .bo-calendar-card-header
        > div:first-child
        > span {
          display: block;

          margin-top: 3px;

          color: var(--aaib-text-muted);

          font-size: 10px;
        }

        .bo-calendar-controls {
          display: flex;
          align-items: center;

          gap: 5px;
        }

        .bo-calendar-controls button {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border: 1px solid var(--aaib-border);

          border-radius: 8px;

          background: #fff;

          color: var(--aaib-primary);

          cursor: pointer;
        }

        .bo-calendar-controls button:hover {
          background:
            var(--aaib-primary-soft);

          border-color:
            rgba(27,40,30,.15);
        }

        .bo-calendar-controls
        .bo-today-button {
          width: auto;
          padding: 0 11px;

          color: var(--aaib-primary);

          font-size: 10px;
          font-weight: 700;
        }

        /* ==================================================
           LEGEND
        ================================================== */

        .bo-calendar-legend {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;

          margin-bottom: 14px;
          padding-bottom: 12px;

          border-bottom:
            1px solid
            var(--aaib-border);
        }

        .bo-calendar-legend span {
          display: flex;
          align-items: center;
          gap: 5px;

          color: var(--aaib-text-muted);

          font-size: 8px;
          font-weight: 600;
        }

        .bo-calendar-legend i {
          width: 7px;
          height: 7px;

          display: inline-block;

          border-radius: 50%;
        }

        .bo-calendar-legend
        .project-dot {
          background:
            var(--aaib-primary);
        }

        .bo-calendar-legend
        .reminder-dot {
          background:
            var(--aaib-accent);
        }

        .bo-calendar-legend
        .today-dot {
          background:
            var(--aaib-success);
        }

        /* ==================================================
           WEEKDAYS
        ================================================== */

        .bo-calendar-weekdays {
          display: grid;
          grid-template-columns:
            repeat(7, 1fr);

          gap: 5px;

          margin-bottom: 5px;
        }

        .bo-calendar-weekdays span {
          padding: 7px 0;

          color: #89958e;

          text-align: center;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: .06em;
        }

        /* ==================================================
           DAYS
        ================================================== */

        .bo-calendar-days {
          display: grid;
          grid-template-columns:
            repeat(7, 1fr);

          gap: 5px;
        }

        .bo-calendar-day {
          position: relative;

          min-height: 77px;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          padding: 10px;

          border: 1px solid transparent;

          border-radius: 9px;

          background: transparent;

          color: var(--aaib-text);

          cursor: pointer;

          transition:
            background .18s ease,
            border-color .18s ease,
            transform .18s ease;
        }

        .bo-calendar-day:hover {
          background:
            var(--aaib-primary-soft);

          border-color:
            rgba(27,40,30,.08);
        }

        .bo-calendar-day.muted {
          color: #c1c8c4;
        }

        .bo-calendar-day.today {
          background:
            var(--aaib-success-soft);
        }

        .bo-calendar-day.today
        .bo-calendar-day-number {
          color:
            var(--aaib-success);

          font-weight: 800;
        }

        .bo-calendar-day.selected {
          border-color:
            var(--aaib-accent);

          background:
            rgba(197,160,89,.09);
        }

        .bo-calendar-day-number {
          font-size: 12px;
          font-weight: 600;
        }

        .bo-day-indicators {
          display: flex;
          align-items: center;

          gap: 3px;
        }

        .bo-day-project,
        .bo-day-reminder {
          width: 17px;
          height: 17px;

          display: grid;
          place-items: center;

          border-radius: 5px;

          font-size: 7px;
          font-weight: 800;
        }

        .bo-day-project {
          background:
            var(--aaib-primary);

          color:
            var(--aaib-accent);
        }

        .bo-day-reminder {
          background:
            var(--aaib-accent-soft);

          color:
            #96721d;
        }

        /* ==================================================
           SELECTED DATE
        ================================================== */

        .bo-selected-date {
          margin-top: 18px;
          padding-top: 17px;

          border-top:
            1px solid
            var(--aaib-border);
        }

        .bo-selected-date-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 12px;
        }

        .bo-selected-date-header span {
          display: block;

          margin-bottom: 3px;

          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .12em;
        }

        .bo-selected-date-header strong {
          color:
            var(--aaib-primary);

          font-size: 13px;
        }

        .bo-add-reminder-small {
          display: inline-flex;
          align-items: center;

          gap: 5px;

          height: 29px;

          padding: 0 9px;

          border: 1px solid
            rgba(27,40,30,.1);

          border-radius: 7px;

          background:
            var(--aaib-surface-alt);

          color:
            var(--aaib-primary);

          font-size: 9px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-add-reminder-small:hover {
          background:
            var(--aaib-primary-soft);
        }

        .bo-selected-group {
          margin-top: 13px;
        }

        .bo-selected-group-label {
          margin-bottom: 7px;

          color:
            var(--aaib-text-muted);

          font-size: 7px;
          font-weight: 800;

          letter-spacing: .08em;
        }

        .bo-selected-events {
          display: grid;
          gap: 7px;
        }

        .bo-selected-event {
          display: flex;
          align-items: center;

          gap: 9px;

          width: 100%;

          padding: 9px 10px;

          border: 1px solid
            var(--aaib-border);

          border-radius: 9px;

          background: #fff;

          text-align: left;

          cursor: pointer;
        }

        .bo-selected-event:hover {
          border-color:
            rgba(27,40,30,.15);

          background:
            var(--aaib-primary-soft);
        }

        .bo-selected-event-icon {
          width: 28px;
          height: 28px;

          flex: 0 0 auto;

          display: grid;
          place-items: center;

          border-radius: 7px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-selected-event-info {
          min-width: 0;
          flex: 1;
        }

        .bo-selected-event-info strong {
          display: block;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          color:
            var(--aaib-primary);

          font-size: 10px;
        }

        .bo-selected-event-info small {
          display: block;

          margin-top: 2px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-selected-event > svg {
          color: #a0aaa4;
        }

        /* ==================================================
           SELECTED REMINDERS
        ================================================== */

        .bo-selected-reminders {
          display: grid;
          gap: 6px;
        }

        .bo-selected-reminder {
          display: flex;
          align-items: center;

          gap: 8px;

          padding: 9px;

          border:
            1px solid
            var(--aaib-border);

          border-radius: 8px;

          background: #fff;
        }

        .bo-selected-reminder.completed {
          opacity: .58;
        }

        .bo-reminder-check,
        .bo-reminder-card-check {
          width: 23px;
          height: 23px;

          display: grid;
          place-items: center;

          flex: 0 0 auto;

          border:
            1px solid
            var(--aaib-border);

          border-radius: 6px;

          background: #fff;

          color:
            var(--aaib-success);

          cursor: pointer;

          font-size: 11px;
          font-weight: 800;
        }

        .bo-selected-reminder.completed
        .bo-reminder-check {
          border-color:
            var(--aaib-success);

          background:
            var(--aaib-success-soft);
        }

        .bo-selected-reminder-info {
          min-width: 0;
          flex: 1;
        }

        .bo-selected-reminder-info strong {
          display: block;

          color:
            var(--aaib-primary);

          font-size: 10px;
        }

        .bo-selected-reminder-info span {
          display: block;

          margin-top: 2px;

          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 700;
        }

        .bo-selected-reminder-info small {
          display: block;

          margin-top: 3px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bo-reminder-actions {
          display: flex;
          gap: 3px;
        }

        .bo-reminder-actions button {
          width: 25px;
          height: 25px;

          display: grid;
          place-items: center;

          border: 0;
          border-radius: 6px;

          background:
            var(--aaib-surface-alt);

          color:
            var(--aaib-text-muted);

          cursor: pointer;
        }

        .bo-reminder-actions button:hover {
          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-selected-empty {
          margin-top: 11px;

          padding: 13px;

          border-radius: 8px;

          background:
            var(--aaib-surface-alt);

          color:
            var(--aaib-text-muted);

          font-size: 10px;

          text-align: center;
        }

        /* ==================================================
           UPCOMING / RIGHT CARD
        ================================================== */

        .bo-upcoming-card {
          padding: 20px;
        }

        .bo-upcoming-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-bottom: 13px;
        }

        .bo-upcoming-header
        > div:first-child
        > span {
          display: block;

          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .13em;
        }

        .bo-upcoming-header h2 {
          margin: 4px 0 0;

          color:
            var(--aaib-primary);

          font-size: 17px;

          letter-spacing: -.02em;
        }

        .bo-upcoming-icon {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color:
            #9c781f;

          background:
            var(--aaib-accent-soft);
        }

        .bo-main-add-reminder {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 6px;

          height: 37px;

          margin-bottom: 12px;

          border: 1px solid
            rgba(27,40,30,.12);

          border-radius: 9px;

          background:
            var(--aaib-primary);

          color:
            #fff;

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-main-add-reminder:hover {
          background:
            var(--aaib-primary-strong);
        }

        .bo-reminder-list {
          display: grid;
          gap: 8px;
        }

        .bo-reminder-card {
          display: flex;

          gap: 9px;

          padding: 10px;

          border:
            1px solid
            var(--aaib-border);

          border-radius: 9px;

          background: #fff;
        }

        .bo-reminder-card.completed {
          opacity: .58;
        }

        .bo-reminder-card-check {
          margin-top: 2px;

          width: 23px;
          height: 23px;
        }

        .bo-reminder-card.completed
        .bo-reminder-card-check {
          border-color:
            var(--aaib-success);

          background:
            var(--aaib-success-soft);
        }

        .bo-reminder-card-content {
          min-width: 0;
          flex: 1;
        }

        .bo-reminder-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 5px;

          margin-bottom: 5px;
        }

        .bo-reminder-type {
          display: inline-flex;

          width: fit-content;

          padding: 3px 6px;

          border-radius: 999px;

          font-size: 7px;
          font-weight: 800;
        }

        .bo-reminder-type.meeting {
          color:
            #335f8c;

          background:
            #eaf2ff;
        }

        .bo-reminder-type.deadline {
          color:
            var(--aaib-danger);

          background:
            var(--aaib-danger-soft);
        }

        .bo-reminder-type.todo {
          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-reminder-date {
          color:
            var(--aaib-text-muted);

          font-size: 8px;
          font-weight: 700;
        }

        .bo-reminder-card-content > strong {
          display: block;

          color:
            var(--aaib-primary);

          font-size: 10px;

          line-height: 1.35;
        }

        .bo-reminder-time {
          display: block;

          margin-top: 3px;

          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 700;
        }

        .bo-reminder-card-content > p {
          margin: 5px 0 0;

          color:
            var(--aaib-text-muted);

          font-size: 8px;

          line-height: 1.45;
        }

        .bo-reminder-card-actions {
          display: flex;
          gap: 9px;

          margin-top: 8px;
        }

        .bo-reminder-card-actions button {
          padding: 0;

          border: 0;

          background: transparent;

          color:
            var(--aaib-primary);

          font-size: 8px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-reminder-card-actions
        button:hover {
          color:
            var(--aaib-accent);
        }

        .bo-reminder-card-actions
        button.danger {
          color:
            var(--aaib-danger);
        }

        /* ==================================================
           EMPTY
        ================================================== */

        .bo-calendar-empty {
          display: grid;
          place-items: center;

          padding: 27px 15px;

          border:
            1px dashed
            rgba(27,40,30,.12);

          border-radius: 10px;

          background:
            #fcfdfc;

          text-align: center;
        }

        .bo-calendar-empty-icon {
          width: 44px;
          height: 44px;

          display: grid;
          place-items: center;

          margin-bottom: 8px;

          border-radius: 12px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-calendar-empty strong {
          color:
            var(--aaib-primary);

          font-size: 11px;
        }

        .bo-calendar-empty p {
          max-width: 220px;

          margin: 4px 0 13px;

          color:
            var(--aaib-text-muted);

          font-size: 9px;

          line-height: 1.5;
        }

        .bo-calendar-empty
        .aaib-btn {
          font-size: 9px;
          padding: 8px 11px;
        }

        /* ==================================================
           FOOTER
        ================================================== */

        .bo-upcoming-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 10px;

          margin-top: 13px;
          padding-top: 12px;

          border-top:
            1px solid
            var(--aaib-border);
        }

        .bo-upcoming-footer span {
          color:
            var(--aaib-text-muted);

          font-size: 8px;
        }

        .bo-upcoming-footer button {
          border: 0;
          background: transparent;

          color:
            var(--aaib-primary);

          font-size: 8px;
          font-weight: 800;

          cursor: pointer;
        }

        .bo-upcoming-footer button:hover {
          color:
            var(--aaib-accent);
        }

        /* ==================================================
           SUMMARY
        ================================================== */

        .bo-calendar-summary {
          display: grid;

          grid-template-columns:
            1fr auto 1fr auto 1fr;

          align-items: center;

          gap: 20px;

          margin-top: 18px;

          padding: 17px 20px;

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

        .bo-calendar-summary-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bo-calendar-summary-icon {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          color:
            var(--aaib-primary);

          background:
            var(--aaib-primary-soft);
        }

        .bo-calendar-summary-icon.green {
          color:
            var(--aaib-success);

          background:
            var(--aaib-success-soft);
        }

        .bo-calendar-summary-icon.gold {
          color:
            #9b771f;

          background:
            var(--aaib-accent-soft);
        }

        .bo-calendar-summary-item span {
          display: block;

          margin-bottom: 2px;

          color:
            var(--aaib-text-muted);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .05em;
        }

        .bo-calendar-summary-item strong {
          color:
            var(--aaib-primary);

          font-size: 18px;

          line-height: 1;
        }

        .bo-calendar-summary-divider {
          width: 1px;
          height: 34px;

          background:
            var(--aaib-border);
        }

        /* ==================================================
           MODAL
        ================================================== */

        .bo-reminder-modal-backdrop {
          position: fixed;

          inset: 0;

          z-index: 200;

          display: grid;
          place-items: center;

          padding: 20px;

          background:
            rgba(20,33,24,.48);

          backdrop-filter:
            blur(3px);
        }

        .bo-reminder-modal {
          width: min(530px, 100%);

          max-height:
            calc(100vh - 40px);

          overflow-y: auto;

          padding: 22px;

          border:
            1px solid
            var(--aaib-border);

          border-radius:
            var(--aaib-radius-lg);

          background:
            var(--aaib-surface);

          box-shadow:
            0 25px 70px
            rgba(20,33,24,.2);
        }

        .bo-reminder-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 15px;

          padding-bottom: 15px;

          margin-bottom: 16px;

          border-bottom:
            1px solid
            var(--aaib-border);
        }

        .bo-reminder-modal-header span {
          color:
            var(--aaib-accent);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: .13em;
        }

        .bo-reminder-modal-header h2 {
          margin: 4px 0 3px;

          color:
            var(--aaib-primary);

          font-size: 20px;

          letter-spacing: -.02em;
        }

        .bo-reminder-modal-header p {
          margin: 0;

          color:
            var(--aaib-text-muted);

          font-size: 10px;
        }

        .bo-reminder-modal-close {
          width: 32px;
          height: 32px;

          display: grid;
          place-items: center;

          border: 1px solid
            var(--aaib-border);

          border-radius: 8px;

          background: #fff;

          color:
            var(--aaib-text-muted);

          cursor: pointer;
        }

        .bo-reminder-modal-close:hover {
          color:
            var(--aaib-primary);

          background:
            var(--aaib-surface-alt);
        }

        .bo-reminder-form {
          display: grid;
          gap: 14px;
        }

        .bo-reminder-form-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        .bo-reminder-form-field {
          min-width: 0;
        }

        .bo-reminder-form-field.full {
          width: 100%;
        }

        .bo-reminder-form-field label {
          display: block;

          margin-bottom: 6px;

          color:
            var(--aaib-primary);

          font-size: 10px;
          font-weight: 700;
        }

        .bo-reminder-form-field label span {
          margin-left: 3px;

          color:
            var(--aaib-danger);
        }

        .bo-reminder-type-options {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 7px;
        }

        .bo-reminder-type-option {
          min-height: 38px;

          border:
            1px solid
            var(--aaib-border);

          border-radius: 9px;

          background: #fff;

          color:
            var(--aaib-text-muted);

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;
        }

        .bo-reminder-type-option:hover {
          background:
            var(--aaib-surface-alt);
        }

        .bo-reminder-type-option.active {
          border-color:
            rgba(197,160,89,.55);

          color:
            var(--aaib-primary);

          background:
            var(--aaib-accent-soft);

          box-shadow:
            0 0 0 2px
            rgba(197,160,89,.08);
        }

        .bo-reminder-form-actions {
          display: flex;
          justify-content: flex-end;

          gap: 8px;

          padding-top: 4px;
        }

        .bo-reminder-form-actions
        .aaib-btn {
          min-height: 38px;

          font-size: 10px;
        }

        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 950px) {
          .bo-calendar-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .bo-calendar-summary {
            grid-template-columns: 1fr;

            gap: 14px;
          }

          .bo-calendar-summary-divider {
            width: 100%;
            height: 1px;
          }

          .bo-reminder-form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .bo-calendar-card {
            padding: 15px;
          }

          .bo-calendar-card-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .bo-calendar-controls {
            width: 100%;
            justify-content: flex-end;
          }

          .bo-calendar-day {
            min-height: 57px;
            padding: 7px;
          }

          .bo-calendar-day-number {
            font-size: 10px;
          }

          .bo-day-project,
          .bo-day-reminder {
            width: 15px;
            height: 15px;

            font-size: 6px;
          }

          .bo-calendar-weekdays span {
            font-size: 7px;
          }

          .bo-selected-date-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .bo-add-reminder-small {
            width: 100%;

            justify-content: center;
          }

          .bo-reminder-type-options {
            grid-template-columns: 1fr;
          }

          .bo-reminder-form-actions {
            display: grid;

            grid-template-columns: 1fr;
          }

          .bo-reminder-form-actions button {
            width: 100%;
          }

          .bo-reminder-modal {
            padding: 17px;
          }
        }
        `}
      </style>
    </div>
  );
}