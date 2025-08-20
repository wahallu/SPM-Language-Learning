"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

const ModuleCard = ({ module, courseId, onDelete, delay = 0 }) => {
  const [showActions, setShowActions] = useState(false);

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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          module.status === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {module.status}
        </span>
        <span className="text-sm text-gray-500">Module {module.order}</span>
      </div>

      {/* Module Icon */}
      <div className="w-12 h-12 bg-[#FF7D29] bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
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
          <span>{module.lessons} lessons</span>
          <span>{module.duration}</span>
        </div>
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
        <div className="relative">
          <button
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Completion</span>
          <span className="text-xs text-gray-500">
            {module.lessons > 0 ? Math.round((module.lessons / 10) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-[#FF7D29] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: module.lessons > 0 ? `${Math.round((module.lessons / 10) * 100)}%` : '0%'
            }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;