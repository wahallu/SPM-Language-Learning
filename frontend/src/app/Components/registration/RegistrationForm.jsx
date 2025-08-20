"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';

const RegistrationForm = ({ selectedLanguages, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        goal: '',
        experience: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const goals = [
        { id: 'career', label: 'Career advancement', icon: '💼' },
        { id: 'travel', label: 'Travel and culture', icon: '✈️' },
        { id: 'education', label: 'Education', icon: '📚' },
        { id: 'family', label: 'Family and friends', icon: '👨‍👩‍👧‍👦' },
        { id: 'hobby', label: 'Personal interest', icon: '❤️' },
        { id: 'other', label: 'Other', icon: '🌟' }
    ];

    const experienceLevels = [
        { id: 'beginner', label: 'Complete beginner', description: "I'm new to this language" },
        { id: 'some', label: 'Some experience', description: "I know some basic words" },
        { id: 'intermediate', label: 'Intermediate', description: "I can have simple conversations" },
        { id: 'advanced', label: 'Advanced', description: "I'm quite comfortable with this language" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.age) {
            newErrors.age = 'Please select your age range';
        }

        if (!formData.goal) {
            newErrors.goal = 'Please select your learning goal';
        }

        if (!formData.experience) {
            newErrors.experience = 'Please select your experience level';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.name, // Using name as username
                    email: formData.email,
                    password: formData.password,
                    languageToLearn: selectedLanguages.learn.code,
                    languageKnown: selectedLanguages.know.code
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Store auth token in localStorage or cookies
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            
            // Store additional user preferences if needed
            localStorage.setItem('learningLanguage', selectedLanguages.learn.code);
            localStorage.setItem('knownLanguage', selectedLanguages.know.code);
            
            // Redirect to student dashboard
            router.push('/lessons');

        } catch (error) {
            console.error('Registration failed:', error);
            // Set appropriate error message
            if (error.message.includes('Email already registered')) {
                setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
            } else if (error.message.includes('Username already taken')) {
                setErrors(prev => ({ ...prev, name: 'This username is already taken' }));
            } else {
                alert('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center mb-4">
                    <Image
                        src="/Gif/Cup.gif"
                        alt="Achievement cup"
                        width={80}
                        height={80}
                        unoptimized={true}
                    />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Create your account
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        <Image
                            src={selectedLanguages.learn?.flag}
                            alt={selectedLanguages.learn?.name}
                            width={20}
                            height={20}
                            className="mr-2 rounded-sm"
                        />
                        Learning: {selectedLanguages.learn?.name}
                    </span>
                    <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        <Image
                            src={selectedLanguages.know?.flag}
                            alt={selectedLanguages.know?.name}
                            width={20}
                            height={20}
                            className="mr-2 rounded-sm"
                        />
                        I know: {selectedLanguages.know?.name}
                    </span>
                </div>
                <button
                    onClick={onBack}
                    className="text-[#FF7D29] hover:text-[#FF9D5C] text-sm font-medium"
                >
                    Change languages
                </button>
            </motion.div>

            {/* Form */}
            <motion.div
                className="bg-white rounded-2xl shadow-lg p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Age Range *
                            </label>
                            <select
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${errors.age ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select age range</option>
                                <option value="under-13">Under 13</option>
                                <option value="13-17">13-17</option>
                                <option value="18-25">18-25</option>
                                <option value="26-35">26-35</option>
                                <option value="36-50">36-50</option>
                                <option value="over-50">Over 50</option>
                            </select>
                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your email address"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Create a password"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    {/* Learning Goals */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            What's your main goal for learning {selectedLanguages.learn?.name}? *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {goals.map((goal) => (
                                <motion.button
                                    key={goal.id}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, goal: goal.id }))}
                                    className={`p-4 border rounded-xl text-left transition-all hover:scale-105 ${formData.goal === goal.id
                                            ? 'border-[#FF7D29] bg-orange-50 ring-2 ring-[#FF7D29]'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">{goal.icon}</span>
                                        <span className="font-medium">{goal.label}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                        {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            What's your current level in {selectedLanguages.learn?.name}? *
                        </label>
                        <div className="space-y-3">
                            {experienceLevels.map((level) => (
                                <motion.button
                                    key={level.id}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, experience: level.id }))}
                                    className={`w-full p-4 border rounded-xl text-left transition-all hover:scale-105 ${formData.experience === level.id
                                            ? 'border-[#FF7D29] bg-orange-50 ring-2 ring-[#FF7D29]'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="font-medium text-gray-800">{level.label}</div>
                                    <div className="text-sm text-gray-600">{level.description}</div>
                                </motion.button>
                            ))}
                        </div>
                        {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-4 text-lg relative"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                    Creating your account...
                                </div>
                            ) : (
                                'Create Account & Start Learning!'
                            )}
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium">
                            Sign in here
                        </a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegistrationForm;