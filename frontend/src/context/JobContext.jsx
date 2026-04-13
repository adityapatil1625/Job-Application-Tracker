import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const JobContext = createContext()

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error('useJobs must be used within JobProvider')
  }
  return context
}

export const JobProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
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
      toast.error(error.response?.data?.message || 'Failed to fetch tracking data')
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
    try {
      const res = await api.post('/api/jobs', jobData)
      setJobs([res.data.data, ...jobs])
      fetchStats()
      toast.success('Application tracked successfully!')
      return res.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add application')
      throw error
    }
  }

  const updateJob = async (id, jobData) => {
    let previousJobs = null

    // Optimistic UI: reflect edits immediately, then reconcile with server response.
    setJobs((prevJobs) => {
      previousJobs = prevJobs
      return prevJobs.map((job) => (job._id === id ? { ...job, ...jobData } : job))
    })

    try {
      const res = await api.put(`/api/jobs/${id}`, jobData)
      setJobs((prevJobs) => prevJobs.map(job => job._id === id ? res.data.data : job))
      fetchStats()
      toast.success('Updated successfully')
      return res.data
    } catch (error) {
      if (previousJobs) {
        setJobs(previousJobs)
      }
      toast.error(error.response?.data?.message || 'Failed to update application')
      throw error
    }
  }

  const deleteJob = async (id) => {
    try {
      await api.delete(`/api/jobs/${id}`)
      setJobs((prevJobs) => prevJobs.filter(job => job._id !== id))
      fetchStats()
      toast.success('Application deleted')
    } catch (error) {
      toast.error('Failed to delete application')
      throw error
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setJobs([])
      setStats({})
      setLoading(false)
      return
    }

    fetchJobs()
    fetchStats()
  }, [isAuthenticated])

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
