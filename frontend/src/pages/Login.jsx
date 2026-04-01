import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBriefcase, FiLock, FiMail } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData)
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_40%,_#e2e8f0)] dark:bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_45%,_#020617)] px-4 py-10">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center min-h-[calc(100vh-5rem)]">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-4 py-2 border border-slate-200 dark:border-slate-800 shadow-sm">
              <FiBriefcase className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Track applications by account</span>
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Keep every application, interview, and offer tied to your own login.
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Sign in to manage your personal pipeline, update statuses, and keep your job search organized across devices.
            </p>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Sign in to your account to continue tracking applications.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 transition"
            >
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            New here?{' '}
            <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
