import { useJobs } from '../context/JobContext'
import { FiDownload, FiUpload } from 'react-icons/fi'
import api from '../utils/api'

const ExportImport = () => {
  const { fetchJobs, fetchStats } = useJobs()

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/api/jobs/export/csv', {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'job-applications.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export CSV')
    }
  }

  const handleImportCSV = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/api/jobs/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('Jobs imported successfully!')
      fetchJobs()
      fetchStats()
    } catch (error) {
      console.error('Import error:', error)
      alert('Failed to import CSV')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <button
        onClick={handleExportCSV}
        className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center space-x-2"
      >
        <FiDownload className="w-5 h-5" />
        <span>Export CSV</span>
      </button>
      
      <label className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center space-x-2 cursor-pointer">
        <FiUpload className="w-5 h-5" />
        <span>Import CSV</span>
        <input
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          className="hidden"
        />
      </label>
    </div>
  )
}

export default ExportImport
