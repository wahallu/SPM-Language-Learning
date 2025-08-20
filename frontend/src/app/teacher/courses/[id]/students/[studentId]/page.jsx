"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";

const StudentProgressPage = ({ params }) => {
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data fetch - in a real app, this would be an API call
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Find student and course data
      const mockStudent = {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        avatar: null,
        enrolledDate: "2024-01-15",
        courses: [
          {
            id: 1,
            title: "Beginner Basics",
            category: "English",
            progress: 85,
            grade: "A",
            status: "active",
            completedLessons: 20,
            totalLessons: 24,
            lastActivity: "2024-03-20",
            modules: [
              {
                id: 1,
                title: "Introduction to English",
                progress: 100,
                completedLessons: 6,
                totalLessons: 6,
                quizScores: [90, 85, 95],
                assignments: [
                  {
                    title: "Basic Intro",
                    score: 18,
                    totalPoints: 20,
                    submittedDate: "2024-01-20",
                  },
                  {
                    title: "Vocabulary Quiz",
                    score: 45,
                    totalPoints: 50,
                    submittedDate: "2024-01-25",
                  },
                ],
              },
              {
                id: 2,
                title: "Basic Grammar",
                progress: 80,
                completedLessons: 8,
                totalLessons: 10,
                quizScores: [75, 82, 88],
                assignments: [
                  {
                    title: "Grammar Exercise",
                    score: 36,
                    totalPoints: 40,
                    submittedDate: "2024-02-10",
                  },
                  {
                    title: "Sentence Structure",
                    score: 28,
                    totalPoints: 30,
                    submittedDate: "2024-02-15",
                  },
                ],
              },
              {
                id: 3,
                title: "Conversational Skills",
                progress: 75,
                completedLessons: 6,
                totalLessons: 8,
                quizScores: [80, 85],
                assignments: [
                  {
                    title: "Dialog Practice",
                    score: 42,
                    totalPoints: 50,
                    submittedDate: "2024-03-05",
                  },
                ],
              },
            ],
            activityLog: [
              {
                date: "2024-03-20",
                activity: "Completed lesson: Advanced Conversation Techniques",
                duration: 45,
              },
              {
                date: "2024-03-18",
                activity: "Submitted assignment: Dialog Practice",
                duration: 30,
              },
              {
                date: "2024-03-15",
                activity: "Quiz completed: Conversational Phrases",
                score: "85%",
              },
              {
                date: "2024-03-10",
                activity: "Completed lesson: Grammar Essentials",
                duration: 35,
              },
              {
                date: "2024-03-05",
                activity: "Started module: Conversational Skills",
                duration: 20,
              },
              {
                date: "2024-02-28",
                activity: "Completed module: Basic Grammar",
                duration: null,
              },
              {
                date: "2024-02-15",
                activity: "Submitted assignment: Sentence Structure",
                duration: 40,
              },
              {
                date: "2024-02-10",
                activity: "Submitted assignment: Grammar Exercise",
                duration: 35,
              },
              {
                date: "2024-01-30",
                activity: "Completed module: Introduction to English",
                duration: null,
              },
              {
                date: "2024-01-25",
                activity: "Submitted assignment: Vocabulary Quiz",
                duration: 45,
              },
              {
                date: "2024-01-20",
                activity: "Submitted assignment: Basic Intro",
                duration: 25,
              },
              {
                date: "2024-01-15",
                activity: "Course enrollment",
                duration: null,
              },
            ],
            strengths: [
              "Vocabulary",
              "Reading comprehension",
              "Consistent participation",
            ],
            areasForImprovement: ["Grammar usage", "Speaking fluency"],
            notes:
              "Sarah is a dedicated student who consistently completes assignments on time. She excels in reading and vocabulary, but could benefit from more speaking practice.",
          },
        ],
      };

      // Find the course that matches the ID from params
      const foundCourse = mockStudent.courses.find(
        (c) => c.id === parseInt(params.id)
      );

      setStudent(mockStudent);
      setCourse(foundCourse);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [params.id, params.studentId]);

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "at risk":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeColor = (grade) => {
    if (grade?.startsWith("A")) return "text-green-600";
    if (grade?.startsWith("B")) return "text-blue-600";
    if (grade?.startsWith("C")) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF7D29] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student || !course) {
    return (
      <div className="p-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Student or course not found
        </h3>
        <p className="text-gray-600 mb-6">
          We couldn't find the requested student or course information.
        </p>
        <Link
          href="/teacher/students"
          className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
        >
          Return to students list
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "modules", label: "Modules Progress", icon: "📚" },
    { id: "activity", label: "Activity Log", icon: "📝" },
    { id: "feedback", label: "Feedback", icon: "💬" },
  ];

  // Calculate average quiz score
  const allQuizScores = course.modules.flatMap((module) => module.quizScores);
  const averageQuizScore = allQuizScores.length
    ? Math.round(
        allQuizScores.reduce((sum, score) => sum + score, 0) /
          allQuizScores.length
      )
    : 0;

  // Calculate assignment completion
  const totalAssignments = course.modules.reduce(
    (sum, module) => sum + module.assignments.length,
    0
  );
  const assignmentCompletionRate = totalAssignments ? 100 : 0; // In this mock data, all assignments are completed

  return (
    <div className="space-y-8">
      {/* Header with student and course info */}
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Link
                  href="/teacher/students"
                  className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
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
                  Back to Students
                </Link>
              </div>

              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl mr-4">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt=""
                      className="h-14 w-14 rounded-full"
                    />
                  ) : (
                    <span>{student.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{student.name}</h1>
                  <p className="text-orange-100">{student.email}</p>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4 mt-4">
                <div className="text-lg font-semibold mb-2">
                  Course: {course.title}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-orange-100">Progress</p>
                    <p className="font-semibold">{course.progress}%</p>
                  </div>
                  <div>
                    <p className="text-orange-100">Grade</p>
                    <p className="font-semibold">{course.grade}</p>
                  </div>
                  <div>
                    <p className="text-orange-100">Status</p>
                    <p className="font-semibold capitalize">{course.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#FF7D29] border-b-2 border-[#FF7D29] bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Progress Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Overall Progress</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {course.progress}%
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${getProgressColor(
                        course.progress
                      )} rounded-xl flex items-center justify-center text-white text-xl`}
                    >
                      📊
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getProgressColor(
                        course.progress
                      )} h-2 rounded-full`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Completed Lessons</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {course.completedLessons}/{course.totalLessons}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                      📚
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (course.completedLessons / course.totalLessons) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Quiz Average</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {averageQuizScore}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                      🧠
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${averageQuizScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Assignments</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {assignmentCompletionRate}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                      ✅
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${assignmentCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Last Activity & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {course.activityLog.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-[#FF7D29] flex-shrink-0">
                          {activity.activity.includes("Completed")
                            ? "✅"
                            : activity.activity.includes("Submitted")
                            ? "📝"
                            : activity.activity.includes("Quiz")
                            ? "❓"
                            : activity.activity.includes("Started")
                            ? "🏁"
                            : activity.activity.includes("enrollment")
                            ? "🎓"
                            : "🔄"}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">
                            {activity.activity}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                            {activity.duration && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                {activity.duration} mins
                              </span>
                            )}
                            {activity.score && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Score: {activity.score}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <button
                      onClick={() => setActiveTab("activity")}
                      className="text-sm text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
                    >
                      View full activity log →
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Performance Summary
                  </h3>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {course.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-800"
                        >
                          <span className="text-green-500">✓</span> {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {course.areasForImprovement.map((area, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-800"
                        >
                          <span className="text-yellow-500">!</span> {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setActiveTab("feedback")}
                      className="text-sm text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
                    >
                      View detailed feedback →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Modules Progress Tab */}
          {activeTab === "modules" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Module Progress
                </h2>
                <p className="text-gray-600">
                  Detailed breakdown of student progress through each course
                  module
                </p>
              </div>

              <div className="space-y-6">
                {course.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-[#FF7D29] font-semibold">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {module.title}
                            </h3>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {module.completedLessons}/{module.totalLessons}{" "}
                              lessons completed
                            </span>
                            <span>{module.progress}% complete</span>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            module.progress === 100
                              ? "bg-green-100 text-green-800"
                              : module.progress >= 50
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {module.progress === 100
                            ? "Completed"
                            : "In Progress"}
                        </div>
                      </div>

                      <div className="mb-6 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`${getProgressColor(
                            module.progress
                          )} h-2.5 rounded-full`}
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quiz Scores */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Quiz Scores
                          </h4>
                          {module.quizScores.length > 0 ? (
                            <div className="space-y-3">
                              {module.quizScores.map((score, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3"
                                >
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className={`${
                                        score >= 90
                                          ? "bg-green-500"
                                          : score >= 75
                                          ? "bg-blue-500"
                                          : score >= 60
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      } h-2.5 rounded-full`}
                                      style={{ width: `${score}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-700 min-w-[40px]">
                                    {score}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No quiz data available
                            </p>
                          )}
                        </div>

                        {/* Assignments */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Assignments
                          </h4>
                          {module.assignments.length > 0 ? (
                            <div className="space-y-3">
                              {module.assignments.map((assignment, i) => (
                                <div
                                  key={i}
                                  className="border border-gray-200 rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-gray-800">
                                      {assignment.title}
                                    </p>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        assignment.score /
                                          assignment.totalPoints >=
                                        0.9
                                          ? "bg-green-100 text-green-800"
                                          : assignment.score /
                                              assignment.totalPoints >=
                                            0.75
                                          ? "bg-blue-100 text-blue-800"
                                          : assignment.score /
                                              assignment.totalPoints >=
                                            0.6
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {assignment.score}/
                                      {assignment.totalPoints}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Submitted on{" "}
                                    {new Date(
                                      assignment.submittedDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No assignments available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Activity Log
                </h2>
                <p className="text-gray-600">
                  Complete history of student's activities in this course
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6 pl-16 relative">
                  {course.activityLog.map((activity, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-[-3rem] w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-[#FF7D29]">
                        {activity.activity.includes("Completed")
                          ? "✅"
                          : activity.activity.includes("Submitted")
                          ? "📝"
                          : activity.activity.includes("Quiz")
                          ? "❓"
                          : activity.activity.includes("Started")
                          ? "🏁"
                          : activity.activity.includes("enrollment")
                          ? "🎓"
                          : "🔄"}
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-800">
                            {activity.activity}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {activity.duration && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              Duration: {activity.duration} mins
                            </span>
                          )}
                          {activity.score && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Score: {activity.score}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Feedback & Notes
                </h2>
                <p className="text-gray-600">
                  Instructor feedback and notes for this student
                </p>
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-green-500">✓</span> Strengths
                  </h3>
                  <ul className="space-y-4">
                    {course.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">
                            {strength}
                          </p>
                          <p className="text-sm text-gray-600">
                            {strength === "Vocabulary" &&
                              "Strong grasp of new vocabulary terms, consistently scoring high on vocabulary quizzes."}
                            {strength === "Reading comprehension" &&
                              "Excellent understanding of reading materials, able to answer complex questions about text content."}
                            {strength === "Consistent participation" &&
                              "Regular course activity and participation, rarely misses assignments or deadlines."}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">!</span> Areas for
                    Improvement
                  </h3>
                  <ul className="space-y-4">
                    {course.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 flex-shrink-0 mt-0.5">
                          !
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{area}</p>
                          <p className="text-sm text-gray-600">
                            {area === "Grammar usage" &&
                              "Struggles with consistent application of grammar rules, particularly with verb tenses and prepositions."}
                            {area === "Speaking fluency" &&
                              "Hesitates during speaking exercises, needs more practice with spontaneous conversation."}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructor Notes */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-blue-500">📝</span> Instructor Notes
                </h3>
                <div className="bg-blue-50 border-l-4 border-blue-300 p-4 rounded-r-lg">
                  <p className="text-gray-800">{course.notes}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Last updated: March 22, 2024
                  </p>
                </div>

                {/* Add Note Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Add New Note
                  </h4>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                    rows={4}
                    placeholder="Enter your notes about this student's progress..."
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FF9D5C] transition-all">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-purple-500">📋</span> Suggested Action
                  Items
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-[#FF7D29] border-gray-300 rounded focus:ring-[#FF7D29]"
                    />
                    <span className="text-gray-800">
                      Recommend additional speaking practice resources
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-[#FF7D29] border-gray-300 rounded focus:ring-[#FF7D29]"
                    />
                    <span className="text-gray-800">
                      Schedule 1:1 session to review grammar concepts
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-[#FF7D29] border-gray-300 rounded focus:ring-[#FF7D29]"
                    />
                    <span className="text-gray-800">
                      Provide additional conversation practice exercises
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked
                      className="w-5 h-5 text-[#FF7D29] border-gray-300 rounded focus:ring-[#FF7D29]"
                    />
                    <span className="text-gray-800 line-through">
                      Send encouragement message for consistent participation
                    </span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <input
                    type="text"
                    placeholder="Add new action item..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent mr-3"
                  />
                  <button className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FF9D5C] transition-all">
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProgressPage;
