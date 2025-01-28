import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-gray-700 dark:text-gray-300">
        Configure your application preferences here.
      </p>
      {/* TODO: Implement various application settings */}
    </div>
  )
}
