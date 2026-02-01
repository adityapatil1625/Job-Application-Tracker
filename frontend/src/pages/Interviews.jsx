import { useState, useEffect } from 'react'
import { useInterviews } from '../context/InterviewContext'
import InterviewModal from '../components/InterviewModal'
import { FiPlus, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi'

const Interviews = () => {
  const { interviews, deleteInterview, fetchInterviews } = useInterviews()
  const [showModal, setShowModal] = useState(false)
  const [editingInterview, setEditingInterview] = useState(null)

  useEffect(() => {
    fetchInterviews()
  }, [])

  const handleEdit = (interview) => {
    setEditingInterview(interview)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await deleteInterview(id)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingInterview(null)
  }

  const sortedInterviews = [...interviews].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Plan and track your interviews</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {sortedInterviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
          <FiCalendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No interviews scheduled yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedInterviews.map((interview) => (
            <div key={interview._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md dark:hover:shadow-lg transition border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{interview.company}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{interview.role}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{interview.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                    </div>
                    {interview.time && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{interview.time}</p>
                      </div>
                    )}
                    {interview.location && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{interview.location}</p>
                      </div>
                    )}
                    {interview.interviewer && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Interviewer</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{interview.interviewer}</p>
                      </div>
                    )}
                  </div>

                  {interview.meetingLink && (
                    <div className="mt-3">
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        Join Meeting →
                      </a>
                    </div>
                  )}

                  {interview.notes && (
                    <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">{interview.notes}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(interview)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(interview._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <InterviewModal
          interview={editingInterview}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default Interviews
