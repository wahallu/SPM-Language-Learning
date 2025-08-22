"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ApiService from '@/app/utils/api';

const EditLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const { courseId, moduleId, lessonId } = params;

  const [lessonData, setLessonData] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState({
    question: '',
    options: ['', '', ''],
    correctAnswer: 0
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditingQuiz, setIsEditingQuiz] = useState(null);

  // Fetch lesson data on component mount
  useEffect(() => {
    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      setFetchLoading(true);
      console.log('Fetching lesson data for ID:', lessonId);

      const response = await ApiService.getLessonById(lessonId);
      console.log('Lesson API response:', response);

      if (response.success) {
        setLessonData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch lesson data');
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
      alert('Failed to load lesson data: ' + error.message);
      // Navigate back if lesson not found
      router.push(`/teacher/courses/${courseId}/modules/${moduleId}`);
    } finally {
      setFetchLoading(false);
    }
  };

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
        id: Date.now().toString() // Temporary ID for frontend
      };

      setLessonData(prev => ({
        ...prev,
        quizzes: [...(prev.quizzes || []), newQuiz]
      }));

      setCurrentQuiz({
        question: '',
        options: ['', '', ''],
        correctAnswer: 0
      });
    }
  };

  const editQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setIsEditingQuiz(quiz.id);
  };

  const updateQuiz = () => {
    if (currentQuiz.question && currentQuiz.options.every(opt => opt.trim())) {
      setLessonData(prev => ({
        ...prev,
        quizzes: (prev.quizzes || []).map(q =>
          q.id === isEditingQuiz ? currentQuiz : q
        )
      }));

      setCurrentQuiz({
        question: '',
        options: ['', '', ''],
        correctAnswer: 0
      });
      setIsEditingQuiz(null);
    }
  };

  const cancelEditQuiz = () => {
    setCurrentQuiz({
      question: '',
      options: ['', '', ''],
      correctAnswer: 0
    });
    setIsEditingQuiz(null);
  };

  const removeQuiz = (quizId) => {
    if (confirm('Are you sure you want to delete this quiz question?')) {
      setLessonData(prev => ({
        ...prev,
        quizzes: (prev.quizzes || []).filter(q => q.id !== quizId)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!lessonData.title?.trim()) {
      newErrors.title = 'Lesson title is required';
    }

    if (!lessonData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!lessonData.videoUrl?.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!lessonData.videoUrl.includes('youtube.com') && !lessonData.videoUrl.includes('youtu.be')) {
      newErrors.videoUrl = 'Please provide a valid YouTube URL';
    }

    if (!lessonData.duration?.trim()) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setActiveTab('details');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Updating lesson with data:', lessonData);

      // Prepare the update data
      const updateData = {
        title: lessonData.title,
        description: lessonData.description,
        videoUrl: lessonData.videoUrl,
        duration: lessonData.duration,
        order: lessonData.order,
        status: lessonData.status,
        coverImage: lessonData.coverImage,
        transcript: lessonData.transcript,
        tags: lessonData.tags,
        difficulty: lessonData.difficulty,
        language: lessonData.language,
        quizzes: lessonData.quizzes
      };

      const response = await ApiService.updateLesson(lessonId, updateData);

      if (response.success) {
        console.log('Lesson updated successfully');
        alert('Lesson updated successfully!');
        router.push(`/teacher/courses/${courseId}/modules/${moduleId}`);
      } else {
        throw new Error(response.message || 'Failed to update lesson');
      }

    } catch (error) {
      console.error('Failed to update lesson:', error);
      alert('Failed to update lesson: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading lesson data...</p>
        </div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Lesson Not Found</h3>
        <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
        <Link
          href={`/teacher/courses/${courseId}/modules/${moduleId}`}
          className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF9D5C] transition-all"
        >
          Back to Module
        </Link>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(lessonData.videoUrl);

  const tabs = [
    { id: 'details', label: 'Lesson Details', icon: '📝' },
    { id: 'quiz', label: 'Quiz Questions', icon: '❓' },
    { id: 'preview', label: 'Preview', icon: '👁️' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/teacher/courses/${courseId}/modules/${moduleId}`}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Module
            </Link>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${lessonData.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
              }`}>
              {lessonData.status}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#FF7D29] text-white px-6 py-2 rounded-xl hover:bg-[#FF9D5C] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Lesson</h1>
        <p className="text-gray-600">{lessonData.title}</p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id
                    ? 'text-[#FF7D29] border-b-2 border-[#FF7D29] bg-orange-50'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Lesson Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={lessonData.title || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
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
                      value={lessonData.description || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
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
                      value={lessonData.videoUrl || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${errors.videoUrl ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      Paste the full YouTube URL for this lesson's video
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={lessonData.duration || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent ${errors.duration ? 'border-red-500' : 'border-gray-300'
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
                        value={lessonData.order || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={lessonData.status || 'DRAFT'}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        name="difficulty"
                        value={lessonData.difficulty || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      >
                        <option value="">Select difficulty</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        name="language"
                        value={lessonData.language || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      >
                        <option value="">Select language</option>
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Sinhala">Sinhala</option>
                      </select>
                    </div>
                  </div>

                  {/* Video Preview */}
                  {videoId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Preview
                      </label>
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Video preview"
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* Quiz Questions Tab */}
            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Quiz Questions ({lessonData.quizzes?.length || 0})
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage quiz questions to test students' understanding of this lesson.
                  </p>
                </div>

                {/* Existing Quiz Questions */}
                {lessonData.quizzes && lessonData.quizzes.length > 0 && (
                  <div className="space-y-4">
                    {lessonData.quizzes.map((quiz, index) => (
                      <div key={quiz.id || index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 mb-2">
                              {index + 1}. {quiz.question}
                            </p>
                            <div className="space-y-1">
                              {quiz.options && quiz.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm px-3 py-1 rounded-lg ${optIndex === quiz.correctAnswer
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
                              <p className="text-sm text-gray-500 mt-2 italic">
                                Explanation: {quiz.explanation}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editQuiz(quiz)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Edit question"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeQuiz(quiz.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete question"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add/Edit Quiz Form */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <h4 className="font-medium text-gray-800 mb-4">
                    {isEditingQuiz ? 'Edit Question' : 'Add New Question'}
                  </h4>

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

                    <div className="flex gap-2">
                      {isEditingQuiz ? (
                        <>
                          <button
                            type="button"
                            onClick={updateQuiz}
                            disabled={!currentQuiz.question || !currentQuiz.options.every(opt => opt.trim())}
                            className="flex-1 py-2 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Question
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditQuiz}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={addQuiz}
                          disabled={!currentQuiz.question || !currentQuiz.options.every(opt => opt.trim())}
                          className="w-full py-2 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Question
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Lesson Preview</h3>
                  <p className="text-gray-600 text-sm">
                    Preview how students will see this lesson.
                  </p>
                </div>

                {/* Lesson Preview Card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                          {lessonData.title}
                        </h4>
                        <p className="text-gray-600 mb-4">{lessonData.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {lessonData.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {lessonData.quizzes?.length || 0} quiz{(lessonData.quizzes?.length || 0) !== 1 ? 'es' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Video Preview */}
                    {videoId && (
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Lesson video"
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Quiz Preview */}
                    {lessonData.quizzes && lessonData.quizzes.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-800">Quiz Questions:</h5>
                        {lessonData.quizzes.map((quiz, index) => (
                          <div key={quiz.id || index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="font-medium text-gray-800 mb-3">
                              {index + 1}. {quiz.question}
                            </p>
                            <div className="space-y-2">
                              {quiz.options && quiz.options.map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`preview-quiz-${quiz.id || index}`}
                                    defaultChecked={optIndex === quiz.correctAnswer}
                                    className="w-4 h-4 text-[#FF7D29] border-gray-300 focus:ring-[#FF7D29]"
                                    disabled
                                  />
                                  <span className="text-gray-700">
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </span>
                                  {optIndex === quiz.correctAnswer && (
                                    <span className="text-green-600 text-sm font-medium">✓ Correct</span>
                                  )}
                                </label>
                              ))}
                            </div>
                            {quiz.explanation && (
                              <p className="text-sm text-gray-500 mt-3 p-2 bg-blue-50 rounded">
                                <strong>Explanation:</strong> {quiz.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default EditLessonPage;