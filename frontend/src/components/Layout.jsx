import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiBriefcase, FiTrello, FiCalendar, FiMoon, FiSun, FiLogOut, FiMenu, FiX } from 'react-icons/fi'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition tap-target ${
      isActive ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`

  const mobileNavClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl tap-target transition ${
      isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60'
    }`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">JobTracker</h1>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/dashboard" className={navItemClass}>
                <FiHome className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/jobs" className={navItemClass}>
                <FiBriefcase className="w-5 h-5" />
                <span>Jobs</span>
              </NavLink>

              <NavLink to="/kanban" className={navItemClass}>
                <FiTrello className="w-5 h-5" />
                <span>Kanban</span>
              </NavLink>

              <NavLink to="/interviews" className={navItemClass}>
                <FiCalendar className="w-5 h-5" />
                <span>Interviews</span>
              </NavLink>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[220px]">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[220px]">{user?.email}</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 tap-target text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 tap-target text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="md:hidden p-2 tap-target text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-3 space-y-2">
                <NavLink
                  to="/dashboard"
                  className={navItemClass}
                >
                  <FiHome className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/jobs"
                  className={navItemClass}
                >
                  <FiBriefcase className="w-5 h-5" />
                  <span>Jobs</span>
                </NavLink>

                <NavLink
                  to="/kanban"
                  className={navItemClass}
                >
                  <FiTrello className="w-5 h-5" />
                  <span>Kanban</span>
                </NavLink>

                <NavLink
                  to="/interviews"
                  className={navItemClass}
                >
                  <FiCalendar className="w-5 h-5" />
                  <span>Interviews</span>
                </NavLink>

                <div className="px-4 pt-2 pb-1 border-t border-gray-200 dark:border-gray-700 mt-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 tap-target text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mobile-safe-bottom md:pb-8">
        <Outlet />
      </main>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-4 gap-2">
          <NavLink to="/dashboard" className={mobileNavClass}>
            <FiHome className="w-5 h-5" />
            <span className="text-[11px] font-medium">Home</span>
          </NavLink>
          <NavLink to="/jobs" className={mobileNavClass}>
            <FiBriefcase className="w-5 h-5" />
            <span className="text-[11px] font-medium">Jobs</span>
          </NavLink>
          <NavLink to="/kanban" className={mobileNavClass}>
            <FiTrello className="w-5 h-5" />
            <span className="text-[11px] font-medium">Kanban</span>
          </NavLink>
          <NavLink to="/interviews" className={mobileNavClass}>
            <FiCalendar className="w-5 h-5" />
            <span className="text-[11px] font-medium">Interviews</span>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Layout
