"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const SupervisorReports = () => {
  const [selectedReport, setSelectedReport] = useState('lesson-summary');
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-01-31'
  });
  const [exportFormat, setExportFormat] = useState('excel');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'lesson-summary',
      title: 'Lesson Summary Report',
      description: 'Overview of all lesson submissions, approvals, and rejections',
      icon: '📚',
      fields: ['Teacher Name', 'Lesson Title', 'Language', 'Level', 'Status', 'Submission Date', 'Review Date']
    },
    {
      id: 'teacher-performance',
      title: 'Teacher Performance Report',
      description: 'Detailed analysis of teacher contributions and quality metrics',
      icon: '👨‍🏫',
      fields: ['Teacher Name', 'Total Lessons', 'Approved', 'Rejected', 'Avg Rating', 'Student Count']
    },
    {
      id: 'student-engagement',
      title: 'Student Engagement Report',
      description: 'Student activity, progress, and learning outcomes',
      icon: '👥',
      fields: ['Student Name', 'Courses Enrolled', 'Completion Rate', 'Total XP', 'Last Active']
    },
    {
      id: 'quality-metrics',
      title: 'Quality Metrics Report',
      description: 'Content quality analysis and improvement areas',
      icon: '⭐',
      fields: ['Content Type', 'Average Rating', 'Review Count', 'Issues Reported', 'Resolution Rate']
    },
    {
      id: 'system-usage',
      title: 'System Usage Report',
      description: 'Platform usage statistics and technical metrics',
      icon: '📊',
      fields: ['Date', 'Active Users', 'New Registrations', 'Lesson Views', 'System Uptime']
    },
    {
      id: 'financial-summary',
      title: 'Financial Summary Report',
      description: 'Revenue, subscriptions, and financial analytics',
      icon: '💰',
      fields: ['Period', 'Total Revenue', 'New Subscriptions', 'Renewals', 'Churn Rate']
    }
  ];

  const sampleData = {
    'lesson-summary': [
      {
        teacherName: 'Dr. Sarah Johnson',
        lessonTitle: 'English Grammar Basics',
        language: 'English',
        level: 'Beginner',
        status: 'Approved',
        submissionDate: '2024-01-15',
        reviewDate: '2024-01-16'
      },
      {
        teacherName: 'Prof. Ravi Kumar',
        lessonTitle: 'Tamil Vocabulary',
        language: 'Tamil',
        level: 'Intermediate',
        status: 'Approved',
        submissionDate: '2024-01-14',
        reviewDate: '2024-01-15'
      },
      {
        teacherName: 'Ms. Priya Perera',
        lessonTitle: 'Sinhala Pronunciation',
        language: 'Sinhala',
        level: 'Beginner',
        status: 'Pending',
        submissionDate: '2024-01-16',
        reviewDate: '-'
      }
    ],
    'teacher-performance': [
      {
        teacherName: 'Dr. Sarah Johnson',
        totalLessons: 45,
        approved: 42,
        rejected: 3,
        avgRating: 4.8,
        studentCount: 1250
      },
      {
        teacherName: 'Prof. Ravi Kumar',
        totalLessons: 32,
        approved: 30,
        rejected: 2,
        avgRating: 4.6,
        studentCount: 890
      }
    ]
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportData = sampleData[selectedReport] || [];
    const selectedReportType = reportTypes.find(r => r.id === selectedReport);
    
    if (exportFormat === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `${selectedReport}-${dateRange.from}-to-${dateRange.to}.xlsx`);
    } else if (exportFormat === 'csv') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const csvContent = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${selectedReport}-${dateRange.from}-to-${dateRange.to}.csv`);
    }
    
    setIsGenerating(false);
  };

  const selectedReportType = reportTypes.find(r => r.id === selectedReport);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-emerald-100 text-lg">Generate comprehensive reports for data-driven insights</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Selection */}
        <motion.div
          className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Select Report Type</h2>
          
          <div className="space-y-3">
            {reportTypes.map((report) => (
              <motion.button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedReport === report.id
                    ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{report.icon}</span>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Report Configuration */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Configure Report</h2>
          
          {selectedReportType && (
            <div className="space-y-6">
              {/* Selected Report Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{selectedReportType.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedReportType.title}</h3>
                    <p className="text-gray-600">{selectedReportType.description}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Report Fields:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedReportType.fields.map((field, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => handleDateChange('from', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => handleDateChange('to', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="pdf">PDF (.pdf)</option>
                </select>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Generating Report...
                  </div>
                ) : (
                  `Generate ${selectedReportType.title}`
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Reports Generated', value: '1,245', icon: '📊', change: '+15%' },
            { title: 'Data Points Analyzed', value: '45.2K', icon: '📈', change: '+23%' },
            { title: 'Export Downloads', value: '892', icon: '⬇️', change: '+8%' },
            { title: 'Automated Reports', value: '156', icon: '🤖', change: '+12%' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-emerald-600 mb-1">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change} this month</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Reports</h2>
        
        <div className="space-y-4">
          {[
            {
              name: 'Monthly Teacher Performance',
              type: 'Teacher Performance Report',
              date: '2024-01-20',
              size: '2.4 MB',
              format: 'Excel',
              downloads: 45
            },
            {
              name: 'Weekly Lesson Summary',
              type: 'Lesson Summary Report',
              date: '2024-01-18',
              size: '1.8 MB',
              format: 'PDF',
              downloads: 23
            },
            {
              name: 'Student Engagement Analysis',
              type: 'Student Engagement Report',
              date: '2024-01-15',
              size: '3.1 MB',
              format: 'Excel',
              downloads: 67
            }
          ].map((report, index) => (
            <motion.div
              key={report.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  📄
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.type}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Generated: {report.date}</span>
                    <span>Size: {report.size}</span>
                    <span>Format: {report.format}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{report.downloads} downloads</span>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SupervisorReports;