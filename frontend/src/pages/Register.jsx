import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBriefcase, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
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
      await register(formData)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,_#f8fafc,_#e0f2fe_50%,_#f8fafc)] dark:bg-[linear-gradient(160deg,_#020617,_#0f172a_50%,_#020617)] px-4 py-10">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-8 items-center min-h-[calc(100vh-5rem)]">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-4 py-2 border border-slate-200 dark:border-slate-800 shadow-sm">
              <FiBriefcase className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Private application tracker</span>
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Create your account and keep your job search data yours.
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Register once, then track applications, interviews, offers, and notes in your own personal workspace.
            </p>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create account</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Start tracking your own job applications in minutes.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Name</span>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your full name"
                />
              </div>
            </label>

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
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="At least 6 characters"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 transition"
            >
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
