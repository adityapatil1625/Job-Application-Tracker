import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { JobProvider } from './context/JobContext'
import { InterviewProvider } from './context/InterviewContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Kanban from './pages/Kanban'
import Interviews from './pages/Interviews'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'

function AppShell() {
  return (
    <JobProvider>
      <InterviewProvider>
        <Layout />
      </InterviewProvider>
    </JobProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Toaster position="bottom-right" />
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="kanban" element={<Kanban />} />
                <Route path="interviews" element={<Interviews />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
