"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const StudentCourseDetailPage = ({ params }) => {
  const [course] = useState({
    id: 1,
    title: "Beginner Basics",
    description: "Master the fundamentals of English language with comprehensive lessons covering grammar, vocabulary, pronunciation, and conversation skills. Perfect for absolute beginners starting their English learning journey.",
    category: "English",
    instructor: "Dr. Maria Rodriguez",
    instructorTitle: "Language Expert",
    instructorBio: "Dr. Rodriguez has over 15 years of experience teaching English as a second language. She holds a PhD in Applied Linguistics and has helped thousands of students achieve fluency.",
    instructorImage: "/images/instructors/maria-rodriguez.jpg",
    image: "/images/courses/beginner-basics.jpg",
    level: "Beginner",
    rating: 4.8,
    totalRatings: 2543,
    students: 15420,
    duration: "8 weeks",
    totalLessons: 24,
    completedLessons: 18,
    totalModules: 6,
    completedModules: 4,
    progress: 75,
    enrolledDate: "2024-01-15",
    lastAccessed: "2024-03-15T14:30:00Z",
    status: "in-progress",
    totalXP: 1250,
    avgQuizScore: 87,
    timeSpent: "15.5 hours",
    certificate: false,
    currentStreak: 7,
    tags: ["Grammar", "Vocabulary", "Speaking", "Listening", "Pronunciation"],
    objectives: [
      "Master basic English grammar structures",
      "Build a vocabulary of 500+ common words",
      "Develop clear pronunciation skills",
      "Engage in simple conversations",
      "Understand basic written and spoken English"
    ]
  });

  const [modules] = useState([
    {
      id: 1,
      title: "Introduction to English",
      description: "Learn the English alphabet, basic sounds, and pronunciation fundamentals",
      lessons: 4,
      duration: "1 week",
      completed: true,
      xpEarned: 200,
      lessons_detail: [
        { id: 1, title: "English Alphabet", duration: "8 min", completed: true, xp: 50 },
        { id: 2, title: "Basic Sounds", duration: "10 min", completed: true, xp: 50 },
        { id: 3, title: "Pronunciation Guide", duration: "12 min", completed: true, xp: 50 },
        { id: 4, title: "Practice Session", duration: "15 min", completed: true, xp: 50 }
      ]
    },
    {
      id: 2,
      title: "Basic Grammar",
      description: "Understand fundamental grammar rules including nouns, verbs, and sentence structure",
      lessons: 5,
      duration: "1.5 weeks",
      completed: true,
      xpEarned: 250,
      lessons_detail: [
        { id: 5, title: "Nouns and Articles", duration: "10 min", completed: true, xp: 50 },
        { id: 6, title: "Verbs and Tenses", duration: "12 min", completed: true, xp: 50 },
        { id: 7, title: "Adjectives", duration: "8 min", completed: true, xp: 50 },
        { id: 8, title: "Sentence Structure", duration: "15 min", completed: true, xp: 50 },
        { id: 9, title: "Grammar Practice", duration: "10 min", completed: true, xp: 50 }
      ]
    },
    {
      id: 3,
      title: "Common Vocabulary",
      description: "Build your vocabulary with everyday words and phrases",
      lessons: 4,
      duration: "1 week",
      completed: true,
      xpEarned: 200,
      lessons_detail: [
        { id: 10, title: "Family and Relationships", duration: "9 min", completed: true, xp: 50 },
        { id: 11, title: "Numbers and Time", duration: "11 min", completed: true, xp: 50 },
        { id: 12, title: "Colors and Shapes", duration: "8 min", completed: true, xp: 50 },
        { id: 13, title: "Vocabulary Review", duration: "12 min", completed: true, xp: 50 }
      ]
    },
    {
      id: 4,
      title: "Speaking Practice",
      description: "Develop your speaking skills with guided practice sessions",
      lessons: 5,
      duration: "1.5 weeks",
      completed: true,
      xpEarned: 250,
      lessons_detail: [
        { id: 14, title: "Basic Greetings", duration: "10 min", completed: true, xp: 50 },
        { id: 15, title: "Introducing Yourself", duration: "12 min", completed: true, xp: 50 },
        { id: 16, title: "Asking Questions", duration: "11 min", completed: true, xp: 50 },
        { id: 17, title: "Common Phrases", duration: "9 min", completed: true, xp: 50 },
        { id: 18, title: "Speaking Assessment", duration: "15 min", completed: true, xp: 50 }
      ]
    },
    {
      id: 5,
      title: "Daily Conversations",
      description: "Learn practical phrases for everyday situations",
      lessons: 4,
      duration: "1 week",
      completed: false,
      currentLesson: 3,
      xpEarned: 150,
      lessons_detail: [
        { id: 19, title: "At the Restaurant", duration: "8 min", completed: true, xp: 50 },
        { id: 20, title: "Shopping for Clothes", duration: "10 min", completed: true, xp: 50 },
        { id: 21, title: "Asking for Directions", duration: "12 min", completed: false, current: true, xp: 0 },
        { id: 22, title: "Making Small Talk", duration: "9 min", completed: false, xp: 0 }
      ]
    },
    {
      id: 6,
      title: "Advanced Topics",
      description: "Explore more complex grammar and conversation topics",
      lessons: 2,
      duration: "0.5 weeks",
      completed: false,
      currentLesson: 0,
      xpEarned: 0,
      lessons_detail: [
        { id: 23, title: "Past and Future Tenses", duration: "15 min", completed: false, xp: 0 },
        { id: 24, title: "Final Assessment", duration: "20 min", completed: false, xp: 0 }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'curriculum', label: 'Curriculum', icon: '📚' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'instructor', label: 'Instructor', icon: '👨‍🏫' }
  ];

  const currentLesson = modules
    .flatMap(module => module.lessons_detail)
    .find(lesson => lesson.current);

  const nextLesson = modules
    .flatMap(module => module.lessons_detail)
    .find(lesson => !lesson.completed && !lesson.current);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getModuleProgress = (module) => {
    if (module.completed) return 100;
    if (module.currentLesson) {
      return Math.round((module.currentLesson / module.lessons) * 100);
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <motion.div
        className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-2xl p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Link 
                  href="/student/courses"
                  className="text-orange-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {course.level}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-300">⭐</span>
                    <span className="text-sm">{course.rating}</span>
                    <span className="text-sm text-orange-200">({course.totalRatings})</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-orange-100 text-lg mb-6 max-w-3xl">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-orange-200 text-sm">Progress</p>
                  <p className="text-2xl font-bold">{course.progress}%</p>
                </div>
                <div>
                  <p className="text-orange-200 text-sm">Lessons Complete</p>
                  <p className="text-2xl font-bold">{course.completedLessons}/{course.totalLessons}</p>
                </div>
                <div>
                  <p className="text-orange-200 text-sm">XP Earned</p>
                  <p className="text-2xl font-bold">{course.totalXP}</p>
                </div>
                <div>
                  <p className="text-orange-200 text-sm">Study Streak</p>
                  <p className="text-2xl font-bold">{course.currentStreak} days</p>
                </div>
              </div>

              <div className="flex gap-4">
                {currentLesson ? (
                  <Link href={`/student/courses/${params.courseId}/learn/${currentLesson.id}`}>
                    <button className="bg-white text-[#FF7D29] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                      Continue Learning
                    </button>
                  </Link>
                ) : (
                  <Link href={`/student/courses/${params.courseId}/continue`}>
                    <button className="bg-white text-[#FF7D29] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                      Start Course
                    </button>
                  </Link>
                )}
                <Link href={`/student/courses/${params.courseId}/continue`}>
                  <button className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-colors">
                    View Options
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
      </motion.div>

      {/* Next Lesson Alert */}
      {currentLesson && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                ▶️
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Ready to continue?</h3>
                <p className="text-blue-700">
                  Your next lesson: <strong>{currentLesson.title}</strong> ({currentLesson.duration})
                </p>
              </div>
            </div>
            <Link href={`/student/courses/${params.courseId}/learn/${currentLesson.id}`}>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors">
                Start Lesson
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Course Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">About This Course</h3>
                    <p className="text-gray-600 mb-6">{course.description}</p>
                    
                    <h4 className="font-semibold text-gray-800 mb-3">What You'll Learn</h4>
                    <ul className="space-y-2">
                      {course.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-600">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Course Stats */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Course Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Skill Level</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Total Lessons</span>
                        <span className="font-medium">{course.totalLessons}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Students Enrolled</span>
                        <span className="font-medium">{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Enrolled Since</span>
                        <span className="font-medium">{formatDate(course.enrolledDate)}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-gray-600">Last Accessed</span>
                        <span className="font-medium">{formatTimeAgo(course.lastAccessed)}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Course Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Course Curriculum</h3>
                  <div className="text-sm text-gray-600">
                    {course.totalModules} modules • {course.totalLessons} lessons
                  </div>
                </div>

                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                              module.completed 
                                ? 'bg-green-500' 
                                : module.currentLesson 
                                ? 'bg-[#FF7D29]' 
                                : 'bg-gray-400'
                            }`}>
                              {module.completed ? '✓' : module.currentLesson ? '▶' : index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{module.title}</h4>
                              <p className="text-gray-600 text-sm">{module.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm text-gray-600">
                              <div>{module.lessons} lessons • {module.duration}</div>
                              {module.xpEarned > 0 && (
                                <div className="text-yellow-600">+{module.xpEarned} XP</div>
                              )}
                            </div>
                            <div className="w-6 h-6 flex items-center justify-center">
                              <motion.svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ rotate: expandedModule === module.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </motion.svg>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium">{getModuleProgress(module)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                module.completed ? 'bg-green-500' : 'bg-[#FF7D29]'
                              }`}
                              style={{ width: `${getModuleProgress(module)}%` }}
                            />
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedModule === module.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200"
                          >
                            <div className="p-6 space-y-3">
                              {module.lessons_detail.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center justify-between p-4 rounded-lg ${
                                    lesson.current 
                                      ? 'bg-orange-50 border border-[#FF7D29]' 
                                      : lesson.completed 
                                      ? 'bg-green-50' 
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                                      lesson.current 
                                        ? 'bg-[#FF7D29]' 
                                        : lesson.completed 
                                        ? 'bg-green-500' 
                                        : 'bg-gray-400'
                                    }`}>
                                      {lesson.completed ? '✓' : lesson.current ? '▶' : lessonIndex + 1}
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-800">{lesson.title}</h5>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{lesson.duration}</span>
                                        {lesson.xp > 0 && (
                                          <span className="text-yellow-600">+{lesson.xp} XP</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {lesson.current && (
                                      <span className="bg-[#FF7D29] text-white px-2 py-1 rounded-full text-xs">
                                        Current
                                      </span>
                                    )}
                                    {lesson.completed && (
                                      <Link href={`/student/courses/${params.courseId}/learn/${lesson.id}`}>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                                          Review
                                        </button>
                                      </Link>
                                    )}
                                    {lesson.current && (
                                      <Link href={`/student/courses/${params.courseId}/learn/${lesson.id}`}>
                                        <button className="bg-[#FF7D29] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors">
                                          Continue
                                        </button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h3 className="text-xl font-bold text-gray-800">Learning Progress</h3>
                
                {/* Overall Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">Overall Progress</h4>
                    <div className="text-3xl font-bold">{course.progress}%</div>
                    <div className="text-blue-100 text-sm">{course.completedLessons} of {course.totalLessons} lessons</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">Total XP</h4>
                    <div className="text-3xl font-bold">{course.totalXP}</div>
                    <div className="text-yellow-100 text-sm">Points earned</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">Quiz Average</h4>
                    <div className="text-3xl font-bold">{course.avgQuizScore}%</div>
                    <div className="text-green-100 text-sm">Average score</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">Time Studied</h4>
                    <div className="text-3xl font-bold">{course.timeSpent}</div>
                    <div className="text-purple-100 text-sm">Total hours</div>
                  </div>
                </div>

                {/* Module Progress */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Module Progress</h4>
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={module.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-800">{module.title}</h5>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              {module.completed 
                                ? `${module.lessons}/${module.lessons}` 
                                : `${module.currentLesson || 0}/${module.lessons}`} lessons
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {getModuleProgress(module)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <motion.div
                            className={`h-3 rounded-full ${
                              module.completed ? 'bg-green-500' : 'bg-[#FF7D29]'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${getModuleProgress(module)}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{module.duration}</span>
                          {module.xpEarned > 0 && (
                            <span className="text-yellow-600 font-medium">+{module.xpEarned} XP</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Streak */}
                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🔥</div>
                    <div>
                      <h4 className="text-xl font-bold">Learning Streak</h4>
                      <p className="text-orange-100">You've been studying for {course.currentStreak} consecutive days!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Instructor Tab */}
            {activeTab === 'instructor' && (
              <motion.div
                key="instructor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h3 className="text-xl font-bold text-gray-800">About Your Instructor</h3>
                
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    MR
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-800 mb-1">{course.instructor}</h4>
                    <p className="text-[#FF7D29] font-medium mb-4">{course.instructorTitle}</p>
                    <p className="text-gray-600 leading-relaxed">{course.instructorBio}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-[#FF7D29] mb-2">{course.students.toLocaleString()}</div>
                    <div className="text-gray-600">Students Taught</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-[#FF7D29] mb-2">{course.rating}</div>
                    <div className="text-gray-600">Average Rating</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-[#FF7D29] mb-2">15+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h5 className="font-semibold text-blue-900 mb-2">Teaching Philosophy</h5>
                  <p className="text-blue-800">
                    "I believe that language learning should be engaging, practical, and tailored to each student's goals. 
                    My approach focuses on real-world application and building confidence through gradual skill development."
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {currentLesson ? (
          <Link href={`/student/courses/${params.courseId}/learn/${currentLesson.id}`}>
            <button className="bg-[#FF7D29] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#FF9D5C] transition-colors">
              Continue Learning
            </button>
          </Link>
        ) : course.status === 'completed' ? (
          <div className="flex gap-4">
            <Link href={`/student/courses/${params.courseId}/certificate`}>
              <button className="bg-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
                View Certificate
              </button>
            </Link>
            <Link href="/student/browse">
              <button className="bg-[#FF7D29] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#FF9D5C] transition-colors">
                Explore More Courses
              </button>
            </Link>
          </div>
        ) : (
          <Link href={`/student/courses/${params.courseId}/continue`}>
            <button className="bg-[#FF7D29] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#FF9D5C] transition-colors">
              Start Course
            </button>
          </Link>
        )}
        
        <Link href={`/student/courses/${params.courseId}/practice`}>
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Practice Mode
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default StudentCourseDetailPage;