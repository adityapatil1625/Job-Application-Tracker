import { useJobs } from '../context/JobContext'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const AnalyticsCharts = () => {
  const { stats } = useJobs()

  const conversationRate = stats.total 
    ? ((stats.Interview || 0) / stats.total * 100).toFixed(1)
    : 0

  const offerRate = stats.total 
    ? ((stats.Offer || 0) / stats.total * 100).toFixed(1)
    : 0

  const data = [
    { name: 'Applied', value: stats.Applied || 0, color: '#3b82f6' },
    { name: 'OA', value: stats.OA || 0, color: '#a855f7' },
    { name: 'Interview', value: stats.Interview || 0, color: '#eab308' },
    { name: 'Offer', value: stats.Offer || 0, color: '#22c55e' },
    { name: 'Rejected', value: stats.Rejected || 0, color: '#ef4444' }
  ].filter(item => item.value > 0) // Only show statuses with at least 1 application

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{payload[0].name}</p>
          <p className="text-sm font-medium" style={{ color: payload[0].payload.color }}>
            {payload[0].value} Applications
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversion Rate */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6 group hover:shadow-lg transition-all duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition duration-500"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider relative z-10">Interview Rate</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mt-3 relative z-10">{conversationRate}%</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium relative z-10">
            {stats.Interview || 0} of {stats.total || 0} got interviews
          </p>
        </div>

        {/* Offer Rate */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6 group hover:shadow-lg transition-all duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition duration-500"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider relative z-10">Offer Rate</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mt-3 relative z-10">{offerRate}%</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium relative z-10">
            {stats.Offer || 0} offers received
          </p>
        </div>

        {/* Rejection Rate */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6 group hover:shadow-lg transition-all duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition duration-500"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider relative z-10">Rejection Rate</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 mt-3 relative z-10">
            {stats.total ? ((stats.Rejected || 0) / stats.total * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium relative z-10">
            {stats.Rejected || 0} rejections total
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Doughnut */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Pipeline Breakdown</h3>
          <div className="h-64">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium">
                 No applications to display yet.
               </div>
            )}
          </div>
        </div>
        
        {/* Quick Insights (Placeholder for further metrics) */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Keep up the momentum!</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                You've got {stats.total || 0} total applications in play right now. Consistent pipeline volume is the key to maximizing offers.
            </p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
