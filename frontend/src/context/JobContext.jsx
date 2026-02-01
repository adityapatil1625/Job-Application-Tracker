import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const JobContext = createContext()

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error('useJobs must be used within JobProvider')
  }
  return context
}

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const fetchJobs = async (filters = {}) => {
    if (!token) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams(filters).toString()
      const res = await axios.get(`/api/jobs${params ? '?' + params : ''}`)
      setJobs(res.data.data)
    } catch (error) {
      console.error('Fetch jobs error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!token) return
    
    try {
      const res = await axios.get('/api/jobs/stats')
      setStats(res.data.data)
    } catch (error) {
      console.error('Fetch stats error:', error)
    }
  }

  const createJob = async (jobData) => {
    const res = await axios.post('/api/jobs', jobData)
    setJobs([res.data.data, ...jobs])
    fetchStats()
    return res.data
  }

  const updateJob = async (id, jobData) => {
    const res = await axios.put(`/api/jobs/${id}`, jobData)
    setJobs(jobs.map(job => job._id === id ? res.data.data : job))
    fetchStats()
    return res.data
  }

  const deleteJob = async (id) => {
    await axios.delete(`/api/jobs/${id}`)
    setJobs(jobs.filter(job => job._id !== id))
    fetchStats()
  }

  useEffect(() => {
    if (token) {
      fetchJobs()
      fetchStats()
    }
  }, [token])

  const value = {
    jobs,
    stats,
    loading,
    fetchJobs,
    fetchStats,
    createJob,
    updateJob,
    deleteJob
  }

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}
