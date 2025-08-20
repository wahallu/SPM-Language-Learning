"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CreateCoursePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    level: '',
    description: '',
    instructor: 'Dr. Maria Rodriguez',
    instructorTitle: 'Language Expert',
    image: '',
    price: '',
    estimatedDuration: '',
    prerequisites: [],
    learningObjectives: ['']
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
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

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...courseData.learningObjectives];
    newObjectives[index] = value;
    setCourseData(prev => ({
      ...prev,
      learningObjectives: newObjectives
    }));
  };

  const addObjective = () => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const removeObjective = (index) => {
    const newObjectives = courseData.learningObjectives.filter((_, i) => i !== index);
    setCourseData(prev => ({
      ...prev,
      learningObjectives: newObjectives
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!courseData.title.trim()) newErrors.title = 'Course title is required';
      if (!courseData.category) newErrors.category = 'Category is required';
      if (!courseData.level) newErrors.level = 'Level is required';
      if (!courseData.description.trim()) newErrors.description = 'Description is required';
    }

    if (step === 2) {
      if (!courseData.estimatedDuration) newErrors.estimatedDuration = 'Duration is required';
      const validObjectives = courseData.learningObjectives.filter(obj => obj.trim());
      if (validObjectives.length === 0) newErrors.learningObjectives = 'At least one learning objective is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCourse = {
        ...courseData,
        id: Date.now(),
        status: 'draft',
        students: 0,
        modules: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      console.log('Course created:', newCourse);
      router.push(`/teacher/courses/${newCourse.id}`);
      
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Course Details' },
    { number: 3, title: 'Review & Create' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Course</h1>
        <p className="text-gray-600">Let's build an amazing learning experience together</p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="relative">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    step.number <= currentStep
                      ? 'bg-[#FF7D29] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={{ 
                    scale: step.number === currentStep ? 1.1 : 1,
                  }}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </motion.div>
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-[#FF7D29]' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-24 h-1 bg-gray-200 mx-4 relative">
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-[#FF7D29]"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: step.number < currentStep ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Beginner Spanish Conversation"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={courseData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  name="level"
                  value={courseData.level}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                    errors.level ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what students will learn in this course..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Image URL
              </label>
              <input
                type="url"
                name="image"
                value={courseData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                placeholder="https://example.com/course-image.jpg"
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Course Details */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration *
                </label>
                <input
                  type="text"
                  name="estimatedDuration"
                  value={courseData.estimatedDuration}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                    errors.estimatedDuration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 8 weeks, 20 hours"
                />
                {errors.estimatedDuration && <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                  placeholder="0 for free course"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives *
              </label>
              {courseData.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                    placeholder={`Learning objective ${index + 1}`}
                  />
                  {courseData.learningObjectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addObjective}
                className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium text-sm"
              >
                + Add another objective
              </button>
              {errors.learningObjectives && <p className="text-red-500 text-sm mt-1">{errors.learningObjectives}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <textarea
                name="prerequisites"
                value={courseData.prerequisites}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                placeholder="What should students know before taking this course? (Optional)"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Review Your Course</h3>
              <p className="text-gray-600">Make sure everything looks correct before creating your course</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Course Details</h4>
                  <p><span className="font-medium">Title:</span> {courseData.title}</p>
                  <p><span className="font-medium">Category:</span> {courseData.category}</p>
                  <p><span className="font-medium">Level:</span> {courseData.level}</p>
                  <p><span className="font-medium">Duration:</span> {courseData.estimatedDuration}</p>
                  {courseData.price && <p><span className="font-medium">Price:</span> ${courseData.price}</p>}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Instructor</h4>
                  <p><span className="font-medium">Name:</span> {courseData.instructor}</p>
                  <p><span className="font-medium">Title:</span> {courseData.instructorTitle}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{courseData.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Learning Objectives</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {courseData.learningObjectives.filter(obj => obj.trim()).map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Creating Course...
                </div>
              ) : (
                'Create Course'
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateCoursePage;