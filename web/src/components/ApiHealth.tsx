import { createServerFn, useServerFn } from '@tanstack/react-start';
import { db } from '../lib/db';

const getHealthStatus = createServerFn(
  'GET',
  async () => {
    try {
      // Test database connection
      await db.query.jobApplications.findFirst();
      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
        service: 'career-loop-frontend'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        service: 'career-loop-frontend',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
);

export function ApiHealth() {
  const healthQuery = useServerFn(getHealthStatus);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold">API Health Check</h2>
      {healthQuery.isPending && <p>Loading...</p>}
      {healthQuery.error && (
        <p className="text-red-500">Error: {healthQuery.error.message}</p>
      )}
      {healthQuery.data && (
        <div className="mt-2">
          <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${
            healthQuery.data.status === 'healthy' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {healthQuery.data.status.toUpperCase()}
          </div>
          <pre className="p-2 mt-2 bg-gray-100 rounded text-sm">
            <code>{JSON.stringify(healthQuery.data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
