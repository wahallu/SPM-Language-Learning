"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';

const SupervisorSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    autoApproval: false,
    emailNotifications: true,
    weeklyReports: true,
    qualityThreshold: 80,
    maxReviewTime: 48,
    language: 'en',
    timezone: 'UTC+05:30'
  });

  const [contentSettings, setContentSettings] = useState({
    requireVideoPreview: true,
    minLessonDuration: 10,
    maxLessonDuration: 60,
    allowExternalLinks: true,
    moderateComments: true,
    enableQuizzes: true,
    minQuizQuestions: 5
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newCourseSubmissions: true,
    pendingReviews: true,
    qualityAlerts: true,
    teacherMessages: true,
    systemUpdates: false,
    weeklyDigest: true,
    emailFrequency: 'immediate'
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'platform',
    showActivity: true,
    allowDirectMessages: true,
    shareStatistics: false,
    dataRetention: '2years',
    twoFactorAuth: false
  });

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'content', name: 'Content Review', icon: '📝' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy & Security', icon: '🔒' },
    { id: 'integration', name: 'Integrations', icon: '🔗' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">General Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Auto-Approval for Trusted Teachers</label>
              <p className="text-sm text-gray-500">Automatically approve content from verified teachers</p>
            </div>
            <input
              type="checkbox"
              checked={generalSettings.autoApproval}
              onChange={(e) => setGeneralSettings({...generalSettings, autoApproval: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive email updates about platform activities</p>
            </div>
            <input
              type="checkbox"
              checked={generalSettings.emailNotifications}
              onChange={(e) => setGeneralSettings({...generalSettings, emailNotifications: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Weekly Reports</label>
              <p className="text-sm text-gray-500">Generate and send weekly activity reports</p>
            </div>
            <input
              type="checkbox"
              checked={generalSettings.weeklyReports}
              onChange={(e) => setGeneralSettings({...generalSettings, weeklyReports: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Quality Threshold (%)</label>
            <input
              type="range"
              min="50"
              max="100"
              value={generalSettings.qualityThreshold}
              onChange={(e) => setGeneralSettings({...generalSettings, qualityThreshold: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>50%</span>
              <span>Current: {generalSettings.qualityThreshold}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Maximum Review Time (hours)</label>
            <select
              value={generalSettings.maxReviewTime}
              onChange={(e) => setGeneralSettings({...generalSettings, maxReviewTime: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
              <option value={168}>1 week</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Language</label>
              <select
                value={generalSettings.language}
                onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC+05:30">UTC+05:30 (Sri Lanka)</option>
                <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                <option value="UTC-05:00">UTC-05:00 (EST)</option>
                <option value="UTC+01:00">UTC+01:00 (CET)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContentSettings = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Review Standards</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Require Video Preview</label>
              <p className="text-sm text-gray-500">All lessons must include video content</p>
            </div>
            <input
              type="checkbox"
              checked={contentSettings.requireVideoPreview}
              onChange={(e) => setContentSettings({...contentSettings, requireVideoPreview: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Min Lesson Duration (minutes)</label>
              <input
                type="number"
                min="5"
                max="30"
                value={contentSettings.minLessonDuration}
                onChange={(e) => setContentSettings({...contentSettings, minLessonDuration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Max Lesson Duration (minutes)</label>
              <input
                type="number"
                min="30"
                max="120"
                value={contentSettings.maxLessonDuration}
                onChange={(e) => setContentSettings({...contentSettings, maxLessonDuration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Allow External Links</label>
              <p className="text-sm text-gray-500">Permit links to external resources</p>
            </div>
            <input
              type="checkbox"
              checked={contentSettings.allowExternalLinks}
              onChange={(e) => setContentSettings({...contentSettings, allowExternalLinks: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Moderate Comments</label>
              <p className="text-sm text-gray-500">Review comments before publication</p>
            </div>
            <input
              type="checkbox"
              checked={contentSettings.moderateComments}
              onChange={(e) => setContentSettings({...contentSettings, moderateComments: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Enable Quizzes</label>
              <p className="text-sm text-gray-500">Require quizzes for lesson completion</p>
            </div>
            <input
              type="checkbox"
              checked={contentSettings.enableQuizzes}
              onChange={(e) => setContentSettings({...contentSettings, enableQuizzes: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {contentSettings.enableQuizzes && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">Minimum Quiz Questions</label>
              <input
                type="number"
                min="3"
                max="20"
                value={contentSettings.minQuizQuestions}
                onChange={(e) => setContentSettings({...contentSettings, minQuizQuestions: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">New Course Submissions</label>
              <p className="text-sm text-gray-500">Notify when teachers submit new courses</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.newCourseSubmissions}
              onChange={(e) => setNotificationSettings({...notificationSettings, newCourseSubmissions: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Pending Reviews</label>
              <p className="text-sm text-gray-500">Remind about content awaiting review</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.pendingReviews}
              onChange={(e) => setNotificationSettings({...notificationSettings, pendingReviews: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Quality Alerts</label>
              <p className="text-sm text-gray-500">Alert about content quality issues</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.qualityAlerts}
              onChange={(e) => setNotificationSettings({...notificationSettings, qualityAlerts: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Teacher Messages</label>
              <p className="text-sm text-gray-500">Notify about messages from teachers</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.teacherMessages}
              onChange={(e) => setNotificationSettings({...notificationSettings, teacherMessages: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">System Updates</label>
              <p className="text-sm text-gray-500">Notify about platform updates and maintenance</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.systemUpdates}
              onChange={(e) => setNotificationSettings({...notificationSettings, systemUpdates: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Weekly Digest</label>
              <p className="text-sm text-gray-500">Receive weekly activity summary</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.weeklyDigest}
              onChange={(e) => setNotificationSettings({...notificationSettings, weeklyDigest: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Email Frequency</label>
            <select
              value={notificationSettings.emailFrequency}
              onChange={(e) => setNotificationSettings({...notificationSettings, emailFrequency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly Digest</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Digest</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPrivacySettings = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy & Security</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="platform">Platform Only</option>
              <option value="teachers">Teachers Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Show Activity Status</label>
              <p className="text-sm text-gray-500">Display when you're online</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.showActivity}
              onChange={(e) => setPrivacySettings({...privacySettings, showActivity: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Allow Direct Messages</label>
              <p className="text-sm text-gray-500">Let teachers send you direct messages</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.allowDirectMessages}
              onChange={(e) => setPrivacySettings({...privacySettings, allowDirectMessages: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Share Statistics</label>
              <p className="text-sm text-gray-500">Include your review stats in reports</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.shareStatistics}
              onChange={(e) => setPrivacySettings({...privacySettings, shareStatistics: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Add extra security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.twoFactorAuth}
              onChange={(e) => setPrivacySettings({...privacySettings, twoFactorAuth: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Data Retention Period</label>
            <select
              value={privacySettings.dataRetention}
              onChange={(e) => setPrivacySettings({...privacySettings, dataRetention: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1year">1 Year</option>
              <option value="2years">2 Years</option>
              <option value="5years">5 Years</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderIntegrationSettings = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Third-party Integrations</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Email Service</h4>
                <p className="text-sm text-gray-500">Connected to Gmail</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700 font-medium">Disconnect</button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Slack Notifications</h4>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Connect</button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Analytics Dashboard</h4>
                <p className="text-sm text-gray-500">Connected to Google Analytics</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700 font-medium">Disconnect</button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🔗</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Webhook Notifications</h4>
                <p className="text-sm text-gray-500">Custom webhook endpoint</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Configure</button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600">Manage your supervisor preferences and configurations</p>
            </div>
            
            <motion.button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'content' && renderContentSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
            {activeTab === 'integration' && renderIntegrationSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorSettingsPage;