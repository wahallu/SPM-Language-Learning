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
      href: '/student/courses',
      active: pathname.startsWith('/student/courses')
    },
    {
      icon: '🔍',
      label: 'Browse Courses',
      href: '/student/browse',
      active: pathname === '/student/browse'
    },
    {
      icon: '📊',
      label: 'Progress',
      href: '/student/progress',
      active: pathname === '/student/progress'
    },
    {
      icon: '🏆',
      label: 'Achievements',
      href: '/student/achievements',
      active: pathname === '/student/achievements'
    },
    {
      icon: '📝',
      label: 'Practice',
      href: '/student/practice',
      active: pathname === '/student/practice'
    },
    {
      icon: '👥',
      label: 'Community',
      href: '/student/community',
      active: pathname === '/student/community'
    },
    {
      icon: '⚙️',
      label: 'Settings',
      href: '/student/settings',
      active: pathname === '/student/settings'
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
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Collapse Toggle */}
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
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{student.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-500">⭐</span>
                <span className="text-gray-600">Level {student.level}</span>
              </div>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Streak Counter */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <span className="text-orange-500">🔥</span>
                <span className="text-sm text-gray-600">{student.currentStreak} day streak</span>
              </div>
            </div>
            
            {/* XP Progress */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Level Progress</span>
                <span className="text-xs text-gray-500">{student.xpToNextLevel} XP to go</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] h-2 rounded-full transition-all duration-500"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
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

      {/* Daily Goal */}
      {!isCollapsed && (
        <motion.div
          className="p-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>🎯</span>
              Daily Goal
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">15 minutes</span>
                <span className="text-green-600 font-medium">12/15 min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: '80%' }}
                />
              </div>
              <p className="text-xs text-gray-600">
                Just 3 more minutes to reach your daily goal! 🌟
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentSidebar;