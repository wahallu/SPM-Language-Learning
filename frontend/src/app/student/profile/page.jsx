"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    id: "",
    username: "",
    email: "",
    languageToLearn: "",
    languageKnown: "",
    role: "",
    createdAt: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    avatar: null,
  });

  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalXP: 0,
    currentLevel: 0,
    currentStreak: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    timeSpent: "0h 0m",
    achievementsUnlocked: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "activities", label: "Recent Activities", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  // Helper function to get authentication data from localStorage
  const getAuthData = () => {
    // Try different token keys based on your localStorage structure
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("supervisorToken");

    // Get user data from individual localStorage items
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");
    const knownLanguage = localStorage.getItem("knownLanguage");
    const learningLanguage = localStorage.getItem("learningLanguage");

    // Try to get structured user data if it exists
    let userData = null;
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      try {
        userData = JSON.parse(userDataStr);
      } catch (e) {
        console.error("Error parsing userData:", e);
      }
    }

    // If no structured userData, construct from individual keys
    if (!userData && userId) {
      userData = {
        id: userId,
        username: username,
        role: userRole || "STUDENT",
        languageKnown: knownLanguage,
        languageToLearn: learningLanguage,
      };
    }

    console.log("Auth Debug - Token:", token ? "Present" : "Missing");
    console.log("Auth Debug - UserData:", userData);
    console.log(
      "Auth Debug - Available localStorage keys:",
      Object.keys(localStorage)
    );

    return { token, userData };
  };

  // Fetch student profile data
  useEffect(() => {
    fetchStudentProfile();
    fetchStudentStats();
    fetchStudentActivities();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { token, userData } = getAuthData();

      if (!userData?.id || !token) {
        console.error("No user data or token found");
        setError("Authentication required. Please log in again.");
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/student/profile/${userData.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("Authentication failed, redirecting to login");
          localStorage.clear(); // Clear all auth data
          window.location.href = "/login";
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const student = result.data;
        setProfileData({
          id: student.id,
          username: student.username || userData.username || "",
          email: student.email || "",
          languageToLearn:
            student.languageToLearn || userData.languageToLearn || "",
          languageKnown: student.languageKnown || userData.languageKnown || "",
          role: student.role || userData.role || "STUDENT",
          createdAt: student.createdAt
            ? new Date(student.createdAt).toLocaleDateString()
            : "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          bio:
            userData.bio ||
            "Passionate language learner exploring new cultures and languages.",
          avatar: userData.avatar || null,
        });
      } else {
        throw new Error(result.message || "Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
      setError("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentStats = async () => {
    try {
      const { token, userData } = getAuthData();

      if (!userData?.id || !token) return;

      const response = await fetch(
        `http://localhost:8080/api/student/profile/${userData.id}/stats`,
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
        if (result.success && result.data) {
          setStats(result.data);
        }
      } else if (response.status === 401 || response.status === 403) {
        console.error("Token expired while fetching stats");
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error fetching student stats:", error);
    }
  };

  const fetchStudentActivities = async () => {
    try {
      const { token, userData } = getAuthData();

      if (!userData?.id || !token) return;

      const response = await fetch(
        `http://localhost:8080/api/student/profile/${userData.id}/activities`,
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
        if (result.success && result.data) {
          setRecentActivities(result.data);
        }
      } else if (response.status === 401 || response.status === 403) {
        console.error("Token expired while fetching activities");
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error fetching student activities:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const { token, userData } = getAuthData();

      if (!userData?.id || !token) {
        console.error("No user data or token found");
        setError("Authentication required. Please log in again.");
        return;
      }

      const updateData = {
        username: profileData.username,
        email: profileData.email,
        languageToLearn: profileData.languageToLearn,
        languageKnown: profileData.languageKnown,
      };

      const response = await fetch(
        `http://localhost:8080/api/student/profile/${userData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);

        // Update localStorage with new data
        localStorage.setItem("username", updateData.username);
        localStorage.setItem("knownLanguage", updateData.languageKnown);
        localStorage.setItem("learningLanguage", updateData.languageToLearn);

        // If userData object exists, update it too
        const existingUserData = localStorage.getItem("userData");
        if (existingUserData) {
          try {
            const parsedUserData = JSON.parse(existingUserData);
            const updatedUserData = { ...parsedUserData, ...updateData };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
          } catch (e) {
            console.error("Error updating userData:", e);
          }
        }

        alert("Profile updated successfully!");
        await fetchStudentProfile();
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "lesson_completed":
        return "✅";
      case "quiz_completed":
        return "📝";
      case "course_enrolled":
        return "📚";
      case "achievement_unlocked":
        return "🏆";
      case "streak_milestone":
        return "🔥";
      default:
        return "📌";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString();
    } catch (error) {
      return timestamp;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7D29] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
            >
              Retry
            </button>
            <Link
              href="/login"
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Remove the manual header/sidebar implementation since it's now in layout
  return (
    <div className="space-y-8">
      {/* Header - Now handled by layout */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back,{" "}
              {profileData.firstName || profileData.username || "Student"}!
            </h1>
            <p className="text-blue-100 text-lg">
              Continue your learning journey
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              👨‍🎓
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {profileData.firstName?.charAt(0) ||
                    profileData.username?.charAt(0) ||
                    "S"}
                  {profileData.lastName?.charAt(0) || ""}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#FF7D29]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {profileData.firstName} {profileData.lastName}{" "}
                {!profileData.firstName &&
                  !profileData.lastName &&
                  profileData.username}
              </h2>
              <p className="text-gray-600 mb-2">{profileData.email}</p>
              <p className="text-sm text-gray-500">
                Student • Level {stats.currentLevel}
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Learning</span>
                  <span className="font-medium text-[#FF7D29]">
                    {profileData.languageToLearn || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Native</span>
                  <span className="font-medium">
                    {profileData.languageKnown || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium">
                    {formatDate(profileData.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Learning Stats
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Total XP",
                  value: stats.totalXP?.toLocaleString() || "0",
                  icon: "⭐",
                },
                {
                  label: "Current Streak",
                  value: `${stats.currentStreak} days`,
                  icon: "🔥",
                },
                {
                  label: "Courses Enrolled",
                  value: stats.coursesEnrolled,
                  icon: "📚",
                },
                {
                  label: "Lessons Completed",
                  value: `${stats.completedLessons}/${stats.totalLessons}`,
                  icon: "✅",
                },
                {
                  label: "Average Score",
                  value: `${stats.averageScore}%`,
                  icon: "🎯",
                },
                { label: "Time Spent", value: stats.timeSpent, icon: "⏱️" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stat.icon}</span>
                    <span className="text-gray-600 text-sm">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <motion.div
            className="bg-white rounded-xl shadow-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-[#FF7D29] text-[#FF7D29] bg-orange-50"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Profile Information
                      </h3>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
                        disabled={isSaving}
                      >
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                            {profileData.username || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                          {profileData.email || "Not provided"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language Learning
                        </label>
                        {isEditing ? (
                          <select
                            value={profileData.languageToLearn}
                            onChange={(e) =>
                              handleInputChange(
                                "languageToLearn",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                          >
                            <option value="">Select Language</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Italian">Italian</option>
                            <option value="Portuguese">Portuguese</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Arabic">Arabic</option>
                            <option value="Russian">Russian</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Sinhala">Sinhala</option>
                            <option value="Tamil">Tamil</option>
                          </select>
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                            {profileData.languageToLearn || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Native Language
                        </label>
                        {isEditing ? (
                          <select
                            value={profileData.languageKnown}
                            onChange={(e) =>
                              handleInputChange("languageKnown", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                          >
                            <option value="">Select Language</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Italian">Italian</option>
                            <option value="Portuguese">Portuguese</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Arabic">Arabic</option>
                            <option value="Russian">Russian</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Sinhala">Sinhala</option>
                            <option value="Tamil">Tamil</option>
                          </select>
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                            {profileData.languageKnown || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                          {formatDate(profileData.createdAt)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                          {profileData.role || "Student"}
                        </p>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors disabled:opacity-50"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Activities Tab */}
                {activeTab === "activities" && (
                  <motion.div
                    key="activities"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      Recent Activities
                    </h3>

                    {recentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg">
                                {getActivityIcon(activity.type)}
                              </div>

                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">
                                  {activity.title}
                                </h4>
                                <p className="text-gray-600 text-sm mt-1">
                                  {activity.description}
                                </p>

                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-gray-400">
                                    {formatTimestamp(activity.timestamp)}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      activity.status
                                    )}`}
                                  >
                                    {activity.status}
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
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">📊</div>
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">
                          No Recent Activities
                        </h4>
                        <p className="text-gray-500">
                          Your learning activities will appear here.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      Account Settings
                    </h3>

                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Notifications
                        </h4>
                        <div className="space-y-4">
                          {[
                            {
                              label: "Email Notifications",
                              description: "Receive learning updates via email",
                            },
                            {
                              label: "Course Updates",
                              description:
                                "Notify when new content is available",
                            },
                            {
                              label: "Achievement Alerts",
                              description:
                                "Get notified about achievements and milestones",
                            },
                            {
                              label: "Study Reminders",
                              description:
                                "Daily reminders to maintain your streak",
                            },
                          ].map((setting, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {setting.label}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {setting.description}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29]"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Privacy
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-800">
                                Profile Visibility
                              </p>
                              <p className="text-gray-600 text-sm">
                                Make your profile visible to other learners
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29]"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="border border-red-200 rounded-xl p-6">
                        <h4 className="font-semibold text-red-600 mb-4">
                          Danger Zone
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
                            <div>
                              <p className="font-medium text-red-800">
                                Delete Account
                              </p>
                              <p className="text-red-600 text-sm">
                                Permanently delete your account and all data
                              </p>
                            </div>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
