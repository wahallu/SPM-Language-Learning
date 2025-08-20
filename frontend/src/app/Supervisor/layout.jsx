"use client";

import { usePathname } from 'next/navigation';
import SupervisorSidebar from '../Components/supervisor/SupervisorSidebar';
import SupervisorHeader from '../Components/supervisor/SupervisorHeader';

export default function SupervisorLayout({ children }) {
  const pathname = usePathname();
  
  // Pages that should not have sidebar and header
  const publicPages = ['/Supervisor/login', '/Supervisor/register'];
  const isPublicPage = publicPages.includes(pathname);

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

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