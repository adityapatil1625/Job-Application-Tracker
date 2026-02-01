import { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useJobs } from '../context/JobContext'
import JobModal from '../components/JobModal'
import { FiPlus } from 'react-icons/fi'

const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

const JobCard = ({ job, onEdit }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'job',
    item: { id: job._id, status: job.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      onClick={() => onEdit(job)}
      className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 cursor-move hover:shadow-md dark:hover:shadow-lg transition ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">{job.company}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.role}</p>
      {job.location && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{job.location}</p>
      )}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {new Date(job.appliedDate).toLocaleDateString()}
      </div>
    </div>
  )
}

const Column = ({ status, jobs, onDrop, onEdit }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'job',
    drop: (item) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const colors = {
    Applied: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
    OA: 'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700',
    Interview: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
    Offer: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
    Rejected: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
  }

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[280px] ${colors[status]} border-2 rounded-xl p-4 transition ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white">{status}</h2>
        <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-full text-sm font-medium dark:text-gray-300">
          {jobs.length}
        </span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onEdit={onEdit} />
        ))}
      </div>
    </div>
  )
}

const Kanban = () => {
  const { jobs, updateJob, fetchJobs } = useJobs()
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleDrop = async (jobId, newStatus) => {
    const job = jobs.find((j) => j._id === jobId)
    if (job && job.status !== newStatus) {
      await updateJob(jobId, { ...job, status: newStatus })
    }
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingJob(null)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Drag and drop to update status</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Application</span>
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              jobs={jobs.filter((job) => job.status === status)}
              onDrop={handleDrop}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {showModal && (
          <JobModal
            job={editingJob}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </DndProvider>
  )
}

export default Kanban
