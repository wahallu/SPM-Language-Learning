"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import CreateLessonModal from '../../../../../Components/teacher/CreateLessonModal';
import LessonCard from '../../../../../Components/teacher/LessonCard';
import ApiService from '../../../../../utils/api';

const ModuleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseId, moduleId } = params;

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  // Fetch module and lessons data
  useEffect(() => {
    if (moduleId) {
      fetchModuleData();
      fetchLessons();
    }
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching module data for ID:', moduleId);

      const response = await ApiService.getModuleById(moduleId);
      console.log('Module API response:', response);

      if (response.success) {
        setModule(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch module data');
      }
    } catch (error) {
      console.error('Error fetching module data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      setLessonsLoading(true);
      console.log('Fetching lessons for module ID:', moduleId);

      const response = await ApiService.getLessonsByModule(moduleId);
      console.log('Lessons API response:', response);

      if (response.success) {
        setLessons(response.data || []);
      } else {
        console.error('Failed to fetch lessons:', response.message);
        setLessons([]);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleCreateLesson = async (lessonData) => {
    try {
      console.log('Creating lesson with data:', lessonData);

      const response = await ApiService.createLesson(moduleId, lessonData);

      if (response.success) {
        console.log('Lesson created successfully:', response.data);

        // Refresh lessons list
        await fetchLessons();

        // Update module lesson count if needed
        if (module) {
          setModule(prev => ({
            ...prev,
            totalLessons: (prev.totalLessons || 0) + 1
          }));
        }

        setShowCreateLesson(false);

        // Show success message
        alert('Lesson created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert(error.message || 'Failed to create lesson. Please try again.');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      try {
        console.log('Deleting lesson:', lessonId);

        const response = await ApiService.deleteLesson(lessonId);

        if (response.success) {
          console.log('Lesson deleted successfully');

          // Refresh lessons list
          await fetchLessons();

          // Update module lesson count
          if (module) {
            setModule(prev => ({
              ...prev,
              totalLessons: Math.max(0, (prev.totalLessons || 0) - 1)
            }));
          }

          alert('Lesson deleted successfully!');
        } else {
          throw new Error(response.message || 'Failed to delete lesson');
        }
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert(error.message || 'Failed to delete lesson. Please try again.');
      }
    }
  };

  const handlePublishLesson = async (lessonId) => {
    try {
      console.log('Publishing lesson:', lessonId);

      const response = await ApiService.publishLesson(lessonId);

      if (response.success) {
        console.log('Lesson published successfully');

        // Update lesson status in local state
        setLessons(prev => prev.map(lesson =>
            lesson.id === lessonId
                ? { ...lesson, status: 'PUBLISHED' }
                : lesson
        ));

        alert('Lesson published successfully!');
      } else {
        throw new Error(response.message || 'Failed to publish lesson');
      }
    } catch (error) {
      console.error('Error publishing lesson:', error);
      alert(error.message || 'Failed to publish lesson. Please try again.');
    }
  };

  const handleUnpublishLesson = async (lessonId) => {
    try {
      console.log('Unpublishing lesson:', lessonId);

      const response = await ApiService.unpublishLesson(lessonId);

      if (response.success) {
        console.log('Lesson unpublished successfully');

        // Update lesson status in local state
        setLessons(prev => prev.map(lesson =>
            lesson.id === lessonId
                ? { ...lesson, status: 'DRAFT' }
                : lesson
        ));

        alert('Lesson unpublished successfully!');
      } else {
        throw new Error(response.message || 'Failed to unpublish lesson');
      }
    } catch (error) {
      console.error('Error unpublishing lesson:', error);
      alert(error.message || 'Failed to unpublish lesson. Please try again.');
    }
  };

  // Filter and sort lessons
  const filteredLessons = lessons
      .filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || lesson.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'order':
            return (a.order || 0) - (b.order || 0);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'recent':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'status':
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <motion.div
                className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600">Loading module details...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Module</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
                onClick={fetchModuleData}
                className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
            >
              Try Again
            </button>
            <Link
                href={`/teacher/courses/${courseId}`}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Back to Course
            </Link>
          </div>
        </div>
    );
  }

  if (!module) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Module Not Found</h3>
          <p className="text-gray-600 mb-6">The module you're looking for doesn't exist or has been removed.</p>
          <Link
              href={`/teacher/courses/${courseId}`}
              className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
          >
            Back to Course
          </Link>
        </div>
    );
  }

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
                    href={`/teacher/courses/${courseId}`}
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Course
                </Link>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    module.status === 'PUBLISHED'
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
                <span>{module.totalLessons || 0} lessons</span>
                <span>{module.duration}</span>
                <span>Created: {formatDate(module.createdAt)}</span>
              </div>

              {/* Learning Objectives */}
              {module.learningObjectives && module.learningObjectives.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {module.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#FF7D29] mt-1">•</span>
                            <span>{objective}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                  onClick={() => router.push(`/teacher/courses/${courseId}/modules/${moduleId}/edit`)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all"
              >
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
              <button
                  onClick={() => setShowCreateLesson(true)}
                  className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FF9D5C] transition-all"
              >
                + Add Lesson
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              />
              <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                <option value="order">Order</option>
                <option value="title">Title</option>
                <option value="recent">Most Recent</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* Lessons List */}
          {lessonsLoading ? (
              <div className="text-center py-8">
                <motion.div
                    className="w-8 h-8 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-600">Loading lessons...</p>
              </div>
          ) : filteredLessons.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'No lessons found' : 'No lessons yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Create your first lesson to start building this module'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                    <button
                        onClick={() => setShowCreateLesson(true)}
                        className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
                    >
                      Create First Lesson
                    </button>
                )}
              </div>
          ) : (
              <div className="space-y-4">
                {filteredLessons.map((lesson, index) => (
                    <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        moduleId={moduleId}
                        courseId={courseId}
                        onDelete={() => handleDeleteLesson(lesson.id)}
                        onPublish={() => handlePublishLesson(lesson.id)}
                        onUnpublish={() => handleUnpublishLesson(lesson.id)}
                        delay={index * 0.1}
                    />
                ))}
              </div>
          )}
        </motion.div>

        {/* Module Statistics */}
        <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-800">{lessons.length}</p>
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
                  {lessons.filter(l => l.status === 'PUBLISHED').length}
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
                <p className="text-gray-600 text-sm">Draft</p>
                <p className="text-2xl font-bold text-gray-800">
                  {lessons.filter(l => l.status === 'DRAFT').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-800">
                  {lessons.reduce((sum, lesson) => sum + (lesson.quizzes?.length || 0), 0)}
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
                  lessonCount={lessons.length}
                  moduleId={moduleId}
              />
          )}
        </AnimatePresence>
      </div>
  );
};

export default ModuleDetailPage;