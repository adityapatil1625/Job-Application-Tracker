import { useJobs } from '../context/JobContext'

const AnalyticsCharts = () => {
  const { stats } = useJobs()

  const getStatusPercentage = (status) => {
    if (!stats.total) return 0
    return ((stats[status] || 0) / stats.total * 100).toFixed(1)
  }

  const conversationRate = stats.total 
    ? ((stats.Interview || 0) / stats.total * 100).toFixed(1)
    : 0

  const offerRate = stats.total 
    ? ((stats.Offer || 0) / stats.total * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Interview Rate</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{conversationRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.Interview || 0} of {stats.total || 0} got interviews</p>
        </div>

        {/* Offer Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Offer Rate</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{offerRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.Offer || 0} offers received</p>
        </div>

        {/* Rejection Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rejection Rate</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {stats.total ? ((stats.Rejected || 0) / stats.total * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.Rejected || 0} rejections</p>
        </div>
      </div>

      {/* Pie Chart Alternative */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Application Pipeline</h3>
        <div className="space-y-4">
          {['Applied', 'OA', 'Interview', 'Offer', 'Rejected'].map((status) => {
            const percentage = getStatusPercentage(status)
            const colors = {
              Applied: 'bg-blue-500 dark:bg-blue-600',
              OA: 'bg-purple-500 dark:bg-purple-600',
              Interview: 'bg-yellow-500 dark:bg-yellow-600',
              Offer: 'bg-green-500 dark:bg-green-600',
              Rejected: 'bg-red-500 dark:bg-red-600'
            }
            
            return (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{status}</span>
                  <span className="text-gray-600 dark:text-gray-400">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`${colors[status]} h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
