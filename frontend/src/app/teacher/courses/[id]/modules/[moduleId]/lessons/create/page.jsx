"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ApiService from '@/app/utils/api';

const CreateLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const { courseId, moduleId } = params;

  const [currentStep, setCurrentStep] = useState(1);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: 1,
    coverImage: '',
    transcript: '',
    tags: [],
    difficulty: 'BEGINNER',
    language: 'English',
    quizzes: []
  });

  const [currentQuiz, setCurrentQuiz] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 10
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [module, setModule] = useState(null);
  const [loadingModule, setLoadingModule] = useState(true);

  // Fetch module data
  useEffect(() => {
    if (moduleId) {
      fetchModuleData();
    }
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoadingModule(true);
      const response = await ApiService.getModuleById(moduleId);
      
      if (response.success) {
        setModule(response.data);
        // Set the next lesson order
        const lessons = await ApiService.getLessonsByModule(moduleId);
        if (lessons.success) {
          setLessonData(prev => ({
            ...prev,
            order: (lessons.data?.length || 0) + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoadingModule(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setLessonData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleQuizInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuiz(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuizOptionChange = (index, value) => {
    const newOptions = [...currentQuiz.options];
    newOptions[index] = value;
    setCurrentQuiz(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addQuiz = () => {
    if (!currentQuiz.question.trim()) {
      alert('Please enter a question');
      return;
    }

    const filledOptions = currentQuiz.options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    const newQuiz = {
      id: Date.now().toString(),
      question: currentQuiz.question,
      options: currentQuiz.options.filter(opt => opt.trim()),
      correctAnswer: currentQuiz.correctAnswer,
      explanation: currentQuiz.explanation,
      points: currentQuiz.points || 10
    };

    setLessonData(prev => ({
      ...prev,
      quizzes: [...prev.quizzes, newQuiz]
    }));

    setCurrentQuiz({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10
    });
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

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Creating lesson with data:', lessonData);

      const response = await ApiService.createLesson(moduleId, lessonData);

      if (response.success) {
        console.log('Lesson created successfully:', response.data);
        alert('Lesson created successfully!');
        router.push(`/teacher/courses/${courseId}/modules/${moduleId}`);
      } else {
        throw new Error(response.message || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert(error.message || 'Failed to create lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const videoId = getYouTubeVideoId(lessonData.videoUrl);

  const steps = [
    { number: 1, title: 'Lesson Details', icon: '📝' },
    { number: 2, title: 'Quiz Questions', icon: '❓' }
  ];

  if (loadingModule) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading module data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/teacher/courses/${courseId}/modules/${moduleId}`}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Module
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Lesson</h1>
        <p className="text-gray-600">
          Module: <strong>{module?.title || 'Loading...'}</strong>
        </p>

        {/* Progress Steps */}
        <div className="mt-6 flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step.number
                      ? 'bg-[#FF7D29] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${currentStep >= step.number ? 'text-[#FF7D29]' : 'text-gray-600'}`}>
                    Step {step.number}
                  </p>
                  <p className="text-sm text-gray-500">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                    currentStep > step.number ? 'bg-[#FF7D29]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-8">
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
                    rows="4"
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
                  
                  {/* Video Preview */}
                  {videoId && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="e.g., 15 minutes"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty"
                      value={lessonData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <input
                      type="text"
                      name="language"
                      value={lessonData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      placeholder="e.g., English"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={lessonData.tags.join(', ')}
                    onChange={handleTagsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                    placeholder="e.g., beginner, grammar, vocabulary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL (optional)
                  </label>
                  <input
                    type="url"
                    name="coverImage"
                    value={lessonData.coverImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transcript (optional)
                  </label>
                  <textarea
                    name="transcript"
                    value={lessonData.transcript}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                    placeholder="Enter the video transcript here..."
                  />
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
                                  className={`text-sm px-3 py-2 rounded-lg ${
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
                            {quiz.explanation && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                Explanation: {quiz.explanation}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Points: {quiz.points}
                            </p>
                          </div>
                          <button
                            onClick={() => removeQuiz(quiz.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                        name="question"
                        value={currentQuiz.question}
                        onChange={handleQuizInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        placeholder="Enter your question..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {currentQuiz.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-600 font-medium w-8">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleQuizOptionChange(index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <select
                        name="correctAnswer"
                        value={currentQuiz.correctAnswer}
                        onChange={handleQuizInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      >
                        {currentQuiz.options.map((option, index) => (
                          <option key={index} value={index} disabled={!option.trim()}>
                            {String.fromCharCode(65 + index)} - {option || '(empty)'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (optional)
                      </label>
                      <textarea
                        name="explanation"
                        value={currentQuiz.explanation}
                        onChange={handleQuizInputChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        placeholder="Explain why this is the correct answer..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        name="points"
                        value={currentQuiz.points}
                        onChange={handleQuizInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        min="1"
                        max="100"
                      />
                    </div>

                    <button
                      onClick={addQuiz}
                      disabled={!currentQuiz.question || !currentQuiz.options.some(opt => opt.trim())}
                      className="w-full py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={currentStep === 1 ? () => router.back() : prevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>

          {currentStep === 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors font-medium"
            >
              Next: Add Questions
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 font-medium"
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
    </div>
  );
};

export default CreateLessonPage;