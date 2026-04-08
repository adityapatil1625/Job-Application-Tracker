import { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useJobs } from '../context/JobContext'
import JobModal from '../components/JobModal'
import { FiPlus } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

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
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      ref={drag}
      onClick={() => onEdit(job)}
      className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-move transition-colors ${
        isDragging ? 'opacity-40 scale-105 shadow-xl ring-2 ring-blue-400 z-50 relative' : 'hover:shadow-md dark:hover:shadow-lg'
      }`}
    >
      <h3 className="font-semibold text-slate-900 dark:text-white truncate">{job.company}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">{job.role}</p>
      {job.location && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate bg-slate-100 dark:bg-slate-900 inline-block px-2 py-1 rounded-md">{job.location}</p>
      )}
      <div className="text-xs text-slate-500 dark:text-slate-500 mt-3 font-medium">
        {new Date(job.appliedDate).toLocaleDateString()}
      </div>
    </motion.div>
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
      className={`flex-1 min-w-[300px] border-2 rounded-2xl p-4 transition-all duration-300 ${colors[status]} ${
        isOver ? 'ring-4 ring-offset-2 ring-blue-500/50 dark:ring-offset-slate-900 scale-[1.01] shadow-xl' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase text-sm">{status}</h2>
        <span className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          {jobs.length}
        </span>
      </div>
      <div className="space-y-4 min-h-[200px]">
        <AnimatePresence>
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onEdit={onEdit} />
          ))}
        </AnimatePresence>
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
