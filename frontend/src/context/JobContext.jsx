import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

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

  const fetchJobs = async (filters = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams(filters).toString()
      const res = await api.get(`/api/jobs${params ? '?' + params : ''}`)
      setJobs(res.data.data)
    } catch (error) {
      console.error('Fetch jobs error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/jobs/stats')
      setStats(res.data.data)
    } catch (error) {
      console.error('Fetch stats error:', error)
    }
  }

  const createJob = async (jobData) => {
    const res = await api.post('/api/jobs', jobData)
    setJobs([res.data.data, ...jobs])
    fetchStats()
    return res.data
  }

  const updateJob = async (id, jobData) => {
    const res = await api.put(`/api/jobs/${id}`, jobData)
    setJobs(jobs.map(job => job._id === id ? res.data.data : job))
    fetchStats()
    return res.data
  }

  const deleteJob = async (id) => {
    await api.delete(`/api/jobs/${id}`)
    setJobs(jobs.filter(job => job._id !== id))
    fetchStats()
  }

  useEffect(() => {
    fetchJobs()
    fetchStats()
  }, [])

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
