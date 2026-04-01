import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

const TOKEN_KEY = 'token'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  const isAuthenticated = Boolean(token && user)

  const setSession = (nextToken, nextUser = null) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }

    setUser(nextUser)
  }

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/api/auth/me')
      setUser(res.data.data)
      return res.data.data
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
      return null
    }
  }

  const login = async (credentials) => {
    const res = await api.post('/api/auth/login', credentials)
    const nextUser = {
      _id: res.data.data._id,
      name: res.data.data.name,
      email: res.data.data.email
    }
    setSession(res.data.data.token, nextUser)
    return res.data.data
  }

  const register = async (payload) => {
    const res = await api.post('/api/auth/register', payload)
    const nextUser = {
      _id: res.data.data._id,
      name: res.data.data.name,
      email: res.data.data.email
    }
    setSession(res.data.data.token, nextUser)
    return res.data.data
  }

  const logout = () => {
    setSession(null, null)
  }

  useEffect(() => {
    const bootstrap = async () => {
      const existingToken = localStorage.getItem(TOKEN_KEY)
      if (!existingToken) {
        setLoading(false)
        return
      }

      await fetchCurrentUser()
      setLoading(false)
    }

    bootstrap()
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
