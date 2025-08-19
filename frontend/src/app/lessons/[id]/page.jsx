"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "../../Components/layout/Header";
import Footer from "../../Components/layout/Footer";
import { motion } from "motion/react";

const LessonDetail = () => {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id);

  // This would typically come from an API, but for now we'll hardcode the lessons data
  const lessonsData = [
    {
      id: 1,
      title: "Beginner Basics",
      category: "English",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/beginner-basics.png",
      level: "Beginner",
      description:
        "This course is designed for absolute beginners to English. You'll learn essential vocabulary, basic grammar structures, and simple conversational phrases to start your language journey.",
      duration: "4 weeks",
      modules: 12,
      learningPoints: [
        "Basic greetings and introductions",
        "Essential vocabulary for everyday situations",
        "Simple sentence structures",
        "Numbers, colors, and common objects",
        "Basic question formation",
      ],
    },
    {
      id: 2,
      title: "Conversation Skills",
      category: "Sinhala",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Language Expert",
      image: "/images/lessons/conversation.png",
      level: "Intermediate",
      description:
        "Take your Sinhala speaking skills to the next level with this conversation-focused course. Practice dialogues, learn idioms, and gain confidence in various social situations.",
      duration: "6 weeks",
      modules: 18,
      learningPoints: [
        "Engaging in everyday conversations",
        "Sinhala idioms and expressions",
        "Speaking fluently about various topics",
        "Active listening techniques",
        "Cultural context for natural communication",
      ],
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      category: "Tamil",
      instructor: "Prof. James Chen",
      instructorTitle: "Grammar Specialist",
      image: "/images/lessons/grammar.png",
      level: "Beginner",
      description:
        "Master the essential grammar rules of Tamil with clear explanations and plenty of practical exercises. This course builds a solid foundation for further language learning.",
      duration: "5 weeks",
      modules: 15,
      learningPoints: [
        "Tamil sentence structure and word order",
        "Verb conjugation and tenses",
        "Noun cases and gender",
        "Pronouns and articles",
        "Forming questions and negations",
      ],
    },
    {
      id: 4,
      title: "Pronunciation Guide",
      category: "English",
      instructor: "Sarah Thompson",
      instructorTitle: "Accent Coach",
      image: "/images/lessons/pronunciation.png",
      level: "All Levels",
      description:
        "Improve your English pronunciation with targeted practice on difficult sounds, rhythm, and intonation. Suitable for learners at any level who want to sound more natural.",
      duration: "3 weeks",
      modules: 10,
      learningPoints: [
        "Mastering challenging English sounds",
        "Word stress and sentence rhythm",
        "Intonation patterns for questions and statements",
        "Linking sounds in natural speech",
        "Reducing accent and improving clarity",
      ],
    },
    {
      id: 5,
      title: "Vocabulary Builder",
      category: "Sinhala",
      instructor: "Prof. James Chen",
      instructorTitle: "Language Expert",
      image: "/images/lessons/vocabulary.png",
      level: "Beginner",
      description:
        "Expand your Sinhala vocabulary with this comprehensive course covering essential words and phrases for everyday situations, organized by theme for easy learning.",
      duration: "4 weeks",
      modules: 12,
      learningPoints: [
        "Food and dining vocabulary",
        "Travel and transportation terms",
        "Family and relationships",
        "Work and professional settings",
        "Shopping and services",
      ],
    },
    {
      id: 6,
      title: "Cultural Context",
      category: "Tamil",
      instructor: "Dr. Maria Rodriguez",
      instructorTitle: "Cultural Specialist",
      image: "/images/lessons/culture.png",
      level: "Intermediate",
      description:
        "Learn Tamil while exploring the rich cultural heritage of Tamil-speaking regions. Understand cultural nuances, traditions, and history to enhance your language skills.",
      duration: "5 weeks",
      modules: 15,
      learningPoints: [
        "Tamil traditions and festivals",
        "Cultural etiquette and customs",
        "Literature and arts vocabulary",
        "Historical context and cultural references",
        "Regional variations in language and culture",
      ],
    },
    {
      id: 7,
      title: "Reading Comprehension",
      category: "English",
      instructor: "Sarah Thompson",
      instructorTitle: "Reading Coach",
      image: "/images/lessons/reading.png",
      level: "Advanced",
      description:
        "Develop advanced English reading skills through progressively challenging texts. Learn strategies for understanding complex material and expanding your vocabulary.",
      duration: "6 weeks",
      modules: 18,
      learningPoints: [
        "Skimming and scanning techniques",
        "Critical reading and analysis",
        "Understanding context and inference",
        "Academic and professional text comprehension",
        "Building vocabulary through context",
      ],
    },
    {
      id: 8,
      title: "Writing Essentials",
      category: "Sinhala",
      instructor: "Prof. James Chen",
      instructorTitle: "Writing Expert",
      image: "/images/lessons/writing.png",
      level: "Intermediate",
      description:
        "Master the fundamentals of written Sinhala through guided practice. Learn to write clear, grammatically correct sentences and structure coherent paragraphs.",
      duration: "5 weeks",
      modules: 15,
      learningPoints: [
        "Sinhala script and writing system",
        "Sentence construction and paragraph development",
        "Common writing formats (letters, essays, etc.)",
        "Grammar and punctuation in writing",
        "Expressing ideas clearly and concisely",
      ],
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
                  {lesson.category} • {lesson.level}
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                  {lesson.title}
                </h1>
                <p className="text-gray-600 mb-6">{lesson.description}</p>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {lesson.instructor.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {lesson.instructor}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lesson.instructorTitle}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-gray-700 font-medium">
                      {lesson.duration}
                    </span>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-gray-700 font-medium">
                      {lesson.modules} Modules
                    </span>
                  </div>
                </div>
                <Link href={`/lessons/${lesson.id}/content`}>
                  <motion.button
                    className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-4 px-8 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:transform active:translate-y-1 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Learning Now
                  </motion.button>
                </Link>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-full max-w-md h-72 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  {/* If you have actual images, uncomment this */}
                  {/* <Image 
                    src={lesson.image} 
                    alt={lesson.title}
                    fill
                    style={{ objectFit: 'cover' }} 
                  /> */}
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-xl">
                      [{lesson.category} Lesson Preview]
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* What You'll Learn Section */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              What You'll Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lesson.learningPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <div className="mr-4 mt-1 text-[#FF7D29]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Course Structure */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Course Structure
            </h2>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-orange-100 text-[#FF7D29] rounded-full flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">
                        Module {index + 1}:{" "}
                        {
                          [
                            "Introduction",
                            "Core Concepts",
                            "Advanced Practice",
                          ][index]
                        }
                      </h3>
                      <p className="text-sm text-gray-500">
                        4 lessons • 45 minutes
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {index === 0 ? "Free Preview" : ""}
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-center text-gray-500 text-sm">
                  And {lesson.modules - 3} more modules...
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Ready to start your {lesson.category} journey?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already improved their{" "}
              {lesson.category} skills with our engaging, interactive lessons.
            </p>
            <Link href={`/lessons/${lesson.id}/content`}>
              <motion.button
                className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-4 px-10 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:transform active:translate-y-1 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LessonDetail;
