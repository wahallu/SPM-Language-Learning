"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import CreateLessonModal from '../../../../../Components/teacher/CreateLessonModal';
import LessonCard from '../../../../../Components/teacher/LessonCard';

const ModuleDetailPage = ({ params }) => {
  const [module, setModule] = useState({
    id: 1,
    title: "Introduction to English",
    description: "Basic alphabet, pronunciation, and greetings",
    order: 1,
    duration: "1 week",
    status: "published",
    lessons: [
      {
        id: 1,
        title: "English Alphabet",
        description: "Learn the 26 letters of the English alphabet",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        duration: "10 minutes",
        order: 1,
        status: "published",
        quizzes: [
          {
            id: 1,
            question: "How many letters are in the English alphabet?",
            options: ["24", "25", "26"],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 2,
        title: "Basic Pronunciation",
        description: "Learn how to pronounce English sounds correctly",
        videoUrl: "https://www.youtube.com/watch?v=example2",
        duration: "15 minutes",
        order: 2,
        status: "draft",
        quizzes: []
      }
    ]
  });

  const [showCreateLesson, setShowCreateLesson] = useState(false);

  const handleCreateLesson = (lessonData) => {
    const newLesson = {
      ...lessonData,
      id: Date.now(),
      order: module.lessons.length + 1,
      status: 'draft',
      quizzes: lessonData.quizzes || []
    };
    
    setModule(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }));
    
    setShowCreateLesson(false);
  };

  const handleDeleteLesson = (lessonId) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setModule(prev => ({
        ...prev,
        lessons: prev.lessons.filter(l => l.id !== lessonId)
      }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Link 
                href={`/teacher/courses/${params.courseId}`}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Course
              </Link>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                module.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {module.status}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{module.title}</h1>
            <p className="text-gray-600 mb-4">{module.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Module {module.order}</span>
              <span>{module.lessons.length} lessons</span>
              <span>{module.duration}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all">
              Edit Module
            </button>
            <button
              onClick={() => setShowCreateLesson(true)}
              className="bg-[#FF7D29] text-white px-4 py-2 rounded-xl hover:bg-[#FF9D5C] transition-all flex items-center gap-2"
            >
              <span className="text-lg">➕</span>
              Add Lesson
            </button>
          </div>
        </div>
      </motion.div>

      {/* Lessons Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lessons</h2>
            <p className="text-gray-600">Manage the lessons in this module</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Lessons</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <button
              onClick={() => setShowCreateLesson(true)}
              className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FF9D5C] transition-all"
            >
              + Add Lesson
            </button>
          </div>
        </div>

        {module.lessons.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No lessons yet</h3>
            <p className="text-gray-600 mb-4">Create your first lesson to start building this module</p>
            <button
              onClick={() => setShowCreateLesson(true)}
              className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
            >
              Create First Lesson
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {module.lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                moduleId={module.id}
                courseId={params.courseId}
                onDelete={() => handleDeleteLesson(lesson.id)}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Module Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Lessons</p>
              <p className="text-2xl font-bold text-gray-800">{module.lessons.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Published</p>
              <p className="text-2xl font-bold text-gray-800">
                {module.lessons.filter(l => l.status === 'published').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-800">
                {module.lessons.reduce((sum, lesson) => sum + lesson.quizzes.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">❓</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Create Lesson Modal */}
      <AnimatePresence>
        {showCreateLesson && (
          <CreateLessonModal
            onClose={() => setShowCreateLesson(false)}
            onSubmit={handleCreateLesson}
            lessonCount={module.lessons.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleDetailPage;