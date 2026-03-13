import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const InterviewContext = createContext()

export const useInterviews = () => {
  const context = useContext(InterviewContext)
  if (!context) {
    throw new Error('useInterviews must be used within InterviewProvider')
  }
  return context
}

export const InterviewProvider = ({ children }) => {
  const [interviews, setInterviews] = useState([])
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchInterviews = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/interviews')
      setInterviews(res.data.data)
    } catch (error) {
      console.error('Fetch interviews error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcomingInterviews = async () => {
    try {
      const res = await axios.get('/api/interviews/upcoming')
      setUpcomingInterviews(res.data.data)
    } catch (error) {
      console.error('Fetch upcoming error:', error)
    }
  }

  const createInterview = async (interviewData) => {
    const res = await axios.post('/api/interviews', interviewData)
    setInterviews([...interviews, res.data.data])
    fetchUpcomingInterviews()
    return res.data
  }

  const updateInterview = async (id, interviewData) => {
    const res = await axios.put(`/api/interviews/${id}`, interviewData)
    setInterviews(interviews.map(i => i._id === id ? res.data.data : i))
    fetchUpcomingInterviews()
    return res.data
  }

  const deleteInterview = async (id) => {
    await axios.delete(`/api/interviews/${id}`)
    setInterviews(interviews.filter(i => i._id !== id))
    fetchUpcomingInterviews()
  }

  useEffect(() => {
    fetchInterviews()
    fetchUpcomingInterviews()
  }, [])

  const value = {
    interviews,
    upcomingInterviews,
    loading,
    fetchInterviews,
    fetchUpcomingInterviews,
    createInterview,
    updateInterview,
    deleteInterview
  }

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>
}
