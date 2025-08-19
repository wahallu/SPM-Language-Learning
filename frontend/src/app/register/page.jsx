"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../Components/layout/Header';
import LanguageSelection from '../Components/registration/LanguageSelection';
import RegistrationForm from '../components/registration/RegistrationForm';
import ProgressIndicator from '../components/registration/ProgressIndicator';

const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedLanguages, setSelectedLanguages] = useState({
        learn: null,
        know: null
    });

    const handleLanguageSelection = (learn, know) => {
        setSelectedLanguages({ learn, know });
        setCurrentStep(2);
    };

    const handleBackToLanguages = () => {
        setCurrentStep(1);
    };

    const steps = [
        { number: 1, title: 'Choose Languages' },
        { number: 2, title: 'Create Account' }
    ];

    return (
        <div>
            <Header />
            <div className="min-h-screen max-w-4xl mx-auto px-6 py-8">
                <ProgressIndicator steps={steps} currentStep={currentStep} />

                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="language-selection"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LanguageSelection onNext={handleLanguageSelection} />
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="registration-form"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <RegistrationForm
                                selectedLanguages={selectedLanguages}
                                onBack={handleBackToLanguages}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RegisterPage;