"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

const LessonCard = ({ lesson, moduleId, courseId, onDelete, onPublish, onUnpublish, delay = 0 }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(lesson.videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) return 'Draft';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start p-6">
        {/* Video Thumbnail */}
        <div className="flex-shrink-0 mr-4">
          <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={lesson.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">🎥</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {lesson.order}. {lesson.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                  {getStatusDisplay(lesson.status)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {lesson.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.duration || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.quizzes?.length || 0} quiz{(lesson.quizzes?.length || 0) !== 1 ? 'es' : ''}
                </span>
                {lesson.views !== undefined && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {lesson.views || 0} views
                  </span>
                )}
              </div>

              {/* Created/Updated dates */}
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                <span>Created: {formatDate(lesson.createdAt)}</span>
                {lesson.updatedAt && (
                  <span>Updated: {formatDate(lesson.updatedAt)}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Toggle details"
              >
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <div className="relative group">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <Link
                    href={`/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Lesson
                    </span>
                  </Link>

                  {lesson.videoUrl && (
                    <button
                      onClick={() => window.open(lesson.videoUrl, '_blank')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Preview Video
                      </span>
                    </button>
                  )}

                  {/* Publish/Unpublish actions */}
                  {lesson.status === 'DRAFT' && onPublish && (
                    <button
                      onClick={() => onPublish(lesson.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Publish Lesson
                      </span>
                    </button>
                  )}

                  {lesson.status === 'PUBLISHED' && onUnpublish && (
                    <button
                      onClick={() => onUnpublish(lesson.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unpublish Lesson
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => onDelete && onDelete(lesson.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Lesson
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <motion.div
        initial={false}
        animate={{ height: showDetails ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-4 space-y-4">
            {/* Video URL */}
            {lesson.videoUrl && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Video URL</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={lesson.videoUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(lesson.videoUrl)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Additional lesson metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {lesson.difficulty && (
                <div>
                  <h4 className="font-medium text-gray-700">Difficulty</h4>
                  <p className="text-gray-600">{lesson.difficulty}</p>
                </div>
              )}
              {lesson.language && (
                <div>
                  <h4 className="font-medium text-gray-700">Language</h4>
                  <p className="text-gray-600">{lesson.language}</p>
                </div>
              )}
              {lesson.averageRating !== undefined && lesson.averageRating > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700">Rating</h4>
                  <p className="text-gray-600">{lesson.averageRating.toFixed(1)}/5 ({lesson.totalRatings || 0} ratings)</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {lesson.tags && lesson.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Questions */}
            {lesson.quizzes && lesson.quizzes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Quiz Questions ({lesson.quizzes.length})
                </h4>
                <div className="space-y-3">
                  {lesson.quizzes.map((quiz, index) => (
                    <div key={quiz.id || index} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-gray-800 text-sm mb-2">
                        {index + 1}. {quiz.question}
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {quiz.options && quiz.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-xs px-2 py-1 rounded ${optIndex === quiz.correctAnswer
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
                        <p className="text-xs text-gray-500 mt-2 italic">
                          Explanation: {quiz.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Link
                href={`/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`}
                className="flex-1 text-center py-2 bg-[#FF7D29] text-white rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
              >
                Edit Lesson
              </Link>
              {lesson.videoUrl && (
                <button
                  onClick={() => window.open(lesson.videoUrl, '_blank')}
                  className="flex-1 text-center py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Preview Video
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LessonCard;