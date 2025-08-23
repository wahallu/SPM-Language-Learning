"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApiService from "../../../utils/api";

const CourseContentPage = ({ params }) => {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lessonProgress, setLessonProgress] = useState({});

  useEffect(() => {
    // Check authentication first
    const checkAuth = () => {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (!token) {
        console.error("No authentication token found");
        router.push("/login");
        return false;
      }

      return true;
    };

    if (checkAuth() && params.id) {
      fetchCourseData();
    }
  }, [params.id, router]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify authentication before making API calls
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Fetch course details
      const courseResponse = await ApiService.getCourseById(params.id);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      } else {
        throw new Error(courseResponse.message || "Failed to fetch course");
      }

      // Fetch modules and lessons
      const modulesResponse = await ApiService.getModulesByCourse(params.id);
      if (modulesResponse.success) {
        const modulesWithLessons = await Promise.all(
          modulesResponse.data.map(async (module) => {
            try {
              const lessonsResponse = await ApiService.getLessonsByModule(
                module.id
              );
              return {
                ...module,
                lessons: lessonsResponse.success ? lessonsResponse.data : [],
              };
            } catch (error) {
              console.warn(
                `Failed to fetch lessons for module ${module.id}:`,
                error
              );
              return { ...module, lessons: [] };
            }
          })
        );

        setModules(modulesWithLessons);

        // Set first lesson as current if available
        if (
          modulesWithLessons.length > 0 &&
          modulesWithLessons[0].lessons.length > 0
        ) {
          setCurrentModule(modulesWithLessons[0]);
          setCurrentLesson(modulesWithLessons[0].lessons[0]);
        }
      } else {
        throw new Error(modulesResponse.message || "Failed to fetch modules");
      }
    } catch (error) {
      console.error("Error fetching course data:", error);

      // Handle authentication errors
      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        console.warn("Authentication failed, redirecting to login");
        localStorage.clear();
        router.push("/login");
        return;
      }

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectLesson = (module, lesson) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
  };

  const markLessonComplete = (lessonId) => {
    setLessonProgress((prev) => ({
      ...prev,
      [lessonId]: { completed: true, completedAt: new Date() },
    }));
  };

  const getNextLesson = () => {
    if (!currentModule || !currentLesson) return null;

    const currentModuleIndex = modules.findIndex(
      (m) => m.id === currentModule.id
    );
    const currentLessonIndex = currentModule.lessons.findIndex(
      (l) => l.id === currentLesson.id
    );

    // Next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      return {
        module: currentModule,
        lesson: currentModule.lessons[currentLessonIndex + 1],
      };
    }

    // First lesson of next module
    if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0) {
        return {
          module: nextModule,
          lesson: nextModule.lessons[0],
        };
      }
    }

    return null;
  };

  const getPreviousLesson = () => {
    if (!currentModule || !currentLesson) return null;

    const currentModuleIndex = modules.findIndex(
      (m) => m.id === currentModule.id
    );
    const currentLessonIndex = currentModule.lessons.findIndex(
      (l) => l.id === currentLesson.id
    );

    // Previous lesson in current module
    if (currentLessonIndex > 0) {
      return {
        module: currentModule,
        lesson: currentModule.lessons[currentLessonIndex - 1],
      };
    }

    // Last lesson of previous module
    if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      if (prevModule.lessons.length > 0) {
        return {
          module: prevModule,
          lesson: prevModule.lessons[prevModule.lessons.length - 1],
        };
      }
    }

    return null;
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
          <p className="text-gray-600">Loading course content...</p>
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
            Error Loading Course
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={`/courses/${params.id}`}
            className="px-6 py-2 bg-[#FF7D29] text-white rounded-lg hover:bg-[#FF9D5C] transition-colors"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Link
                  href={`/courses/${params.id}`}
                  className="text-[#FF7D29] hover:text-[#FF9D5C] transition-colors"
                >
                  ← Back to Course
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mt-2 truncate">
                {course.title}
              </h2>
            </div>

            {/* Course Content */}
            <div className="flex-1 overflow-y-auto">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="border-b border-gray-100">
                  <div className="p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {module.lessons?.length || 0} lessons
                    </p>
                  </div>

                  {module.lessons && module.lessons.length > 0 && (
                    <div className="divide-y divide-gray-100">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isActive = currentLesson?.id === lesson.id;
                        const isCompleted =
                          lessonProgress[lesson.id]?.completed;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(module, lesson)}
                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                              isActive
                                ? "bg-[#FF7D29] bg-opacity-10 border-r-2 border-[#FF7D29]"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                                      isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                        ? "bg-[#FF7D29] text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {isCompleted ? "✓" : lessonIndex + 1}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <h4
                                      className={`text-sm font-medium truncate ${
                                        isActive
                                          ? "text-[#FF7D29]"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {lesson.title}
                                    </h4>
                                    {lesson.duration && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {lesson.duration}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {lesson.type && (
                                <span className="ml-2 text-gray-400">
                                  {lesson.type === "VIDEO"
                                    ? "📹"
                                    : lesson.type === "READING"
                                    ? "📖"
                                    : lesson.type === "QUIZ"
                                    ? "❓"
                                    : "📄"}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded hover:bg-gray-100 mr-4"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              )}

              {currentModule && currentLesson && (
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {currentLesson.title}
                  </h1>
                  <p className="text-sm text-gray-600">{currentModule.title}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {previousLesson && (
                <button
                  onClick={() =>
                    selectLesson(previousLesson.module, previousLesson.lesson)
                  }
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Previous
                </button>
              )}

              {currentLesson &&
                !lessonProgress[currentLesson.id]?.completed && (
                  <button
                    onClick={() => markLessonComplete(currentLesson.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Mark Complete
                  </button>
                )}

              {nextLesson && (
                <button
                  onClick={() =>
                    selectLesson(nextLesson.module, nextLesson.lesson)
                  }
                  className="px-4 py-2 bg-[#FF7D29] text-white rounded hover:bg-[#FF9D5C] transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto p-8">
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                {/* Lesson Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {currentLesson.title}
                  </h1>

                  {currentLesson.description && (
                    <p className="text-gray-600 mb-6">
                      {currentLesson.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {currentLesson.type && (
                      <span className="flex items-center">
                        <span className="mr-1">
                          {currentLesson.type === "VIDEO"
                            ? "📹"
                            : currentLesson.type === "READING"
                            ? "📖"
                            : currentLesson.type === "QUIZ"
                            ? "❓"
                            : "📄"}
                        </span>
                        {currentLesson.type}
                      </span>
                    )}

                    {currentLesson.duration && (
                      <span>⏱️ {currentLesson.duration}</span>
                    )}

                    {currentLesson.difficulty && (
                      <span>📊 {currentLesson.difficulty}</span>
                    )}
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="prose max-w-none">
                  {currentLesson.content ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentLesson.content,
                      }}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-4">📝</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Lesson content coming soon
                      </h3>
                      <p className="text-gray-600">
                        This lesson is being prepared by your instructor.
                      </p>
                    </div>
                  )}
                </div>

                {/* Lesson Navigation */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
                  {previousLesson ? (
                    <button
                      onClick={() =>
                        selectLesson(
                          previousLesson.module,
                          previousLesson.lesson
                        )
                      }
                      className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous Lesson
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {nextLesson && (
                    <button
                      onClick={() =>
                        selectLesson(nextLesson.module, nextLesson.lesson)
                      }
                      className="flex items-center px-6 py-3 bg-[#FF7D29] text-white rounded-lg hover:bg-[#FF9D5C] transition-colors"
                    >
                      Next Lesson
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a lesson to start learning
                </h3>
                <p className="text-gray-600">
                  Choose a lesson from the sidebar to begin your learning
                  journey.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;
