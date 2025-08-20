"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SupervisorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('lessons');

  const analyticsData = {
    platformOverview: {
      totalUsers: 15420,
      activeUsers: 12350,
      totalLessons: 3250,
      approvedLessons: 2980,
      averageRating: 4.6,
      completionRate: 87.5
    },
    lessonMetrics: {
      submitted: [45, 52, 38, 65, 48, 72, 58],
      approved: [40, 48, 35, 58, 42, 65, 52],
      rejected: [5, 4, 3, 7, 6, 7, 6],
      pending: [8, 12, 6, 15, 10, 18, 12]
    },
    teacherMetrics: {
      total: 245,
      active: 198,
      pending: 15,
      suspended: 8,
      newRegistrations: [12, 8, 15, 10, 18, 14, 22]
    },
    studentEngagement: {
      dailyActive: [3200, 3450, 3100, 3800, 3650, 4200, 3900],
      weeklyActive: 12350,
      monthlyActive: 15420,
      averageSessionTime: 28.5,
      completionRates: {
        beginner: 92,
        intermediate: 85,
        advanced: 78
      }
    },
    contentQuality: {
      averageRatings: {
        english: 4.7,
        sinhala: 4.5,
        tamil: 4.6,
        spanish: 4.4
      },
      reportedIssues: 23,
      resolvedIssues: 19,
      pendingReviews: 47
    }
  };

  // Chart configurations
  const lessonTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Submitted',
        data: analyticsData.lessonMetrics.submitted,
        borderColor: '#FF7D29',
        backgroundColor: 'rgba(255, 125, 41, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Approved',
        data: analyticsData.lessonMetrics.approved,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Rejected',
        data: analyticsData.lessonMetrics.rejected,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const userEngagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Active Users',
        data: analyticsData.studentEngagement.dailyActive,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: '#6366F1',
        borderWidth: 2
      }
    ]
  };

  const languageDistributionData = {
    labels: ['English', 'Sinhala', 'Tamil', 'Spanish', 'Others'],
    datasets: [
      {
        data: [35, 28, 22, 10, 5],
        backgroundColor: [
          '#FF7D29',
          '#10B981',
          '#6366F1',
          '#F59E0B',
          '#8B5CF6'
        ],
        borderWidth: 0
      }
    ]
  };

  const qualityMetricsData = {
    labels: ['Content Quality', 'User Engagement', 'Technical Performance', 'Support Response', 'Feature Completeness'],
    datasets: [
      {
        label: 'Current',
        data: [4.6, 4.2, 4.8, 4.4, 4.3],
        backgroundColor: 'rgba(255, 125, 41, 0.2)',
        borderColor: '#FF7D29',
        borderWidth: 2
      },
      {
        label: 'Target',
        data: [4.8, 4.5, 4.9, 4.7, 4.6],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10B981',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
            <p className="text-indigo-100 text-lg">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 backdrop-blur-sm"
            >
              <option value="7d" className="text-gray-800">Last 7 days</option>
              <option value="30d" className="text-gray-800">Last 30 days</option>
              <option value="90d" className="text-gray-800">Last 90 days</option>
              <option value="1y" className="text-gray-800">Last year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { title: 'Total Users', value: analyticsData.platformOverview.totalUsers.toLocaleString(), icon: '👥', color: 'bg-blue-500', change: '+12%' },
          { title: 'Active Users', value: analyticsData.platformOverview.activeUsers.toLocaleString(), icon: '🟢', color: 'bg-green-500', change: '+8%' },
          { title: 'Total Lessons', value: analyticsData.platformOverview.totalLessons.toLocaleString(), icon: '📚', color: 'bg-orange-500', change: '+15%' },
          { title: 'Approved Lessons', value: analyticsData.platformOverview.approvedLessons.toLocaleString(), icon: '✅', color: 'bg-emerald-500', change: '+18%' },
          { title: 'Avg Rating', value: analyticsData.platformOverview.averageRating, icon: '⭐', color: 'bg-yellow-500', change: '+0.2' },
          { title: 'Completion Rate', value: `${analyticsData.platformOverview.completionRate}%`, icon: '🎯', color: 'bg-purple-500', change: '+5%' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {metric.icon}
              </div>
              <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lesson Trends */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Lesson Approval Trends</h2>
          <div className="h-80">
            <Line data={lessonTrendsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* User Engagement */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Daily Active Users</h2>
          <div className="h-80">
            <Bar data={userEngagementData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Language Distribution */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Content Distribution by Language</h2>
          <div className="h-80">
            <Doughnut 
              data={languageDistributionData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} 
            />
          </div>
        </motion.div>

        {/* Quality Metrics */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quality Metrics</h2>
          <div className="h-80">
            <Radar data={qualityMetricsData} options={radarOptions} />
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teacher Performance */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Top Performing Teachers</h2>
          <div className="space-y-4">
            {[
              { name: 'Dr. Sarah Johnson', lessons: 45, rating: 4.8, students: 1250 },
              { name: 'Prof. Ravi Kumar', lessons: 32, rating: 4.6, students: 890 },
              { name: 'Ms. Emily Chen', lessons: 28, rating: 4.7, students: 750 },
              { name: 'Dr. Michael Brown', lessons: 24, rating: 4.5, students: 680 },
              { name: 'Prof. Lisa Wang', lessons: 22, rating: 4.9, students: 920 }
            ].map((teacher, index) => (
              <div key={teacher.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.lessons} lessons</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">⭐ {teacher.rating}</p>
                  <p className="text-sm text-gray-600">{teacher.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">System Health</h2>
          <div className="space-y-6">
            {[
              { metric: 'Server Uptime', value: '99.9%', status: 'excellent', color: 'bg-green-500' },
              { metric: 'Response Time', value: '245ms', status: 'good', color: 'bg-blue-500' },
              { metric: 'Error Rate', value: '0.1%', status: 'excellent', color: 'bg-green-500' },
              { metric: 'Database Performance', value: '98%', status: 'excellent', color: 'bg-green-500' },
              { metric: 'CDN Performance', value: '97%', status: 'good', color: 'bg-blue-500' }
            ].map((item, index) => (
              <div key={item.metric} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-gray-700">{item.metric}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">System Status: Operational</h3>
            <p className="text-green-700 text-sm">All systems are running normally. Last updated: 2 minutes ago</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Summary */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Platform Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-gray-800 mb-2">Growth Rate</h3>
            <p className="text-2xl font-bold text-blue-600">+15%</p>
            <p className="text-sm text-gray-600">User growth this month</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">Quality Score</h3>
            <p className="text-2xl font-bold text-green-600">4.6/5</p>
            <p className="text-sm text-gray-600">Average lesson rating</p>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-xl">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Processing Time</h3>
            <p className="text-2xl font-bold text-orange-600">2.4h</p>
            <p className="text-sm text-gray-600">Avg lesson review time</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SupervisorAnalytics;