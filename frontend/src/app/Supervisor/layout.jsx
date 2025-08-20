"use client";

import SupervisorSidebar from '../Components/supervisor/SupervisorSidebar';
import SupervisorHeader from '../Components/supervisor/SupervisorHeader';

export default function SupervisorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SupervisorSidebar />
      <SupervisorHeader />
      <main className="ml-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}