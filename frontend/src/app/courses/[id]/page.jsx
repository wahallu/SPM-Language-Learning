"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import ApiService from "../../utils/api";

const CourseDetailsPage = ({ params }) => {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchCourseDetails();
      fetchCourseModules();
    }
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await ApiService.getCourseById(params.id);

      if (response.success) {
        setCourse(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch course details");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      setError(error.message);
    }
  };

  const fetchCourseModules = async () => {
    try {
      const response = await ApiService.getModulesByCourse(params.id);

      if (response.success) {
        // Fetch lessons for each module
        const modulesWithLessons = await Promise.all(
          response.data.map(async (module) => {
            try {
              const lessonsResponse = await ApiService.getLessonsByModule(
                module.id
              );
              return {
                ...module,
                lessons: lessonsResponse.success ? lessonsResponse.data : [],
              };
            } catch (error) {
              console.error(
                `Error fetching lessons for module ${module.id}:`,
                error
              );
              return {
                ...module,
                lessons: [],
              };
            }
          })
        );

        setModules(modulesWithLessons);
      } else {
        console.warn("Failed to fetch modules:", response.message);
        setModules([]);
      }
    } catch (error) {
      console.error("Error fetching course modules:", error);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested course could not be found."}
          </p>
          <Link
            href="/courses"
            className="px-6 py-2 bg-[#FF7D29] text-white rounded-lg hover:bg-[#FF9D5C] transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce(
    (total, module) => total + (module.lessons?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {course.title}
              </h1>

              <p className="text-xl mb-8 text-white text-opacity-90">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">📚</span>
                  <span>{modules.length} Modules</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📖</span>
                  <span>{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📊</span>
                  <span>{course.level || "Beginner"}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👨‍🏫</span>
                  <span>By {course.instructorName || "Instructor"}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden bg-white bg-opacity-10 backdrop-blur-sm">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-8xl">📖</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "curriculum", label: "Curriculum" },
              { id: "instructor", label: "Instructor" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-[#FF7D29] text-[#FF7D29]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About This Course
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>

                  {course.learningObjectives && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        What You'll Learn
                      </h3>
                      <ul className="space-y-2">
                        {course.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#FF7D29] mr-2">✓</span>
                            <span className="text-gray-600">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.requirements && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {course.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span className="text-gray-600">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "curriculum" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <div
                      key={module.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Module {moduleIndex + 1}: {module.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {module.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{module.lessons?.length || 0} lessons</span>
                              {module.duration && (
                                <span>{module.duration}</span>
                              )}
                            </div>
                          </div>
                          <motion.svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{
                              rotate: expandedModule === module.id ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </motion.svg>
                        </div>
                      </button>

                      {expandedModule === module.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 bg-gray-50"
                        >
                          <div className="p-6">
                            {module.lessons && module.lessons.length > 0 ? (
                              <div className="space-y-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center justify-between p-3 bg-white rounded border"
                                  >
                                    <div className="flex items-center">
                                      <span className="text-gray-400 mr-3">
                                        📹
                                      </span>
                                      <div>
                                        <h4 className="font-medium text-gray-900">
                                          {lessonIndex + 1}. {lesson.title}
                                        </h4>
                                        {lesson.description && (
                                          <p className="text-sm text-gray-600">
                                            {lesson.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      {lesson.duration && (
                                        <span>{lesson.duration}</span>
                                      )}
                                      {lesson.status === "PUBLISHED" && (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                          Published
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">
                                No lessons available in this module yet.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {modules.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <div className="text-gray-400 text-4xl mb-4">📚</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No modules available
                      </h3>
                      <p className="text-gray-600">
                        This course curriculum is being prepared.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "instructor" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Meet Your Instructor
                </h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FF7D29] to-[#FF9D5C] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {course.instructorName
                        ? course.instructorName.charAt(0).toUpperCase()
                        : "I"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {course.instructorName || "Course Instructor"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {course.instructorBio ||
                          "Experienced educator passionate about helping students achieve their learning goals."}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>📚 Expert in {course.category}</span>
                        <span>🎓 Years of teaching experience</span>
                        <span>⭐ Highly rated instructor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Information
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">
                    {course.level || "Beginner"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{course.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Modules:</span>
                  <span className="font-medium">{modules.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons:</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>

                {course.estimatedDuration && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {course.estimatedDuration}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      course.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status || "Draft"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href={`/courses/${course.id}/content`}
                  className="block w-full text-center py-3 bg-[#FF7D29] text-white rounded-lg hover:bg-[#FF9D5C] transition-colors font-medium"
                >
                  Start Learning
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
