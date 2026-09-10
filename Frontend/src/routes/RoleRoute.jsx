import { Navigate, Outlet } from 'react-router-dom'

export default function RoleRoute({ roles }) {
  const role = localStorage.getItem('role')

  return roles.includes(role)
    ? <Outlet />
    : <Navigate to="/404" replace />
}