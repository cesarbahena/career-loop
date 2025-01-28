import React from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { LayoutDashboard, Briefcase, Settings } from 'lucide-react';

export function DashboardLayout() {
  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Applications', to: '/applications', icon: Briefcase },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center px-4 border-b dark:border-gray-700">
            <h1 className="text-2xl font-bold text-cyan-500">Career-Loop</h1>
          </div>
          <nav className="flex-grow p-4">
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="flex items-center p-2 my-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    activeProps={{ className: 'bg-cyan-500/20 text-cyan-500' }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            {/* User profile section can go here */}
            <p className="text-sm text-center">User Profile</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center px-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
