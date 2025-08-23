"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

const ModuleCard = ({ module, courseId, onDelete, delay = 0 }) => {
  const [showActions, setShowActions] = useState(false);

  const formatStatus = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return { text: 'Published', color: 'bg-green-100 text-green-800' };
      case 'DRAFT':
        return { text: 'Draft', color: 'bg-yellow-100 text-yellow-800' };
      case 'UNDER_REVIEW':
        return { text: 'Under Review', color: 'bg-blue-100 text-blue-800' };
      case 'ARCHIVED':
        return { text: 'Archived', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status || 'Draft', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const statusInfo = formatStatus(module.status);

  return (
      <motion.div
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay }}
          onHoverStart={() => setShowActions(true)}
          onHoverEnd={() => setShowActions(false)}
      >
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
          <span className="text-sm text-gray-500">Module {module.order}</span>
        </div>

        {/* Module Icon */}
        <div className="w-12 h-12 bg-[#FF7D29] bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
          {module.coverImage ? (
              <img
                  src={module.coverImage}
                  alt={module.title}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
              />
          ) : null}
          <span className="text-2xl">📚</span>
        </div>

        {/* Module Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 text-lg leading-tight">
            {module.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {module.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{module.totalLessons || 0} lessons</span>
            <span>{module.duration}</span>
          </div>

          {/* Learning Objectives */}
          {module.learningObjectives && module.learningObjectives.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Learning Objectives:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {module.learningObjectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-[#FF7D29] mt-1">•</span>
                        <span className="line-clamp-1">{objective}</span>
                      </li>
                  ))}
                  {module.learningObjectives.length > 2 && (
                      <li className="text-gray-400">+{module.learningObjectives.length - 2} more...</li>
                  )}
                </ul>
              </div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
            className="flex gap-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 10 }}
            transition={{ duration: 0.2 }}
        >
          <Link
              href={`/teacher/courses/${courseId}/modules/${module.id}`}
              className="flex-1 text-center py-2 bg-[#FF7D29] text-white rounded-lg text-sm hover:bg-[#FF9D5C] transition-colors"
          >
            Manage
          </Link>
          <Link
              href={`/teacher/courses/${courseId}/modules/${module.id}/lessons/create`}
              className="flex-1 text-center py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            + Lesson
          </Link>
        </motion.div>

        {/* Dropdown Menu */}
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <Link
                  href={`/teacher/courses/${courseId}/modules/${module.id}/edit`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Module
              </span>
              </Link>
              <button
                  onClick={() => onDelete && onDelete(module.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Module
              </span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Completion</span>
            <span className="text-xs text-gray-500">
            {module.completionPercentage ? Math.round(module.completionPercentage) : 0}%
          </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
                className="bg-[#FF7D29] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: module.completionPercentage ? `${Math.round(module.completionPercentage)}%` : '0%'
                }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
            />
          </div>
        </div>

        {/* Module Metadata */}
        <div className="mt-3 text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(module.createdAt).toLocaleDateString()}</span>
          </div>
          {module.updatedAt && module.updatedAt !== module.createdAt && (
              <div className="flex justify-between">
                <span>Updated:</span>
                <span>{new Date(module.updatedAt).toLocaleDateString()}</span>
              </div>
          )}
          {module.totalDurationMinutes > 0 && (
              <div className="flex justify-between">
                <span>Total Duration:</span>
                <span>{Math.round(module.totalDurationMinutes / 60)}h {module.totalDurationMinutes % 60}m</span>
              </div>
          )}
        </div>
      </motion.div>
  );
};

export default ModuleCard;