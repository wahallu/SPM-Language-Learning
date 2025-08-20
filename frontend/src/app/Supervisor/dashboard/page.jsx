"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalComments, setApprovalComments] = useState('');

  // Mock data for lessons - in real app, this would come from API
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Basic English Greetings",
      teacher: "John Smith",
      teacherAvatar: "JS",
      language: "English",
      level: "Beginner",
      category: "Conversation",
      submittedDate: "2024-01-15",
      status: "pending",
      duration: "45 mins",
      modules: 5,
      description: "Learn essential greetings and basic introductions in English. Perfect for complete beginners.",
      content: {
        overview: "This lesson covers fundamental greeting patterns used in English-speaking countries...",
        objectives: ["Master basic greeting vocabulary", "Practice pronunciation", "Understand cultural context"],
        materials: ["Audio recordings", "Interactive exercises", "Cultural notes"]
      },
      rating: null,
      views: 0
    },
    {
      id: 2,
      title: "Sinhala Family Vocabulary",
      teacher: "Priya Perera",
      teacherAvatar: "PP",
      language: "Sinhala",
      level: "Beginner",
      category: "Vocabulary",
      submittedDate: "2024-01-14",
      status: "pending",
      duration: "30 mins",
      modules: 3,
      description: "Comprehensive family relationship terms in Sinhala with cultural context.",
      content: {
        overview: "Master family relationship terminology in Sinhala language...",
        objectives: ["Learn family member names", "Understand relationship hierarchies", "Practice pronunciation"],
        materials: ["Family tree diagrams", "Audio pronunciations", "Cultural insights"]
      },
      rating: null,
      views: 0
    },
    {
      id: 3,
      title: "Tamil Numbers and Counting",
      teacher: "Ravi Kumar",
      teacherAvatar: "RK",
      language: "Tamil",
      level: "Beginner",
      category: "Numbers",
      submittedDate: "2024-01-13",
      status: "approved",
      duration: "25 mins",
      modules: 4,
      description: "Learn numbers 1-100 in Tamil with practical applications.",
      content: {
        overview: "Complete guide to Tamil number system...",
        objectives: ["Count 1-100 in Tamil", "Use numbers in context", "Practice writing numerals"],
        materials: ["Number charts", "Practice exercises", "Real-world examples"]
      },
      rating: 4.8,
      views: 156,
      approvedDate: "2024-01-14"
    },
    {
      id: 4,
      title: "English Business Communication",
      teacher: "Sarah Johnson",
      teacherAvatar: "SJ",
      language: "English",
      level: "Advanced",
      category: "Business",
      submittedDate: "2024-01-12",
      status: "declined",
      duration: "60 mins",
      modules: 8,
      description: "Professional communication skills for business environments.",
      content: {
        overview: "Advanced business communication strategies...",
        objectives: ["Master professional vocabulary", "Write business emails", "Lead meetings"],
        materials: ["Business scenarios", "Email templates", "Meeting guides"]
      },
      rating: null,
      views: 0,
      declineReason: "Content needs more interactive elements and updated business scenarios."
    },
    {
      id: 5,
      title: "Sinhala Traditional Stories",
      teacher: "Nimal Fernando",
      teacherAvatar: "NF",
      language: "Sinhala",
      level: "Intermediate",
      category: "Culture",
      submittedDate: "2024-01-11",
      status: "approved",
      duration: "40 mins",
      modules: 6,
      description: "Learn Sinhala through traditional folk stories and cultural narratives.",
      content: {
        overview: "Explore Sinhala culture through traditional narratives...",
        objectives: ["Understand cultural stories", "Improve reading skills", "Learn cultural vocabulary"],
        materials: ["Story texts", "Audio narrations", "Cultural explanations"]
      },
      rating: 4.9,
      views: 203,
      approvedDate: "2024-01-12"
    }
  ]);

  // Statistics calculation
  const stats = {
    total: lessons.length,
    pending: lessons.filter(l => l.status === 'pending').length,
    approved: lessons.filter(l => l.status === 'approved').length,
    declined: lessons.filter(l => l.status === 'declined').length,
    thisWeek: lessons.filter(l => {
      const lessonDate = new Date(l.submittedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lessonDate >= weekAgo;
    }).length
  };

  // Filter lessons based on active tab and search
  const filteredLessons = lessons.filter(lesson => {
    const matchesTab = activeTab === 'all' || lesson.status === activeTab;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || lesson.language === filterLanguage;
    
    return matchesTab && matchesSearch && matchesLanguage;
  });

  const handleApprovalAction = (lesson, action) => {
    setSelectedLesson(lesson);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = () => {
    if (selectedLesson) {
      const updatedLessons = lessons.map(lesson => {
        if (lesson.id === selectedLesson.id) {
          return {
            ...lesson,
            status: approvalAction,
            ...(approvalAction === 'approved' && { approvedDate: new Date().toISOString().split('T')[0] }),
            ...(approvalAction === 'declined' && { declineReason: approvalComments })
          };
        }
        return lesson;
      });
      
      setLessons(updatedLessons);
      setShowApprovalModal(false);
      setApprovalComments('');
      setSelectedLesson(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image 
                  src="/ZAlogo.png" 
                  alt="ZorsCode Academy" 
                  width={140} 
                  height={50}
                  className="h-10 w-auto"
                />
              </Link>
              <div className="ml-8">
                <h1 className="text-2xl font-bold text-gray-800">Supervisor Dashboard</h1>
                <p className="text-sm text-gray-600">Lesson Quality Management Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Image
                  src="/Gif/Robot.gif"
                  alt="Supervisor avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized={true}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Welcome back!</p>
                  <p className="text-xs text-gray-500">Supervisor</p>
                </div>
              </div>
              <Link href="/Supervisor/login">
                <button className="text-gray-500 hover:text-gray-700 text-sm">Logout</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'approved', 'declined'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-[#FF7D29] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab !== 'all' && (
                    <span className="ml-2 text-xs">
                      ({stats[tab]})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                <option value="all">All Languages</option>
                <option value="English">English</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {lesson.teacherAvatar}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 text-sm">{lesson.teacher}</p>
                        <p className="text-xs text-gray-500">Teacher</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lesson.status)}`}>
                      {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{lesson.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.description}</p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {lesson.language}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>
                      {lesson.level}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {lesson.duration}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{lesson.modules} modules</span>
                    <span>Submitted: {new Date(lesson.submittedDate).toLocaleDateString()}</span>
                  </div>

                  {lesson.status === 'approved' && (
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{lesson.rating}</span>
                      </div>
                      <span>{lesson.views} views</span>
                    </div>
                  )}

                  {lesson.status === 'declined' && lesson.declineReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-800 text-sm font-medium mb-1">Decline Reason:</p>
                      <p className="text-red-700 text-xs">{lesson.declineReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedLesson(lesson)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                    
                    {lesson.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprovalAction(lesson, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprovalAction(lesson, 'declined')}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredLessons.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/Gif/Book1.gif"
                alt="No lessons"
                width={100}
                height={100}
                unoptimized={true}
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>

      {/* Lesson Details Modal */}
      <AnimatePresence>
        {selectedLesson && !showApprovalModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>By {selectedLesson.teacher}</span>
                      <span>•</span>
                      <span>{selectedLesson.language}</span>
                      <span>•</span>
                      <span>{selectedLesson.level}</span>
                      <span>•</span>
                      <span>{selectedLesson.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Overview</h3>
                    <p className="text-gray-600 mb-6">{selectedLesson.content.overview}</p>

                    <h3 className="font-semibold text-lg mb-3">Learning Objectives</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                      {selectedLesson.content.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>

                    <h3 className="font-semibold text-lg mb-3">Materials Included</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {selectedLesson.content.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-4">Lesson Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedLesson.status)}`}>
                            {selectedLesson.status.charAt(0).toUpperCase() + selectedLesson.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{selectedLesson.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Modules:</span>
                          <span className="font-medium">{selectedLesson.modules}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submitted:</span>
                          <span className="font-medium">{new Date(selectedLesson.submittedDate).toLocaleDateString()}</span>
                        </div>
                        {selectedLesson.status === 'approved' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rating:</span>
                              <span className="font-medium flex items-center">
                                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {selectedLesson.rating}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Views:</span>
                              <span className="font-medium">{selectedLesson.views}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {selectedLesson.status === 'pending' && (
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => handleApprovalAction(selectedLesson, 'approved')}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          Approve Lesson
                        </button>
                        <button
                          onClick={() => handleApprovalAction(selectedLesson, 'declined')}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          Decline Lesson
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval Action Modal */}
      <AnimatePresence>
        {showApprovalModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {approvalAction === 'approved' ? 'Approve Lesson' : 'Decline Lesson'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to {approvalAction === 'approved' ? 'approve' : 'decline'} "{selectedLesson?.title}"?
                </p>
                
                {approvalAction === 'declined' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for decline (required)
                    </label>
                    <textarea
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      rows={3}
                      placeholder="Please provide feedback for the teacher..."
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitApproval}
                    disabled={approvalAction === 'declined' && !approvalComments.trim()}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-white ${
                      approvalAction === 'approved'
                        ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
                        : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
                    }`}
                  >
                    {approvalAction === 'approved' ? 'Approve' : 'Decline'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupervisorDashboard;