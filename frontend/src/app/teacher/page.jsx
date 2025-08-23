"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from "next/navigation";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Beginner Basics",
      category: "English",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/beginner-basics.png",
      level: "Beginner",
      students: 156,
      modules: 8,
      status: "published",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Advanced Conversation",
      category: "Spanish",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/advanced-conversation.png",
      level: "Advanced",
      students: 89,
      modules: 12,
      status: "draft",
      createdAt: "2024-02-01"
    }
  ]);
  const router = useRouter();

  const stats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    publishedCourses: courses.filter(course => course.status === 'published').length,
    draftCourses: courses.filter(course => course.status === 'draft').length
  };

  useEffect(() => {
    // Ensure we have proper authentication
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'teacher') {
      // Redirect to login if not properly authenticated
      router.push('/teacher/login');
    }
  }, []);

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
            <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Rodriguez!</h1>
            <p className="text-orange-100 text-lg">Ready to inspire more learners today?</p>
          </div>
          <div className="hidden md:block">
            <Image
              src="/Gif/Person1.gif"
              alt="Teacher illustration"
              width={120}
              height={120}
              unoptimized={true}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'bg-blue-500' },
          { title: 'Total Students', value: stats.totalStudents, icon: '👥', color: 'bg-green-500' },
          { title: 'Published', value: stats.publishedCourses, icon: '✅', color: 'bg-purple-500' },
          { title: 'Drafts', value: stats.draftCourses, icon: '📝', color: 'bg-yellow-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/teacher/courses/create">
            <motion.div
              className="p-4 border-2 border-dashed border-[#FF7D29] rounded-xl hover:bg-orange-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF7D29] rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  ➕
                </div>
                <h3 className="font-semibold text-gray-800">Create New Course</h3>
                <p className="text-gray-600 text-sm">Start building your next course</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/teacher/analytics">
            <motion.div
              className="p-4 border-2 border-dashed border-blue-400 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  📊
                </div>
                <h3 className="font-semibold text-gray-800">View Analytics</h3>
                <p className="text-gray-600 text-sm">Track your course performance</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/teacher/students">
            <motion.div
              className="p-4 border-2 border-dashed border-green-400 rounded-xl hover:bg-green-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  👨‍🎓
                </div>
                <h3 className="font-semibold text-gray-800">Manage Students</h3>
                <p className="text-gray-600 text-sm">View and interact with students</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Courses */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
          <Link 
            href="/teacher/courses"
            className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                  <span className="text-xs text-gray-500">{course.level}</span>
                </div>
                
                <h3 className="font-semibold text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.category}</p>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500">{course.students} students</span>
                  <span className="text-sm text-gray-500">{course.modules} modules</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Link 
                    href={`/teacher/courses/${course.id}`}
                    className="flex-1 text-center py-2 bg-[#FF7D29] text-white rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
                  >
                    Edit
                  </Link>
                  <Link 
                    href={`/teacher/courses/${course.id}/analytics`}
                    className="flex-1 text-center py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;