"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

const SupervisorTeachers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const [teachers] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0123',
      specialization: ['English', 'Business Communication'],
      joinDate: '2024-01-15',
      status: 'active',
      totalLessons: 45,
      approvedLessons: 42,
      pendingLessons: 3,
      averageRating: 4.8,
      totalStudents: 1250,
      institution: 'Stanford University',
      experience: '8 years',
      qualifications: 'PhD in English Literature, TESOL Certified',
      lastActive: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      name: 'Prof. Ravi Kumar',
      email: 'ravi.kumar@example.com',
      phone: '+94-11-1234567',
      specialization: ['Tamil', 'Linguistics'],
      joinDate: '2024-01-10',
      status: 'active',
      totalLessons: 32,
      approvedLessons: 30,
      pendingLessons: 2,
      averageRating: 4.6,
      totalStudents: 890,
      institution: 'University of Colombo',
      experience: '12 years',
      qualifications: 'MA in Tamil Literature, PhD in Linguistics',
      lastActive: '2024-01-19T15:45:00Z'
    },
    {
      id: 3,
      name: 'Ms. Priya Perera',
      email: 'priya.perera@example.com',
      phone: '+94-77-1234567',
      specialization: ['Sinhala', 'Cultural Studies'],
      joinDate: '2024-01-08',
      status: 'pending',
      totalLessons: 5,
      approvedLessons: 2,
      pendingLessons: 3,
      averageRating: 4.2,
      totalStudents: 150,
      institution: 'University of Kelaniya',
      experience: '5 years',
      qualifications: 'BA in Sinhala Language, MA in Cultural Studies',
      lastActive: '2024-01-18T09:20:00Z'
    },
    {
      id: 4,
      name: 'Dr. Michael Rodriguez',
      email: 'michael.rodriguez@example.com',
      phone: '+1-555-0456',
      specialization: ['Spanish', 'Advanced Grammar'],
      joinDate: '2024-01-05',
      status: 'suspended',
      totalLessons: 28,
      approvedLessons: 20,
      pendingLessons: 0,
      averageRating: 3.9,
      totalStudents: 680,
      institution: 'UCLA',
      experience: '10 years',
      qualifications: 'PhD in Hispanic Studies, Native Speaker',
      lastActive: '2024-01-15T14:30:00Z',
      suspensionReason: 'Content quality issues'
    }
  ]);

  const getFilteredTeachers = () => {
    return teachers.filter(teacher => {
      const matchesTab = activeTab === 'all' || teacher.status === activeTab;
      const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesTab && matchesSearch;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'joinDate': return new Date(b.joinDate) - new Date(a.joinDate);
        case 'lessons': return b.totalLessons - a.totalLessons;
        case 'rating': return b.averageRating - a.averageRating;
        default: return 0;
      }
    });
  };

  const handleStatusChange = (teacherId, newStatus) => {
    console.log('Changing teacher status:', teacherId, 'to', newStatus);
    // Update teacher status logic here
  };

  const tabs = [
    { id: 'all', label: 'All Teachers', count: teachers.length },
    { id: 'active', label: 'Active', count: teachers.filter(t => t.status === 'active').length },
    { id: 'pending', label: 'Pending', count: teachers.filter(t => t.status === 'pending').length },
    { id: 'suspended', label: 'Suspended', count: teachers.filter(t => t.status === 'suspended').length }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Teacher Management</h1>
        <p className="text-green-100 text-lg">Manage teacher accounts, permissions, and performance</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Teachers', value: teachers.length, icon: '👨‍🏫', color: 'bg-blue-500' },
          { title: 'Active', value: teachers.filter(t => t.status === 'active').length, icon: '✅', color: 'bg-green-500' },
          { title: 'Pending Approval', value: teachers.filter(t => t.status === 'pending').length, icon: '⏳', color: 'bg-yellow-500' },
          { title: 'Avg Rating', value: (teachers.reduce((sum, t) => sum + t.averageRating, 0) / teachers.length).toFixed(1), icon: '⭐', color: 'bg-purple-500' }
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
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="lessons">Sort by Lessons</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tabs and Teachers List */}
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Teachers List */}
        <div className="p-6">
          {getFilteredTeachers().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No teachers found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredTeachers().map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            teacher.status === 'active' ? 'bg-green-100 text-green-700' :
                            teacher.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {teacher.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p><span className="font-medium">Email:</span> {teacher.email}</p>
                            <p><span className="font-medium">Phone:</span> {teacher.phone}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Institution:</span> {teacher.institution}</p>
                            <p><span className="font-medium">Experience:</span> {teacher.experience}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Joined:</span> {teacher.joinDate}</p>
                            <p><span className="font-medium">Specialization:</span> {teacher.specialization.join(', ')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>📚</span>
                            <span>{teacher.totalLessons} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👥</span>
                            <span>{teacher.totalStudents} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{teacher.averageRating}/5.0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>✅</span>
                            <span>{teacher.approvedLessons} approved</span>
                          </div>
                          {teacher.pendingLessons > 0 && (
                            <div className="flex items-center gap-1">
                              <span>⏳</span>
                              <span>{teacher.pendingLessons} pending</span>
                            </div>
                          )}
                        </div>

                        {teacher.status === 'suspended' && teacher.suspensionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                              <span className="font-medium">Suspension Reason:</span> {teacher.suspensionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Link
                        href={`/Supervisor/teachers/${teacher.id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors text-center"
                      >
                        View Profile
                      </Link>
                      
                      {teacher.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(teacher.id, 'active')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(teacher.id, 'suspended')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {teacher.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(teacher.id, 'suspended')}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      
                      {teacher.status === 'suspended' && (
                        <button
                          onClick={() => handleStatusChange(teacher.id, 'active')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                        >
                          Reactivate
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

export default SupervisorTeachers;