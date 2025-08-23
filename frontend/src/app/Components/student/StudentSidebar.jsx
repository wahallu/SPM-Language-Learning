"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const StudentSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      icon: '🏠',
      label: 'Dashboard',
      href: '/student',
      active: pathname === '/student'
    },
    {
      icon: '📚',
      label: 'My Courses',
      href: '/student/mycourses',
      active: pathname === '/student/mycourses'
    },
    {
      icon: '📖',
      label: 'Lessons',
      href: '/lessons',
      active: pathname === '/lessons'
    }
  ];

  // Mock student data
  const student = {
    name: "Sarah Johnson",
    level: 5,
    currentStreak: 7,
    xpToNextLevel: 125
  };

  return (
    <motion.div
      className={`fixed left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ top: '4rem' }}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 w-6 h-6 bg-[#FF7D29] text-white rounded-full flex items-center justify-center hover:bg-[#FF9D5C] transition-colors"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ◀
        </motion.div>
      </button>

      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            SJ
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-semibold text-gray-800">{student.name}</p>
              <p className="text-sm text-gray-600">Level {student.level}</p>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {!isCollapsed && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Level {student.level}</span>
              <span>{student.xpToNextLevel} XP to next level</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] h-2 rounded-full" 
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={item.href}>
              <motion.div
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  item.active
                    ? 'bg-[#FF7D29] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Current Streak Card */}
      {!isCollapsed && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="font-semibold mb-2">🔥 Current Streak</h4>
          <div className="text-2xl font-bold">{student.currentStreak} days</div>
          <p className="text-sm opacity-90">Keep it up!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentSidebar;
