import axios from 'axios'

const normalizeBaseUrl = (url) => {
  if (!url) return ''

  // Support values like https://api.example.com or https://api.example.com/api
  const cleaned = url.trim().replace(/\/+$/, '')
  return cleaned.replace(/\/api$/i, '')
}

const resolvedBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL) || 'http://localhost:5000'

// Create axios instance with base URL
const api = axios.create({
  baseURL: resolvedBaseUrl
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/dashboard'
    }
    return Promise.reject(error)
  }
)

export default api
