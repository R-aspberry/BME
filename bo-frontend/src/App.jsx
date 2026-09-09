import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectCreate from './pages/ProjectCreate'
import ProjectDetail from './pages/ProjectDetail'
import Profile from './pages/Profile'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import BOLayout from './pages/BusinessOwner/BOLayout'
import BODashboard from './pages/BusinessOwner/Dashboard/BODashboard'
import BOProjectList from './pages/BusinessOwner/Projects/BOProjectList'
import EmployeeLayout from './pages/Employee/EmployeeLayout'
import EmployeeDashboard from './pages/Employee/EmployeeDashboard'
import EmployeeProjects from './pages/Employee/EmployeeProjects'
import EmployeePortfolios from './pages/Employee/EmployeePortfolios'
import EmployeeCalendar from './pages/Employee/EmployeeCalendar'
import EmployeeNotifications from './pages/Employee/EmployeeNotifications'
import EmployeeProfile from './pages/Employee/EmployeeProfile'

// 1. Update RequireAuth to act as a layout guard using <Outlet />
function RequireAuth() {
  const token = localStorage.getItem('token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

function RequireBO() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  return token && role === 'BO' ? <Outlet /> : <Navigate to="/login" replace />
}

// 2. Create a specific layout component for authenticated users
function AuthenticatedLayout() {
  return (
    <div className="app-root">
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<ProjectCreate />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RequireBO />}>
        <Route element={<BOLayout />}>
          <Route path="/bo" element={<Navigate to="/bo/dashboard" replace />} />
          <Route path="/bo/dashboard" element={<BODashboard />} />
          <Route path="/bo/projects" element={<BOProjectList />} />
          <Route path="/bo/projects/create" element={<ProjectCreate />} />
          <Route path="/bo/notifications" element={<div>Notifications</div>} />
          <Route path="/bo/calendar" element={<div>Calendar</div>} />
          <Route path="/bo/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RequireEmployee />}>
        <Route element={<EmployeeLayout />}>
          <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/projects" element={<EmployeeProjects />} />
          <Route path="/employee/projects/:id" element={<ProjectDetail />} />
          <Route path="/employee/portfolios" element={<EmployeePortfolios />} />
          <Route path="/employee/calendar" element={<EmployeeCalendar />} />
          <Route path="/employee/notifications" element={<EmployeeNotifications />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
        </Route>
      </Route>
    </Routes>
  )
}

function RequireEmployee() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  return token && role === 'Employee' ? <Outlet /> : <Navigate to="/login" replace />
}