"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import CreateModuleModal from '../../../Components/teacher/CreateModuleModal';
import ModuleCard from '../../../Components/teacher/ModuleCard';

const CourseDetailPage = ({ params }) => {
  const [course, setCourse] = useState({
    id: 1,
    title: "Beginner Basics",
    category: "English",
    instructor: "Dr. Maria Rodriguez",
    instructorTitle: "Language Expert",
    image: "/images/lessons/beginner-basics.png",
    level: "Beginner",
    students: 156,
    status: "published",
    description: "A comprehensive course for English beginners covering basic grammar, vocabulary, and conversation skills.",
    estimatedDuration: "8 weeks",
    price: 99,
    modules: [
      {
        id: 1,
        title: "Introduction to English",
        description: "Basic alphabet, pronunciation, and greetings",
        order: 1,
        lessons: 5,
        duration: "1 week",
        status: "published"
      },
      {
        id: 2,
        title: "Basic Grammar",
        description: "Nouns, verbs, and simple sentence structure",
        order: 2,
        lessons: 8,
        duration: "2 weeks",
        status: "published"
      },
      {
        id: 3,
        title: "Everyday Vocabulary",
        description: "Common words and phrases for daily conversations",
        order: 3,
        lessons: 6,
        duration: "1.5 weeks",
        status: "draft"
      }
    ]
  });

  const [showCreateModule, setShowCreateModule] = useState(false);
  const [activeTab, setActiveTab] = useState('modules');

  const handleCreateModule = (moduleData) => {
    const newModule = {
      ...moduleData,
      id: Date.now(),
      lessons: 0,
      status: 'draft'
    };
    
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
    
    setShowCreateModule(false);
  };

  const handleDeleteModule = (moduleId) => {
    if (confirm('Are you sure you want to delete this module?')) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.filter(m => m.id !== moduleId)
      }));
    }
  };

  const tabs = [
    { id: 'modules', label: 'Modules', icon: '📚' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.status === 'published' 
                    ? 'bg-green-500 bg-opacity-20 text-green-100' 
                    : 'bg-yellow-500 bg-opacity-20 text-yellow-100'
                }`}>
                  {course.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {course.level}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-orange-100 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-orange-200">Students</p>
                  <p className="font-semibold text-lg">{course.students}</p>
                </div>
                <div>
                  <p className="text-orange-200">Modules</p>
                  <p className="font-semibold text-lg">{course.modules.length}</p>
                </div>
                <div>
                  <p className="text-orange-200">Duration</p>
                  <p className="font-semibold text-lg">{course.estimatedDuration}</p>
                </div>
                <div>
                  <p className="text-orange-200">Price</p>
                  <p className="font-semibold text-lg">${course.price}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl transition-all">
                Preview Course
              </button>
              <button className="bg-white text-[#FF7D29] px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-all">
                Edit Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-[#FF7D29] border-b-2 border-[#FF7D29] bg-orange-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Course Modules</h2>
                  <p className="text-gray-600">Organize your course content into modules</p>
                </div>
                <button
                  onClick={() => setShowCreateModule(true)}
                  className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all flex items-center gap-2"
                >
                  <span className="text-lg">➕</span>
                  Add Module
                </button>
              </div>

              {course.modules.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No modules yet</h3>
                  <p className="text-gray-600 mb-4">Create your first module to start building your course</p>
                  <button
                    onClick={() => setShowCreateModule(true)}
                    className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
                  >
                    Create First Module
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course.modules.map((module, index) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      courseId={course.id}
                      onDelete={() => handleDeleteModule(module.id)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Enrolled Students</h2>
                <p className="text-gray-600">Manage and track your students' progress</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <span className="text-4xl mb-4 block">👥</span>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Students Management</h3>
                <p className="text-gray-600">Student management features coming soon...</p>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Course Analytics</h2>
                <p className="text-gray-600">Track your course performance and student engagement</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <span className="text-4xl mb-4 block">📊</span>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Detailed analytics coming soon...</p>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Course Settings</h2>
                <p className="text-gray-600">Manage course visibility, pricing, and other settings</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <span className="text-4xl mb-4 block">⚙️</span>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Settings</h3>
                <p className="text-gray-600">Advanced settings panel coming soon...</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Create Module Modal */}
      <AnimatePresence>
        {showCreateModule && (
          <CreateModuleModal
            onClose={() => setShowCreateModule(false)}
            onSubmit={handleCreateModule}
            moduleCount={course.modules.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetailPage;