"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const EditLessonPage = ({ params }) => {
  const router = useRouter();
  
  // Mock lesson data - in real app, this would be fetched based on lessonId
  const [lessonData, setLessonData] = useState({
    id: 1,
    title: "English Alphabet",
    description: "Learn the 26 letters of the English alphabet and their pronunciation",
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
      },
      {
        id: 2,
        question: "Which letter comes after 'M' in the alphabet?",
        options: ["L", "N", "O"],
        correctAnswer: 1
      }
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  });

  const [currentQuiz, setCurrentQuiz] = useState({
    question: '',
    options: ['', '', ''],
    correctAnswer: 0
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditingQuiz, setIsEditingQuiz] = useState(null);

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

  const editQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setIsEditingQuiz(quiz.id);
  };

  const updateQuiz = () => {
    if (currentQuiz.question && currentQuiz.options.every(opt => opt.trim())) {
      setLessonData(prev => ({
        ...prev,
        quizzes: prev.quizzes.map(q => 
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
        quizzes: prev.quizzes.filter(q => q.id !== quizId)
      }));
    }
  };

  const validateForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab('details');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Lesson updated:', lessonData);
      router.push(`/teacher/courses/${params.courseId}/modules/${params.moduleId}`);
      
    } catch (error) {
      console.error('Failed to update lesson:', error);
      alert('Failed to update lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href={`/teacher/courses/${params.courseId}/modules/${params.moduleId}`}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Module
            </Link>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              lessonData.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {lessonData.status}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Lesson</h1>
          <p className="text-gray-600">{lessonData.title}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(lessonData.videoUrl, '_blank')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Preview Video
          </button>
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
                {tab.id === 'quiz' && lessonData.quizzes.length > 0 && (
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {lessonData.quizzes.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
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
                      rows={4}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={lessonData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
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
                    Quiz Questions ({lessonData.quizzes.length})
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage quiz questions to test students' understanding of this lesson.
                  </p>
                </div>

                {/* Existing Quiz Questions */}
                {lessonData.quizzes.length > 0 && (
                  <div className="space-y-4">
                    {lessonData.quizzes.map((quiz, index) => (
                      <div key={quiz.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 mb-3">
                              {index + 1}. {quiz.question}
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {quiz.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm px-4 py-2 rounded-lg border ${
                                    optIndex === quiz.correctAnswer
                                      ? 'bg-green-100 text-green-800 border-green-200 font-medium'
                                      : 'bg-white text-gray-600 border-gray-200'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {optIndex === quiz.correctAnswer && ' ✓ Correct Answer'}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => editQuiz(quiz)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit question"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeQuiz(quiz.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete question"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                            <label className="ml-2 text-sm text-gray-700 font-medium">
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

                    <div className="flex gap-3">
                      {isEditingQuiz ? (
                        <>
                          <button
                            onClick={updateQuiz}
                            disabled={!currentQuiz.question || !currentQuiz.options.every(opt => opt.trim())}
                            className="flex-1 py-2 bg-[#FF7D29] text-white rounded-xl hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Question
                          </button>
                          <button
                            onClick={cancelEditQuiz}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Lesson Preview
                  </h3>
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
                            {lessonData.quizzes.length} quiz{lessonData.quizzes.length !== 1 ? 'es' : ''}
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
                    {lessonData.quizzes.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-800">Quiz Questions:</h5>
                        {lessonData.quizzes.map((quiz, index) => (
                          <div key={quiz.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="font-medium text-gray-800 mb-3">
                              {index + 1}. {quiz.question}
                            </p>
                            <div className="space-y-2">
                              {quiz.options.map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`preview-quiz-${quiz.id}`}
                                    className="w-4 h-4 text-[#FF7D29] border-gray-300 focus:ring-[#FF7D29]"
                                    disabled
                                  />
                                  <span className="text-gray-700">
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </span>
                                </label>
                              ))}
                            </div>
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