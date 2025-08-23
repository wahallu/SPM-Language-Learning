"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalLessonsCompleted: 0,
    currentStreak: 0,
    totalXP: 0,
    currentLevel: 1,
    coursesEnrolled: 0,
    coursesCompleted: 0,
    averageScore: 0,
    weeklyGoalProgress: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get student data from localStorage
    const storedStudentData = JSON.parse(
      localStorage.getItem("userData") || "{}"
    );
    setStudentData(storedStudentData);

    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("No student token or ID found");
        window.location.href = "/login";
        return;
      }

      // Fetch dashboard statistics
      const statsResponse = await fetch(
        `http://localhost:8080/api/student/dashboard/stats/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        if (statsResult.success) {
          setStats(statsResult.data);
        }
      } else if (statsResponse.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "/login";
        return;
      }

      // Fetch recent activities
      const activitiesResponse = await fetch(
        `http://localhost:8080/api/student/dashboard/activities/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (activitiesResponse.ok) {
        const activitiesResult = await activitiesResponse.json();
        if (activitiesResult.success) {
          setRecentActivity(activitiesResult.data);
        }
      }

      // Fetch upcoming lessons
      const lessonsResponse = await fetch(
        `http://localhost:8080/api/student/dashboard/upcoming-lessons/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (lessonsResponse.ok) {
        const lessonsResult = await lessonsResponse.json();
        if (lessonsResult.success) {
          setUpcomingLessons(lessonsResult.data);
        }
      }

      // Fetch recent achievements
      const achievementsResponse = await fetch(
        `http://localhost:8080/api/student/dashboard/achievements/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (achievementsResponse.ok) {
        const achievementsResult = await achievementsResponse.json();
        if (achievementsResult.success) {
          setAchievements(achievementsResult.data);
        }
      }

      // Fetch student profile data
      const profileResponse = await fetch(
        `http://localhost:8080/api/student/profile/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (profileResponse.ok) {
        const profileResult = await profileResponse.json();
        if (profileResult.success && profileResult.data) {
          const student = profileResult.data;
          setStudentData({
            id: student.id,
            username: student.username,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            languageToLearn: student.languageToLearn,
            languageKnown: student.languageKnown,
            currentLevel: student.currentLevel || 1,
            totalXP: student.totalXP || 0,
          });

          // Update localStorage with fresh data
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ...student,
              currentLevel: student.currentLevel || 1,
              totalXP: student.totalXP || 0,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");

      // Use fallback data
      setStats({
        totalLessonsCompleted: 45,
        currentStreak: 7,
        totalXP: 2450,
        currentLevel: 5,
        coursesEnrolled: 3,
        coursesCompleted: 1,
        averageScore: 87,
        weeklyGoalProgress: 75,
      });

      setRecentActivity([
        {
          id: 1,
          type: "lesson_completed",
          title: "Spanish Grammar Basics - Lesson 3",
          course: "Spanish Fundamentals",
          time: "2 hours ago",
          xpEarned: 50,
          status: "completed",
        },
        {
          id: 2,
          type: "quiz_completed",
          title: "Vocabulary Quiz",
          course: "English Advanced",
          time: "1 day ago",
          score: 92,
          status: "completed",
        },
      ]);

      setUpcomingLessons([
        {
          id: 1,
          title: "Spanish Conversation Practice",
          course: "Spanish Fundamentals",
          time: "2:00 PM Today",
          duration: "30 min",
          difficulty: "intermediate",
          type: "conversation",
        },
        {
          id: 2,
          title: "Grammar Review",
          course: "English Advanced",
          time: "Tomorrow 10:00 AM",
          duration: "45 min",
          difficulty: "advanced",
          type: "lesson",
        },
      ]);

      setAchievements([
        {
          id: 1,
          title: "7-Day Streak!",
          description: "Completed lessons for 7 consecutive days",
          icon: "🔥",
          earned: true,
          dateEarned: "2024-01-20",
        },
        {
          id: 2,
          title: "Grammar Master",
          description: "Scored 90+ on 5 grammar quizzes",
          icon: "📚",
          earned: true,
          dateEarned: "2024-01-18",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLesson = async (lessonId) => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      // Log lesson start activity
      await fetch(
        `http://localhost:8080/api/student/lessons/${lessonId}/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId: userId }),
        }
      );

      // Navigate to lesson
      window.location.href = `/student/lessons/${lessonId}`;
    } catch (error) {
      console.error("Error starting lesson:", error);
      // Navigate anyway if API fails
      window.location.href = `/student/lessons/${lessonId}`;
    }
  };

  const handleRefreshData = () => {
    fetchDashboardData();
  };

  const calculateLevelProgress = () => {
    const xpPerLevel = 500; // Assuming 500 XP per level
    const currentLevelXP = stats.totalXP % xpPerLevel;
    const progressPercentage = (currentLevelXP / xpPerLevel) * 100;
    return Math.min(progressPercentage, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getDisplayName = () => {
    if (studentData?.firstName && studentData?.lastName) {
      return `${studentData.firstName} ${studentData.lastName}`;
    }
    return studentData?.username || "Student";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7D29] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefreshData}
            className="bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {getDisplayName()}!
            </h1>
            <p className="text-orange-100 text-lg">
              Ready to continue your learning journey?
            </p>
            {studentData?.languageToLearn && (
              <p className="text-orange-200 text-sm mt-2">
                Learning: {studentData.languageToLearn}
                {studentData.languageKnown &&
                  ` | Native: ${studentData.languageKnown}`}
              </p>
            )}
          </div>
          <div className="hidden md:block">
            <Image
              src="/Gif/Cup.gif"
              alt="Learning mascot"
              width={80}
              height={80}
              unoptimized={true}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Current Streak",
            value: `${stats.currentStreak} days`,
            icon: "🔥",
            color: "bg-red-500",
            change:
              stats.currentStreak > 0 ? "Keep it going!" : "Start your streak!",
          },
          {
            title: "Total XP",
            value: stats.totalXP.toLocaleString(),
            icon: "⭐",
            color: "bg-yellow-500",
            change: `Level ${stats.currentLevel}`,
          },
          {
            title: "Lessons Completed",
            value: stats.totalLessonsCompleted,
            icon: "📚",
            color: "bg-blue-500",
            change: `${stats.coursesEnrolled} courses enrolled`,
          },
          {
            title: "Average Score",
            value: `${stats.averageScore}%`,
            icon: "🎯",
            color: "bg-green-500",
            change: stats.averageScore >= 80 ? "Excellent!" : "Keep improving!",
          },
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
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Level Progress</h2>
          <span className="text-[#FF7D29] font-semibold">
            Level {stats.currentLevel}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <motion.div
            className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calculateLevelProgress()}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{stats.totalXP % 500} XP</span>
          <span>{500 - (stats.totalXP % 500)} XP to next level</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/student/browse">
            <motion.div
              className="p-4 border-2 border-dashed border-[#FF7D29] rounded-xl hover:bg-orange-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF7D29] rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  🔍
                </div>
                <h3 className="font-semibold text-gray-800">Browse Courses</h3>
                <p className="text-gray-600 text-sm">Discover new lessons</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/student/progress">
            <motion.div
              className="p-4 border-2 border-dashed border-blue-400 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  📊
                </div>
                <h3 className="font-semibold text-gray-800">View Progress</h3>
                <p className="text-gray-600 text-sm">Track your learning</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/student/quizzes">
            <motion.div
              className="p-4 border-2 border-dashed border-green-400 rounded-xl hover:bg-green-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  🧠
                </div>
                <h3 className="font-semibold text-gray-800">Take Quiz</h3>
                <p className="text-gray-600 text-sm">Test your knowledge</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/student/achievements">
            <motion.div
              className="p-4 border-2 border-dashed border-purple-400 rounded-xl hover:bg-purple-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3">
                  🏆
                </div>
                <h3 className="font-semibold text-gray-800">Achievements</h3>
                <p className="text-gray-600 text-sm">View your awards</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Lessons */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Upcoming Lessons
          </h2>

          <div className="space-y-4">
            {upcomingLessons.length > 0 ? (
              upcomingLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Course: {lesson.course}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {lesson.duration}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            lesson.difficulty === "beginner"
                              ? "bg-green-100 text-green-700"
                              : lesson.difficulty === "intermediate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {lesson.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {lesson.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {lesson.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartLesson(lesson.id)}
                        className="bg-[#FF7D29] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-gray-500">No upcoming lessons</p>
                <Link
                  href="/student/browse"
                  className="text-[#FF7D29] hover:text-[#FF9D5C] text-sm font-medium mt-2 inline-block"
                >
                  Browse courses to get started
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      activity.type === "lesson_completed"
                        ? "bg-green-500"
                        : activity.type === "quiz_completed"
                        ? "bg-blue-500"
                        : activity.type === "achievement_earned"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {activity.type === "lesson_completed"
                      ? "📚"
                      : activity.type === "quiz_completed"
                      ? "🧠"
                      : activity.type === "achievement_earned"
                      ? "🏆"
                      : "📝"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600">{activity.course}</p>
                    {activity.xpEarned && (
                      <p className="text-xs text-[#FF7D29] font-medium">
                        +{activity.xpEarned} XP
                      </p>
                    )}
                    {activity.score && (
                      <p className="text-xs text-green-600 font-medium">
                        Score: {activity.score}%
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDate(activity.time) || activity.time}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-500">No recent activity</p>
                <p className="text-gray-400 text-sm">
                  Start learning to see your progress here
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Recent Achievements
            </h2>
            <Link
              href="/student/achievements"
              className="text-[#FF7D29] hover:text-[#FF9D5C] text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-yellow-600 font-medium">
                    Earned {formatDate(achievement.dateEarned)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly Goal Progress */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Weekly Goal Progress
        </h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              {Math.floor(stats.weeklyGoalProgress / 15)} lessons completed this
              week
            </span>
            <span>{stats.weeklyGoalProgress}% of goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.weeklyGoalProgress, 100)}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {stats.weeklyGoalProgress >= 100
            ? "🎉 Congratulations! You've completed your weekly goal!"
            : `Great progress! Complete ${Math.ceil(
                (100 - stats.weeklyGoalProgress) / 15
              )} more lessons to reach your weekly goal.`}
        </p>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
