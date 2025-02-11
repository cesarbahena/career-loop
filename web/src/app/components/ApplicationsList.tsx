'use client';

import { useEffect, useState } from 'react';

type Application = {
  id: number;
  title: string;
  company: string;
  url: string;
  status: string;
  appliedAt: string;
};

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch('/api/applications');
        if (!res.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Job Applications</h1>
      <ul>
        {applications.map((app) => (
          <li key={app.id} className="border p-4 mb-2 rounded">
            <h2 className="font-bold">{app.title}</h2>
            <p>{app.company}</p>
            <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View Job
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
