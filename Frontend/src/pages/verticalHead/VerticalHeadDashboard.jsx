import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../../services/projectService';

export default function VerticalHeadDashboard() {
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
   * ==============================
   * PROJECT INFORMATION
   * ==============================
   *
   * We use the existing project service here.
   * We do NOT assume new backend endpoints or
   * employee fields that have not been confirmed.
   */

  const inProgressProjects = projects.filter(project =>
    ['In Progress', 'Active'].includes(project.status)
  );

  const completedProjects = projects.filter(project =>
    ['Done', 'Completed'].includes(project.status)
  );

  const projectsRequiringAttention = projects.filter(project =>
    project.flag ||
    [
      'Changes Requested',
      'Requires Attention',
      'Rejected'
    ].includes(project.status)
  );

  /*
   * Resource requests that appear to be waiting
   * for action.
   */
  const pendingRequests = projects.filter(project =>
    [
      'Pending Resource Request',
      'Pending Resource',
      'Resource Request',
      'Pending Assignment',
      'Pending'
    ].includes(project.status)
  );

  /*
   * Recent projects.
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

  const stats = [
    {
      label: 'Pending Requests',
      value: pendingRequests.length
    },
    {
      label: 'Department Employees',
      value: '—'
    },
    {
      label: 'Assigned',
      value: '—'
    },
    {
      label: 'Available',
      value: '—'
    },
    {
      label: 'Unavailable',
      value: '—'
    }
  ];

  const getStatusBadge = status => {
    const normalizedStatus =
      (status || 'Open').toLowerCase();

    if (
      normalizedStatus.includes('done') ||
      normalizedStatus.includes('completed') ||
      normalizedStatus.includes('approved')
    ) {
      return 'aaib-badge-success';
    }

    if (
      normalizedStatus.includes('pending') ||
      normalizedStatus.includes('request')
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
            Here is a summary of your department,
            projects, and resource requests.
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
            onClick={() =>
              navigate('/vertical-head/resource-requests')
            }
          >
            Resource Requests
          </button>

          <button
            className="aaib-btn aaib-btn-secondary"
            onClick={() =>
              navigate('/vertical-head/department')
            }
          >
            My Department
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
              gap: '8px'
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
                color: 'var(--aaib-primary)',
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
            RESOURCE REQUESTS
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
              Pending Resource Requests
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
                navigate('/vertical-head/resource-requests')
              }
            >
              View All
            </button>
          </div>


          {isLoading ? (

            <div className="aaib-stack">

              <div
                className="aaib-skeleton aaib-skeleton-card"
                style={{ height: '90px' }}
              />

              <div
                className="aaib-skeleton aaib-skeleton-card"
                style={{ height: '90px' }}
              />

            </div>

          ) : pendingRequests.length === 0 ? (

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
                No pending resource requests
              </h3>

              <p style={{ margin: 0 }}>
                There are currently no resource requests
                requiring your attention.
              </p>

            </div>

          ) : (

            <div className="aaib-stack">

              {pendingRequests
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
                          `/vertical-head/projects/${projectId}`
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
                          {project.status || 'Pending'}
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
            QUICK ACTIONS
        ====================== */}

        <div className="aaib-stack">

          <section
            className="aaib-panel"
            style={{
              padding: '24px'
            }}
          >

            <h2
              className="aaib-title"
              style={{
                fontSize: '16px',
                marginBottom: '16px'
              }}
            >
              Quick Access
            </h2>

            <div
              className="aaib-stack"
              style={{
                gap: '10px'
              }}
            >

              <button
                className="aaib-btn aaib-btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
                onClick={() =>
                  navigate('/vertical-head/resource-requests')
                }
              >
                Resource Requests
              </button>

              <button
                className="aaib-btn aaib-btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
                onClick={() =>
                  navigate('/vertical-head/department')
                }
              >
                My Department
              </button>

              <button
                className="aaib-btn aaib-btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
                onClick={() =>
                  navigate('/vertical-head/employee-discovery')
                }
              >
                Employee Discovery
              </button>

              <button
                className="aaib-btn aaib-btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
                onClick={() =>
                  navigate('/vertical-head/projects')
                }
              >
                Projects
              </button>

            </div>

          </section>


          {/* =====================
              NOTIFICATIONS
          ====================== */}

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
                  navigate('/vertical-head/notifications')
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

      </div>


      {/* =========================
          RECENT PROJECT UPDATES
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
            Recent Project Updates
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
              navigate('/vertical-head/projects')
            }
          >
            View Projects
          </button>

        </div>


        {isLoading ? (

          <div className="aaib-stack">

            <div
              className="aaib-skeleton aaib-skeleton-card"
              style={{ height: '80px' }}
            />

            <div
              className="aaib-skeleton aaib-skeleton-card"
              style={{ height: '80px' }}
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
              No project updates
            </h3>

            <p style={{ margin: 0 }}>
              There are currently no projects to display.
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
                      `/vertical-head/projects/${projectId}`
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
          DEPARTMENT OVERVIEW
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
            marginBottom: '20px'
          }}
        >

          <div>
            <h2
              className="aaib-title"
              style={{
                fontSize: '20px',
                marginBottom: '6px'
              }}
            >
              Department Overview
            </h2>

            <p
              className="aaib-subtitle"
              style={{
                margin: 0
              }}
            >
              Employee availability and assignment summary.
            </p>
          </div>

          <button
            className="aaib-btn aaib-btn-secondary"
            onClick={() =>
              navigate('/vertical-head/department')
            }
          >
            View Department
          </button>

        </div>


        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}
        >

          {[
            ['Total Employees', '—'],
            ['Assigned', '—'],
            ['Available', '—'],
            ['Unavailable', '—']
          ].map(([label, value]) => (

            <div
              key={label}
              style={{
                padding: '16px',
                border:
                  '1px solid var(--aaib-border)',
                borderRadius: '8px'
              }}
            >

              <span
                className="aaib-muted"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                {label}
              </span>

              <strong
                style={{
                  fontSize: '24px',
                  color: 'var(--aaib-primary)'
                }}
              >
                {isLoading ? '-' : value}
              </strong>

            </div>

          ))}

        </div>

      </section>


      {/* =========================
          ATTENTION
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
            Projects Requiring Attention
          </h2>

        </div>

        {projectsRequiringAttention.length === 0 ? (

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
              No projects currently require attention.
            </p>

          </div>

        ) : (

          <div className="aaib-stack">

            {projectsRequiringAttention
              .slice(0, 5)
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
                        `/vertical-head/projects/${projectId}`
                      )
                    }
                  >

                    <div
                      className="aaib-row-between"
                    >

                      <strong>
                        {getProjectName(project)}
                      </strong>

                      <span
                        className={`aaib-badge ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {project.status ||
                          'Requires Attention'}
                      </span>

                    </div>

                  </div>
                );
              })}

          </div>

        )}

      </section>

    </div>
  );
}