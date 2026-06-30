import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FiGrid, FiHome, FiCalendar, FiUser, FiSettings, FiHeart, FiUsers, FiCheckSquare, FiBarChart2 } from 'react-icons/fi'

import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import { ROLES } from './constants'

// Public pages
import HomePage from './pages/public/HomePage'
import PropertiesPage from './pages/public/PropertiesPage'
import PropertyDetailPage from './pages/public/PropertyDetailPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage'
import ResetPasswordPage from './pages/public/ResetPasswordPage'
import NotFoundPage from './pages/public/NotFoundPage'

// User dashboard
import UserDashboardPage from './pages/user/UserDashboardPage'
import ProfilePage from './pages/user/ProfilePage'
import FavoritesPage from './pages/user/FavoritesPage'
import BookingsPage from './pages/user/BookingsPage'
import SettingsPage from './pages/user/SettingsPage'

// Agent dashboard
import AgentDashboardPage from './pages/agent/AgentDashboardPage'
import AgentListingsPage from './pages/agent/AgentListingsPage'
import AgentBookingsPage from './pages/agent/AgentBookingsPage'
import PropertyFormPage from './pages/agent/PropertyFormPage'

// Admin dashboard
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import ManagePropertiesPage from './pages/admin/ManagePropertiesPage'
import PropertyApprovalPage from './pages/admin/PropertyApprovalPage'

const userLinks = [
  { to: '/account', label: 'Overview', icon: FiGrid, end: true },
  { to: '/account/profile', label: 'My Profile', icon: FiUser },
  { to: '/favorites', label: 'Saved Properties', icon: FiHeart },
  { to: '/bookings', label: 'My Inquiries', icon: FiCalendar },
  { to: '/account/settings', label: 'Settings', icon: FiSettings },
]

const agentLinks = [
  { to: '/agent/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/agent/listings', label: 'My Listings', icon: FiHome },
  { to: '/agent/bookings', label: 'Viewing Requests', icon: FiCalendar },
]

const adminLinks = [
  { to: '/admin/dashboard', label: 'Analytics', icon: FiBarChart2, end: true },
  { to: '/admin/users', label: 'Manage Users', icon: FiUsers },
  { to: '/admin/properties', label: 'Manage Properties', icon: FiHome },
  { to: '/admin/approvals', label: 'Property Approval', icon: FiCheckSquare },
  { to: '/admin/bookings', label: 'All Bookings', icon: FiCalendar },
]

export default function App() {
  const { pathname } = useLocation()

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', fontSize: '14px' },
      }} />
      <ErrorBoundary resetKey={pathname}>
        <Routes>

          {/* ── Public routes ─────────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="properties/:id" element={<PropertyDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:token" element={<ResetPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="bookings" element={<BookingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── User account dashboard ────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<DashboardLayout links={userLinks} title="My Account" />}>
              <Route index element={<UserDashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ── Agent dashboard ───────────────────────────────────────── */}
          <Route element={<ProtectedRoute roles={[ROLES.AGENT, ROLES.ADMIN]} />}>
            <Route path="agent" element={<DashboardLayout links={agentLinks} title="Agent Dashboard" />}>
              <Route path="dashboard" element={<AgentDashboardPage />} />
              <Route path="listings" element={<AgentListingsPage />} />
              <Route path="listings/new" element={<PropertyFormPage />} />
              <Route path="listings/:id/edit" element={<PropertyFormPage />} />
              <Route path="bookings" element={<AgentBookingsPage />} />
            </Route>
          </Route>

          {/* ── Admin dashboard ───────────────────────────────────────── */}
          <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
            <Route path="admin" element={<DashboardLayout links={adminLinks} title="Admin" />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<ManageUsersPage />} />
              <Route path="properties" element={<ManagePropertiesPage />} />
              <Route path="properties/new" element={<PropertyFormPage />} />
              <Route path="properties/:id/edit" element={<PropertyFormPage />} />
              <Route path="approvals" element={<PropertyApprovalPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
            </Route>
          </Route>

        </Routes>
      </ErrorBoundary>
    </>
  )
}