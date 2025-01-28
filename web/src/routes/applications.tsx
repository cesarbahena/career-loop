import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { getJobApplications, createJobApplication } from '../lib/server-functions'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/applications')({
  loader: async () => {
    const applications = await getJobApplications()
    return { applications }
  },
  component: Applications,
})

const statusColors = {
  saved: 'bg-gray-100 text-gray-800',
  applied: 'bg-blue-100 text-blue-800',
  interviewing: 'bg-yellow-100 text-yellow-800',
  offer_received: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-600',
}

function JobApplicationForm({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobUrl: '',
    status: 'saved' as const,
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const createMutation = useServerFn(createJobApplication)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    try {
      await createMutation.mutate({ data: formData })
      onSuccess()
      onClose()
    } catch (error: any) {
      if (error?.formError) {
        setErrors(error.formError.fieldErrors || {})
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Job Application</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
          </div>

          <div>
            <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Job URL
            </label>
            <input
              type="url"
              id="jobUrl"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
            {errors.jobUrl && <p className="text-red-500 text-xs mt-1">{errors.jobUrl}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer_received">Offer Received</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Applications() {
  const { applications } = Route.useLoaderData()
  const [isAddingNew, setIsAddingNew] = useState(false)
  const queryClient = useQueryClient()

  const handleAddNew = () => {
    setIsAddingNew(true)
  }

  const handleFormSuccess = () => {
    // Invalidate and refetch applications
    queryClient.invalidateQueries({ queryKey: ['applications'] })
    // For immediate update, we could also manually refetch the loader
    window.location.reload()
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <Button onClick={handleAddNew}>
          Add New Application
        </Button>
      </div>
      
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No job applications yet</p>
          <Button onClick={handleAddNew}>Add your first application</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.jobTitle}
                  </h3>
                  <p className="text-gray-600">{app.companyName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>
              
              {app.jobUrl && (
                <a 
                  href={app.jobUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mb-2 block"
                >
                  View Job Posting →
                </a>
              )}
              
              {app.notes && (
                <p className="text-gray-700 text-sm mb-2">{app.notes}</p>
              )}
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Added: {formatDate(app.createdAt)}</span>
                {app.appliedAt && (
                  <span>Applied: {formatDate(app.appliedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isAddingNew && (
        <JobApplicationForm
          onClose={() => setIsAddingNew(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
