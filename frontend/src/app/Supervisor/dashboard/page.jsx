"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const SupervisorDashboard = () => {
  const [stats] = useState({
    totalLessons: 125,
    pendingReviews: 8,
    totalTeachers: 34,
    totalStudents: 1250,
    approvedToday: 12,
    rejectedToday: 2,
    averageRating: 4.6,
    completionRate: 89
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'lesson_approved',
      title: 'English Grammar Basics',
      teacher: 'John Smith',
      time: '5 minutes ago',
      status: 'approved'
    },
    {
      id: 2,
      type: 'teacher_registered',
      title: 'New Teacher Registration',
      teacher: 'Sarah Johnson',
      time: '30 minutes ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'lesson_rejected',
      title: 'Advanced Conversation',
      teacher: 'Mike Davis',
      time: '1 hour ago',
      status: 'rejected'
    }
  ]);

  const [pendingReviews] = useState([
    {
      id: 1,
      title: 'Sinhala Family Vocabulary',
      teacher: 'Priya Perera',
      language: 'Sinhala',
      level: 'Beginner',
      submittedDate: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Business English Communication',
      teacher: 'Alex Johnson',
      language: 'English',
      level: 'Advanced',
      submittedDate: '2024-01-14',
      priority: 'medium'
    }
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Supervisor!</h1>
            <p className="text-orange-100 text-lg">Ready to ensure quality education today?</p>
          </div>
          
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Lessons', value: stats.totalLessons, icon: '📚', color: 'bg-blue-500', change: '+5 this week' },
          { title: 'Pending Reviews', value: stats.pendingReviews, icon: '⏳', color: 'bg-yellow-500', change: '-2 today' },
          { title: 'Total Teachers', value: stats.totalTeachers, icon: '👨‍🏫', color: 'bg-green-500', change: '+3 this month' },
          { title: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: '👥', color: 'bg-purple-500', change: '+24 today' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/Supervisor/lessons">
            <motion.div
              className="p-4 border-2 border-dashed border-orange-400 rounded-xl hover:bg-orange-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  📝
                </div>
                <h3 className="font-semibold text-gray-800">Review Lessons</h3>
                <p className="text-gray-600 text-sm">Approve or reject lessons</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/Supervisor/teachers">
            <motion.div
              className="p-4 border-2 border-dashed border-blue-400 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  👨‍🏫
                </div>
                <h3 className="font-semibold text-gray-800">Manage Teachers</h3>
                <p className="text-gray-600 text-sm">View and approve teachers</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/Supervisor/students">
            <motion.div
              className="p-4 border-2 border-dashed border-green-400 rounded-xl hover:bg-green-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  👥
                </div>
                <h3 className="font-semibold text-gray-800">View Students</h3>
                <p className="text-gray-600 text-sm">Monitor student progress</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/Supervisor/analytics">
            <motion.div
              className="p-4 border-2 border-dashed border-purple-400 rounded-xl hover:bg-purple-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  📊
                </div>
                <h3 className="font-semibold text-gray-800">View Analytics</h3>
                <p className="text-gray-600 text-sm">Platform insights</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Reviews */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pending Reviews</h2>
            <Link href="/Supervisor/lessons" className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {pendingReviews.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                className="border border-gray-200 rounded-xl p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">By {lesson.teacher}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {lesson.language}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {lesson.level}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lesson.priority === 'high' ? 'bg-red-100 text-red-700' :
                        lesson.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {lesson.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  activity.status === 'approved' ? 'bg-green-500' :
                  activity.status === 'rejected' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}>
                  {activity.status === 'approved' ? '✓' : activity.status === 'rejected' ? '✖' : '⏳'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.teacher}</span> {activity.type === 'lesson_approved' ? 'approved' : activity.type === 'lesson_rejected' ? 'rejected' : 'registered'} a lesson
                  </p>
                  <p className="text-xs text-gray-500">{activity.title}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;