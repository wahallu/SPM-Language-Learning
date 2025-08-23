"use client";

import { usePathname } from 'next/navigation';
import StudentSidebar from '../Components/student/StudentSidebar';
import StudentHeader from '../Components/student/StudentHeader';

export default function StudentLayout({ children }) {
  const pathname = usePathname();
  
  // Pages that should not have sidebar and header
  const publicPages = ['/student/login', '/student/register'];
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
      <StudentSidebar />
      <StudentHeader />
      <main className="ml-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}