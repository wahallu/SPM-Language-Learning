"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const StudentDashboard = () => {
  const [student] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    currentStreak: 7,
    totalXP: 2450,
    level: 5,
    profileImage: null,
    joinedDate: "2024-01-15",
    learningLanguages: ["English", "Spanish"]
  });

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
      currentModule: "Module 6: Daily Conversations",
      nextLesson: "Ordering Food at a Restaurant",
      estimatedTime: "8 minutes",
      lastAccessed: "2024-03-15T14:30:00Z",
      status: "in-progress"
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
      currentModule: "Module 3: Grammar Basics",
      nextLesson: "Verb Conjugations",
      estimatedTime: "12 minutes",
      lastAccessed: "2024-03-14T10:15:00Z",
      status: "in-progress"
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
      currentModule: "Course Completed",
      nextLesson: null,
      estimatedTime: null,
      lastAccessed: "2024-03-10T16:45:00Z",
      status: "completed"
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: "lesson_completed",
      title: "Completed: Greetings and Introductions",
      course: "Beginner Basics",
      timestamp: "2024-03-15T14:30:00Z",
      xpGained: 50
    },
    {
      id: 2,
      type: "quiz_passed",
      title: "Passed Quiz: Basic Vocabulary",
      course: "Beginner Basics",
      timestamp: "2024-03-15T14:15:00Z",
      score: 85,
      xpGained: 25
    },
    {
      id: 3,
      type: "streak_milestone",
      title: "7-day Learning Streak!",
      course: null,
      timestamp: "2024-03-15T09:00:00Z",
      xpGained: 100
    },
    {
      id: 4,
      type: "lesson_completed",
      title: "Completed: Basic Pronunciation",
      course: "Spanish Fundamentals",
      timestamp: "2024-03-14T10:30:00Z",
      xpGained: 45
    }
  ]);

  const [achievements] = useState([
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      unlocked: true,
      unlockedDate: "2024-01-16"
    },
    {
      id: 2,
      title: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      unlocked: true,
      unlockedDate: "2024-03-15"
    },
    {
      id: 3,
      title: "Quiz Champion",
      description: "Score 100% on 5 quizzes",
      icon: "🏆",
      unlocked: false,
      progress: 3,
      target: 5
    },
    {
      id: 4,
      title: "Course Finisher",
      description: "Complete your first course",
      icon: "🎓",
      unlocked: true,
      unlockedDate: "2024-03-10"
    }
  ]);

  const getLevelProgress = () => {
    const currentLevelXP = student.level * 500;
    const nextLevelXP = (student.level + 1) * 500;
    const progressInLevel = student.totalXP - currentLevelXP;
    const xpNeededForNext = nextLevelXP - currentLevelXP;
    return (progressInLevel / xpNeededForNext) * 100;
  };

  const getXPToNextLevel = () => {
    const nextLevelXP = (student.level + 1) * 500;
    return nextLevelXP - student.totalXP;
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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-2xl p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {student.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-orange-100 text-lg mb-4">
                Ready to continue your learning journey?
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-sm text-orange-200">Current Streak</p>
                    <p className="text-xl font-bold">{student.currentStreak} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-sm text-orange-200">Level {student.level}</p>
                    <p className="text-xl font-bold">{student.totalXP} XP</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <Image
                src="/Gif/reading boy.gif"
                alt="Learning mascot"
                width={120}
                height={120}
                unoptimized={true}
              />
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-200">Level Progress</span>
              <span className="text-sm text-orange-200">
                {getXPToNextLevel()} XP to Level {student.level + 1}
              </span>
            </div>
            <div className="w-full bg-orange-400 bg-opacity-30 rounded-full h-3">
              <motion.div
                className="bg-white h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getLevelProgress()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Courses Enrolled', 
            value: enrolledCourses.length, 
            icon: '📚', 
            color: 'bg-blue-500',
            subtitle: `${enrolledCourses.filter(c => c.status === 'in-progress').length} active`
          },
          { 
            title: 'Lessons Completed', 
            value: enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0), 
            icon: '✅', 
            color: 'bg-green-500',
            subtitle: 'This month'
          },
          { 
            title: 'Average Score', 
            value: '87%', 
            icon: '🎯', 
            color: 'bg-purple-500',
            subtitle: 'Quiz performance'
          },
          { 
            title: 'Hours Learned', 
            value: '24.5', 
            icon: '⏱️', 
            color: 'bg-yellow-500',
            subtitle: 'Total time'
          }
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
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Learning Section */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Continue Learning</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrolledCourses.filter(course => course.status === 'in-progress').map((course, index) => (
            <motion.div
              key={course.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {course.category} • {course.instructor}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {course.currentModule}
                  </p>
                </div>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {course.level}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-800">
                    {course.completedLessons}/{course.totalLessons} lessons ({course.progress}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-[#FF7D29] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>

              {/* Next Lesson */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Next Lesson:</p>
                <p className="font-medium text-gray-800">{course.nextLesson}</p>
                <p className="text-sm text-gray-500">Estimated time: {course.estimatedTime}</p>
              </div>

              <div className="flex gap-3">
                <Link 
                  href={`/student/courses/${course.id}/continue`}
                  className="flex-1 text-center py-3 bg-[#FF7D29] text-white rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
                >
                  Continue Learning
                </Link>
                <Link 
                  href={`/student/courses/${course.id}`}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  View Course
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm ${
                  activity.type === 'lesson_completed' ? 'bg-green-500' :
                  activity.type === 'quiz_passed' ? 'bg-blue-500' :
                  activity.type === 'streak_milestone' ? 'bg-orange-500' : 'bg-gray-500'
                }`}>
                  {activity.type === 'lesson_completed' ? '✓' :
                   activity.type === 'quiz_passed' ? '🧠' :
                   activity.type === 'streak_milestone' ? '🔥' : '📚'}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  {activity.course && (
                    <p className="text-sm text-gray-600">{activity.course}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    {activity.xpGained && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        +{activity.xpGained} XP
                      </span>
                    )}
                    {activity.score && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {activity.score}% Score
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link 
            href="/student/activity"
            className="block text-center mt-6 text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
          >
            View All Activity
          </Link>
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Achievements</h2>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-3xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.unlocked ? (
                      <p className="text-xs text-green-600 mt-1">
                        Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    ) : achievement.progress !== undefined ? (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            Progress: {achievement.progress}/{achievement.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-[#FF7D29] h-1 rounded-full transition-all duration-500"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link 
            href="/student/achievements"
            className="block text-center mt-6 text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
          >
            View All Achievements
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;