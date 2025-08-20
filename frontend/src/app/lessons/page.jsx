"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../Components/layout/Header";
import Footer from "../Components/layout/Footer";
import { motion } from "motion/react";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Language learning focused lessons
  const lessons = [
    {
      id: 1,
      title: "Beginner Basics",
      category: "English",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/beginner-basics.png",
      level: "Beginner",
    },
    {
      id: 2,
      title: "Conversation Skills",
      category: "Sinhala",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/conversation.png",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      category: "Tamil",
      instructor: "Prof. James Chen",
      instructorTitle: "Grammar Specialist",
      image: "/images/lessons/grammar.png",
      level: "Beginner",
    },
    {
      id: 4,
      title: "Pronunciation Guide",
      category: "English",
      instructor: "Sarah Thompson",
      instructorTitle: "Accent Coach",
      image: "/images/lessons/pronunciation.png",
      level: "All Levels",
    },
    {
      id: 5,
      title: "Vocabulary Builder",
      category: "Sinhala",
      instructor: "Prof. James Chen",
      instructorTitle: "Language Expert",
      image: "/images/lessons/vocabulary.png",
      level: "Beginner",
    },
    {
      id: 6,
      title: "Cultural Context",
      category: "Tamil",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Cultural Specialist",
      image: "/images/lessons/culture.png",
      level: "Intermediate",
    },
    {
      id: 7,
      title: "Reading Comprehension",
      category: "English",
      instructor: "Sarah Thompson",
      instructorTitle: "Reading Coach",
      image: "/images/lessons/reading.png",
      level: "Advanced",
    },
    {
      id: 8,
      title: "Writing Essentials",
      category: "Sinhala",
      instructor: "Prof. James Chen",
      instructorTitle: "Writing Expert",
      image: "/images/lessons/writing.png",
      level: "Intermediate",
    },
  ];

  // Filter lessons based on search term
  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Search bar */}
        <motion.div
          className="max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
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
        </motion.div>

        {/* Free lesson banner */}
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
                Start Your Language Journey Today!
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
              {/* Image placeholder */}
              <div className="h-48 bg-gray-200 relative">
                {/* If you have actual images, uncomment this */}
                {/* <Image 
                  src={lesson.image} 
                  alt={lesson.title}
                  fill
                  style={{ objectFit: 'cover' }} 
                /> */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400">
                    [{lesson.category} Lesson]
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {lesson.level}
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm text-[#FF7D29] font-medium mb-1">
                  {lesson.category}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {lesson.title}
                </h3>

                <div className="flex items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    {lesson.instructor.charAt(0)}
                  </div>
                  <div>
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

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No lessons found matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-[#FF7D29] hover:text-[#FF9D5C]"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
