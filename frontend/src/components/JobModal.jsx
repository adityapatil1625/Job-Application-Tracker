import { useState, useEffect } from 'react'
import { useJobs } from '../context/JobContext'
import { FiX, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'

const JobModal = ({ job, onClose }) => {
  const { createJob, updateJob } = useJobs()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    link: '',
    location: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    notes: ''
  })

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || '',
        role: job.role || '',
        link: job.link || '',
        location: job.location || '',
        appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : '',
        status: job.status || 'Applied',
        notes: job.notes || ''
      })
    }
  }, [job])

  useEffect(() => {
    // Magic Auto-Fill: Try to extract company name from ATS/Job Board URLs
    if (!formData.link || job || formData.company) return; // Only auto-fill for new apps, if link provided, and company is empty

    const url = formData.link.toLowerCase();
    let detectedCompany = '';
    let fromPlatform = '';
    
    try {
      if (url.includes('internshala.com/internship')) {
        const match = url.match(/-at-([a-z0-9-]+)(?:\d{5,})/);
        if (match) detectedCompany = match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        fromPlatform = 'Internshala';
      } else if (url.includes('greenhouse.io') || url.includes('lever.co') || url.includes('ashbyhq.com')) {
        const match = url.match(/(?:boards\.greenhouse\.io|jobs\.lever\.co|boards\.ashbyhq\.com|jobs\.ashbyhq\.com)\/([a-z0-9-]+)/);
        if (match) detectedCompany = match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        fromPlatform = 'ATS Board';
      } else if (url.includes('wellfound.com') || url.includes('angel.co')) {
        const match = url.match(/company\/([a-z0-9-]+)/);
        if (match) detectedCompany = match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        fromPlatform = 'Wellfound';
      } else if (url.includes('workaday.com') || url.includes('myworkdayjobs.com')) {
        // e.g., company.myworkdayjobs.com
        const match = url.match(/:\/\/([a-z0-9-]+)\.myworkdayjobs\.com/);
        if (match) detectedCompany = match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        fromPlatform = 'Workday';
      }
      
      if (detectedCompany) {
        setFormData(prev => ({ ...prev, company: detectedCompany }));
        toast.success(`✨ Magic Auto-filled: ${detectedCompany} via ${fromPlatform}`, { icon: '✨' });
      }
    } catch (e) {
      console.log('Error parsing URL:', e);
    }
  }, [formData.link, job, formData.company])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (job) {
        await updateJob(job._id, formData)
      } else {
        await createJob(formData)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {job ? 'Edit Application' : 'Add New Application'}
            {!job && <FiZap className="text-blue-500 w-5 h-5 ml-1 animate-pulse" title="Magic Auto-Fill Enabled" />}
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 tap-target hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                placeholder="e.g., Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Role *
              </label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                <span>Job Link</span>
                <span className="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1"><FiZap /> Paste to auto-fill</span>
              </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Applied Date *
              </label>
              <input
                type="date"
                name="appliedDate"
                required
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            >
              <option value="Applied">Applied</option>
              <option value="OA">OA</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              placeholder="Add any notes, referrals, or reminders..."
            ></textarea>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 tap-target rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 tap-target rounded-lg font-medium text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : job ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobModal
