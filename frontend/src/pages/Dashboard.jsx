import { useEffect } from 'react'
import { useJobs } from '../context/JobContext'
import { FiBriefcase, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'
import UpcomingInterviews from '../components/UpcomingInterviews'
import AnalyticsCharts from '../components/AnalyticsCharts'
import ExportImport from '../components/ExportImport'

const Dashboard = () => {
  const { stats, jobs, fetchStats, fetchJobs } = useJobs()

  useEffect(() => {
    fetchStats()
    fetchJobs()
  }, [])

  const recentJobs = jobs.slice(0, 5)

  const statCards = [
    { label: 'Total Applications', value: stats.total || 0, icon: FiBriefcase, color: 'bg-blue-500' },
    { label: 'Interviews', value: stats.Interview || 0, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Offers', value: stats.Offer || 0, icon: FiCheckCircle, color: 'bg-green-500' },
    { label: 'Rejected', value: stats.Rejected || 0, icon: FiXCircle, color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your job application progress</p>
        </div>
        <ExportImport />
      </div>

      {/* Upcoming Interviews Alert */}
      <UpcomingInterviews />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Recent Applications */}
      <div className="card p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Applications</h2>
        {recentJobs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No applications yet. Start adding some!</p>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{job.company}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.role}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'Offer' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    job.status === 'Interview' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    job.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
