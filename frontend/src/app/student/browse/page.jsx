"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

const CourseBrowserPage = () => {
  const [courses] = useState([
    {
      id: 1,
      title: "English Fundamentals",
      description: "Master the basics of English language with comprehensive lessons covering grammar, vocabulary, and conversation skills.",
      category: "English",
      level: "Beginner",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      rating: 4.8,
      totalRatings: 2543,
      students: 15420,
      duration: "8 weeks",
      lessons: 45,
      price: 49,
      originalPrice: 99,
      image: "/images/courses/english-fundamentals.jpg",
      tags: ["Grammar", "Vocabulary", "Speaking", "Listening"],
      lastUpdated: "2024-02-15",
      language: "English",
      certificate: true,
      bestseller: true,
      new: false
    },
    {
      id: 2,
      title: "Spanish for Travelers",
      description: "Learn essential Spanish phrases and conversations for your next travel adventure. Perfect for tourists and business travelers.",
      category: "Spanish",
      level: "Beginner",
      instructor: "Prof. Carlos Martinez",
      instructorTitle: "Native Spanish Speaker",
      rating: 4.9,
      totalRatings: 1876,
      students: 8932,
      duration: "6 weeks",
      lessons: 32,
      price: 39,
      originalPrice: 79,
      image: "/images/courses/spanish-travelers.jpg",
      tags: ["Travel", "Conversation", "Phrases", "Culture"],
      lastUpdated: "2024-03-01",
      language: "Spanish",
      certificate: true,
      bestseller: false,
      new: true
    },
    {
      id: 3,
      title: "Business French",
      description: "Advance your career with professional French language skills. Learn business terminology, formal communication, and networking.",
      category: "French",
      level: "Intermediate",
      instructor: "Mme. Sophie Dubois",
      instructorTitle: "Business Language Specialist",
      rating: 4.7,
      totalRatings: 892,
      students: 3456,
      duration: "10 weeks",
      lessons: 58,
      price: 79,
      originalPrice: 129,
      image: "/images/courses/business-french.jpg",
      tags: ["Business", "Professional", "Formal", "Networking"],
      lastUpdated: "2024-01-20",
      language: "French",
      certificate: true,
      bestseller: false,
      new: false
    },
    {
      id: 4,
      title: "German Grammar Mastery",
      description: "Conquer German grammar with systematic lessons covering cases, verb conjugations, and sentence structure.",
      category: "German",
      level: "Intermediate",
      instructor: "Dr. Hans Mueller",
      instructorTitle: "German Linguistics PhD",
      rating: 4.6,
      totalRatings: 1234,
      students: 5678,
      duration: "12 weeks",
      lessons: 72,
      price: 89,
      originalPrice: 149,
      image: "/images/courses/german-grammar.jpg",
      tags: ["Grammar", "Cases", "Verbs", "Structure"],
      lastUpdated: "2024-02-28",
      language: "German",
      certificate: true,
      bestseller: false,
      new: false
    },
    {
      id: 5,
      title: "Italian Conversation Club",
      description: "Practice Italian speaking skills in a fun, interactive environment. Join virtual conversation sessions with native speakers.",
      category: "Italian",
      level: "Intermediate",
      instructor: "Marco Rossini",
      instructorTitle: "Native Italian Speaker",
      rating: 4.9,
      totalRatings: 567,
      students: 2134,
      duration: "Ongoing",
      lessons: 24,
      price: 29,
      originalPrice: 59,
      image: "/images/courses/italian-conversation.jpg",
      tags: ["Speaking", "Conversation", "Native Speaker", "Interactive"],
      lastUpdated: "2024-03-10",
      language: "Italian",
      certificate: false,
      bestseller: false,
      new: true
    },
    {
      id: 6,
      title: "Japanese for Anime Fans",
      description: "Learn Japanese through your favorite anime! Understand dialogues, cultural references, and everyday expressions.",
      category: "Japanese",
      level: "Beginner",
      instructor: "Sensei Takeshi",
      instructorTitle: "Japanese Culture Expert",
      rating: 4.8,
      totalRatings: 3421,
      students: 12876,
      duration: "14 weeks",
      lessons: 84,
      price: 69,
      originalPrice: 119,
      image: "/images/courses/japanese-anime.jpg",
      tags: ["Anime", "Culture", "Entertainment", "Popular"],
      lastUpdated: "2024-02-05",
      language: "Japanese",
      certificate: true,
      bestseller: true,
      new: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Korean'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: '$100+' }
  ];

  const featuredCourses = courses.filter(course => course.bestseller || course.new).slice(0, 3);

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      
      let matchesPrice = true;
      if (selectedPrice === 'free') matchesPrice = course.price === 0;
      else if (selectedPrice === '0-50') matchesPrice = course.price >= 0 && course.price <= 50;
      else if (selectedPrice === '50-100') matchesPrice = course.price > 50 && course.price <= 100;
      else if (selectedPrice === '100+') matchesPrice = course.price > 100;
      
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular': return b.students - a.students;
        case 'rating': return b.rating - a.rating;
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'alphabetical': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const handleEnroll = (courseId) => {
    // Simulate enrollment
    alert(`Enrolled in course ${courseId}! Redirecting to course page...`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedPrice('all');
    setSortBy('popular');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">Discover Your Next Learning Adventure</h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore thousands of expert-led courses and start learning something new today
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search for courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-800 bg-white rounded-xl text-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
      </motion.div>

      {/* Featured Courses */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
                {course.bestseller && (
                  <span className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Bestseller
                  </span>
                )}
                {course.new && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    New
                  </span>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-gray-500">({course.totalRatings})</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{course.students.toLocaleString()} students</span>
                  <span>{course.duration}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#FF7D29]">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Filters and Course Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
            </button>

            {/* Desktop Filters */}
            <div className={`flex flex-wrap gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                {levels.map(level => (
                  <option key={level} value={level === 'All' ? 'all' : level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="alphabetical">Alphabetical</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#FF7D29] text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#FF7D29] text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
              {searchTerm && (
                <span> for "<strong>{searchTerm}</strong>"</span>
              )}
            </p>
          </div>
        </div>

        {/* Course Grid/List */}
        <AnimatePresence>
          {filteredCourses.length === 0 ? (
            <motion.div
              className="bg-white rounded-xl shadow-lg p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl hover:bg-[#FF9D5C] transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }>
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {viewMode === 'grid' ? (
                    <CourseCardGrid course={course} onEnroll={handleEnroll} />
                  ) : (
                    <CourseCardList course={course} onEnroll={handleEnroll} />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
};

// Grid View Course Card
const CourseCardGrid = ({ course, onEnroll }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-6xl">📚</span>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {course.bestseller && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Bestseller
            </span>
          )}
          {course.new && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              New
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {course.level}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{course.category}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-sm text-gray-500">({course.totalRatings})</span>
          </div>
        </div>
        
        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>
        <p className="text-sm text-gray-500 mb-4">by {course.instructor}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{course.students.toLocaleString()} students</span>
          <span>{course.lessons} lessons</span>
          <span>{course.duration}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#FF7D29]">${course.price}</span>
            {course.originalPrice > course.price && (
              <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onEnroll(course.id)}
            className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

// List View Course Card
const CourseCardList = ({ course, onEnroll }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className="flex gap-6">
        <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-4xl">📚</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-xl text-gray-800">{course.title}</h3>
              <div className="flex gap-2">
                {course.bestseller && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Bestseller
                  </span>
                )}
                {course.new && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    New
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[#FF7D29]">${course.price}</span>
              {course.originalPrice > course.price && (
                <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mb-3">{course.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              {course.rating} ({course.totalRatings} reviews)
            </span>
            <span>{course.students.toLocaleString()} students</span>
            <span>{course.lessons} lessons</span>
            <span>{course.duration}</span>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{course.level}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">by {course.instructor}, {course.instructorTitle}</p>
              <div className="flex flex-wrap gap-1">
                {course.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onEnroll(course.id)}
              className="bg-[#FF7D29] text-white px-6 py-3 rounded-lg hover:bg-[#FF9D5C] transition-colors"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBrowserPage;