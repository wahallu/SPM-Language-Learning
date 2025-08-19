"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import LanguageCard from '../ui/LanguageCard';
import Button from '../ui/Button';

const LANGUAGES = {
    LEARN: [
        { code: 'en', name: 'English', flag: '/flags/us.png' },
        { code: 'si', name: 'Sinhala', flag: '/flags/sri.png' },
        { code: 'ta', name: 'Tamil', flag: '/flags/india.png' },
    ],
    KNOWN: [
        { code: 'en', name: 'English', flag: '/flags/us.png' },
        { code: 'si', name: 'Sinhala', flag: '/flags/sri.png' },
        { code: 'ta', name: 'Tamil', flag: '/flags/india.png' },
    ]
};

const LanguageSelection = ({ onNext }) => {
    const [selectedLearn, setSelectedLearn] = useState(null);
    const [selectedKnow, setSelectedKnow] = useState(null);
    const [currentSection, setCurrentSection] = useState('learn'); // 'learn' or 'know'

    const handleLearnLanguage = (language) => {
        setSelectedLearn(language);
        setCurrentSection('know');
    };

    const handleKnownLanguage = (language) => {
        setSelectedKnow(language);
    };

    const handleContinue = () => {
        if (selectedLearn && selectedKnow) {
            onNext(selectedLearn, selectedKnow);
        }
    };

    const handleBackToLearn = () => {
        setCurrentSection('learn');
        setSelectedKnow(null);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center mb-6">
                    <Image
                        src="/Gif/reading boy.gif"
                        alt="Learning mascot"
                        width={120}
                        height={120}
                        className="animate-bounce"
                        unoptimized={true}
                    />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    {currentSection === 'learn'
                        ? "I want to learn..."
                        : "I know..."}
                </h1>
                <p className="text-lg text-gray-600">
                    {currentSection === 'learn'
                        ? "Choose the language you'd like to learn"
                        : "Choose the language you already know"}
                </p>
            </motion.div>

            {/* Language Selection Section */}
            <motion.div
                className="rounded-2xl shadow-lg p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                {currentSection === 'learn' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
                            Select a language to learn
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {LANGUAGES.LEARN.map((language, index) => (
                                <motion.div
                                    key={language.code}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <LanguageCard
                                        language={language}
                                        isSelected={selectedLearn?.code === language.code}
                                        onClick={() => handleLearnLanguage(language)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {currentSection === 'know' && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={handleBackToLearn}
                                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2">
                                    Learning: {selectedLearn?.name}
                                </span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
                            What language do you know?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {LANGUAGES.KNOWN.map((language, index) => (
                                <motion.div
                                    key={language.code}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <LanguageCard
                                        language={language}
                                        isSelected={selectedKnow?.code === language.code}
                                        onClick={() => handleKnownLanguage(language)}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {selectedKnow && (
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Button
                                    onClick={handleContinue}
                                    className="bg-[#FF7D29] hover:bg-[#FF9D5C] text-white px-12 py-4 text-lg"
                                >
                                    Continue
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Progress hint */}
            {currentSection === 'learn' && selectedLearn && (
                <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="text-sm text-gray-500">
                        Great choice! Now let's select the language you already know →
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default LanguageSelection;