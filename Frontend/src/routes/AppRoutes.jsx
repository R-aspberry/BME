import { Navigate, Route, Routes } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Login from '../pages/auth/Login'
import BODashboard from '../pages/bo/BODashboard'
import BOCalendar from '../pages/bo/Calendar'
import BOCreateProject from '../pages/bo/CreateProject'
import BOMyProjects from '../pages/bo/MyProjects'
import BONotifications from '../pages/bo/Notifications'
import BOProfile from '../pages/bo/Profile'
import BOProjectDetails from '../pages/bo/ProjectDetails'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

function BOFrame({ children }) {
  return <div className="app-root"><Header /><div className="layout"><Sidebar /><main className="main">{children}</main></div></div>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute roles={['BO']} />}>
          <Route path="/bo" element={<Navigate to="/bo/dashboard" replace />} />
          <Route path="/bo/dashboard" element={<BOFrame><BODashboard /></BOFrame>} />
          <Route path="/bo/projects" element={<BOFrame><BOMyProjects /></BOFrame>} />
          <Route path="/bo/projects/create" element={<BOFrame><BOCreateProject /></BOFrame>} />
          <Route path="/bo/projects/:id" element={<BOFrame><BOProjectDetails /></BOFrame>} />
          <Route path="/bo/notifications" element={<BOFrame><BONotifications /></BOFrame>} />
          <Route path="/bo/calendar" element={<BOFrame><BOCalendar /></BOFrame>} />
          <Route path="/bo/profile" element={<BOFrame><BOProfile /></BOFrame>} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
