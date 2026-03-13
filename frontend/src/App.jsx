import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { JobProvider } from './context/JobContext'
import { InterviewProvider } from './context/InterviewContext'
import { ThemeProvider } from './context/ThemeContext'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Kanban from './pages/Kanban'
import Interviews from './pages/Interviews'
import Layout from './components/Layout'

function App() {
  return (
    <ThemeProvider>
      <JobProvider>
        <InterviewProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="kanban" element={<Kanban />} />
                <Route path="interviews" element={<Interviews />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </InterviewProvider>
      </JobProvider>
    </ThemeProvider>
  )
}

export default App
