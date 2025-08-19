"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../../Components/layout/Header";
import Footer from "../../../Components/layout/Footer";
import { motion } from "motion/react";

const LessonContent = () => {
  const params = useParams();
  const lessonId = parseInt(params.id);
  const [currentModule, setCurrentModule] = useState(1);
  const [progress, setProgress] = useState(0);

  // This would typically come from an API, but for now we'll hardcode the lessons data
  const lessonsData = [
    {
      id: 1,
      title: "Beginner Basics",
      category: "English",
      instructor: "Dr. Maria Rodriguez",
      level: "Beginner",
    },
    {
      id: 2,
      title: "Conversation Skills",
      category: "Sinhala",
      instructor: "Dr. Maria Rodriguez",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      category: "Tamil",
      instructor: "Prof. James Chen",
      level: "Beginner",
    },
    {
      id: 4,
      title: "Pronunciation Guide",
      category: "English",
      instructor: "Sarah Thompson",
      level: "All Levels",
    },
    {
      id: 5,
      title: "Vocabulary Builder",
      category: "Sinhala",
      instructor: "Prof. James Chen",
      level: "Beginner",
    },
    {
      id: 6,
      title: "Cultural Context",
      category: "Tamil",
      instructor: "Dr. Maria Rodriguez",
      level: "Intermediate",
    },
    {
      id: 7,
      title: "Reading Comprehension",
      category: "English",
      instructor: "Sarah Thompson",
      level: "Advanced",
    },
    {
      id: 8,
      title: "Writing Essentials",
      category: "Sinhala",
      instructor: "Prof. James Chen",
      level: "Intermediate",
    },
  ];

  const lesson = lessonsData.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-20 flex-grow text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Lesson not found
          </h1>
          <p className="text-gray-600 mb-8">
            The lesson you're looking for doesn't exist.
          </p>
          <Link href="/Lessons">
            <button className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Back to Lessons
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Sample module content
  const modules = [
    {
      id: 1,
      title: "Introduction to the Basics",
      description: "Learn the foundational concepts of this lesson.",
      content: `
        <h2>Welcome to ${lesson.title}!</h2>
        <p>In this module, you'll learn the essential building blocks of ${lesson.category} language learning. We'll start with the most basic concepts and gradually build your knowledge.</p>
        <p>By the end of this module, you'll be able to understand simple ${lesson.category} phrases and construct basic sentences.</p>
        <h3>Key Concepts:</h3>
        <ul>
          <li>Fundamental vocabulary</li>
          <li>Basic grammar rules</li>
          <li>Pronunciation guidelines</li>
          <li>Simple sentence structures</li>
        </ul>
        <p>Let's get started on your language learning journey!</p>
      `,
    },
    {
      id: 2,
      title: "Core Concepts",
      description: "Dive deeper into the language fundamentals.",
      content: `
        <h2>Core Concepts of ${lesson.category}</h2>
        <p>Now that you understand the basics, let's expand your knowledge with more complex language patterns and vocabulary.</p>
        <p>In this module, we'll focus on building conversational skills and enhancing your understanding of ${lesson.category} grammar.</p>
        <h3>What You'll Learn:</h3>
        <ul>
          <li>Expanded vocabulary for everyday situations</li>
          <li>Intermediate grammar structures</li>
          <li>Common expressions and idioms</li>
          <li>Reading and comprehension skills</li>
        </ul>
        <p>By the end of this module, you'll be able to engage in simple conversations and understand more complex ${lesson.category} content.</p>
      `,
    },
    {
      id: 3,
      title: "Advanced Practice",
      description: "Apply your knowledge through practical exercises.",
      content: `
        <h2>Advanced Practice in ${lesson.category}</h2>
        <p>This module focuses on applying everything you've learned through practical exercises and real-world scenarios.</p>
        <p>We'll work on integrating all your language skills: speaking, listening, reading, and writing.</p>
        <h3>Practice Activities:</h3>
        <ul>
          <li>Role-playing conversational scenarios</li>
          <li>Comprehension exercises with authentic materials</li>
          <li>Writing practice with feedback</li>
          <li>Pronunciation refinement</li>
        </ul>
        <p>By completing this module, you'll gain confidence in using ${lesson.category} in various contexts and be prepared for more advanced study.</p>
      `,
    },
  ];

  const currentModuleContent =
    modules.find((m) => m.id === currentModule) || modules[0];

  const handleModuleChange = (moduleId) => {
    setCurrentModule(moduleId);
    // Calculate progress (simplified version)
    const newProgress = Math.round((moduleId / modules.length) * 100);
    setProgress(newProgress);
  };

  const handleNextModule = () => {
    if (currentModule < modules.length) {
      handleModuleChange(currentModule + 1);
    }
  };

  const handlePrevModule = () => {
    if (currentModule > 1) {
      handleModuleChange(currentModule - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        {/* Course header */}
        <div className="bg-gradient-to-r from-orange-50 to-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-[#FF7D29] font-medium mb-1">
                  {lesson.category} • {lesson.level}
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {lesson.title}
                </h1>
              </div>
              <div>
                <Link href={`/lessons/${lesson.id}`}>
                  <button className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg border border-gray-300 font-medium transition-colors">
                    Back to Overview
                  </button>
                </Link>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  className="bg-[#FF7D29] h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Module navigation */}
            <div className="w-full md:w-1/4">
              <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
                <h3 className="font-bold text-gray-800 mb-4">Course Modules</h3>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => handleModuleChange(module.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentModule === module.id
                          ? "bg-orange-100 text-[#FF7D29]"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            currentModule === module.id
                              ? "bg-[#FF7D29] text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {module.id}
                        </div>
                        <div>
                          <div className="font-medium">{module.title}</div>
                          <div className="text-xs text-gray-500">
                            {module.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="w-full md:w-3/4">
              <motion.div
                key={currentModule}
                className="bg-white rounded-xl shadow-md p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: currentModuleContent.content,
                  }}
                ></div>

                {/* Interactive elements would go here */}
                <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-4">Practice Activity</h3>
                  <p className="mb-4">
                    Try completing this exercise to test your understanding:
                  </p>
                  <div className="p-4 bg-white rounded-lg border border-gray-300 mb-4">
                    <p className="font-medium">Fill in the blanks:</p>
                    <p className="my-3">
                      The _____ is a fundamental part of learning any new _____.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="opt1"
                          name="answer"
                          className="mr-2"
                        />
                        <label htmlFor="opt1">alphabet / language</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="opt2"
                          name="answer"
                          className="mr-2"
                        />
                        <label htmlFor="opt2">vocabulary / skill</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="opt3"
                          name="answer"
                          className="mr-2"
                        />
                        <label htmlFor="opt3">grammar / course</label>
                      </div>
                    </div>
                  </div>
                  <button className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-2 px-6 rounded-lg font-medium transition-colors">
                    Check Answer
                  </button>
                </div>

                {/* Navigation buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handlePrevModule}
                    className={`flex items-center py-2 px-4 rounded-lg font-medium ${
                      currentModule > 1
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={currentModule === 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Previous Module
                  </button>
                  <button
                    onClick={handleNextModule}
                    className={`flex items-center py-2 px-4 rounded-lg font-medium ${
                      currentModule < modules.length
                        ? "bg-[#FF7D29] hover:bg-[#FF9D5C] text-white"
                        : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                    disabled={currentModule === modules.length}
                  >
                    Next Module
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LessonContent;
