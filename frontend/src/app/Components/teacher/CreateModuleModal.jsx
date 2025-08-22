"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import ApiService from '../../utils/api';

const CreateModuleModal = ({ onClose, onSubmit, moduleCount, courseId }) => {
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    duration: '',
    order: moduleCount + 1,
    learningObjectives: [],
    prerequisites: [],
    coverImage: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!moduleData.title.trim()) {
      newErrors.title = 'Module title is required';
    } else if (moduleData.title.length < 3) {
      newErrors.title = 'Module title must be at least 3 characters';
    } else if (moduleData.title.length > 200) {
      newErrors.title = 'Module title cannot exceed 200 characters';
    }

    if (!moduleData.description.trim()) {
      newErrors.description = 'Module description is required';
    } else if (moduleData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (moduleData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (!moduleData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (moduleData.order < 1) {
      newErrors.order = 'Order must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Check if user is authenticated
      const currentUser = ApiService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('Please login to create modules');
      }

      // Check if courseId is provided
      if (!courseId) {
        throw new Error('Course ID is required to create a module');
      }

      // Prepare module data for API - match the backend DTO structure
      const modulePayload = {
        title: moduleData.title.trim(),
        description: moduleData.description.trim(),
        duration: moduleData.duration === 'custom' ? moduleData.customDuration || moduleData.duration : moduleData.duration,
        order: parseInt(moduleData.order),
        coverImage: moduleData.coverImage || null,
        learningObjectives: moduleData.learningObjectives.filter(obj => obj.trim()),
        prerequisites: moduleData.prerequisites.filter(prereq => prereq.trim())
      };

      console.log('Creating module with payload:', modulePayload);
      console.log('Course ID:', courseId);

      // Call the real API to create module
      const response = await ApiService.createModule(courseId, modulePayload);

      console.log('API Response:', response);

      if (response.success) {
        // Call the parent component's onSubmit function with the created module
        onSubmit(response.data);

        // Close the modal
        onClose();

        // Show success message
        console.log('Module created successfully:', response.data);
      } else {
        throw new Error(response.message || response.error || 'Failed to create module');
      }

    } catch (error) {
      console.error('Failed to create module:', error);

      // Set error for display
      setErrors({
        submit: error.message || 'Failed to create module. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
      >
        <motion.div
            className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create New Module</h2>
              <p className="text-gray-600 text-sm">Add a new module to organize your course content</p>
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Display submit error if any */}
          {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module Title *
              </label>
              <input
                  type="text"
                  name="title"
                  value={moduleData.title}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Introduction to Grammar"
                  maxLength={200}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              <p className="text-gray-500 text-xs mt-1">{moduleData.title.length}/200 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                  name="description"
                  value={moduleData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Describe what students will learn in this module..."
                  maxLength={1000}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-gray-500 text-xs mt-1">{moduleData.description.length}/1000 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration *
                </label>
                <select
                    name="duration"
                    value={moduleData.duration}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                    } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select duration</option>
                  <option value="1-2 days">1-2 days</option>
                  <option value="3-5 days">3-5 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="3 weeks">3 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="custom">Custom</option>
                </select>
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Order
                </label>
                <input
                    type="number"
                    name="order"
                    value={moduleData.order}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                        isLoading ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    min="1"
                    max="99"
                />
                <p className="text-gray-500 text-xs mt-1">Position in course sequence</p>
              </div>
            </div>

            {/* Custom duration input */}
            {moduleData.duration === 'custom' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Duration
                  </label>
                  <input
                      type="text"
                      name="customDuration"
                      placeholder="e.g., 10 days, 6 weeks, 3 months"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      disabled={isLoading}
                      onChange={(e) => setModuleData(prev => ({ ...prev, customDuration: e.target.value }))}
                  />
                </motion.div>
            )}

            {/* Cover Image URL (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL (Optional)
              </label>
              <input
                  type="url"
                  name="coverImage"
                  value={moduleData.coverImage}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                      isLoading ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://example.com/module-image.jpg"
              />
              <p className="text-gray-500 text-xs mt-1">Optional: Add a cover image for your module</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating Module...
                    </div>
                ) : (
                    'Create Module'
                )}
              </button>
            </div>
          </form>

          {/* Help text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">Module Organization Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Break down complex topics into digestible modules</li>
                  <li>• Each module should focus on a specific learning objective</li>
                  <li>• Consider the logical progression of your course content</li>
                  <li>• Modules can be reordered later if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default CreateModuleModal;