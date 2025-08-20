"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

const SupervisorLessons = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [lessons] = useState([
    {
      id: 1,
      title: 'Sinhala Family Vocabulary',
      teacher: 'Priya Perera',
      teacherEmail: 'priya@example.com',
      language: 'Sinhala',
      level: 'Beginner',
      submittedDate: '2024-01-15',
      priority: 'high',
      status: 'pending',
      description: 'Learn essential family-related vocabulary in Sinhala language',
      videoUrl: 'https://www.youtube.com/watch?v=example1',
      duration: '15 minutes',
      quizCount: 5,
      estimatedStudents: 120
    },
    {
      id: 2,
      title: 'Business English Communication',
      teacher: 'Alex Johnson',
      teacherEmail: 'alex@example.com',
      language: 'English',
      level: 'Advanced',
      submittedDate: '2024-01-14',
      priority: 'medium',
      status: 'pending',
      description: 'Professional communication skills for business environments',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      duration: '25 minutes',
      quizCount: 8,
      estimatedStudents: 85
    },
    {
      id: 3,
      title: 'Tamil Grammar Basics',
      teacher: 'Ravi Kumar',
      teacherEmail: 'ravi@example.com',
      language: 'Tamil',
      level: 'Beginner',
      submittedDate: '2024-01-12',
      priority: 'low',
      status: 'approved',
      description: 'Fundamental grammar concepts in Tamil language',
      videoUrl: 'https://www.youtube.com/watch?v=example3',
      duration: '20 minutes',
      quizCount: 6,
      estimatedStudents: 95
    },
    {
      id: 4,
      title: 'English Pronunciation Guide',
      teacher: 'Sarah Thompson',
      teacherEmail: 'sarah@example.com',
      language: 'English',
      level: 'Intermediate',
      submittedDate: '2024-01-10',
      priority: 'medium',
      status: 'rejected',
      description: 'Master English pronunciation with phonetic guidelines',
      videoUrl: 'https://www.youtube.com/watch?v=example4',
      duration: '18 minutes',
      quizCount: 4,
      estimatedStudents: 150,
      rejectionReason: 'Audio quality needs improvement'
    }
  ]);

  const filteredLessons = lessons.filter(lesson => {
    const matchesTab = lesson.status === activeTab;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || lesson.language === filterLanguage;
    const matchesLevel = filterLevel === 'all' || lesson.level === filterLevel;
    
    return matchesTab && matchesSearch && matchesLanguage && matchesLevel;
  });

  const handleApprove = (lessonId) => {
    console.log('Approving lesson:', lessonId);
    // Update lesson status logic here
  };

  const handleReject = (lessonId, reason) => {
    console.log('Rejecting lesson:', lessonId, 'Reason:', reason);
    // Update lesson status logic here
  };

  const tabs = [
    { id: 'pending', label: 'Pending Review', count: lessons.filter(l => l.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: lessons.filter(l => l.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: lessons.filter(l => l.status === 'rejected').length }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Lesson Management</h1>
        <p className="text-blue-100 text-lg">Review, approve, and manage lesson submissions</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Submissions', value: lessons.length, icon: '📚', color: 'bg-blue-500' },
          { title: 'Pending Review', value: lessons.filter(l => l.status === 'pending').length, icon: '⏳', color: 'bg-yellow-500' },
          { title: 'Approved Today', value: 5, icon: '✅', color: 'bg-green-500' },
          { title: 'High Priority', value: lessons.filter(l => l.priority === 'high').length, icon: '🔥', color: 'bg-red-500' }
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
              placeholder="Search lessons or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
              <option value="Tamil">Tamil</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Lessons List */}
        <div className="p-6">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No lessons found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lesson.priority === 'high' ? 'bg-red-100 text-red-700' :
                          lesson.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {lesson.priority} priority
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lesson.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          lesson.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {lesson.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{lesson.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Teacher:</span> {lesson.teacher}
                        </div>
                        <div>
                          <span className="font-medium">Language:</span> {lesson.language}
                        </div>
                        <div>
                          <span className="font-medium">Level:</span> {lesson.level}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {lesson.duration}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {lesson.submittedDate}
                        </div>
                        <div>
                          <span className="font-medium">Quizzes:</span> {lesson.quizCount}
                        </div>
                        <div>
                          <span className="font-medium">Est. Students:</span> {lesson.estimatedStudents}
                        </div>
                      </div>

                      {lesson.status === 'rejected' && lesson.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Rejection Reason:</span> {lesson.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Review
                      </button>
                      
                      {lesson.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(lesson.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(lesson.id, 'Quality needs improvement')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Lesson Review Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedLesson.title}</h2>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Lesson Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Teacher:</span> {selectedLesson.teacher}</div>
                    <div><span className="font-medium">Email:</span> {selectedLesson.teacherEmail}</div>
                    <div><span className="font-medium">Language:</span> {selectedLesson.language}</div>
                    <div><span className="font-medium">Level:</span> {selectedLesson.level}</div>
                    <div><span className="font-medium">Duration:</span> {selectedLesson.duration}</div>
                    <div><span className="font-medium">Quiz Count:</span> {selectedLesson.quizCount}</div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedLesson.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Video Preview</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎥</div>
                      <p className="text-gray-600">Video preview would appear here</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedLesson.status === 'pending' && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleApprove(selectedLesson.id);
                      setSelectedLesson(null);
                    }}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors"
                  >
                    Approve Lesson
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedLesson.id, 'Needs revision');
                      setSelectedLesson(null);
                    }}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Reject Lesson
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupervisorLessons;