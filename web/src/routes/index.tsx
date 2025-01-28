import { createFileRoute } from '@tanstack/react-router'
import { ApiHealth } from '../components/ApiHealth' // Keep ApiHealth for now as an example of an external component.

export const Route = createFileRoute('/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Career-Loop Dashboard!</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        This is your central hub for managing job applications, configurations, and tracking your job search progress.
      </p>
      <ApiHealth />
    </div>
  )
}