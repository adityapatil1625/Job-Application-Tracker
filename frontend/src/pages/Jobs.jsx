import { useState, useEffect, useRef } from 'react'
import { useJobs } from '../context/JobContext'
import JobModal from '../components/JobModal'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const CustomStatusDropdown = ({ job, handleStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const statuses = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

  const getColors = (status) => {
    switch (status) {
      case 'Offer': return 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 ring-emerald-500/20'
      case 'Interview': return 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-300 ring-yellow-500/20'
      case 'OA': return 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 ring-purple-500/20'
      case 'Rejected': return 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 ring-rose-500/20'
      default: return 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 ring-blue-500/20'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer transition-all border-0 shadow-sm ring-2 hover:opacity-80 ${getColors(job.status)}`}
      >
        {job.status}
        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[100] flex flex-col py-1"
          >
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => {
                  setIsOpen(false)
                  handleStatusChange(job, s)
                }}
                className={`px-4 py-2 text-sm font-medium text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${s === job.status ? 'bg-slate-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Jobs = () => {
  const { jobs, loading, fetchJobs, deleteJob, updateJob } = useJobs()
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [workModeFilter, setWorkModeFilter] = useState('all')

  useEffect(() => {
    const filters = {}
    if (search) filters.search = search
    if (statusFilter !== 'all') filters.status = statusFilter
    if (workModeFilter !== 'all') filters.workMode = workModeFilter
    fetchJobs(filters)
  }, [search, statusFilter, workModeFilter])

  const handleEdit = (job) => {
    setEditingJob(job)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteJob(id)
    }
  }

  const handleStatusChange = async (job, newStatus) => {
    if (job.status !== newStatus) {
      await updateJob(job._id, { ...job, status: newStatus })
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingJob(null)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Job Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your applications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 tap-target"
        >
          <FiPlus className="w-5 h-5" />
          <span className="sm:inline">Add Application</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="text-gray-400 w-4 h-4" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filters</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-52">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="all">All Status</option>
              <option value="Applied">Applied</option>
              <option value="OA">OA</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="w-full md:w-56">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Work Mode</label>
            <div className="relative">
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
                className="appearance-none px-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="all">All Work Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Work From Home">Work From Home</option>
              <option value="In Office">In Office</option>
            </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No applications found. Add your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md dark:hover:shadow-lg transition border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.company}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{job.role}</p>
                      {job.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{job.location}</p>
                      )}
                      {job.workMode && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{job.workMode}</p>
                      )}
                    </div>
                    <div className="flex items-center self-start sm:self-auto">
                      <CustomStatusDropdown job={job} handleStatusChange={handleStatusChange} />
                    </div>
                  </div>
                  
                  {job.notes && (
                    <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">{job.notes}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>Applied: {new Date(job.appliedDate).toLocaleDateString()}</span>
                    {job.link && (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Posting
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-start sm:ml-auto">
                  <button
                    onClick={() => handleEdit(job)}
                    className="p-2.5 tap-target text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2.5 tap-target text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
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
        <JobModal
          job={editingJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default Jobs
