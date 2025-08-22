"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const StudentHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    languageToLearn: "",
    currentLevel: 1,
  });

  const notifications = [
    {
      id: 1,
      title: "New lesson available!",
      message: 'Your next lesson "Advanced Grammar" is ready',
      time: "5 min ago",
      unread: true,
      type: "lesson",
    },
    {
      id: 2,
      title: "Achievement unlocked!",
      message: 'You earned the "Streak Master" badge',
      time: "1 hour ago",
      unread: true,
      type: "achievement",
    },
    {
      id: 3,
      title: "Daily goal reminder",
      message: "You have 3 minutes left to complete your daily goal",
      time: "2 hours ago",
      unread: false,
      type: "reminder",
    },
    {
      id: 4,
      title: "Course progress",
      message: "You completed 85% of Spanish Basics",
      time: "1 day ago",
      unread: false,
      type: "progress",
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Get student data from localStorage
      const authToken = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");
      const languageToLearn = localStorage.getItem("learningLanguage");

      if (!authToken || !userId) {
        console.log("No student auth data found");
        return;
      }

      setStudentData({ id: userId, username });

      // Try to fetch detailed profile data from API
      const response = await fetch(
        `http://localhost:8080/api/student/profile/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const student = result.data;
          setProfileData({
            username: student.username || username || "",
            email: student.email || "",
            firstName: student.firstName || "",
            lastName: student.lastName || "",
            languageToLearn: student.languageToLearn || languageToLearn || "",
            currentLevel: student.currentLevel || 1,
          });
        }
      } else {
        // Fallback to stored data if API call fails
        setProfileData({
          username: username || "",
          email: "",
          firstName: "",
          lastName: "",
          languageToLearn: languageToLearn || "",
          currentLevel: 1,
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      // Fallback to stored data if API call fails
      const username = localStorage.getItem("username");
      const languageToLearn = localStorage.getItem("learningLanguage");
      setProfileData({
        username: username || "",
        email: "",
        firstName: "",
        lastName: "",
        languageToLearn: languageToLearn || "",
        currentLevel: 1,
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("knownLanguage");
    localStorage.removeItem("learningLanguage");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  const getInitials = () => {
    const firstName = profileData.firstName;
    const lastName = profileData.lastName;
    const username = profileData.username;

    if (firstName && lastName) {
      return (
        firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
      );
    } else if (firstName) {
      return (
        firstName.charAt(0).toUpperCase() +
          firstName.charAt(1)?.toUpperCase() || ""
      );
    } else if (username) {
      return (
        username.charAt(0).toUpperCase() + username.charAt(1)?.toUpperCase() ||
        ""
      );
    }
    return "ST";
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "lesson":
        return "📚";
      case "achievement":
        return "🏆";
      case "reminder":
        return "⏰";
      case "progress":
        return "📊";
      default:
        return "📌";
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <Link href="/student" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#FF7D29] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">Z</span>
          </div>
          <span className="text-xl font-bold text-gray-800">
            ZorsCode Academy
          </span>
          <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Student
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search courses, lessons, or topics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
              <span className="text-orange-500">🔥</span>
              <span className="text-gray-700 font-medium">7 day streak</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
              <span className="text-yellow-500">⭐</span>
              <span className="text-gray-700 font-medium">2,450 XP</span>
            </div>
          </div>

          {/* Browse Courses Button */}
          <Link href="/student/browse">
            <motion.button
              className="bg-[#FF7D29] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#FF9D5C] transition-colors hidden md:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Courses
            </motion.button>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5-5V9a5 5 0 00-10 0v3L0 17h5a5 5 0 0010 0z"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          notification.unread ? "bg-blue-50" : ""
                        }`}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm">
                              {notification.title}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="text-[#FF7D29] text-sm font-medium hover:text-[#FF9D5C] w-full text-center">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials()}
              </div>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {getInitials()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {profileData.firstName && profileData.lastName
                            ? `${profileData.firstName} ${profileData.lastName}`
                            : profileData.username || "Student"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {profileData.email || "student@email.com"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500 text-sm">⭐</span>
                          <span className="text-sm text-gray-600">
                            Level {profileData.currentLevel} • 2,450 XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/student/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span>👤</span>
                        My Profile
                      </span>
                    </Link>
                    <Link
                      href="/student/progress"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span>📊</span>
                        Learning Progress
                      </span>
                    </Link>
                    <Link
                      href="/student/achievements"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span>🏆</span>
                        Achievements
                      </span>
                    </Link>
                    <Link
                      href="/student/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span>⚙️</span>
                        Settings
                      </span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span>🚪</span>
                        Sign Out
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default StudentHeader;
