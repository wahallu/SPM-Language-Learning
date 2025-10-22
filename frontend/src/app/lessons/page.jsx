"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../Components/layout/Header";
import Footer from "../Components/layout/Footer";
import { motion } from "motion/react";
import ApiService from "../utils/api";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Fetch lessons on component mount
  useEffect(() => {
    fetchLessons();
  }, []);

  // Filter lessons when search term or filters change
  useEffect(() => {
    filterLessons();
  }, [searchTerm, selectedCategory, selectedLevel, lessons]);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ApiService.getAllPublishedLessons();

      if (response.success && response.data) {
        setLessons(response.data);
        setFilteredLessons(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch lessons');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setError(error.message);
      setLessons([]);
      setFilteredLessons([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = lessons;

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(term) ||
          lesson.category.toLowerCase().includes(term) ||
          lesson.level.toLowerCase().includes(term) ||
          (lesson.description && lesson.description.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.level.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    setFilteredLessons(filtered);
  };

  // Get unique categories and levels from lessons
  const categories = ["all", ...new Set(lessons.map((l) => l.category))];
  const levels = ["all", ...new Set(lessons.map((l) => l.level))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600">Loading lessons...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error Loading Lessons
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchLessons}
              className="bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Language Learning Lessons
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive language lessons designed to help you
            master new languages with confidence
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by language, title, or level..."
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7D29]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filter dropdowns */}
          <div className="flex gap-4 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D29]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D29]"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === "all" ? "All Levels" : level}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="bg-green-100 rounded-lg p-6 mb-10 text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-center">
            <Image
              src="/Gif/Book1.gif"
              alt="Learning mascot"
              width={80}
              height={80}
              className="mr-4"
              unoptimized={true}
            />
            <div className="text-left">
              <h3 className="text-xl font-bold text-green-800 mb-1">
                {lessons.length} Lessons Available!
              </h3>
              <p className="text-green-700">
                All lessons are free to learn with our innovative approach to
                language learning.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Image */}
              <div className="h-48 bg-gray-200 relative">
                {lesson.coverImage || lesson.videoThumbnail ? (
                  <img
                    src={lesson.coverImage || lesson.videoThumbnail}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="flex items-center justify-center h-full"
                  style={{ display: lesson.coverImage || lesson.videoThumbnail ? 'none' : 'flex' }}
                >
                  <div className="text-gray-400">
                    [{lesson.category} Lesson]
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {lesson.level}
                </div>
                {lesson.views > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    👁️ {lesson.views} views
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="text-sm text-[#FF7D29] font-medium mb-1">
                  {lesson.category}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                  {lesson.title}
                </h3>

                {lesson.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {lesson.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-3">
                  {lesson.duration && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {lesson.duration}
                    </div>
                  )}
                  {lesson.averageRating > 0 && (
                    <div className="text-xs text-gray-500 flex items-center">
                      ⭐ {lesson.averageRating.toFixed(1)} ({lesson.totalRatings})
                    </div>
                  )}
                </div>

                <div className="flex items-center pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    {lesson.instructor.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">
                      {lesson.instructor}
                    </div>
                    <div className="text-xs text-gray-500">
                      {lesson.instructorTitle}
                    </div>
                  </div>
                  <Link href={`/lessons/${lesson.id}`} className="ml-auto">
                    <button className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white text-sm py-2 px-5 rounded-full font-medium transition-colors">
                      Start
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredLessons.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-2">
              {searchTerm || selectedCategory !== "all" || selectedLevel !== "all"
                ? `No lessons found matching your filters`
                : `No lessons available yet`}
            </p>
            {(searchTerm || selectedCategory !== "all" || selectedLevel !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }}
                className="mt-4 text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
