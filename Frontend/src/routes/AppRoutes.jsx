import { Navigate, Route, Routes } from 'react-router-dom'

import Login from '../pages/auth/Login'

// Dashboards
import BODashboard from '../pages/bo/BODashboard'
import EmployeeDashboard from '../pages/employee/EmployeeDashboard'
import PlannerDashboard from '../pages/resourcePlanner/PlannerDashboard'
import PODashboard from '../pages/po/PODashboard'
import VerticalHeadDashboard from '../pages/verticalHead/VerticalHeadDashboard'

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

        </Route>


        {/* =====================
            RESOURCE PLANNER
        ====================== */}

        <Route element={<RoleRoute roles={['ResourcePlanner']} />}>

          <Route
            path="/resource-planner"
            element={
              <Navigate
                to="/resource-planner/dashboard"
                replace
              />
            }
          />

          <Route
            path="/resource-planner/dashboard"
            element={<PlannerDashboard />}
          />

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

        </Route>


        {/* =====================
            VERTICAL HEAD
        ====================== */}

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