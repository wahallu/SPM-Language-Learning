"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const StudentCoursesPage = () => {
  const [enrolledCourses] = useState([
    {
      id: 1,
      title: "Beginner Basics",
      category: "English",
      instructor: "Dr. Maria Rodriguez",
      image: "/images/lessons/beginner-basics.png",
      level: "Beginner",
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      totalModules: 6,
      completedModules: 4,
      currentModule: "Module 5: Daily Conversations",
      nextLesson: "Ordering Food at a Restaurant",
      estimatedTime: "8 minutes",
      lastAccessed: "2024-03-15T14:30:00Z",
      enrolledDate: "2024-01-15T10:00:00Z",
      status: "in-progress",
      rating: null,
      certificate: false,
      totalXP: 1250,
      avgQuizScore: 87,
      timeSpent: "15.5 hours"
    },
    {
      id: 2,
      title: "Spanish Fundamentals",
      category: "Spanish",
      instructor: "Prof. Carlos Martinez",
      image: "/images/lessons/spanish-fundamentals.png",
      level: "Beginner",
      progress: 45,
      totalLessons: 20,
      completedLessons: 9,
      totalModules: 5,
      completedModules: 2,
      currentModule: "Module 3: Grammar Basics",
      nextLesson: "Verb Conjugations",
      estimatedTime: "12 minutes",
      lastAccessed: "2024-03-14T10:15:00Z",
      enrolledDate: "2024-02-01T09:30:00Z",
      status: "in-progress",
      rating: null,
      certificate: false,
      totalXP: 680,
      avgQuizScore: 92,
      timeSpent: "8.2 hours"
    },
    {
      id: 3,
      title: "Advanced English",
      category: "English",
      instructor: "Dr. Lisa Thompson",
      image: "/images/lessons/advanced-english.png",
      level: "Advanced",
      progress: 100,
      totalLessons: 30,
      completedLessons: 30,
      totalModules: 8,
      completedModules: 8,
      currentModule: "Course Completed",
      nextLesson: null,
      estimatedTime: null,
      lastAccessed: "2024-03-10T16:45:00Z",
      enrolledDate: "2023-12-01T08:00:00Z",
      status: "completed",
      rating: 5,
      certificate: true,
      totalXP: 2100,
      avgQuizScore: 94,
      timeSpent: "32.8 hours"
    },
    {
      id: 4,
      title: "Business French",
      category: "French",
      instructor: "Mme. Sophie Dubois",
      image: "/images/lessons/business-french.png",
      level: "Intermediate",
      progress: 15,
      totalLessons: 35,
      completedLessons: 5,
      totalModules: 7,
      completedModules: 1,
      currentModule: "Module 2: Professional Vocabulary",
      nextLesson: "Business Email Writing",
      estimatedTime: "15 minutes",
      lastAccessed: "2024-03-08T13:20:00Z",
      enrolledDate: "2024-03-01T11:15:00Z",
      status: "in-progress",
      rating: null,
      certificate: false,
      totalXP: 180,
      avgQuizScore: 78,
      timeSpent: "3.1 hours"
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  const tabs = [
    { id: 'all', label: 'All Courses', count: enrolledCourses.length },
    { id: 'in-progress', label: 'In Progress', count: enrolledCourses.filter(c => c.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: enrolledCourses.filter(c => c.status === 'completed').length }
  ];

  const filteredCourses = enrolledCourses
    .filter(course => {
      if (activeTab === 'all') return true;
      return course.status === activeTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastAccessed) - new Date(a.lastAccessed);
        case 'progress':
          return b.progress - a.progress;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'enrolled':
          return new Date(b.enrolledDate) - new Date(a.enrolledDate);
        default:
          return 0;
      }
    });

  const stats = {
    totalCourses: enrolledCourses.length,
    inProgress: enrolledCourses.filter(c => c.status === 'in-progress').length,
    completed: enrolledCourses.filter(c => c.status === 'completed').length,
    totalXP: enrolledCourses.reduce((sum, course) => sum + course.totalXP, 0),
    avgProgress: Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length),
    certificates: enrolledCourses.filter(c => c.certificate).length
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses</h1>
          <p className="text-gray-600">Track your learning progress and continue where you left off</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/student/browse">
            <motion.button
              className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">🔍</span>
              Browse More Courses
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { title: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'bg-blue-500' },
          { title: 'In Progress', value: stats.inProgress, icon: '⏳', color: 'bg-orange-500' },
          { title: 'Completed', value: stats.completed, icon: '✅', color: 'bg-green-500' },
          { title: 'Total XP', value: stats.totalXP.toLocaleString(), icon: '⭐', color: 'bg-yellow-500' },
          { title: 'Avg Progress', value: `${stats.avgProgress}%`, icon: '📊', color: 'bg-purple-500' },
          { title: 'Certificates', value: stats.certificates, icon: '🏆', color: 'bg-red-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">{stat.title}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue Learning Section */}
      {enrolledCourses.filter(c => c.status === 'in-progress').length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses
              .filter(c => c.status === 'in-progress')
              .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
              .slice(0, 2)
              .map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-orange-100 text-sm">{course.currentModule}</p>
                  </div>
                  <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs">
                    {course.progress}%
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-orange-100 mb-1">Next: {course.nextLesson}</p>
                  <p className="text-xs text-orange-200">Estimated time: {course.estimatedTime}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="w-24 bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <Link href={`/student/courses/${course.id}/continue`}>
                    <button className="bg-white text-[#FF7D29] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                      Continue
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Course Management */}
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-[#FF7D29] border-b-2 border-[#FF7D29] bg-orange-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id 
                    ? 'bg-[#FF7D29] text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                <option value="recent">Recently Accessed</option>
                <option value="progress">Progress</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="enrolled">Recently Enrolled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">View:</span>
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
        </div>

        {/* Course List */}
        <div className="p-6">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === 'completed' ? '🎓' : activeTab === 'in-progress' ? '📚' : '📖'}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {activeTab === 'completed' 
                  ? 'No completed courses yet'
                  : activeTab === 'in-progress'
                  ? 'No courses in progress'
                  : 'No courses found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'completed'
                  ? 'Complete your first course to see it here'
                  : activeTab === 'in-progress'
                  ? 'Start learning to see your active courses'
                  : 'Enroll in courses to start your learning journey'}
              </p>
              {activeTab !== 'completed' && (
                <Link href="/student/browse">
                  <button className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-colors">
                    Browse Courses
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
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      <CourseCardGrid course={course} formatTimeAgo={formatTimeAgo} />
                    ) : (
                      <CourseCardList course={course} formatTimeAgo={formatTimeAgo} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Grid View Course Card
const CourseCardGrid = ({ course, formatTimeAgo }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
      {/* Course Image */}
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-6xl">📚</span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {course.status === 'completed' ? 'Completed' : 'In Progress'}
          </span>
        </div>

        {/* Certificate Badge */}
        {course.certificate && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              🏆 Certified
            </span>
          </div>
        )}

        {/* Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Progress</span>
            <span className="text-white text-sm font-medium">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <motion.div
              className="bg-[#FF7D29] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {course.level}
          </span>
          <span className="text-xs text-gray-500">
            Last accessed {formatTimeAgo(course.lastAccessed)}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 group-hover:text-[#FF7D29] transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {course.category} • {course.instructor}
        </p>

        {course.status === 'in-progress' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">{course.currentModule}</p>
            <p className="text-xs text-blue-600">Next: {course.nextLesson}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="block text-xs text-gray-500">Lessons</span>
            <span className="font-medium">{course.completedLessons}/{course.totalLessons}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">XP Earned</span>
            <span className="font-medium">{course.totalXP}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link 
            href={course.status === 'completed' ? `/student/courses/${course.id}` : `/student/courses/${course.id}/continue`}
            className="flex-1 text-center py-2 bg-[#FF7D29] text-white rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
          >
            {course.status === 'completed' ? 'Review' : 'Continue'}
          </Link>
          <Link 
            href={`/student/courses/${course.id}`}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

// List View Course Card
const CourseCardList = ({ course, formatTimeAgo }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-center gap-6">
        {/* Course Image */}
        <div className="w-24 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📚</span>
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-lg text-gray-800">{course.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {course.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
                {course.certificate && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    🏆
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {course.category} • {course.instructor} • {course.level}
              </p>

              {course.status === 'in-progress' && (
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {course.currentModule} • Next: {course.nextLesson}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                <span>{course.totalXP} XP</span>
                <span>Avg score: {course.avgQuizScore}%</span>
                <span>{course.timeSpent} studied</span>
                <span>Last accessed {formatTimeAgo(course.lastAccessed)}</span>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="text-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#FF7D29]"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${course.progress}, 100`}
                    strokeLinecap="round"
                    fill="transparent"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{course.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link 
            href={course.status === 'completed' ? `/student/courses/${course.id}` : `/student/courses/${course.id}/continue`}
            className="px-4 py-2 bg-[#FF7D29] text-white rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
          >
            {course.status === 'completed' ? 'Review' : 'Continue'}
          </Link>
          <Link 
            href={`/student/courses/${course.id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesPage;