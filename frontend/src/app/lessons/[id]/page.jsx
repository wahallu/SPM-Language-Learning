"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "../../Components/layout/Header";
import Footer from "../../Components/layout/Footer";
import { motion } from "motion/react";
import ApiService from "../../utils/api";

const LessonDetail = () => {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id;

  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lessonId) {
      fetchLessonDetails();
    }
  }, [lessonId]);

  const fetchLessonDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ApiService.getPublishedLessonById(lessonId);

      if (response.success && response.data) {
        setLesson(response.data);
      } else {
        throw new Error(response.message || 'Lesson not found');
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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
            <p className="text-gray-600">Loading lesson details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-20 flex-grow text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Lesson not found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The lesson you're looking for doesn't exist."}
          </p>
          <Link href="/lessons">
            <button className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Back to Lessons
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const videoId = getYouTubeVideoId(lesson.videoUrl);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-50 to-white border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <motion.div
                className="w-full md:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-sm text-[#FF7D29] font-medium mb-2">
                  {lesson.category} • {lesson.difficulty || 'Beginner'}
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                  {lesson.title}
                </h1>
                <p className="text-gray-600 mb-6">{lesson.description}</p>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {lesson.teacherName ? lesson.teacherName.charAt(0) : 'T'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {lesson.teacherName || 'Instructor'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Language Expert
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  {lesson.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {lesson.duration}
                    </div>
                  )}
                  {lesson.language && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.894L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                      </svg>
                      {lesson.language}
                    </div>
                  )}
                  {lesson.views > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      👁️ {lesson.views} views
                    </div>
                  )}
                </div>

                {lesson.tags && lesson.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {lesson.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="w-full md:w-1/2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {videoId ? (
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : lesson.coverImage ? (
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={lesson.coverImage}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                    <div className="text-gray-400 text-xl">
                      [{lesson.category} Lesson]
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Quizzes Section */}
        {lesson.quizzes && lesson.quizzes.length > 0 && (
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Quiz Questions ({lesson.quizzes.length})
              </h2>
              <p className="text-gray-600 mb-6">
                Test your knowledge with {lesson.quizzes.length} interactive quiz{lesson.quizzes.length > 1 ? 'zes' : ''}.
              </p>
            </motion.div>
          </div>
        )}

        {/* Transcript Section */}
        {lesson.transcript && (
          <div className="container mx-auto px-4 py-16 bg-gray-50">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Transcript
              </h2>
              <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl">
                <p className="text-gray-700 whitespace-pre-line">{lesson.transcript}</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Ready to start learning?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already improved their language
            skills with this engaging lesson.
          </p>
          <Link href={`/lessons/${lesson.id}/content`}>
            <motion.button
              className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-4 px-10 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:transform active:translate-y-1 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning Now
            </button>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default LessonDetail;