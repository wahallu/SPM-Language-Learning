"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterProgress, setFilterProgress] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock data for students enrolled in teacher's courses
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      avatar: null, // You can add avatar URLs later
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
        },
        {
          id: 2,
          title: "Advanced Conversation",
          category: "Spanish",
          progress: 45,
          grade: "B+",
          status: "active",
          completedLessons: 16,
          totalLessons: 36,
          lastActivity: "2024-03-18",
        },
      ],
    },
    {
      id: 2,
      name: "David Chen",
      email: "david.chen@example.com",
      avatar: null,
      enrolledDate: "2024-02-03",
      courses: [
        {
          id: 1,
          title: "Beginner Basics",
          category: "English",
          progress: 62,
          grade: "B",
          status: "active",
          completedLessons: 15,
          totalLessons: 24,
          lastActivity: "2024-03-15",
        },
      ],
    },
    {
      id: 3,
      name: "Emma Williams",
      email: "emma.williams@example.com",
      avatar: null,
      enrolledDate: "2024-01-20",
      courses: [
        {
          id: 4,
          title: "German Grammar Mastery",
          category: "German",
          progress: 100,
          grade: "A+",
          status: "completed",
          completedLessons: 30,
          totalLessons: 30,
          lastActivity: "2024-03-10",
        },
      ],
    },
    {
      id: 4,
      name: "James Brown",
      email: "james.brown@example.com",
      avatar: null,
      enrolledDate: "2024-02-15",
      courses: [
        {
          id: 1,
          title: "Beginner Basics",
          category: "English",
          progress: 32,
          grade: "C+",
          status: "at risk",
          completedLessons: 8,
          totalLessons: 24,
          lastActivity: "2024-03-01",
        },
        {
          id: 2,
          title: "Advanced Conversation",
          category: "Spanish",
          progress: 15,
          grade: "D",
          status: "at risk",
          completedLessons: 5,
          totalLessons: 36,
          lastActivity: "2024-02-25",
        },
      ],
    },
    {
      id: 5,
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      avatar: null,
      enrolledDate: "2024-03-01",
      courses: [
        {
          id: 2,
          title: "Advanced Conversation",
          category: "Spanish",
          progress: 72,
          grade: "B+",
          status: "active",
          completedLessons: 26,
          totalLessons: 36,
          lastActivity: "2024-03-21",
        },
      ],
    },
  ]);

  // Get unique courses for filter dropdown
  const courses = [
    { id: 1, title: "Beginner Basics", category: "English" },
    { id: 2, title: "Advanced Conversation", category: "Spanish" },
    { id: 4, title: "German Grammar Mastery", category: "German" },
  ];

  // Filter students based on search term and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      filterCourse === "all"
        ? true
        : student.courses.some(
            (course) => course.id === parseInt(filterCourse)
          );

    const matchesProgress =
      filterProgress === "all"
        ? true
        : filterProgress === "completed"
        ? student.courses.some((course) => course.progress === 100)
        : filterProgress === "at-risk"
        ? student.courses.some((course) => course.status === "at risk")
        : filterProgress === "active"
        ? student.courses.some(
            (course) => course.status === "active" && course.progress < 100
          )
        : true;

    return matchesSearch && matchesCourse && matchesProgress;
  });

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

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    return "text-red-600";
  };

  const closeStudentDetails = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Students</h1>
          <p className="text-gray-600">
            Manage and track all your students in one place
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          {
            title: "Total Students",
            value: students.length,
            icon: "👥",
            color: "bg-blue-500",
          },
          {
            title: "Active Students",
            value: students.filter((s) =>
              s.courses.some((c) => c.status === "active")
            ).length,
            icon: "🏃",
            color: "bg-green-500",
          },
          {
            title: "Completed Courses",
            value: students.reduce(
              (sum, student) =>
                sum + student.courses.filter((c) => c.progress === 100).length,
              0
            ),
            icon: "🎓",
            color: "bg-purple-500",
          },
          {
            title: "At Risk Students",
            value: students.filter((s) =>
              s.courses.some((c) => c.status === "at risk")
            ).length,
            icon: "⚠️",
            color: "bg-yellow-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}
              >
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.category})
                </option>
              ))}
            </select>

            <select
              value={filterProgress}
              onChange={(e) => setFilterProgress(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
            >
              <option value="all">All Progress</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No students found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredStudents.map((student) => (
                      <motion.tr
                        key={student.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                              {student.avatar ? (
                                <img
                                  src={student.avatar}
                                  alt=""
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <span>{student.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.courses.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.courses.map((c) => c.title).join(", ")
                              .length > 25
                              ? student.courses
                                  .map((c) => c.title)
                                  .join(", ")
                                  .substring(0, 25) + "..."
                              : student.courses.map((c) => c.title).join(", ")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${getProgressColor(
                                  Math.round(
                                    student.courses.reduce(
                                      (sum, course) => sum + course.progress,
                                      0
                                    ) / student.courses.length
                                  )
                                )} h-2 rounded-full`}
                                style={{
                                  width: `${Math.round(
                                    student.courses.reduce(
                                      (sum, course) => sum + course.progress,
                                      0
                                    ) / student.courses.length
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-700">
                              {Math.round(
                                student.courses.reduce(
                                  (sum, course) => sum + course.progress,
                                  0
                                ) / student.courses.length
                              )}
                              %
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.courses.some(
                            (c) => c.status === "at risk"
                          ) ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              At Risk
                            </span>
                          ) : student.courses.every(
                              (c) => c.progress === 100
                            ) ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(student.enrolledDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-[#FF7D29] hover:text-[#FF9D5C]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeStudentDetails}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 top-20 mx-auto z-50 w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-500 mr-4">
                      {selectedStudent.avatar ? (
                        <img
                          src={selectedStudent.avatar}
                          alt=""
                          className="h-16 w-16 rounded-full"
                        />
                      ) : (
                        <span>{selectedStudent.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedStudent.name}
                      </h2>
                      <p className="text-gray-600">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeStudentDetails}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
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

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Enrolled Since</p>
                    <p className="font-medium">
                      {new Date(
                        selectedStudent.enrolledDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Courses Enrolled</p>
                    <p className="font-medium">
                      {selectedStudent.courses.length}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Course Progress
                </h3>

                <div className="space-y-6">
                  {selectedStudent.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {course.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {course.category}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            course.status
                          )}`}
                        >
                          {course.status.charAt(0).toUpperCase() +
                            course.status.slice(1)}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="text-sm font-medium">
                            {course.progress}%
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${getProgressColor(
                              course.progress
                            )} h-2 rounded-full`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Completed Lessons</p>
                          <p className="font-medium">
                            {course.completedLessons}/{course.totalLessons}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Activity</p>
                          <p className="font-medium">
                            {new Date(course.lastActivity).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Grade</p>
                          <p
                            className={`font-medium ${getGradeColor(
                              course.grade
                            )}`}
                          >
                            {course.grade}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href={`/teacher/courses/${course.id}/students/${selectedStudent.id}`}
                          className="text-sm text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
                        >
                          View detailed progress →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={closeStudentDetails}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsPage;
