"use client";

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const LanguageCard = ({ language, isSelected, onClick }) => {
    return (
        <motion.button
            onClick={() => onClick(language)}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${isSelected
                    ? 'border-[#FF7D29] bg-orange-50 ring-4 ring-orange-200 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <Image
                        src={language.flag}
                        alt={`${language.name} flag`}
                        width={60}
                        height={45}
                        className="rounded-md shadow-sm"
                        unoptimized={true}
                    />
                    {isSelected && (
                        <motion.div
                            className="absolute -top-2 -right-2 bg-[#FF7D29] text-white rounded-full w-6 h-6 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                    )}
                </div>
                <div className="text-center">
                    <h3 className={`font-semibold text-lg ${isSelected ? 'text-[#FF7D29]' : 'text-gray-800'
                        }`}>
                        {language.name}
                    </h3>
                </div>
            </div>
        </motion.button>
    );
};

export default LanguageCard;