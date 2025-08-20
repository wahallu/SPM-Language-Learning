"use client";

import React from 'react';
import { motion } from 'motion/react';
import StudentSidebar from '../Components/student/StudentSidebar';
import StudentHeader from '../Components/student/StudentHeader';

const StudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* <StudentHeader /> */}
      
      <div className="flex">
        <StudentSidebar />
        
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

export default StudentLayout;