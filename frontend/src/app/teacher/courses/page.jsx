"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const TeacherCoursesPage = () => {
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
      lessons: 24,
      status: "published",
      createdAt: "2024-01-15",
      price: 99,
      rating: 4.8,
      revenue: 15444
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
      lessons: 36,
      status: "published",
      createdAt: "2024-02-01",
      price: 149,
      rating: 4.9,
      revenue: 13261
    },
    {
      id: 3,
      title: "Business French",
      category: "French",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/business-french.png",
      level: "Intermediate",
      students: 34,
      modules: 6,
      lessons: 18,
      status: "draft",
      createdAt: "2024-03-10",
      price: 199,
      rating: 0,
      revenue: 0
    },
    {
      id: 4,
      title: "German Grammar Mastery",
      category: "German",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/german-grammar.png",
      level: "Intermediate",
      students: 67,
      modules: 10,
      lessons: 30,
      status: "published",
      createdAt: "2024-01-28",
      price: 129,
      rating: 4.7,
      revenue: 8643
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'students':
          return b.students - a.students;
        case 'revenue':
          return b.revenue - a.revenue;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === 'published').length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    totalRevenue: courses.reduce((sum, course) => sum + course.revenue, 0)
  };

  const categories = ['All', ...new Set(courses.map(course => course.category))];

  const handleDeleteCourse = (courseId) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
    }
  };

  const handleDuplicateCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const duplicatedCourse = {
        ...course,
        id: Date.now(),
        title: `${course.title} (Copy)`,
        students: 0,
        status: 'draft',
        revenue: 0,
        rating: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCourses(prev => [duplicatedCourse, ...prev]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses</h1>
          <p className="text-gray-600">Manage and track all your courses in one place</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/teacher/courses/create">
            <motion.button
              className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">➕</span>
              Create Course
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { title: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'bg-blue-500' },
          { title: 'Published', value: stats.publishedCourses, icon: '✅', color: 'bg-green-500' },
          { title: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: '👥', color: 'bg-purple-500' },
          { title: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-yellow-500' }
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
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="students">Most Students</option>
              <option value="revenue">Highest Revenue</option>
              <option value="alphabetical">Alphabetical</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#FF7D29] text-white' : 'bg-white text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#FF7D29] text-white' : 'bg-white text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Courses Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                ? 'No courses found' 
                : 'No courses yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first course to get started'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <Link href="/teacher/courses/create">
                <button className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all">
                  Create Your First Course
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            <AnimatePresence>
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={viewMode === 'grid' ? '' : 'w-full'}
                >
                  {viewMode === 'grid' ? (
                    <CourseCardGrid 
                      course={course} 
                      onDelete={handleDeleteCourse}
                      onDuplicate={handleDuplicateCourse}
                    />
                  ) : (
                    <CourseCardList 
                      course={course} 
                      onDelete={handleDeleteCourse}
                      onDuplicate={handleDuplicateCourse}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Grid View Course Card Component
const CourseCardGrid = ({ course, onDelete, onDuplicate }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      {/* Course Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-6xl">📚</span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {course.status}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button className="p-2 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600">{course.category} • {course.level}</p>
          </div>
          {course.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">⭐</span>
              <span className="text-gray-600">{course.rating}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{course.students} students</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📚</span>
            <span>{course.modules} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎥</span>
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💰</span>
            <span>${course.price}</span>
          </div>
        </div>

        {course.revenue > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              Revenue: ${course.revenue.toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Link 
            href={`/teacher/courses/${course.id}`}
            className="flex-1 text-center py-2 bg-[#FF7D29] text-white rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
          >
            Manage
          </Link>
          <button
            onClick={() => onDuplicate(course.id)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            title="Duplicate course"
          >
            📋
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// List View Course Card Component
const CourseCardList = ({ course, onDelete, onDuplicate }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-center gap-6">
        {/* Course Icon */}
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📚</span>
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600">{course.category} • {course.level}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {course.status}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
            <span>{course.students} students</span>
            <span>{course.modules} modules</span>
            <span>{course.lessons} lessons</span>
            <span>${course.price}</span>
            {course.rating > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                {course.rating}
              </span>
            )}
          </div>

          {course.revenue > 0 && (
            <p className="text-sm text-green-600 font-medium mb-3">
              Revenue: ${course.revenue.toLocaleString()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link 
            href={`/teacher/courses/${course.id}`}
            className="px-4 py-2 bg-[#FF7D29] text-white rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
          >
            Manage
          </Link>
          <button
            onClick={() => onDuplicate(course.id)}
            className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            title="Duplicate course"
          >
            📋
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete course"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCoursesPage;