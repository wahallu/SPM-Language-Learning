"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CreateLessonModal = ({ onClose, onSubmit, lessonCount }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: lessonCount + 1,
    quizzes: []
  });

  const [currentQuiz, setCurrentQuiz] = useState({
    question: '',
    options: ['', '', ''],
    correctAnswer: 0
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
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

  const handleQuizChange = (field, value, optionIndex = null) => {
    if (field === 'options' && optionIndex !== null) {
      const newOptions = [...currentQuiz.options];
      newOptions[optionIndex] = value;
      setCurrentQuiz(prev => ({
        ...prev,
        options: newOptions
      }));
    } else {
      setCurrentQuiz(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addQuiz = () => {
    if (currentQuiz.question && currentQuiz.options.every(opt => opt.trim())) {
      const newQuiz = {
        ...currentQuiz,
        id: Date.now()
      };
      
      setLessonData(prev => ({
        ...prev,
        quizzes: [...prev.quizzes, newQuiz]
      }));
      
      setCurrentQuiz({
        question: '',
        options: ['', '', ''],
        correctAnswer: 0
      });
    }
  };

  const removeQuiz = (quizId) => {
    setLessonData(prev => ({
      ...prev,
      quizzes: prev.quizzes.filter(q => q.id !== quizId)
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!lessonData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    }

    if (!lessonData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!lessonData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!lessonData.videoUrl.includes('youtube.com') && !lessonData.videoUrl.includes('youtu.be')) {
      newErrors.videoUrl = 'Please provide a valid YouTube URL';
    }

    if (!lessonData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(lessonData);
    } catch (error) {
      console.error('Failed to create lesson:', error);
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
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Lesson</h2>
            <p className="text-gray-600">Step {currentStep} of 2</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center">
            <div className={`w-1/2 h-2 rounded-full ${currentStep >= 1 ? 'bg-[#FF7D29]' : 'bg-gray-200'}`} />
            <div className={`w-1/2 h-2 rounded-full ml-2 ${currentStep >= 2 ? 'bg-[#FF7D29]' : 'bg-gray-200'}`} />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? 'text-[#FF7D29] font-medium' : 'text-gray-500'}>
              Lesson Details
            </span>
            <span className={currentStep >= 2 ? 'text-[#FF7D29] font-medium' : 'text-gray-500'}>
              Quiz Questions
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {/* Step 1: Lesson Details */}
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
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={lessonData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., English Alphabet Basics"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={lessonData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe what students will learn in this lesson..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={lessonData.videoUrl}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                      errors.videoUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>}
                  <p className="text-sm text-gray-500 mt-1">
                    Paste the full YouTube URL for this lesson's video
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={lessonData.duration}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 10 minutes"
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={lessonData.order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Quiz Questions */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add Quiz Questions (Optional)
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Create quiz questions to test students' understanding of this lesson.
                  </p>
                </div>

                {/* Existing Quizzes */}
                {lessonData.quizzes.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h4 className="font-medium text-gray-800">Added Questions ({lessonData.quizzes.length})</h4>
                    {lessonData.quizzes.map((quiz, index) => (
                      <div key={quiz.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 mb-2">
                              {index + 1}. {quiz.question}
                            </p>
                            <div className="space-y-1">
                              {quiz.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm px-3 py-1 rounded-lg ${
                                    optIndex === quiz.correctAnswer
                                      ? 'bg-green-100 text-green-800 font-medium'
                                      : 'bg-white text-gray-600'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {optIndex === quiz.correctAnswer && ' ✓'}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => removeQuiz(quiz.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Quiz */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <h4 className="font-medium text-gray-800 mb-4">Add New Question</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question
                      </label>
                      <input
                        type="text"
                        value={currentQuiz.question}
                        onChange={(e) => handleQuizChange('question', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        placeholder="Enter your quiz question..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options (3 choices)
                      </label>
                      {currentQuiz.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3 mb-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={currentQuiz.correctAnswer === index}
                              onChange={() => handleQuizChange('correctAnswer', index)}
                              className="w-4 h-4 text-[#FF7D29] border-gray-300 focus:ring-[#FF7D29]"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              {String.fromCharCode(65 + index)}.
                            </label>
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleQuizChange('options', e.target.value, index)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-2">
                        Select the radio button next to the correct answer
                      </p>
                    </div>

                    <button
                      onClick={addQuiz}
                      disabled={!currentQuiz.question || !currentQuiz.options.every(opt => opt.trim())}
                      className="w-full py-2 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-gray-200 bg-white">
          <button
            onClick={currentStep === 1 ? onClose : prevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>

          {currentStep === 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors"
            >
              Next: Add Questions
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
                  Creating Lesson...
                </div>
              ) : (
                'Create Lesson'
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateLessonModal;