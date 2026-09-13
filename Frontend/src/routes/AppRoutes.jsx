import { Navigate, Route, Routes } from 'react-router-dom'

import Login from '../pages/auth/Login'

// Dashboards
import BODashboard from '../pages/bo/BODashboard'
import MyProjects from '../pages/bo/MyProjects'
import CreateProject from '../pages/bo/CreateProject'
import Calendar from '../pages/bo/Calendar'
import Notifications from '../pages/bo/Notifications'
import Profile from '../pages/bo/Profile'
import ProjectDetails from '../pages/bo/ProjectDetails'
import EmployeeDashboard from '../pages/employee/EmployeeDashboard'

import PlannerLayout from '../pages/resourcePlanner/PlannerLayout'
import PlannerDashboard from '../pages/resourcePlanner/PlannerDashboard'
import PlannerEmployees from '../pages/resourcePlanner/PlannerEmployees'
import PlannerPortfolio from '../pages/resourcePlanner/PlannerPortfolio'
import PlannerRequests from '../pages/resourcePlanner/PlannerRequests'

import PODashboard from '../pages/po/PODashboard'

import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

import POProjectRequests from '../pages/po/ProjectRequests'
import POMyProjects from '../pages/po/MyProjects'
import POProjectDetails from '../pages/po/ProjectDetails'
import POResourceRequests from '../pages/po/ResourceRequests'
import POEmployeeDirectory from '../pages/po/EmployeeDiscovery'
import POEmployeeDetails from '../pages/po/EmployeeDetails'
import PONotifications from '../pages/po/Notifications'
import POCalendar from '../pages/po/Calendar'
import POProfile from '../pages/po/Profile'

import VerticalHeadDashboard from '../pages/verticalHead/VerticalHeadDashboard'
import VHEmployeeDiscovery from '../pages/verticalHead/EmployeeDiscovery'
import VHEmployeeDetails from '../pages/verticalHead/EmployeeDetails'

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

      {/* =========================
          PUBLIC
      ========================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/404"
        element={<NotFound />}
      />


      {/* =========================
          AUTHENTICATED USERS
      ========================== */}

      <Route element={<ProtectedRoute />}>


        {/* =====================
            BUSINESS OWNER
        ====================== */}

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


        {/* =====================
    RESOURCE PLANNER
====================== */}

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

        {/* =====================
            EMPLOYEE
        ====================== */}

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


        {/* =====================
            HEAD OF PO
        ====================== */}

        <Route element={<RoleRoute roles={['HeadOfPO']} />}>

  <Route
    path="/po"
    element={
      <Navigate
        to="/po/dashboard"
        replace
      />
    }
  />

  <Route
    path="/po/dashboard"
    element={<PODashboard />}
  />

  <Route
    path="/po/project-requests"
    element={<POProjectRequests />}
  />

  <Route
    path="/po/my-projects"
    element={<POMyProjects />}
  />

  <Route
    path="/po/projects/:id"
    element={<POProjectDetails />}
  />

  <Route
    path="/po/resource-requests"
    element={<POResourceRequests />}
  />

  <Route
    path="/po/employees"
    element={<POEmployeeDirectory />}
  />

  <Route
    path="/po/employees/:id"
    element={<POEmployeeDetails />}
  />

  <Route
    path="/po/notifications"
    element={<PONotifications />}
  />

  <Route
    path="/po/calendar"
    element={<POCalendar />}
  />

  <Route
    path="/po/profile"
    element={<POProfile />}
  />

</Route>


        {/* =====================
            VERTICAL HEAD
        ====================== */}

        <Route element={<RoleRoute roles={['Head']} />}>
        <Route
  path="/vertical-head/employees/:id"
  element={<VHEmployeeDetails />}
/>
<Route
  path="/vertical-head/employee-discovery"
  element={<VHEmployeeDiscovery />}
/>
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


      {/* =========================
          DEFAULT
      ========================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

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