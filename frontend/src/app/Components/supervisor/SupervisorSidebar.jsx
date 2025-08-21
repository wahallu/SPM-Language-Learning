"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const SupervisorSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      icon: '🏠',
      label: 'Dashboard',
      href: '/Supervisor/dashboard',
      active: pathname === '/Supervisor/dashboard'
    },
    {
      icon: '📚',
      label: 'Lesson Reviews',
      href: '/Supervisor/lessons',
      active: pathname === '/Supervisor/lessons'
    },
    {
      icon: '👨‍🏫',
      label: 'Teachers',
      href: '/Supervisor/teachers',
      active: pathname === '/Supervisor/teachers'
    },
    {
      icon: '👥',
      label: 'Students',
      href: '/Supervisor/students',
      active: pathname === '/Supervisor/students'
    },
    {
      icon: '📊',
      label: 'Analytics',
      href: '/Supervisor/analytics',
      active: pathname === '/Supervisor/analytics'
    },
    {
      icon: '⚙️',
      label: 'Settings',
      href: '/Supervisor/settings',
      active: pathname === '/Supervisor/settings'
    },
    {
      icon: '📋',
      label: 'Reports',
      href: '/Supervisor/reports',
      active: pathname === '/Supervisor/reports'
    }
  ];

  return (
    <motion.div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
  <Image
    src="/ZAlogo.png"
    alt="ZorsCode Academy"
    width={32}
    height={32}
    className="object-contain"
  />
</div>
          {!isCollapsed && (
            <div>
              <p className="font-semibold text-gray-800">Supervisor</p>
              <p className="text-sm text-gray-600">Quality Manager</p>
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
          className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="font-semibold mb-2">This Week</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Reviews Completed</span>
              <span>24</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>18</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SupervisorSidebar;