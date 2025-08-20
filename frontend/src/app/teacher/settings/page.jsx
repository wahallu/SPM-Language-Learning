"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const TeacherSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: "Dr. Maria Rodriguez",
    title: "Language Expert",
    email: "maria.rodriguez@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Experienced language teacher with over 10 years of expertise in teaching English, Spanish, and French. Specialized in conversational learning methods and cultural immersion techniques.",
    avatarUrl: "/images/avatar.png",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    studentMessages: true,
    courseEnrollments: true,
    courseReviews: true,
    marketingEmails: false,
  });

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    language: "English",
    timezone: "UTC-05:00 (Eastern Time)",
    twoFactorAuth: false,
  });

  // Handle profile data change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle notification settings change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle account settings change
  const handleAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save notification settings
  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Notification settings updated successfully!");
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      alert("Failed to update notification settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save account settings
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Account settings updated successfully!");
    } catch (error) {
      console.error("Failed to update account settings:", error);
      alert("Failed to update account settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "account", label: "Account", icon: "🔐" },
    { id: "billing", label: "Billing", icon: "💳" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-[#FF7D29] border-b-2 border-[#FF7D29] bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Profile Information
                </h2>
                <p className="text-gray-600">
                  Update your personal information and public profile
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-start gap-8">
                  {/* Avatar Section */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden">
                        {profileData.avatarUrl ? (
                          <Image
                            src={profileData.avatarUrl}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#FF7D29] text-white text-4xl font-bold">
                            {profileData.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
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
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click to upload a new photo
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Professional Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={profileData.title}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        placeholder="Tell students about yourself and your expertise..."
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        This will be displayed on your public profile and course
                        pages.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Saving...
                      </div>
                    ) : (
                      "Save Profile"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Notification Settings
                </h2>
                <p className="text-gray-600">
                  Manage how and when you receive notifications
                </p>
              </div>

              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">
                    Email Notifications
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">
                          All Email Notifications
                        </p>
                        <p className="text-sm text-gray-600">
                          Master toggle for all email notifications
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7D29] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pl-4">
                      <div>
                        <p className="text-gray-800">Student Messages</p>
                        <p className="text-sm text-gray-600">
                          When students send you a message
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="studentMessages"
                          checked={notificationSettings.studentMessages}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7D29] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29] ${
                            !notificationSettings.emailNotifications
                              ? "opacity-50"
                              : ""
                          }`}
                        ></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pl-4">
                      <div>
                        <p className="text-gray-800">Course Enrollments</p>
                        <p className="text-sm text-gray-600">
                          When new students enroll in your courses
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="courseEnrollments"
                          checked={notificationSettings.courseEnrollments}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7D29] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29] ${
                            !notificationSettings.emailNotifications
                              ? "opacity-50"
                              : ""
                          }`}
                        ></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pl-4">
                      <div>
                        <p className="text-gray-800">Course Reviews</p>
                        <p className="text-sm text-gray-600">
                          When students review your courses
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="courseReviews"
                          checked={notificationSettings.courseReviews}
                          onChange={handleNotificationChange}
                          disabled={!notificationSettings.emailNotifications}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7D29] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29] ${
                            !notificationSettings.emailNotifications
                              ? "opacity-50"
                              : ""
                          }`}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">
                    Marketing Communications
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 font-medium">
                        Marketing Emails
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive updates about new features and teaching tips
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7D29] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29]"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Saving...
                      </div>
                    ) : (
                      "Save Notification Settings"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Account Settings
                </h2>
                <p className="text-gray-600">
                  Manage your account preferences and security
                </p>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">Preferences</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        name="language"
                        value={accountSettings.language}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={accountSettings.timezone}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      >
                        <option value="UTC-08:00 (Pacific Time)">
                          UTC-08:00 (Pacific Time)
                        </option>
                        <option value="UTC-07:00 (Mountain Time)">
                          UTC-07:00 (Mountain Time)
                        </option>
                        <option value="UTC-06:00 (Central Time)">
                          UTC-06:00 (Central Time)
                        </option>
                        <option value="UTC-05:00 (Eastern Time)">
                          UTC-05:00 (Eastern Time)
                        </option>
                        <option value="UTC+00:00 (UTC)">UTC+00:00 (UTC)</option>
                        <option value="UTC+01:00 (Central European Time)">
                          UTC+01:00 (Central European Time)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">Security</h3>

                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="twoFactorAuth"
                          checked={accountSettings.twoFactorAuth}
                          onChange={handleAccountChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7D29] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29]"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="text-[#FF7D29] font-medium text-sm hover:text-[#FF9D5C]"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">Danger Zone</h3>

                  <div>
                    <button
                      type="button"
                      className="text-red-600 font-medium text-sm hover:text-red-800"
                    >
                      Deactivate Account
                    </button>
                    <p className="text-sm text-gray-500 mt-1">
                      Temporarily disable your account. You can reactivate it
                      anytime.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Saving...
                      </div>
                    ) : (
                      "Save Account Settings"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Billing & Payments
                </h2>
                <p className="text-gray-600">
                  Manage your payment methods and view transaction history
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Payment Methods
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No payment methods added yet
                  </p>
                  <button className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors">
                    Add Payment Method
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Transaction History
                </h3>
                <div className="text-center py-4">
                  <p className="text-gray-600">No transactions found</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Payout Settings
                </h3>
                <p className="text-gray-600 mb-4">
                  Connect your bank account to receive payments from your
                  courses
                </p>
                <button className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors">
                  Set Up Payouts
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherSettingsPage;
