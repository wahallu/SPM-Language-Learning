"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TeacherSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      icon: '🏠',
      label: 'Dashboard',
      href: '/teacher',
      active: pathname === '/teacher'
    },
    {
      icon: '📚',
      label: 'My Courses',
      href: '/teacher/courses',
      active: pathname.startsWith('/teacher/courses')
    },
    {
      icon: '➕',
      label: 'Create Course',
      href: '/teacher/courses/create',
      active: pathname === '/teacher/courses/create'
    },
    {
      icon: '👥',
      label: 'Students',
      href: '/teacher/students',
      active: pathname === '/teacher/students'
    },
    {
      icon: '📊',
      label: 'Analytics',
      href: '/teacher/analytics',
      active: pathname === '/teacher/analytics'
    },
    {
      icon: '💬',
      label: 'Messages',
      href: '/teacher/messages',
      active: pathname === '/teacher/messages'
    },
    {
      icon: '⚙️',
      label: 'Settings',
      href: '/teacher/settings',
      active: pathname === '/teacher/settings'
    }
  ];

  return (
    <motion.div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ${
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
          <div className="w-10 h-10 bg-[#FF7D29] rounded-full flex items-center justify-center text-white font-bold">
            MR
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-semibold text-gray-800">Dr. Maria Rodriguez</p>
              <p className="text-sm text-gray-600">Language Expert</p>
            </div>
          )}
        </div>
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

      {/* Quick Stats */}
      {!isCollapsed && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="font-semibold mb-2">Quick Stats</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Active Students</span>
              <span>245</span>
            </div>
            <div className="flex justify-between">
              <span>This Month</span>
              <span>+12%</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TeacherSidebar;