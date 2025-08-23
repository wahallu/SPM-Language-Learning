"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const CourseContinuePage = ({ params }) => {
  const router = useRouter();
  
  // Mock course data
  const [course] = useState({
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
    currentModuleId: 5,
    nextLessonId: 19,
    totalXP: 1250,
    streak: 7
  });

  const [modules] = useState([
    {
      id: 1,
      title: "Introduction to English",
      lessons: 4,
      completed: true,
      xpEarned: 200
    },
    {
      id: 2,
      title: "Basic Grammar",
      lessons: 5,
      completed: true,
      xpEarned: 250
    },
    {
      id: 3,
      title: "Common Vocabulary",
      lessons: 4,
      completed: true,
      xpEarned: 200
    },
    {
      id: 4,
      title: "Speaking Practice",
      lessons: 5,
      completed: true,
      xpEarned: 250
    },
    {
      id: 5,
      title: "Daily Conversations",
      lessons: 4,
      completed: false,
      currentLesson: 3,
      xpEarned: 150
    },
    {
      id: 6,
      title: "Advanced Topics",
      lessons: 2,
      completed: false,
      currentLesson: 0,
      xpEarned: 0
    }
  ]);

  const [currentModule] = useState({
    id: 5,
    title: "Daily Conversations",
    description: "Learn practical phrases and expressions for everyday situations",
    lessons: [
      {
        id: 17,
        title: "At the Restaurant",
        description: "Learn how to order food and drinks",
        duration: "8 minutes",
        completed: true,
        xpEarned: 50
      },
      {
        id: 18,
        title: "Shopping for Clothes",
        description: "Vocabulary and phrases for shopping",
        duration: "10 minutes",
        completed: true,
        xpEarned: 55
      },
      {
        id: 19,
        title: "Asking for Directions",
        description: "Navigate the city with confidence",
        duration: "12 minutes",
        completed: false,
        current: true,
        xpEarned: 0
      },
      {
        id: 20,
        title: "Making Small Talk",
        description: "Casual conversations with friends and colleagues",
        duration: "9 minutes",
        completed: false,
        xpEarned: 0
      }
    ]
  });

  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);

  const currentLesson = currentModule.lessons.find(lesson => lesson.current);
  const nextLesson = currentModule.lessons.find(lesson => !lesson.completed && !lesson.current);

  const continueOptions = [
    {
      id: 'continue',
      title: 'Continue Where I Left Off',
      description: `Resume "${currentLesson?.title}" in ${currentModule.title}`,
      icon: '▶️',
      color: 'bg-[#FF7D29]',
      action: () => router.push(`/student/courses/${params.courseId}/learn/${currentLesson.id}`)
    },
    {
      id: 'review',
      title: 'Review Previous Lesson',
      description: 'Go back and review the last completed lesson',
      icon: '🔄',
      color: 'bg-blue-500',
      action: () => {
        const lastCompleted = currentModule.lessons.filter(l => l.completed).pop();
        if (lastCompleted) {
          router.push(`/student/courses/${params.courseId}/learn/${lastCompleted.id}`);
        }
      }
    },
    {
      id: 'practice',
      title: 'Practice Mode',
      description: 'Review vocabulary and take practice quizzes',
      icon: '🎯',
      color: 'bg-purple-500',
      action: () => router.push(`/student/courses/${params.courseId}/practice`)
    },
    {
      id: 'overview',
      title: 'Course Overview',
      description: 'See all modules and track your progress',
      icon: '📊',
      color: 'bg-green-500',
      action: () => router.push(`/student/courses/${params.courseId}`)
    }
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option.id);
    setTimeout(() => {
      option.action();
    }, 500);
  };

  const handleQuickStart = () => {
    router.push(`/student/courses/${params.courseId}/learn/${currentLesson.id}`);
  };

  useEffect(() => {
    // Auto-hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcomeBack(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Welcome Back Overlay */}
      <AnimatePresence>
        {showWelcomeBack && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWelcomeBack(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                👋
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h2>
              <p className="text-gray-600 mb-6">
                Ready to continue your English learning journey? You're doing great!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleQuickStart}
                  className="flex-1 bg-[#FF7D29] text-white py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-colors"
                >
                  Quick Start
                </button>
                <button
                  onClick={() => setShowWelcomeBack(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Choose Options
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link 
              href="/student/courses"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          </div>
          <p className="text-gray-600 text-lg">Choose how you'd like to continue learning</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Course Progress */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-[#FF7D29]"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${course.progress}, 100`}
                    strokeLinecap="round"
                    fill="transparent"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${course.progress}, 100` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">{course.progress}%</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Course Progress</h3>
              <p className="text-gray-600 text-sm">{course.completedLessons} of {course.totalLessons} lessons</p>
            </div>

            {/* Current Streak */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Current Streak</h3>
              <p className="text-gray-600 text-sm">{course.streak} days strong!</p>
            </div>

            {/* Total XP */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Total XP</h3>
              <p className="text-gray-600 text-sm">{course.totalXP.toLocaleString()} points earned</p>
            </div>
          </div>
        </motion.div>

        {/* Continue Options */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {continueOptions.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={`relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left overflow-hidden group ${
                selectedOption === option.id ? 'ring-4 ring-blue-300' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-[#FF7D29] transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
              </div>
              
              {selectedOption === option.id && (
                <motion.div
                  className="absolute inset-0 bg-blue-500 bg-opacity-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Current Module Overview */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Module</h2>
          <p className="text-gray-600 mb-6">{currentModule.description}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Module Progress */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">{currentModule.title}</h3>
              <div className="space-y-3">
                {currentModule.lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      lesson.current 
                        ? 'bg-[#FF7D29] bg-opacity-10 border-2 border-[#FF7D29]' 
                        : lesson.completed 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      lesson.current 
                        ? 'bg-[#FF7D29]' 
                        : lesson.completed 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`}>
                      {lesson.completed ? '✓' : lesson.current ? '▶' : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        lesson.current ? 'text-[#FF7D29]' : 'text-gray-800'
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{lesson.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{lesson.duration}</p>
                      {lesson.completed && (
                        <p className="text-xs text-green-600">+{lesson.xpEarned} XP</p>
                      )}
                      {lesson.current && (
                        <span className="text-xs bg-[#FF7D29] text-white px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              
              {/* Next Lesson Card */}
              <div className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-xl p-6 text-white mb-4">
                <h4 className="font-semibold mb-2">Up Next</h4>
                <h5 className="text-lg font-bold mb-2">{currentLesson?.title}</h5>
                <p className="text-orange-100 text-sm mb-4">{currentLesson?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">⏱️ {currentLesson?.duration}</span>
                  <button
                    onClick={handleQuickStart}
                    className="bg-white text-[#FF7D29] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Start Lesson
                  </button>
                </div>
              </div>

              {/* Study Streak */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h4 className="font-semibold">Keep Your Streak!</h4>
                    <p className="text-purple-100 text-sm">{course.streak} days in a row</p>
                  </div>
                </div>
                <p className="text-purple-100 text-sm">
                  Study today to maintain your learning streak and earn bonus XP!
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module Progress Overview */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  module.id === course.currentModuleId
                    ? 'border-[#FF7D29] bg-orange-50'
                    : module.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${
                    module.id === course.currentModuleId ? 'text-[#FF7D29]' : 'text-gray-800'
                  }`}>
                    {module.title}
                  </h3>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                    module.id === course.currentModuleId
                      ? 'bg-[#FF7D29]'
                      : module.completed
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                  }`}>
                    {module.completed ? '✓' : module.id === course.currentModuleId ? '▶' : module.id}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {module.completed 
                    ? `${module.lessons} lessons completed`
                    : module.id === course.currentModuleId
                    ? `${module.currentLesson} of ${module.lessons} lessons`
                    : `${module.lessons} lessons`}
                </div>
                
                {module.xpEarned > 0 && (
                  <div className="text-xs text-yellow-600">
                    +{module.xpEarned} XP earned
                  </div>
                )}
                
                {module.id === course.currentModuleId && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#FF7D29] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(module.currentLesson / module.lessons) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseContinuePage;