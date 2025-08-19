"use client";

import React from 'react';
import { motion } from 'motion/react';

const ProgressIndicator = ({ steps, currentStep }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        {/* Step Circle */}
                        <div className="relative">
                            <motion.div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step.number <= currentStep
                                        ? 'bg-[#FF7D29] text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                initial={{ scale: 0.8 }}
                                animate={{
                                    scale: step.number === currentStep ? 1.1 : 1,
                                    backgroundColor: step.number <= currentStep ? '#FF7D29' : '#E5E7EB'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {step.number < currentStep ? (
                                    <motion.svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </motion.svg>
                                ) : (
                                    step.number
                                )}
                            </motion.div>

                            {/* Step Label */}
                            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <span className={`text-sm font-medium ${step.number <= currentStep ? 'text-[#FF7D29]' : 'text-gray-500'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="relative">
                                <div className="w-24 h-1 bg-gray-200 mx-4"></div>
                                <motion.div
                                    className="absolute top-0 left-4 h-1 bg-[#FF7D29]"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: step.number < currentStep ? '6rem' : '0rem'
                                    }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressIndicator;