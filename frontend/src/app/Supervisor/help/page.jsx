"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';

const SupervisorHelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'All Topics', icon: '📋' },
    { id: 'content', name: 'Content Management', icon: '📝' },
    { id: 'quality', name: 'Quality Control', icon: '✅' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'technical', name: 'Technical Issues', icon: '🔧' }
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'How to Review and Approve Course Content',
      category: 'content',
      description: 'Step-by-step guide for reviewing teacher-submitted courses and lessons.',
      content: 'Learn the complete process of content review, quality checks, and approval workflow.',
      tags: ['review', 'approval', 'courses'],
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Quality Standards and Guidelines',
      category: 'quality',
      description: 'Understanding the quality standards for educational content.',
      content: 'Comprehensive guide to maintaining high-quality educational standards.',
      tags: ['quality', 'standards', 'guidelines'],
      readTime: '8 min'
    },
    {
      id: 3,
      title: 'Managing Teacher Accounts and Permissions',
      category: 'users',
      description: 'How to manage teacher accounts, permissions, and access levels.',
      content: 'Complete guide to user management and permission settings.',
      tags: ['teachers', 'permissions', 'accounts'],
      readTime: '6 min'
    },
    {
      id: 4,
      title: 'Generating Content Performance Reports',
      category: 'reports',
      description: 'Creating and interpreting performance analytics reports.',
      content: 'Learn to generate insights from course and lesson performance data.',
      tags: ['reports', 'analytics', 'performance'],
      readTime: '10 min'
    },
    {
      id: 5,
      title: 'Content Moderation Best Practices',
      category: 'content',
      description: 'Best practices for moderating educational content.',
      content: 'Guidelines for effective content moderation and feedback.',
      tags: ['moderation', 'feedback', 'best-practices'],
      readTime: '7 min'
    },
    {
      id: 6,
      title: 'Troubleshooting Platform Issues',
      category: 'technical',
      description: 'Common technical issues and their solutions.',
      content: 'Solutions for common platform problems and technical difficulties.',
      tags: ['troubleshooting', 'technical', 'solutions'],
      readTime: '4 min'
    }
  ];

  const faqItems = [
    {
      question: 'How do I approve a course for publication?',
      answer: 'Navigate to the Content Review section, select the course, review all modules and lessons, then click the "Approve for Publication" button if it meets quality standards.'
    },
    {
      question: 'What are the minimum quality requirements for courses?',
      answer: 'Courses must have clear learning objectives, structured content, proper grammar, engaging materials, and appropriate difficulty progression.'
    },
    {
      question: 'How can I provide feedback to teachers?',
      answer: 'Use the feedback system in the course review interface to leave specific comments on modules, lessons, or overall course structure.'
    },
    {
      question: 'Can I edit course content directly?',
      answer: 'Supervisors can make minor edits for quality improvements, but major changes should be communicated to the original teacher for revision.'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Supervisor Help Center</h1>
            <p className="text-gray-600">Find answers and guidance for managing educational content</p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles, guides, and FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center gap-3">
                    <span className="text-lg">📞</span>
                    <span className="font-medium">Contact Support</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center gap-3">
                    <span className="text-lg">📖</span>
                    <span className="font-medium">User Manual</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center gap-3">
                    <span className="text-lg">🎥</span>
                    <span className="font-medium">Video Tutorials</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Help Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Help Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {helpCategories.find(cat => cat.id === article.category)?.icon}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          {helpCategories.find(cat => cat.id === article.category)?.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{article.readTime}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Read Article
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                  {faqItems.map((faq, index) => (
                    <motion.div
                      key={index}
                      className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Still Need Help?</h3>
                <p className="mb-4 text-blue-100">Our support team is ready to assist you with any questions.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Contact Support
                  </button>
                  <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                    Schedule Training
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorHelpPage;