"use client";

import React from 'react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import TeacherSidebar from '../components/teacher/TeacherSidebar';
import TeacherHeader from '../components/teacher/TeacherHeader';

const TeacherLayout = ({ children }) => {
  const pathname = usePathname();

  // Hide sidebar and header for login/register pages
  const isAuthPage = pathname === '/teacher/login' || pathname === '/teacher/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <TeacherHeader /> */}

      <div className="flex">
        <TeacherSidebar />

        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;