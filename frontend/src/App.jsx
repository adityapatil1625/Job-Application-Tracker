import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { JobProvider } from './context/JobContext'
import { InterviewProvider } from './context/InterviewContext'
import { ThemeProvider } from './context/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Kanban from './pages/Kanban'
import Interviews from './pages/Interviews'
import Layout from './components/Layout'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JobProvider>
          <InterviewProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="kanban" element={<Kanban />} />
                  <Route path="interviews" element={<Interviews />} />
                </Route>
              </Routes>
            </Router>
          </InterviewProvider>
        </JobProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
