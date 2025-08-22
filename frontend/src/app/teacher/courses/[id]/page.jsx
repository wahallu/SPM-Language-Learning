"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import ApiService from '../../../utils/api';
import CreateModuleModal from '../../../Components/teacher/CreateModuleModal';
import ModuleCard from '../../../Components/teacher/ModuleCard';

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [activeTab, setActiveTab] = useState('modules');
  const [loadingModules, setLoadingModules] = useState(false);

  // Debug: Log course ID
  useEffect(() => {
    console.log('Course ID from params:', id);
    console.log('Current user:', ApiService.getCurrentUser());
  }, [id]);

  // Fetch course data on component mount
  useEffect(() => {
    if (id) {
      fetchCourseData();
      fetchModules();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching course data for ID:', id);

      // Verify teacher authentication
      const currentUser = ApiService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('Please login to access this course.');
      }

      console.log('Current authenticated user:', currentUser);

      // Fetch course by ID
      const response = await ApiService.getCourseById(id);
      console.log('Course API response:', response);

      if (response.success) {
        const courseData = response.data;

        // Verify that this course belongs to the current teacher
        if (courseData.teacherId !== currentUser.id) {
          throw new Error('You do not have permission to access this course.');
        }

        setCourse(courseData);
        console.log('Course data set:', courseData);
      } else {
        throw new Error(response.message || 'Failed to fetch course data');
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      setLoadingModules(true);
      console.log('Fetching modules for course ID:', id);

      // Fetch modules for this course
      const response = await ApiService.getModulesByCourse(id);
      console.log('Modules API response:', response);

      if (response.success) {
        setModules(response.data || []);
        console.log('Modules data set:', response.data);
      } else {
        console.error('Failed to fetch modules:', response.message);
        setModules([]);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      setModules([]);
    } finally {
      setLoadingModules(false);
    }
  };

  const handleCreateModule = async (moduleData) => {
    try {
      console.log('handleCreateModule called with:', moduleData);
      console.log('Course ID for module creation:', id);

      // Validate required data
      if (!id) {
        throw new Error('Course ID is missing');
      }

      if (!moduleData.title || !moduleData.description) {
        throw new Error('Module title and description are required');
      }

      // The CreateModuleModal should handle the API call, but let's add this module to our state
      // Add the new module to the list
      setModules(prev => {
        const newModules = [...prev, moduleData];
        console.log('Updated modules list:', newModules);
        return newModules;
      });

      // Update course module count
      setCourse(prev => ({
        ...prev,
        modules: (prev.modules || 0) + 1
      }));

      setShowCreateModule(false);
      console.log('Module added successfully');

    } catch (error) {
      console.error('Error in handleCreateModule:', error);
      alert(error.message || 'Failed to create module. Please try again.');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      try {
        console.log('Deleting module:', moduleId);

        const response = await ApiService.deleteModule(moduleId);
        console.log('Delete module response:', response);

        if (response.success) {
          // Remove module from the list
          setModules(prev => prev.filter(m => m.id !== moduleId));

          // Update course module count
          setCourse(prev => ({
            ...prev,
            modules: Math.max(0, (prev.modules || 0) - 1)
          }));

          alert('Module deleted successfully');
        } else {
          throw new Error(response.message || 'Failed to delete module');
        }
      } catch (error) {
        console.error('Error deleting module:', error);
        alert(error.message || 'Failed to delete module');
      }
    }
  };

  const handlePublishCourse = async () => {
    try {
      const updatedCourseData = {
        ...course,
        status: course.status === 'published' ? 'draft' : 'published'
      };

      const response = await ApiService.updateCourse(course.id, updatedCourseData);

      if (response.success) {
        setCourse(prev => ({
          ...prev,
          status: updatedCourseData.status
        }));
        alert(`Course ${updatedCourseData.status === 'published' ? 'published' : 'unpublished'} successfully!`);
      } else {
        throw new Error(response.message || 'Failed to update course status');
      }
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Failed to update course status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  const tabs = [
    { id: 'modules', label: 'Modules', icon: '📚' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  // Debug: Show current state
  console.log('Current state:', {
    courseId: id,
    course,
    modules,
    loading,
    loadingModules,
    error,
    showCreateModule
  });

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <motion.div
                className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600">Loading course details...</p>
            <p className="text-sm text-gray-500 mt-2">Course ID: {id}</p>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Course</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700">Debug Info:</p>
            <p className="text-xs text-gray-600">Course ID: {id}</p>
            <p className="text-xs text-gray-600">Current User: {JSON.stringify(ApiService.getCurrentUser())}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
                onClick={fetchCourseData}
                className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
            >
              Try Again
            </button>
            <Link
                href="/teacher/courses"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Back to Courses
            </Link>
          </div>
        </div>
    );
  }

  if (!course) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Course Not Found</h3>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <p className="text-sm text-gray-500 mb-4">Course ID: {id}</p>
          <Link
              href="/teacher/courses"
              className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
          >
            Back to Courses
          </Link>
        </div>
    );
  }

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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.status === 'published'
                    ? 'bg-green-500 bg-opacity-20 text-green-100'
                    : 'bg-yellow-500 bg-opacity-20 text-yellow-100'
                }`}>
                  {course.status}
                </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {course.level}
                </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {course.category}
                </span>
                </div>

                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-orange-100 mb-4">{course.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-orange-200">Students</p>
                    <p className="font-semibold text-lg">{course.students || 0}</p>
                  </div>
                  <div>
                    <p className="text-orange-200">Modules</p>
                    <p className="font-semibold text-lg">{modules.length}</p>
                  </div>
                  <div>
                    <p className="text-orange-200">Duration</p>
                    <p className="font-semibold text-lg">{course.estimatedDuration || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-orange-200">Price</p>
                    <p className="font-semibold text-lg">${course.price || 0}</p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-orange-200">
                  <p>Created: {formatDate(course.createdAt)}</p>
                  <p>Course ID: {course.id}</p>
                  {course.updatedAt && course.updatedAt !== course.createdAt && (
                      <p>Last updated: {formatDate(course.updatedAt)}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                    onClick={handlePublishCourse}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${course.status === 'published'
                        ? 'bg-yellow-500 bg-opacity-20 text-yellow-100 hover:bg-opacity-30'
                        : 'bg-green-500 bg-opacity-20 text-green-100 hover:bg-opacity-30'
                    }`}
                >
                  {course.status === 'published' ? 'Unpublish' : 'Publish Course'}
                </button>
                <Link
                    href={`/teacher/courses/${course.id}/edit`}
                    className="bg-white text-[#FF7D29] px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-all"
                >
                  Edit Details
                </Link>
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
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === tab.id
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
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Course ID: {id}</p>
                        <p>Modules loaded: {modules.length}</p>
                        <p>Loading modules: {loadingModules ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    <button
                        onClick={() => {
                          console.log('Opening create module modal for course:', id);
                          setShowCreateModule(true);
                        }}
                        className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all flex items-center gap-2"
                    >
                      <span className="text-lg">➕</span>
                      Add Module
                    </button>
                  </div>

                  {loadingModules ? (
                      <div className="text-center py-8">
                        <motion.div
                            className="w-8 h-8 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-gray-600">Loading modules...</p>
                      </div>
                  ) : modules.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-4xl">📚</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No modules yet</h3>
                        <p className="text-gray-600 mb-4">Create your first module to start building your course</p>
                        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                          <p className="text-sm text-gray-700">Debug Info:</p>
                          <p className="text-xs text-gray-600">Course ID: {id}</p>
                          <p className="text-xs text-gray-600">API Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}</p>
                          <p className="text-xs text-gray-600">User: {JSON.stringify(ApiService.getCurrentUser())}</p>
                        </div>
                        <button
                            onClick={() => {
                              console.log('Opening create module modal for course:', id);
                              setShowCreateModule(true);
                            }}
                            className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
                        >
                          Create First Module
                        </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module, index) => (
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Enrolled Students</h2>
                      <p className="text-gray-600">Manage and track your students' progress</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.students || 0} students enrolled
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <span className="text-4xl mb-4 block">👥</span>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Students Management</h3>
                    <p className="text-gray-600 mb-4">
                      Student management features are coming soon. You can track basic enrollment numbers above.
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#FF7D29]">
                      <span className="w-2 h-2 bg-[#FF7D29] rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium">Feature in development</span>
                    </div>
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

                  {/* Basic Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Total Students</p>
                          <p className="text-2xl font-bold text-blue-800">{course.students || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                          👥
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Status</p>
                          <p className="text-2xl font-bold text-green-800 capitalize">{course.status}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                          {course.status === 'published' ? '✅' : '📝'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Revenue</p>
                          <p className="text-2xl font-bold text-purple-800">${((course.students || 0) * (course.price || 0)).toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                          💰
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <span className="text-4xl mb-4 block">📊</span>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Detailed Analytics</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced analytics including completion rates, engagement metrics, and performance insights are coming soon.
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#FF7D29]">
                      <span className="w-2 h-2 bg-[#FF7D29] rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium">Feature in development</span>
                    </div>
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

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Publication Status</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Control whether students can enroll in this course
                      </p>
                      <button
                          onClick={handlePublishCourse}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${course.status === 'published'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                      >
                        {course.status === 'published' ? 'Unpublish Course' : 'Publish Course'}
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Course Details</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Edit course information, pricing, and content
                      </p>
                      <Link
                          href={`/teacher/courses/${course.id}/edit`}
                          className="w-full block text-center py-2 px-4 bg-[#FF7D29] text-white rounded-lg font-medium hover:bg-[#FF9D5C] transition-all"
                      >
                        Edit Course
                      </Link>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <span className="text-4xl mb-4 block">⚙️</span>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Advanced Settings</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced course management features including enrollment limits, prerequisites management, and bulk actions are coming soon.
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#FF7D29]">
                      <span className="w-2 h-2 bg-[#FF7D29] rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium">Feature in development</span>
                    </div>
                  </div>
                </motion.div>
            )}
          </div>
        </motion.div>

        {/* Create Module Modal */}
        <AnimatePresence>
          {showCreateModule && (
              <CreateModuleModal
                  onClose={() => {
                    console.log('Closing create module modal');
                    setShowCreateModule(false);
                  }}
                  onSubmit={handleCreateModule}
                  moduleCount={modules.length}
                  courseId={id} // Pass the course ID explicitly
              />
          )}
        </AnimatePresence>
      </div>
  );
};

export default CourseDetailPage;