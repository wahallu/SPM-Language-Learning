"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';

const Getstart = () => {
    const [isHovered, setIsHovered] = useState(false);
    const { language } = useLanguage();

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between items-center pt-36">
            {/* Main content with slogan */}
            <div className="flex-1 flex justify-center items-center">
                <motion.h1 
                    key={`getstart-title-${language}`}
                    className={`text-8xl md:text-7xl text-center text-[#FF7D29] px-5 ${language === 'si' ? 'font-noto-sans-sinhala' : ''}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {t('getStartedTitle', language)}
                </motion.h1>
            </div><br/><br/><br/>
            
            <div className="flex flex-col items-center justify-center gap-6">
                {/* Button with hover effects */}
                <Link href="/register">
                    <motion.button 
                        key={`getstart-btn-${language}`}
                        className="bg-[#FF7D29] text-white px-40 py-4 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:transform hover:bg-[#FF9D5C]"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {t('getStarted', language)}
                    </motion.button>
                </Link>
            </div>

            {/* Footer section with character overlay */}
            <div className="w-full flex justify-center relative -mb-1">
                {/* Background footer gif */}
                <img
                    src="/download.svg"
                    alt="Footer animation"
                    className="w-full h-auto object-cover block"
                />
                
                {/* Character images overlay */}
                <div className="absolute inset-0 flex justify-center items-center">
                    <div className="relative w-64 h-64">
                        {/* GIF Image - appears on hover */}
                        <img
                            src="/Gif/Hii.gif"
                            alt="Hello animation"
                            className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 -translate-y-6.5 ${
                                isHovered ? 'opacity-100 scale-170' : 'opacity-0 scale-90'
                            }`}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;500;600;700&display=swap');
                
                .font-noto-sans-sinhala {
                    font-family: 'Noto Sans Sinhala', sans-serif;
                }
            `}</style>
        </div>
    );
};

export default Getstart;