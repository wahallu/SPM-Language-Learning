"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CoursePlayerPage = ({ params }) => {
  const router = useRouter();
  
  // Mock course and lesson data
  const [course] = useState({
    id: 1,
    title: "Beginner Basics",
    category: "English",
    instructor: "Dr. Maria Rodriguez"
  });

  const [currentLesson, setCurrentLesson] = useState({
    id: 1,
    title: "English Alphabet",
    description: "Learn the 26 letters of the English alphabet and their pronunciation",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "10 minutes",
    order: 1,
    moduleTitle: "Introduction to English",
    quizzes: [
      {
        id: 1,
        question: "How many letters are in the English alphabet?",
        options: ["24", "25", "26"],
        correctAnswer: 2,
        explanation: "The English alphabet has 26 letters, from A to Z."
      },
      {
        id: 2,
        question: "Which letter comes after 'M' in the alphabet?",
        options: ["L", "N", "O"],
        correctAnswer: 1,
        explanation: "The letter N comes after M in the English alphabet."
      }
    ]
  });

  const [lessons] = useState([
    { id: 1, title: "English Alphabet", completed: false, current: true },
    { id: 2, title: "Basic Pronunciation", completed: false, current: false },
    { id: 3, title: "Common Greetings", completed: false, current: false },
    { id: 4, title: "Numbers 1-20", completed: false, current: false },
    { id: 5, title: "Days of the Week", completed: false, current: false }
  ]);

  const [playerState, setPlayerState] = useState({
    currentSection: 'video', // 'video', 'quiz', 'completed'
    videoCompleted: false,
    quizStarted: false,
    currentQuizIndex: 0,
    quizAnswers: {},
    quizCompleted: false,
    lessonCompleted: false,
    showTranscript: false,
    showNotes: false
  });

  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(currentLesson.videoUrl);

  const handleVideoComplete = () => {
    setPlayerState(prev => ({
      ...prev,
      videoCompleted: true,
      currentSection: currentLesson.quizzes.length > 0 ? 'quiz' : 'completed'
    }));
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleQuizSubmit = () => {
    let correctAnswers = 0;
    currentLesson.quizzes.forEach(quiz => {
      if (userAnswers[quiz.id] === quiz.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / currentLesson.quizzes.length) * 100;
    const xpEarned = Math.round(score * 0.5) + 25; // Base XP + bonus based on score
    
    setXpGained(xpEarned);
    setShowResults(true);
    setPlayerState(prev => ({
      ...prev,
      quizCompleted: true,
      currentSection: 'completed'
    }));
  };

  const handleLessonComplete = () => {
    setPlayerState(prev => ({
      ...prev,
      lessonCompleted: true
    }));
    
    // Simulate lesson completion API call
    setTimeout(() => {
      router.push(`/student/courses/${params.courseId}`);
    }, 2000);
  };

  const goToNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.current);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      router.push(`/student/courses/${params.courseId}/learn/${nextLesson.id}`);
    } else {
      router.push(`/student/courses/${params.courseId}`);
    }
  };

  const getQuizScore = () => {
    let correct = 0;
    currentLesson.quizzes.forEach(quiz => {
      if (userAnswers[quiz.id] === quiz.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / currentLesson.quizzes.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <motion.div
        className="bg-gray-800 border-b border-gray-700 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/student/courses/${params.courseId}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{currentLesson.title}</h1>
              <p className="text-gray-400 text-sm">{course.title} • {currentLesson.moduleTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span className="text-gray-400">Lesson {currentLesson.order} of {lessons.length}</span>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#FF7D29] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentLesson.order / lessons.length) * 100}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={() => setPlayerState(prev => ({ ...prev, showNotes: !prev.showNotes }))}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Toggle notes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* Video Section */}
            {playerState.currentSection === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <div className="aspect-video bg-black">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                      title={currentLesson.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      onLoad={() => {
                        // Simulate video completion after 5 seconds for demo
                        setTimeout(handleVideoComplete, 5000);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎥</div>
                        <h3 className="text-xl font-semibold mb-2">Video Player</h3>
                        <p className="text-gray-400">{currentLesson.title}</p>
                        <button
                          onClick={handleVideoComplete}
                          className="mt-4 bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
                        >
                          Simulate Video Complete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{currentLesson.title}</h3>
                        <p className="text-sm text-gray-300">{currentLesson.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPlayerState(prev => ({ ...prev, showTranscript: !prev.showTranscript }))}
                          className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                        >
                          Transcript
                        </button>
                        {playerState.videoCompleted && (
                          <button
                            onClick={() => setPlayerState(prev => ({ ...prev, currentSection: 'quiz' }))}
                            className="bg-[#FF7D29] text-white px-4 py-2 rounded-lg hover:bg-[#FF9D5C] transition-colors"
                          >
                            Continue to Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quiz Section */}
            {playerState.currentSection === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Knowledge Check</h2>
                    <p className="text-gray-400">Test your understanding of this lesson</p>
                  </div>

                  {!showResults ? (
                    <div className="space-y-8">
                      {currentLesson.quizzes.map((quiz, index) => (
                        <motion.div
                          key={quiz.id}
                          className="bg-gray-800 rounded-xl p-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h3 className="text-xl font-semibold mb-4">
                            Question {index + 1}: {quiz.question}
                          </h3>
                          
                          <div className="space-y-3">
                            {quiz.options.map((option, optionIndex) => (
                              <motion.button
                                key={optionIndex}
                                onClick={() => handleQuizAnswer(quiz.id, optionIndex)}
                                className={`w-full text-left p-4 rounded-lg border transition-all ${
                                  userAnswers[quiz.id] === optionIndex
                                    ? 'border-[#FF7D29] bg-[#FF7D29] bg-opacity-20 text-white'
                                    : 'border-gray-600 bg-gray-700 hover:border-gray-500 text-gray-300'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="font-medium mr-3">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      ))}

                      <div className="text-center">
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(userAnswers).length !== currentLesson.quizzes.length}
                          className="bg-[#FF7D29] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#FF9D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Quiz
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="bg-gray-800 rounded-xl p-8 mb-8">
                        <div className="text-6xl mb-4">
                          {getQuizScore() >= 80 ? '🎉' : getQuizScore() >= 60 ? '👏' : '📚'}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                        <p className="text-gray-400 mb-4">
                          You scored {getQuizScore()}% ({Object.values(userAnswers).filter((answer, index) => 
                            answer === currentLesson.quizzes[index].correctAnswer
                          ).length} out of {currentLesson.quizzes.length} correct)
                        </p>
                        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg inline-block">
                          +{xpGained} XP earned!
                        </div>
                      </div>

                      {/* Quiz Review */}
                      <div className="space-y-6 mb-8">
                        <h4 className="text-xl font-semibold">Review Your Answers</h4>
                        {currentLesson.quizzes.map((quiz, index) => (
                          <div key={quiz.id} className="bg-gray-800 rounded-xl p-6 text-left">
                            <h5 className="font-semibold mb-3">{quiz.question}</h5>
                            <div className="space-y-2">
                              {quiz.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    optionIndex === quiz.correctAnswer
                                      ? 'border-green-500 bg-green-500 bg-opacity-20'
                                      : userAnswers[quiz.id] === optionIndex && optionIndex !== quiz.correctAnswer
                                      ? 'border-red-500 bg-red-500 bg-opacity-20'
                                      : 'border-gray-600 bg-gray-700'
                                  }`}
                                >
                                  <span className="mr-3">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  {option}
                                  {optionIndex === quiz.correctAnswer && (
                                    <span className="ml-2 text-green-400">✓ Correct</span>
                                  )}
                                  {userAnswers[quiz.id] === optionIndex && optionIndex !== quiz.correctAnswer && (
                                    <span className="ml-2 text-red-400">✗ Your answer</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 p-3 bg-blue-900 bg-opacity-50 rounded-lg">
                              <p className="text-blue-300 text-sm">
                                <strong>Explanation:</strong> {quiz.explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleLessonComplete}
                        className="bg-[#FF7D29] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#FF9D5C] transition-colors"
                      >
                        Complete Lesson
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Lesson Completed */}
            {playerState.currentSection === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8"
              >
                <div className="max-w-2xl mx-auto text-center">
                  <motion.div
                    className="text-8xl mb-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🎉
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold mb-4">Lesson Complete!</h2>
                  <p className="text-xl text-gray-400 mb-8">
                    Great job! You've successfully completed "{currentLesson.title}"
                  </p>

                  <div className="bg-gray-800 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-400 text-sm">XP Earned</p>
                        <p className="text-2xl font-bold text-yellow-400">+{xpGained}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Quiz Score</p>
                        <p className="text-2xl font-bold text-green-400">{getQuizScore()}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={goToNextLesson}
                      className="bg-[#FF7D29] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#FF9D5C] transition-colors"
                    >
                      Next Lesson
                    </button>
                    <Link
                      href={`/student/courses/${params.courseId}`}
                      className="bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Back to Course
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <motion.div
          className={`bg-gray-800 border-l border-gray-700 transition-all duration-300 ${
            playerState.showNotes ? 'w-80' : 'w-16'
          }`}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
        >
          {playerState.showNotes ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Lesson Notes</h3>
                <button
                  onClick={() => setPlayerState(prev => ({ ...prev, showNotes: false }))}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Points</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• English alphabet has 26 letters</li>
                    <li>• Letters are divided into vowels and consonants</li>
                    <li>• Pronunciation varies by letter combination</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Vocabulary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-700 p-2 rounded">
                      <span className="font-medium">Alphabet:</span>
                      <span className="text-gray-400 ml-2">A set of letters used in a language</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Your Notes</h4>
                  <textarea
                    placeholder="Add your personal notes here..."
                    className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={() => setPlayerState(prev => ({ ...prev, showNotes: true }))}
                className="w-full p-2 text-gray-400 hover:text-white transition-colors"
                title="Open notes"
              >
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Transcript Overlay */}
      <AnimatePresence>
        {playerState.showTranscript && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlayerState(prev => ({ ...prev, showTranscript: false }))}
          >
            <motion.div
              className="bg-gray-800 rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Video Transcript</h3>
                <button
                  onClick={() => setPlayerState(prev => ({ ...prev, showTranscript: false }))}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed">
                <p className="mb-4">
                  [00:00] Welcome to today's lesson on the English alphabet. 
                  The English alphabet consists of 26 letters, starting with A and ending with Z.
                </p>
                <p className="mb-4">
                  [00:15] Each letter has both an uppercase and lowercase form. 
                  For example, A and a, B and b, and so on.
                </p>
                <p className="mb-4">
                  [00:30] The alphabet is the foundation of reading and writing in English. 
                  By learning each letter and its sound, you can begin to form words and sentences.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePlayerPage;