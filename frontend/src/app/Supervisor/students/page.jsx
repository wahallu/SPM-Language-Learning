"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';

const SupervisorStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [students] = useState([
    {
      id: 1,
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      joinDate: '2024-01-10',
      status: 'active',
      coursesEnrolled: 3,
      coursesCompleted: 1,
      totalXP: 2450,
      level: 5,
      currentStreak: 12,
      lastActive: '2024-01-20T08:30:00Z',
      averageScore: 87,
      totalLessons: 45,
      languages: ['English', 'Spanish'],
      subscription: 'premium'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      joinDate: '2024-01-08',
      status: 'active',
      coursesEnrolled: 2,
      coursesCompleted: 0,
      totalXP: 1890,
      level: 4,
      currentStreak: 8,
      lastActive: '2024-01-19T14:20:00Z',
      averageScore: 92,
      totalLessons: 32,
      languages: ['Sinhala', 'Tamil'],
      subscription: 'free'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      joinDate: '2024-01-05',
      status: 'inactive',
      coursesEnrolled: 4,
      coursesCompleted: 2,
      totalXP: 3200,
      level: 7,
      currentStreak: 0,
      lastActive: '2024-01-15T10:45:00Z',
      averageScore: 78,
      totalLessons: 68,
      languages: ['English', 'French', 'German'],
      subscription: 'premium'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'david.rodriguez@email.com',
      joinDate: '2024-01-12',
      status: 'active',
      coursesEnrolled: 1,
      coursesCompleted: 0,
      totalXP: 850,
      level: 2,
      currentStreak: 5,
      lastActive: '2024-01-20T16:10:00Z',
      averageScore: 95,
      totalLessons: 15,
      languages: ['Spanish'],
      subscription: 'free'
    },
    {
      id: 5,
      name: 'Lisa Park',
      email: 'lisa.park@email.com',
      joinDate: '2023-12-20',
      status: 'active',
      coursesEnrolled: 5,
      coursesCompleted: 3,
      totalXP: 4100,
      level: 9,
      currentStreak: 25,
      lastActive: '2024-01-20T19:30:00Z',
      averageScore: 89,
      totalLessons: 89,
      languages: ['Korean', 'Japanese', 'English'],
      subscription: 'premium'
    }
  ]);

  const getFilteredStudents = () => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'joinDate': return new Date(b.joinDate) - new Date(a.joinDate);
        case 'xp': return b.totalXP - a.totalXP;
        case 'level': return b.level - a.level;
        case 'progress': return b.averageScore - a.averageScore;
        default: return 0;
      }
    });
  };

  const formatLastActive = (timestamp) => {
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diffHours = Math.floor((now - lastActive) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Active now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Student Overview</h1>
        <p className="text-purple-100 text-lg">Monitor student progress and engagement across the platform</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { title: 'Total Students', value: students.length, icon: '👥', color: 'bg-blue-500' },
          { title: 'Active Students', value: students.filter(s => s.status === 'active').length, icon: '✅', color: 'bg-green-500' },
          { title: 'Avg Level', value: Math.round(students.reduce((sum, s) => sum + s.level, 0) / students.length), icon: '🎯', color: 'bg-purple-500' },
          { title: 'Premium Users', value: students.filter(s => s.subscription === 'premium').length, icon: '⭐', color: 'bg-yellow-500' },
          { title: 'Total XP', value: `${Math.round(students.reduce((sum, s) => sum + s.totalXP, 0) / 1000)}k`, icon: '🏆', color: 'bg-orange-500' }
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
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="xp">Sort by XP</option>
              <option value="level">Sort by Level</option>
              <option value="progress">Sort by Score</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Students List */}
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-6">
          {getFilteredStudents().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredStudents().map((student, index) => (
                <motion.div
                  key={student.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.subscription === 'premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {student.subscription}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p><span className="font-medium">Email:</span> {student.email}</p>
                            <p><span className="font-medium">Joined:</span> {student.joinDate}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Level:</span> {student.level}</p>
                            <p><span className="font-medium">Total XP:</span> {student.totalXP.toLocaleString()}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Avg Score:</span> {student.averageScore}%</p>
                            <p><span className="font-medium">Last Active:</span> {formatLastActive(student.lastActive)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <span>📚</span>
                            <span>{student.coursesEnrolled} enrolled</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>✅</span>
                            <span>{student.coursesCompleted} completed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🎥</span>
                            <span>{student.totalLessons} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🔥</span>
                            <span>{student.currentStreak} day streak</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Languages:</span>
                          {student.languages.map((lang, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Course Progress</span>
                            <span className="text-sm font-medium text-gray-800">
                              {Math.round((student.coursesCompleted / student.coursesEnrolled) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${Math.round((student.coursesCompleted / student.coursesEnrolled) * 100)}%`
                              }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors">
                        View Profile
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                        Send Message
                      </button>
                      {student.status === 'active' && (
                        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SupervisorStudents;