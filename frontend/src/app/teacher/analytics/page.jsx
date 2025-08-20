"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const TeacherAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedCourse, setSelectedCourse] = useState("all");

  // Mock data for analytics
  const [stats] = useState({
    totalStudents: 346,
    activeStudents: 258,
    completionRate: 72,
    avgEngagement: 83,
    totalRevenue: 37348,
    growthRate: 18,
    totalCourses: 4,
  });

  const [courses] = useState([
    {
      id: 1,
      title: "Beginner Basics",
      category: "English",
      students: 156,
      completionRate: 78,
      rating: 4.8,
      revenue: 15444,
      growth: 12,
      enrollmentTrend: [35, 42, 50, 55, 62, 75, 81, 92, 105, 120, 138, 156],
    },
    {
      id: 2,
      title: "Advanced Conversation",
      category: "Spanish",
      students: 89,
      completionRate: 65,
      rating: 4.9,
      revenue: 13261,
      growth: 24,
      enrollmentTrend: [12, 18, 25, 32, 38, 45, 52, 60, 68, 75, 82, 89],
    },
    {
      id: 3,
      title: "Business French",
      category: "French",
      students: 34,
      completionRate: 45,
      rating: 4.2,
      revenue: 0,
      growth: 0,
      enrollmentTrend: [0, 5, 8, 12, 15, 18, 22, 25, 28, 30, 32, 34],
    },
    {
      id: 4,
      title: "German Grammar Mastery",
      category: "German",
      students: 67,
      completionRate: 70,
      rating: 4.7,
      revenue: 8643,
      growth: 8,
      enrollmentTrend: [20, 24, 28, 32, 36, 40, 45, 50, 55, 60, 64, 67],
    },
  ]);

  // Dummy data for graphs
  const [chartData] = useState({
    enrollmentsByMonth: [
      125, 148, 172, 195, 210, 235, 260, 278, 298, 315, 330, 346,
    ],
    revenueByMonth: [
      2100, 2800, 4500, 5800, 7500, 9200, 12000, 15500, 19000, 24500, 30000,
      37348,
    ],
    completionRateByMonth: [62, 65, 68, 70, 68, 72, 75, 73, 72, 70, 71, 72],
    courseEnrollmentDistribution: [45, 26, 10, 19], // percentages for each course
    studentActivity: {
      daily: [25, 32, 28, 35, 40, 38, 42],
      weekly: [150, 180, 200, 190],
      monthly: [580, 620, 680, 720, 750, 780],
    },
    quizPerformance: {
      excellent: 35,
      good: 42,
      average: 18,
      poor: 5,
    },
  });

  // Helper function to get filtered course data
  const getFilteredData = () => {
    if (selectedCourse === "all") {
      return {
        students: stats.totalStudents,
        completionRate: stats.completionRate,
        revenue: stats.totalRevenue,
        enrollmentTrend: chartData.enrollmentsByMonth,
      };
    } else {
      const course = courses.find((c) => c.id === parseInt(selectedCourse));
      return {
        students: course.students,
        completionRate: course.completionRate,
        revenue: course.revenue,
        enrollmentTrend: course.enrollmentTrend,
      };
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-[#FF7D29] to-[#FF9D5C] rounded-2xl p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-orange-100 text-lg">
                Track your teaching performance and student engagement
              </p>
            </div>
            <div className="flex gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white bg-opacity-20 border border-white border-opacity-30 text-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-medium"
              >
                <option value="7d" className="text-gray-800">
                  Last 7 days
                </option>
                <option value="30d" className="text-gray-800">
                  Last 30 days
                </option>
                <option value="90d" className="text-gray-800">
                  Last 90 days
                </option>
                <option value="year" className="text-gray-800">
                  Last 12 months
                </option>
              </select>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-white bg-opacity-20 border border-white border-opacity-30 text-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-medium"
              >
                <option value="all" className="text-gray-800">
                  All Courses
                </option>
                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                    className="text-gray-800"
                  >
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div>
              <p className="text-orange-200">Total Students</p>
              <p className="font-semibold text-2xl">{filteredData.students}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-300 text-sm">
                  ↑ {stats.growthRate}%
                </span>
                <span className="text-orange-200 text-xs ml-2">
                  vs last period
                </span>
              </div>
            </div>
            <div>
              <p className="text-orange-200">Completion Rate</p>
              <p className="font-semibold text-2xl">
                {filteredData.completionRate}%
              </p>
              <div className="flex items-center mt-1">
                <span className="text-green-300 text-sm">↑ 5%</span>
                <span className="text-orange-200 text-xs ml-2">
                  vs last period
                </span>
              </div>
            </div>
            <div>
              <p className="text-orange-200">Engagement Score</p>
              <p className="font-semibold text-2xl">
                {stats.avgEngagement}/100
              </p>
              <div className="flex items-center mt-1">
                <span className="text-green-300 text-sm">↑ 7%</span>
                <span className="text-orange-200 text-xs ml-2">
                  vs last period
                </span>
              </div>
            </div>
            <div>
              <p className="text-orange-200">Revenue</p>
              <p className="font-semibold text-2xl">
                ${filteredData.revenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-green-300 text-sm">↑ 15%</span>
                <span className="text-orange-200 text-xs ml-2">
                  vs last period
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        {/* <div className="absolute top-0 right-0 w-64 h-64 bg-black bg-opacity-10 rounded-full -translate-y-32 translate-x-32"></div> */}
      </motion.div>

      {/* Course Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrollment Trend Graph */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Student Enrollment Trend
          </h2>

          <div className="h-72 relative">
            <div className="absolute inset-0 flex items-end">
              {filteredData.enrollmentTrend.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <motion.div
                    className="w-4/5 bg-[#FF7D29] rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{
                      height: `${
                        (value / Math.max(...filteredData.enrollmentTrend)) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  ></motion.div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
              {timeRange === "year" ? (
                <>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </>
              ) : timeRange === "30d" ? (
                Array.from({ length: 12 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))
              ) : (
                Array.from({ length: 12 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <div>
              <span className="font-medium">Total Students:</span>{" "}
              {filteredData.students}
            </div>
            <div>
              <span className="font-medium">Growth Rate:</span>{" "}
              {stats.growthRate}%
            </div>
          </div>
        </motion.div>

        {/* Course Completion Rate */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Completion Rates
          </h2>

          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {course.title}
                  </span>
                  <span className="text-sm text-gray-600">
                    {course.completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      course.completionRate > 75
                        ? "bg-green-500"
                        : course.completionRate > 50
                        ? "bg-[#FF7D29]"
                        : "bg-red-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.completionRate}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Overall Rate:</span>{" "}
                {stats.completionRate}%
              </div>
              <div>
                <span className="font-medium">Target:</span> 80%
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Student Activity & Revenue Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Graph */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Revenue Trend
          </h2>

          <div className="h-72 relative">
            <div className="absolute inset-0">
              <svg viewBox="0 0 1200 300" className="w-full h-full">
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FF7D29" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FF7D29" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <motion.path
                  d={`M0,300 
                    ${chartData.revenueByMonth
                      .map(
                        (d, i) =>
                          `L${i * 100},${
                            300 -
                            (d /
                              chartData.revenueByMonth[
                                chartData.revenueByMonth.length - 1
                              ]) *
                              250
                          }`
                      )
                      .join(" ")} 
                    L1100,300 Z`}
                  fill="url(#gradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />

                {/* Line */}
                <motion.path
                  d={`M0,${
                    300 -
                    (chartData.revenueByMonth[0] /
                      chartData.revenueByMonth[
                        chartData.revenueByMonth.length - 1
                      ]) *
                      250
                  } 
                    ${chartData.revenueByMonth
                      .map(
                        (d, i) =>
                          `L${i * 100},${
                            300 -
                            (d /
                              chartData.revenueByMonth[
                                chartData.revenueByMonth.length - 1
                              ]) *
                              250
                          }`
                      )
                      .join(" ")}`}
                  stroke="#FF7D29"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />

                {/* Points */}
                {chartData.revenueByMonth.map((d, i) => (
                  <motion.circle
                    key={i}
                    cx={i * 100}
                    cy={
                      300 -
                      (d /
                        chartData.revenueByMonth[
                          chartData.revenueByMonth.length - 1
                        ]) *
                        250
                    }
                    r="6"
                    fill="#FF7D29"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                  />
                ))}
              </svg>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
              {timeRange === "year" ? (
                <>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </>
              ) : (
                Array.from({ length: 12 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <div>
              <span className="font-medium">Total Revenue:</span> $
              {stats.totalRevenue.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Avg. Per Student:</span> $
              {Math.round(stats.totalRevenue / stats.totalStudents)}
            </div>
          </div>
        </motion.div>

        {/* Quiz Performance */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Quiz Performance
          </h2>

          <div className="relative h-56 w-56 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
              77%
            </div>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Excellent */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="12"
                strokeDasharray={`${
                  chartData.quizPerformance.excellent * 2.51
                } ${251 - chartData.quizPerformance.excellent * 2.51}`}
                strokeDashoffset="0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />

              {/* Good */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FF7D29"
                strokeWidth="12"
                strokeDasharray={`${chartData.quizPerformance.good * 2.51} ${
                  251 - chartData.quizPerformance.good * 2.51
                }`}
                strokeDashoffset={`${-(
                  chartData.quizPerformance.excellent * 2.51
                )}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              {/* Average */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="12"
                strokeDasharray={`${chartData.quizPerformance.average * 2.51} ${
                  251 - chartData.quizPerformance.average * 2.51
                }`}
                strokeDashoffset={`${-(
                  (chartData.quizPerformance.excellent +
                    chartData.quizPerformance.good) *
                  2.51
                )}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />

              {/* Poor */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#EF4444"
                strokeWidth="12"
                strokeDasharray={`${chartData.quizPerformance.poor * 2.51} ${
                  251 - chartData.quizPerformance.poor * 2.51
                }`}
                strokeDashoffset={`${-(
                  (chartData.quizPerformance.excellent +
                    chartData.quizPerformance.good +
                    chartData.quizPerformance.average) *
                  2.51
                )}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Excellent ({chartData.quizPerformance.excellent}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FF7D29] rounded-full"></div>
              <span className="text-sm text-gray-600">
                Good ({chartData.quizPerformance.good}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Average ({chartData.quizPerformance.average}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Poor ({chartData.quizPerformance.poor}%)
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Course Comparisons */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Course Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Course
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Students
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Completion
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Avg. Rating
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Revenue
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Growth
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <motion.tr
                  key={course.id}
                  className="border-b border-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.5 }}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg mr-3">
                        📚
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {course.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {course.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{course.students}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          course.completionRate >= 70
                            ? "bg-green-500"
                            : course.completionRate >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {course.completionRate}%
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {course.rating}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    ${course.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={
                        course.growth > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {course.growth > 0 ? "↑" : "↓"} {Math.abs(course.growth)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/teacher/courses/${course.id}/analytics`}
                      className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Student Engagement */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Student Engagement Insights
          </h2>

          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#FF7D29] text-white text-sm rounded-lg">
              Daily
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
              Weekly
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Activity by Time of Day
            </h3>

            <div className="h-60 relative">
              <div className="absolute inset-0 flex items-end">
                {[
                  35, 42, 60, 75, 82, 68, 50, 40, 55, 65, 58, 42, 38, 45, 52,
                  58, 70, 85, 65, 52, 45, 38, 32, 28,
                ].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <motion.div
                      className="w-3/4 bg-blue-500 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${value}%` }}
                      transition={{ duration: 0.5, delay: index * 0.02 }}
                    ></motion.div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                <span>12am</span>
                <span>6am</span>
                <span>12pm</span>
                <span>6pm</span>
                <span>12am</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Peak hours:</span> 6-8 PM
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Avg. session duration:</span> 42
                minutes
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Content Engagement
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Video Lessons
                  </span>
                  <span className="text-sm text-gray-600">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Quizzes
                  </span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-[#FF7D29] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Reading Materials
                  </span>
                  <span className="text-sm text-gray-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Discussion Forums
                  </span>
                  <span className="text-sm text-gray-600">64%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "64%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Assignments
                  </span>
                  <span className="text-sm text-gray-600">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-yellow-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Improvement Suggestions */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Suggested Improvements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl mb-4">
              📹
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Add More Videos
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Students in "Business French" course spend 3x more time on video
              content than reading materials.
            </p>
            <Link
              href="#"
              className="text-[#FF7D29] hover:text-[#FF9D5C] text-sm font-medium"
            >
              Learn more
            </Link>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl mb-4">
              ⏱️
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Optimize Lesson Duration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Completion rates are 35% higher for lessons under 15 minutes
              compared to longer content.
            </p>
            <Link
              href="#"
              className="text-[#FF7D29] hover:text-[#FF9D5C] text-sm font-medium"
            >
              Learn more
            </Link>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl mb-4">
              💬
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Increase Engagement
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Courses with weekly discussion prompts see 28% higher student
              retention rates.
            </p>
            <Link
              href="#"
              className="text-[#FF7D29] hover:text-[#FF9D5C] text-sm font-medium"
            >
              Learn more
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherAnalyticsPage;
