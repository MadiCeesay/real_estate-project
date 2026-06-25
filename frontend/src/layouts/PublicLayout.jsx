import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ErrorBoundary from '../components/common/ErrorBoundary'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname)

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <ErrorBoundary resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      {!isAuthPage && <Footer />}
    </>
  )
}
