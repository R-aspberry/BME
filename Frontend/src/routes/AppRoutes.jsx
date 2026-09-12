import { Navigate, Route, Routes } from 'react-router-dom'

import Login from '../pages/auth/Login'

// =========================================================
// BUSINESS OWNER
// =========================================================
import BODashboard from '../pages/bo/BODashboard'
import MyProjects from '../pages/bo/MyProjects'
import CreateProject from '../pages/bo/CreateProject'
import Calendar from '../pages/bo/Calendar'
import Notifications from '../pages/bo/Notifications'
import Profile from '../pages/bo/Profile'
import ProjectDetails from '../pages/bo/ProjectDetails'

// =========================================================
// EMPLOYEE
// =========================================================
import EmployeeDashboard from '../pages/employee/EmployeeDashboard'

// =========================================================
// RESOURCE PLANNER
// =========================================================
import PlannerLayout from '../pages/resourcePlanner/PlannerLayout'
import PlannerDashboard from '../pages/resourcePlanner/PlannerDashboard'
import PlannerEmployees from '../pages/resourcePlanner/PlannerEmployees'
import PlannerPortfolio from '../pages/resourcePlanner/PlannerPortfolio'
import PlannerRequests from '../pages/resourcePlanner/PlannerRequests'

// =========================================================
// PRODUCT OWNER
// =========================================================
import PODashboard from '../pages/po/PODashboard'
import POProjectRequests from '../pages/po/ProjectRequests'
import POMyProjects from '../pages/po/MyProjects'
import POProjectDetails from '../pages/po/ProjectDetails'
import POResourceRequests from '../pages/po/ResourceRequests'
import POEmployeeDirectory from '../pages/po/EmployeeDiscovery'
import POEmployeeDetails from '../pages/po/EmployeeDetails'
import PONotifications from '../pages/po/Notifications'
import POCalendar from '../pages/po/Calendar'
import POProfile from '../pages/po/Profile'

// =========================================================
// VERTICAL HEAD
// =========================================================
import VerticalHeadDashboard from '../pages/verticalHead/VerticalHeadDashboard'

// =========================================================
// ROUTE GUARDS
// =========================================================
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'


function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        The page you are looking for does not exist
        or has not been implemented yet.
      </p>
    </div>
  )
}


export default function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ====================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/404"
        element={<NotFound />}
      />


      {/* =====================================================
          ALL AUTHENTICATED ROUTES
      ====================================================== */}

      <Route element={<ProtectedRoute />}>


        {/* ===================================================
            BUSINESS OWNER
        ==================================================== */}

        <Route element={<RoleRoute roles={['BO']} />}>

          <Route
            path="/bo"
            element={
              <Navigate
                to="/bo/dashboard"
                replace
              />
            }
          />

          <Route
            path="/bo/dashboard"
            element={<BODashboard />}
          />

          <Route
            path="/bo/projects"
            element={<MyProjects />}
          />

          <Route
            path="/bo/projects/create"
            element={<CreateProject />}
          />

          <Route
            path="/bo/projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="/bo/calendar"
            element={<Calendar />}
          />

          <Route
            path="/bo/notifications"
            element={<Notifications />}
          />

          <Route
            path="/bo/profile"
            element={<Profile />}
          />

        </Route>


        {/* ===================================================
            RESOURCE PLANNER
        ==================================================== */}

        <Route element={<RoleRoute roles={['ResourcePlanner']} />}>

          <Route
            path="/resource-planner"
            element={<PlannerLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<PlannerDashboard />}
            />

            <Route
              path="employees"
              element={<PlannerEmployees />}
            />

            <Route
              path="portfolio"
              element={<PlannerPortfolio />}
            />

            <Route
              path="requests"
              element={<PlannerRequests />}
            />
          </Route>

        </Route>


        {/* ===================================================
            EMPLOYEE
        ==================================================== */}

        <Route element={<RoleRoute roles={['Employee']} />}>

          <Route
            path="/employee"
            element={
              <Navigate
                to="/employee/dashboard"
                replace
              />
            }
          />

          <Route
            path="/employee/dashboard"
            element={<EmployeeDashboard />}
          />

        </Route>


        {/* ===================================================
            PRODUCT OWNER
        ==================================================== */}

        <Route element={<RoleRoute roles={['HeadOfPO']} />}>

          {/* /po → dashboard */}

          <Route
            path="/po"
            element={
              <Navigate
                to="/po/dashboard"
                replace
              />
            }
          />


          {/* ===============================
              DASHBOARD
          ================================ */}

          <Route
            path="/po/dashboard"
            element={<PODashboard />}
          />


          {/* ===============================
              PROJECT REQUESTS
          ================================ */}

          <Route
            path="/po/project-requests"
            element={<POProjectRequests />}
          />


          {/* ===============================
              MY PROJECTS
              CANONICAL ROUTE
          ================================ */}

          <Route
            path="/po/projects"
            element={<POMyProjects />}
          />


          {/* ===============================
              OLD/ALTERNATIVE ROUTE
              REDIRECT TO CANONICAL ROUTE
          ================================ */}

          <Route
            path="/po/my-projects"
            element={
              <Navigate
                to="/po/projects"
                replace
              />
            }
          />


          {/* ===============================
              PROJECT DETAILS
          ================================ */}

          <Route
            path="/po/projects/:id"
            element={<POProjectDetails />}
          />


          {/* ===============================
              RESOURCE REQUESTS
          ================================ */}

          <Route
            path="/po/resource-requests"
            element={<POResourceRequests />}
          />


          {/* ===============================
              EMPLOYEES
          ================================ */}

          <Route
            path="/po/employees"
            element={<POEmployeeDirectory />}
          />


          {/* ===============================
              EMPLOYEE DETAILS
          ================================ */}

          <Route
            path="/po/employees/:id"
            element={<POEmployeeDetails />}
          />


          {/* ===============================
              NOTIFICATIONS
          ================================ */}

          <Route
            path="/po/notifications"
            element={<PONotifications />}
          />


          {/* ===============================
              CALENDAR
          ================================ */}

          <Route
            path="/po/calendar"
            element={<POCalendar />}
          />


          {/* ===============================
              PROFILE
          ================================ */}

          <Route
            path="/po/profile"
            element={<POProfile />}
          />

        </Route>


        {/* ===================================================
            VERTICAL HEAD
        ==================================================== */}

        <Route element={<RoleRoute roles={['Head']} />}>

          <Route
            path="/vertical-head"
            element={
              <Navigate
                to="/vertical-head/dashboard"
                replace
              />
            }
          />

          <Route
            path="/vertical-head/dashboard"
            element={<VerticalHeadDashboard />}
          />

        </Route>

      </Route>


      {/* =====================================================
          ROOT
      ====================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =====================================================
          CATCH ALL
      ====================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/404"
            replace
          />
        }
      />

    </Routes>
  )
}