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

// 1. Update RequireAuth to act as a layout guard using <Outlet />
function RequireAuth() {
  const token = localStorage.getItem('token')
  return token ? <Outlet /> : <Navigate to="/login" />
}

// 2. Create a specific layout component for authenticated users
function AuthenticatedLayout() {
  return (
    <div className="app-root">
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main">
          {/* <Outlet /> renders the nested child routes (Dashboard, Projects, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* 3. The Login route is now completely independent and has no layout */}
      <Route path="/login" element={<Login />} />

      {/* 4. Group all protected routes under the authentication and layout wrappers */}
      <Route element={<RequireAuth />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<ProjectCreate />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}