"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        // Fallback data for development
        setEnrolledCourses([
          {
            id: 1,
            title: "English Fundamentals",
            category: "English",
            instructor: "Dr. Maria Rodriguez",
            instructorTitle: "Language Expert",
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
            timeSpent: "15.5 hours",
            duration: "8 weeks"
          },
          {
            id: 2,
            title: "Spanish Fundamentals",
            category: "Spanish",
            instructor: "Prof. Carlos Martinez",
            instructorTitle: "Spanish Linguistics Professor",
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
            timeSpent: "8.2 hours",
            duration: "6 weeks"
          },
          {
            id: 3,
            title: "Advanced English",
            category: "English",
            instructor: "Dr. Lisa Thompson",
            instructorTitle: "English Literature PhD",
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
            timeSpent: "32.8 hours",
            duration: "12 weeks"
          }
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/student/courses/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setEnrolledCourses(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    avgProgress: Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) || 0
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-600 mt-2">Track your learning progress and continue your journey</p>
        </div>
        <Link href="/student/browse">
          <button className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl hover:bg-[#FF9D5C] transition-colors">
            Browse New Courses
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.totalCourses}</div>
            <div className="text-gray-600 text-sm">Total Courses</div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-gray-600 text-sm">In Progress</div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.totalXP}</div>
            <div className="text-gray-600 text-sm">Total XP</div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</div>
            <div className="text-gray-600 text-sm">Avg Progress</div>
          </div>
        </motion.div>
      </div>

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
              .map((course) => (
              <motion.div
                key={course.id}
                className="bg-white bg-opacity-20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-orange-200 text-sm">{course.currentModule}</p>
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/student/courses/${course.id}/continue`}>
                    <button className="bg-white text-[#FF7D29] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Continue
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters and Controls */}
      <motion.div
        className="bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#FF7D29] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="recent">Most Recent</option>
                <option value="progress">Progress</option>
                <option value="alphabetical">A-Z</option>
                <option value="enrolled">Enrollment Date</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
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
              <Link href="/student/browse">
                <button className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl hover:bg-[#FF9D5C] transition-colors">
                  Browse Courses
                </button>
              </Link>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              <AnimatePresence>
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {viewMode === 'grid' ? (
                      <CourseCardGrid course={course} />
                    ) : (
                      <CourseCardList course={course} />
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
const CourseCardGrid = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-6xl">📚</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.status === 'completed' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {course.status === 'completed' ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#FF7D29] transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm">{course.category} • {course.instructor}</p>
        </div>

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
            className="flex-1"
          >
            <button className="w-full bg-[#FF7D29] text-white px-4 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors">
              {course.status === 'completed' ? 'Review' : 'Continue'}
            </button>
          </Link>
          <Link href={`/student/courses/${course.id}`}>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              Details
            </button>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-800">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                course.status === 'completed' ? 'bg-green-500' : 'bg-[#FF7D29]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// List View Course Card
const CourseCardList = ({ course }) => {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className="flex gap-6">
        <div className="w-24 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📚</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
              <p className="text-gray-600 text-sm">
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
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    className={course.status === 'completed' ? 'text-green-500' : 'text-[#FF7D29]'}
                    strokeDasharray={`${course.progress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{course.progress}%</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                course.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {course.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Link href={course.status === 'completed' ? `/student/courses/${course.id}` : `/student/courses/${course.id}/continue`}>
            <button className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors">
              {course.status === 'completed' ? 'Review' : 'Continue'}
            </button>
          </Link>
          <Link href={`/student/courses/${course.id}`}>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;