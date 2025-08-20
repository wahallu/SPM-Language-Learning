'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const SupervisorProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    employeeId: '',
    joinDate: '',
    specialization: [],
    bio: '',
    address: '',
    institution: '',
    qualifications: '',
    experience: '',
    status: '',
    role: '',
    isActive: false
  });

  const [stats, setStats] = useState({
    teachersSupervised: 0,
    coursesOverseeing: 0,
    studentsImpacted: 0,
    completedReviews: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'activities', label: 'Recent Activities', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  // Fetch supervisor profile data
  useEffect(() => {
    fetchSupervisorProfile();
    fetchSupervisorStats();
    fetchSupervisorActivities();
  }, []);

  const fetchSupervisorProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const supervisorData = JSON.parse(localStorage.getItem('supervisorData') || '{}');
      const token = localStorage.getItem('supervisorToken');
      
      console.log('Token:', token); // Debug log
      console.log('Supervisor ID:', supervisorData.id); // Debug log
      
      if (!supervisorData.id || !token) {
        console.error('No supervisor data or token found');
        window.location.href = '/Supervisor/login';
        return;
      }

      // Use the correct profile endpoint, not dashboard endpoint
      const response = await fetch(`http://localhost:8080/api/supervisor/profile/${supervisorData.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug log

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed, redirecting to login');
          localStorage.removeItem('supervisorToken');
          localStorage.removeItem('supervisorData');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const supervisor = result.data;
        setProfileData({
          firstName: supervisor.firstName || '',
          lastName: supervisor.lastName || '',
          email: supervisor.email || '',
          phone: supervisor.phone || '',
          department: supervisor.department || '',
          employeeId: supervisor.employeeId || '',
          joinDate: supervisor.createdAt ? new Date(supervisor.createdAt).toLocaleDateString() : '',
          specialization: supervisor.specialization || [],
          bio: supervisor.bio || 'Experienced educational supervisor with expertise in language learning program development.',
          address: supervisor.address || '',
          institution: supervisor.institution || '',
          qualifications: supervisor.qualifications || '',
          experience: supervisor.experience || '',
          status: supervisor.status || '',
          role: supervisor.role || '',
          isActive: supervisor.isActive || false
        });
      } else {
        throw new Error(result.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching supervisor profile:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupervisorStats = async () => {
    try {
      const token = localStorage.getItem('supervisorToken');
      const supervisorData = JSON.parse(localStorage.getItem('supervisorData') || '{}');
      
      if (!token || !supervisorData.id) return;

      // Use correct stats endpoint
      const response = await fetch(`http://localhost:8080/api/supervisor/profile/${supervisorData.id}/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setStats(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching supervisor stats:', error);
    }
  };

  const fetchSupervisorActivities = async () => {
    try {
      const token = localStorage.getItem('supervisorToken');
      const supervisorData = JSON.parse(localStorage.getItem('supervisorData') || '{}');
      
      if (!token || !supervisorData.id) return;

      // Use profile-specific activities endpoint
      const response = await fetch(`http://localhost:8080/api/supervisor/profile/${supervisorData.id}/activities`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setRecentActivities(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching supervisor activities:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const supervisorData = JSON.parse(localStorage.getItem('supervisorData') || '{}');
      const token = localStorage.getItem('supervisorToken');
      
      if (!supervisorData.id || !token) {
        console.error('No supervisor data or token found');
        return;
      }

      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        department: profileData.department,
        qualifications: profileData.qualifications,
        experience: profileData.experience,
        specialization: profileData.specialization
      };

      const response = await fetch(`http://localhost:8080/api/supervisor/profile/${supervisorData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        // Update localStorage with new data
        const updatedSupervisorData = { ...supervisorData, ...updateData };
        localStorage.setItem('supervisorData', JSON.stringify(updatedSupervisorData));
        alert('Profile updated successfully!');
        // Refresh profile data
        await fetchSupervisorProfile();
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'review': return '📝';
      case 'meeting': return '👥';
      case 'evaluation': return '⭐';
      case 'approval': return '✅';
      case 'rejection': return '❌';
      default: return '📌';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    // If it's already a relative time string (like "2 hours ago"), return as is
    if (typeof timestamp === 'string' && timestamp.includes('ago')) {
      return timestamp;
    }
    
    // Otherwise, format as a proper date
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return timestamp;
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                    {profileData.firstName?.charAt(0) || 'S'}{profileData.lastName?.charAt(0) || 'U'}
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
                <p className="text-gray-600 mb-2">{profileData.department || 'Supervisor'}</p>
                <p className="text-sm text-gray-500">ID: {profileData.employeeId || 'N/A'}</p>
                
                {/* Status Badge */}
                {profileData.status && (
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(profileData.status)}`}>
                      {profileData.status.toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="mt-6 space-y-3">
                  {profileData.specialization && profileData.specialization.length > 0 ? (
                    profileData.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-block bg-orange-100 text-[#FF7D29] px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No specializations listed</p>
                  )}
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
                  { label: 'Students Impacted', value: stats.studentsImpacted.toLocaleString(), icon: '🎓' },
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
                          : 'border-transparent text-gray-500 hover:text-gray-700'
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
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
                          disabled={isSaving}
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
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.firstName || 'Not provided'}</p>
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
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.lastName || 'Not provided'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.email || 'Not provided'}</p>
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.phone || 'Not provided'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.department}
                              onChange={(e) => handleInputChange('department', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.department || 'Not provided'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Institution
                          </label>
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.institution || 'Not provided'}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Join Date
                          </label>
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{formatDate(profileData.joinDate)}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                          </label>
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.role || 'Supervisor'}</p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Qualifications
                          </label>
                          {isEditing ? (
                            <textarea
                              value={profileData.qualifications}
                              onChange={(e) => handleInputChange('qualifications', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                              placeholder="Enter your qualifications..."
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.qualifications || 'Not provided'}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience
                          </label>
                          {isEditing ? (
                            <textarea
                              value={profileData.experience}
                              onChange={(e) => handleInputChange('experience', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                              placeholder="Describe your experience..."
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.experience || 'Not provided'}</p>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50"
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
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
                                  <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                      {activity.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-400 text-6xl mb-4">📊</div>
                          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Recent Activities</h4>
                          <p className="text-gray-500">Your recent activities will appear here.</p>
                        </div>
                      )}
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