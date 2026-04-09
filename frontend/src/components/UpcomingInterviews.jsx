import { useEffect } from 'react'
import { useInterviews } from '../context/InterviewContext'
import { FiCalendar, FiClock, FiMapPin, FiUser } from 'react-icons/fi'

const UpcomingInterviews = () => {
  const { upcomingInterviews, fetchUpcomingInterviews } = useInterviews()

  useEffect(() => {
    fetchUpcomingInterviews()
  }, [])

  if (upcomingInterviews.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-orange-200 dark:border-orange-700 bg-gradient-to-r from-orange-50 dark:from-orange-900 to-red-50 dark:to-red-900 p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔔 Upcoming Interviews</h3>
      <div className="space-y-3">
        {upcomingInterviews.slice(0, 3).map((interview) => (
          <div key={interview._id} className="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 border-orange-500 dark:border-orange-400">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{interview.company}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{interview.type}</p>
              </div>
              <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded self-start sm:self-auto">
                {interview.type}
              </span>
            </div>
            
            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4" />
                <span>{new Date(interview.date).toLocaleDateString()}</span>
              </div>
              {interview.time && (
                <div className="flex items-center space-x-2">
                  <FiClock className="w-4 h-4" />
                  <span>{interview.time}</span>
                </div>
              )}
              {interview.location && (
                <div className="flex items-center space-x-2">
                  <FiMapPin className="w-4 h-4" />
                  <span>{interview.location}</span>
                </div>
              )}
              {interview.interviewer && (
                <div className="flex items-center space-x-2">
                  <FiUser className="w-4 h-4" />
                  <span>{interview.interviewer}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingInterviews
