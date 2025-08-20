'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const SupervisorProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Dr. Michael',
    lastName: 'Rodriguez',
    email: 'michael.rodriguez@zorscode.edu',
    phone: '+94 123 456 789',
    department: 'Language Learning Supervision',
    employeeId: 'SUP-2024-001',
    joinDate: '2023-01-15',
    specialization: ['Curriculum Development', 'Teacher Training', 'Quality Assurance'],
    bio: 'Experienced educational supervisor with over 10 years in language learning program development and teacher mentorship.',
    address: '123 Education Street, Colombo 07, Sri Lanka'
  });

  const [stats] = useState({
    teachersSupervised: 15,
    coursesOverseeing: 32,
    studentsImpacted: 1250,
    completedReviews: 89
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'review',
      title: 'Course Review Completed',
      description: 'Reviewed "Advanced Spanish Grammar" course by Maria Garcia',
      timestamp: '2 hours ago',
      status: 'approved'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Teacher Training Session',
      description: 'Conducted monthly training on interactive teaching methods',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'evaluation',
      title: 'Quality Assessment',
      description: 'Evaluated new French course content structure',
      timestamp: '3 days ago',
      status: 'in-progress'
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'activities', label: 'Recent Activities', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'review': return '📝';
      case 'meeting': return '👥';
      case 'evaluation': return '⭐';
      default: return '📌';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/Supervisor" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Supervisor Profile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
                    MR
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#FF7D29]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-600 mb-2">{profileData.department}</p>
                <p className="text-sm text-gray-500">ID: {profileData.employeeId}</p>
                
                <div className="mt-6 space-y-3">
                  {profileData.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-block bg-orange-100 text-[#FF7D29] px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                    >
                      {spec}
                    </span>
                  ))}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Teachers Supervised', value: stats.teachersSupervised, icon: '👨‍🏫' },
                  { label: 'Courses Overseeing', value: stats.coursesOverseeing, icon: '📚' },
                  { label: 'Students Impacted', value: stats.studentsImpacted, icon: '🎓' },
                  { label: 'Reviews Completed', value: stats.completedReviews, icon: '✅' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stat.icon}</span>
                      <span className="text-gray-600 text-sm">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{stat.value}</span>
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
                          ? 'border-[#FF7D29] text-[#FF7D29] bg-orange-50'
                          : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="bg-[#FF7D29] text-white px-4 py-2 rounded-xl hover:bg-[#FF9D5C] transition-colors"
                        >
                          {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.lastName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.phone}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          {isEditing ? (
                            <textarea
                              value={profileData.bio}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.bio}</p>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={handleSave}
                            className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl hover:bg-[#FF9D5C] transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Activities Tab */}
                  {activeTab === 'activities' && (
                    <motion.div
                      key="activities"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">Recent Activities</h3>
                      
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
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                    {activity.status.replace('-', ' ')}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                                <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">Account Settings</h3>
                      
                      <div className="space-y-6">
                        <div className="border border-gray-200 rounded-xl p-6">
                          <h4 className="font-semibold text-gray-800 mb-4">Security</h4>
                          <div className="space-y-4">
                            <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-800">Change Password</p>
                                  <p className="text-gray-600 text-sm">Update your account password</p>
                                </div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </button>

                            <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                                  <p className="text-gray-600 text-sm">Add an extra layer of security</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600 text-sm">Enabled</span>
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-6">
                          <h4 className="font-semibold text-gray-800 mb-4">Notifications</h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Email Notifications', description: 'Receive updates via email' },
                              { label: 'Course Reviews', description: 'Notify when new courses need review' },
                              { label: 'Teacher Updates', description: 'Get updates from supervised teachers' }
                            ].map((setting, index) => (
                              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                <div>
                                  <p className="font-medium text-gray-800">{setting.label}</p>
                                  <p className="text-gray-600 text-sm">{setting.description}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7D29]"></div>
                                </label>
                              </div>
                            ))}
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
    </div>
  );
};

export default SupervisorProfile;