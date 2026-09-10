import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';

export default function PODashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userName = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

  useEffect(() => {
    setIsLoading(true);

    getProjects()
      .then(data => {
        setProjects(data || []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /*
   * PO DASHBOARD
   *
   * The PO should see projects relevant to their workflow:
   * - New project requests
   * - Projects pending PO review
   * - Projects in progress
   * - Completed projects
   * - Projects requiring attention
   */

  const newProjectRequests = projects.filter(project =>
    [
      'Pending PO Review',
      'Pending Review',
      'New',
      'Submitted',
      'Pending'
    ].includes(project.status)
  );

  const pendingReview = projects.filter(project =>
    [
      'Pending PO Review',
      'Pending Review'
    ].includes(project.status)
  );

  const inProgress = projects.filter(project =>
    [
      'In Progress',
      'Active'
    ].includes(project.status)
  );

  const completed = projects.filter(project =>
    [
      'Done',
      'Completed'
    ].includes(project.status)
  );

  const requiresAttention = projects.filter(project =>
    project.flag ||
    [
      'Changes Requested',
      'Rejected',
      'Requires Attention'
    ].includes(project.status)
  );

  /*
   * Projects shown on the dashboard.
   *
   * We keep this based on the data currently returned by
   * the existing project service rather than assuming
   * additional backend fields that have not been confirmed.
   */
  const recentProjects = [...projects]
    .sort((a, b) => {
      const dateA = new Date(
        a.lastUpdatedDate ||
        a.updatedAt ||
        a.createdAt ||
        0
      );

      const dateB = new Date(
        b.lastUpdatedDate ||
        b.updatedAt ||
        b.createdAt ||
        0
      );

      return dateB - dateA;
    })
    .slice(0, 5);

  const upcomingProjects = [...projects]
    .filter(project => project.expectedDeliveryDate || project.endDate)
    .sort((a, b) => {
      const dateA = new Date(
        a.expectedDeliveryDate ||
        a.endDate
      );

      const dateB = new Date(
        b.expectedDeliveryDate ||
        b.endDate
      );

      return dateA - dateB;
    })
    .slice(0, 5);

  const stats = [
    {
      label: 'New Requests',
      value: newProjectRequests.length
    },
    {
      label: 'Pending Review',
      value: pendingReview.length
    },
    {
      label: 'In Progress',
      value: inProgress.length
    },
    {
      label: 'Completed',
      value: completed.length
    },
    {
      label: 'Requires Attention',
      value: requiresAttention.length,
      highlight: true
    }
  ];

  const getStatusBadge = status => {
    const normalizedStatus = (
      status || 'Open'
    ).toLowerCase();

    if (
      normalizedStatus.includes('done') ||
      normalizedStatus.includes('completed') ||
      normalizedStatus.includes('approved')
    ) {
      return 'aaib-badge-success';
    }

    if (
      normalizedStatus.includes('review') ||
      normalizedStatus.includes('pending') ||
      normalizedStatus.includes('submitted') ||
      normalizedStatus.includes('new')
    ) {
      return 'aaib-badge-warning';
    }

    if (
      normalizedStatus.includes('rejected') ||
      normalizedStatus.includes('attention') ||
      normalizedStatus.includes('changes')
    ) {
      return 'aaib-badge-danger';
    }

    return 'aaib-badge-neutral';
  };

  const formatDate = dateString => {
    if (!dateString) {
      return 'TBD';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return 'TBD';
    }

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getProjectName = project =>
    project.project_Name ||
    project.projectName ||
    project.name ||
    'Untitled Project';

  const getProjectId = project =>
    project.prj_ID ||
    project.projectId ||
    project.id;

  const getBOName = project =>
    project.boName ||
    project.bo_Name ||
    project.businessOwnerName ||
    'Unassigned';

  const getDeadline = project =>
    project.expectedDeliveryDate ||
    project.endDate;

  return (
    <div
      style={{
        maxWidth: '1200px',
        animation: 'fadeIn 0.4s ease-out'
      }}
    >

      {/* =========================
          HEADER
      ========================== */}

      <header
        className="aaib-row-between"
        style={{
          marginBottom: '32px',
          alignItems: 'flex-start'
        }}
      >
        <div>
          <h1
            className="aaib-title"
            style={{
              fontSize: '28px',
              marginBottom: '8px'
            }}
          >
            {greeting}, {userName}
          </h1>

          <p className="aaib-subtitle">
            Here is a summary of your projects and pending
            activities.
          </p>
        </div>

        <div
          className="aaib-row"
          style={{
            gap: '12px'
          }}
        >
          <button
            className="aaib-btn aaib-btn-primary"
            onClick={() => navigate('/po/project-requests')}
          >
            Project Requests
          </button>

          <button
            className="aaib-btn aaib-btn-secondary"
            onClick={() => navigate('/po/projects')}
          >
            My Projects
          </button>
        </div>
      </header>


      {/* =========================
          STATISTICS
      ========================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          marginBottom: '32px',
          overflowX: 'auto'
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="aaib-panel"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              border:
                stat.highlight && stat.value > 0
                  ? '1px solid var(--aaib-danger)'
                  : '1px solid var(--aaib-border)'
            }}
          >
            <span
              className="aaib-muted"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {stat.label}
            </span>

            <span
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color:
                  stat.highlight && stat.value > 0
                    ? 'var(--aaib-danger)'
                    : 'var(--aaib-primary)',
                lineHeight: '1'
              }}
            >
              {isLoading ? '-' : stat.value}
            </span>
          </div>
        ))}
      </div>


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}
      >

        {/* =====================
            PROJECTS
        ====================== */}

        <section>

          <div
            className="aaib-row-between"
            style={{
              marginBottom: '20px'
            }}
          >
            <h2
              className="aaib-title"
              style={{
                fontSize: '20px'
              }}
            >
              Projects Requiring Attention
            </h2>

            <button
              className="aaib-btn-muted"
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() =>
                navigate('/po/project-requests')
              }
            >
              View Requests
            </button>
          </div>


          {isLoading ? (

            <div className="aaib-stack">
              <div
                className="aaib-skeleton aaib-skeleton-card"
                style={{
                  height: '90px'
                }}
              />

              <div
                className="aaib-skeleton aaib-skeleton-card"
                style={{
                  height: '90px'
                }}
              />
            </div>

          ) : requiresAttention.length === 0 ? (

            <div className="aaib-empty">
              <div className="aaib-empty-icon">
                ✓
              </div>

              <h3
                style={{
                  margin: '0 0 8px 0',
                  color: 'var(--aaib-primary)'
                }}
              >
                No projects require attention
              </h3>

              <p style={{ margin: 0 }}>
                There are currently no projects requiring
                your immediate attention.
              </p>
            </div>

          ) : (

            <div className="aaib-stack">

              {requiresAttention
                .slice(0, 5)
                .map(project => {

                  const projectId =
                    getProjectId(project);

                  return (
                    <div
                      key={projectId}
                      className="aaib-panel"
                      style={{
                        padding: '20px',
                        cursor: 'pointer'
                      }}
                      onClick={() =>
                        navigate(
                          `/po/projects/${projectId}`
                        )
                      }
                    >

                      <div
                        className="aaib-row-between"
                        style={{
                          marginBottom: '12px'
                        }}
                      >

                        <h3
                          style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--aaib-text)'
                          }}
                        >
                          {getProjectName(project)}
                        </h3>

                        <span
                          className={`aaib-badge ${getStatusBadge(
                            project.status
                          )}`}
                        >
                          {project.status || 'Open'}
                        </span>

                      </div>

                      <div
                        className="aaib-row"
                        style={{
                          fontSize: '13px',
                          color: 'var(--aaib-text-muted)',
                          flexWrap: 'wrap',
                          gap: '16px'
                        }}
                      >
                        <span>
                          <strong>BO:</strong>{' '}
                          {getBOName(project)}
                        </span>

                        <span>
                          <strong>Updated:</strong>{' '}
                          {formatDate(
                            project.lastUpdatedDate ||
                            project.updatedAt ||
                            project.createdAt
                          )}
                        </span>

                        <span>
                          <strong>Deadline:</strong>{' '}
                          {formatDate(
                            getDeadline(project)
                          )}
                        </span>
                      </div>

                    </div>
                  );
                })}

            </div>
          )}

        </section>


        {/* =====================
            SIDE PANELS
        ====================== */}

        <div className="aaib-stack">

          {/* =================
              PROJECT REQUESTS
          ================== */}

          <section
            className="aaib-panel"
            style={{
              padding: '24px'
            }}
          >

            <div
              className="aaib-row-between"
              style={{
                marginBottom: '16px'
              }}
            >

              <h2
                className="aaib-title"
                style={{
                  fontSize: '16px'
                }}
              >
                New Project Requests
              </h2>

              <button
                className="aaib-btn-muted"
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  navigate('/po/project-requests')
                }
              >
                View All
              </button>

            </div>

            {isLoading ? (

              <p
                className="aaib-muted"
                style={{
                  fontSize: '13px'
                }}
              >
                Loading...
              </p>

            ) : newProjectRequests.length === 0 ? (

              <div
                className="aaib-empty"
                style={{
                  padding: '24px 12px'
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    margin: 0
                  }}
                >
                  No new project requests.
                </p>
              </div>

            ) : (

              <div
                className="aaib-stack"
                style={{
                  gap: '10px'
                }}
              >

                {newProjectRequests
                  .slice(0, 3)
                  .map(project => {

                    const projectId =
                      getProjectId(project);

                    return (
                      <div
                        key={projectId}
                        style={{
                          padding: '12px',
                          border:
                            '1px solid var(--aaib-border)',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() =>
                          navigate(
                            `/po/projects/${projectId}`
                          )
                        }
                      >

                        <div
                          className="aaib-row-between"
                          style={{
                            marginBottom: '6px'
                          }}
                        >

                          <strong
                            style={{
                              fontSize: '14px'
                            }}
                          >
                            {getProjectName(project)}
                          </strong>

                          <span
                            className={`aaib-badge ${getStatusBadge(
                              project.status
                            )}`}
                          >
                            {project.status ||
                              'Pending'}
                          </span>

                        </div>

                        <span
                          style={{
                            fontSize: '12px',
                            color:
                              'var(--aaib-text-muted)'
                          }}
                        >
                          BO:{' '}
                          {getBOName(project)}
                        </span>

                      </div>
                    );
                  })}

              </div>
            )}

          </section>


          {/* =================
              UPCOMING DEADLINES
          ================== */}

          <section
            className="aaib-panel"
            style={{
              padding: '24px'
            }}
          >

            <div
              className="aaib-row-between"
              style={{
                marginBottom: '16px'
              }}
            >

              <h2
                className="aaib-title"
                style={{
                  fontSize: '16px'
                }}
              >
                Upcoming Deadlines
              </h2>

              <button
                className="aaib-btn-muted"
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  navigate('/po/calendar')
                }
              >
                Calendar
              </button>

            </div>

            {isLoading ? (

              <p
                className="aaib-muted"
                style={{
                  fontSize: '13px'
                }}
              >
                Loading...
              </p>

            ) : upcomingProjects.length === 0 ? (

              <div
                className="aaib-empty"
                style={{
                  padding: '24px 12px'
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    margin: 0
                  }}
                >
                  No upcoming project deadlines.
                </p>
              </div>

            ) : (

              <div
                className="aaib-stack"
                style={{
                  gap: '10px'
                }}
              >

                {upcomingProjects.map(project => {

                  const projectId =
                    getProjectId(project);

                  return (
                    <div
                      key={projectId}
                      style={{
                        padding: '12px',
                        border:
                          '1px solid var(--aaib-border)',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={() =>
                        navigate(
                          `/po/projects/${projectId}`
                        )
                      }
                    >

                      <strong
                        style={{
                          display: 'block',
                          fontSize: '14px',
                          marginBottom: '4px'
                        }}
                      >
                        {getProjectName(project)}
                      </strong>

                      <span
                        style={{
                          fontSize: '12px',
                          color:
                            'var(--aaib-text-muted)'
                        }}
                      >
                        Deadline:{' '}
                        {formatDate(
                          getDeadline(project)
                        )}
                      </span>

                    </div>
                  );
                })}

              </div>
            )}

          </section>

        </div>

      </div>


      {/* =========================
          RECENT PROJECTS
      ========================== */}

      <section
        style={{
          marginTop: '32px'
        }}
      >

        <div
          className="aaib-row-between"
          style={{
            marginBottom: '20px'
          }}
        >

          <h2
            className="aaib-title"
            style={{
              fontSize: '20px'
            }}
          >
            Recent Projects
          </h2>

          <button
            className="aaib-btn-muted"
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() =>
              navigate('/po/projects')
            }
          >
            View All
          </button>

        </div>


        {isLoading ? (

          <div className="aaib-stack">

            <div
              className="aaib-skeleton aaib-skeleton-card"
              style={{
                height: '80px'
              }}
            />

            <div
              className="aaib-skeleton aaib-skeleton-card"
              style={{
                height: '80px'
              }}
            />

          </div>

        ) : recentProjects.length === 0 ? (

          <div className="aaib-empty">

            <div className="aaib-empty-icon">
              📁
            </div>

            <h3
              style={{
                margin: '0 0 8px 0',
                color: 'var(--aaib-primary)'
              }}
            >
              No projects found
            </h3>

            <p style={{ margin: 0 }}>
              There are currently no projects available.
            </p>

          </div>

        ) : (

          <div className="aaib-stack">

            {recentProjects.map(project => {

              const projectId =
                getProjectId(project);

              return (
                <div
                  key={projectId}
                  className="aaib-panel"
                  style={{
                    padding: '20px',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    navigate(
                      `/po/projects/${projectId}`
                    )
                  }
                >

                  <div
                    className="aaib-row-between"
                    style={{
                      marginBottom: '12px'
                    }}
                  >

                    <h3
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color:
                          'var(--aaib-text)'
                      }}
                    >
                      {getProjectName(project)}
                    </h3>

                    <span
                      className={`aaib-badge ${getStatusBadge(
                        project.status
                      )}`}
                    >
                      {project.status || 'Open'}
                    </span>

                  </div>

                  <div
                    className="aaib-row"
                    style={{
                      fontSize: '13px',
                      color:
                        'var(--aaib-text-muted)',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >

                    <span>
                      <strong>BO:</strong>{' '}
                      {getBOName(project)}
                    </span>

                    <span>
                      <strong>Updated:</strong>{' '}
                      {formatDate(
                        project.lastUpdatedDate ||
                        project.updatedAt ||
                        project.createdAt
                      )}
                    </span>

                    <span>
                      <strong>Deadline:</strong>{' '}
                      {formatDate(
                        getDeadline(project)
                      )}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>


      {/* =========================
          NOTIFICATIONS
      ========================== */}

      <section
        className="aaib-panel"
        style={{
          marginTop: '32px',
          padding: '24px'
        }}
      >

        <div
          className="aaib-row-between"
          style={{
            marginBottom: '16px'
          }}
        >

          <h2
            className="aaib-title"
            style={{
              fontSize: '20px'
            }}
          >
            Recent Notifications
          </h2>

          <button
            className="aaib-btn-muted"
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() =>
              navigate('/po/notifications')
            }
          >
            View All
          </button>

        </div>

        <div
          className="aaib-empty"
          style={{
            padding: '24px 12px'
          }}
        >
          <p
            style={{
              fontSize: '13px',
              margin: 0
            }}
          >
            No new notifications.
          </p>
        </div>

      </section>

    </div>
  );
}