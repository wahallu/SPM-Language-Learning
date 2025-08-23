"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../Components/ui/Button';

const TeacherRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    department: '',
    qualifications: '',
    experience: '',
    specialization: [],
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const specializations = [
    { id: 'english', label: 'English Language', icon: '🇺🇸' },
    { id: 'sinhala', label: 'Sinhala Language', icon: '🇱🇰' },
    { id: 'tamil', label: 'Tamil Language', icon: '🇮🇳' },
    { id: 'spanish', label: 'Spanish Language', icon: '🇪🇸' },
    { id: 'french', label: 'French Language', icon: '🇫🇷' },
    { id: 'german', label: 'German Language', icon: '🇩🇪' },
    { id: 'conversation', label: 'Conversation Practice', icon: '💬' },
    { id: 'grammar', label: 'Grammar & Writing', icon: '📝' },
    { id: 'pronunciation', label: 'Pronunciation', icon: '🗣️' },
    { id: 'business', label: 'Business Language', icon: '💼' },
    { id: 'literature', label: 'Literature', icon: '📚' },
    { id: 'culture', label: 'Cultural Studies', icon: '🌍' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSpecializationToggle = (specId) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(specId)
        ? prev.specialization.filter(id => id !== specId)
        : [...prev.specialization, specId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }

    if (!formData.qualifications.trim()) {
      newErrors.qualifications = 'Qualifications are required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience details are required';
    }

    if (formData.specialization.length === 0) {
      newErrors.specialization = 'Please select at least one specialization';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        department: formData.department || "",
        qualifications: formData.qualifications,
        experience: formData.experience,
        specialization: formData.specialization,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      const response = await fetch('http://localhost:8080/api/teacher/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('Registration successful! Please wait for admin approval to access your teacher dashboard.');
        router.push('/teacher/login');
      } else {
        setErrors({ submit: result.message || result.error || 'Registration failed' });
      }

    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#FFEEE6] px-4 pt-4">
        <header className="bg-[#FFEEE6] flex justify-between items-center py-4 px-6 md:px-8 lg:px-12 text-[#FF7D29] max-w-6xl mx-auto rounded-2xl">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image 
              src="/ZAlogo.png" 
              alt="ZorsCode Academy" 
              width={160} 
              height={60}
              className="h-12 md:h-12 w-auto"
            />
          </Link>
          <div className="text-sm text-[#FF7D29] font-medium">
            Teacher Registration
          </div>
        </header>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-20 h-20 bg-[#FF7D29] rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-3xl text-white">👨‍🏫</span>
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Join as a Teacher
            </h1>
            <p className="text-gray-600">
              Create engaging lessons and inspire students worldwide
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <motion.div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.submit}
                </motion.div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your professional email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution/Organization *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                      errors.institution ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="University, School, etc."
                  />
                  {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all"
                    placeholder="Your department"
                  />
                </div>
              </div>

              {/* Qualifications and Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications *
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                    errors.qualifications ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="List your relevant qualifications, degrees, certifications..."
                />
                {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Experience *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your teaching experience, years of experience, subjects taught..."
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Teaching Specializations *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {specializations.map((spec) => (
                    <motion.button
                      key={spec.id}
                      type="button"
                      onClick={() => handleSpecializationToggle(spec.id)}
                      className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                        formData.specialization.includes(spec.id)
                          ? 'border-[#FF7D29] bg-orange-50 ring-2 ring-[#FF7D29]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{spec.icon}</span>
                        <span className="font-medium text-sm">{spec.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
              </div>

              {/* Password */}
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a secure password"
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF7D29] focus:border-transparent transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#FF7D29] bg-gray-100 border-gray-300 rounded focus:ring-[#FF7D29] focus:ring-2 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium">
                      Privacy Policy
                    </Link>
                    . I understand that my application will be reviewed and I will be contacted regarding approval status.
                  </span>
                </label>
                {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF7D29] hover:bg-[#FF9D5C] text-white py-4 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Submitting Application...
                    </div>
                  ) : (
                    'Submit Teacher Application'
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/teacher/login" 
                  className="text-[#FF7D29] hover:text-[#FF9D5C] font-medium"
                >
                  Sign in here
                </Link>
              </div>
            </form>
          </motion.div>

          {/* Application Process Info */}
          <motion.div
            className="mt-12 bg-orange-50 border border-orange-200 rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Application Process</h3>
              <p className="text-gray-600">Here's what happens after you submit your application:</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF7D29] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">1</div>
                <h4 className="font-semibold text-gray-800 mb-2">Submit Application</h4>
                <p className="text-sm text-gray-600">Complete the form with your teaching credentials</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF7D29] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">2</div>
                <h4 className="font-semibold text-gray-800 mb-2">Admin Review</h4>
                <p className="text-sm text-gray-600">Our team reviews your qualifications and experience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF7D29] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">3</div>
                <h4 className="font-semibold text-gray-800 mb-2">Approval</h4>
                <p className="text-sm text-gray-600">Receive approval notification (typically 3-5 business days)</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF7D29] rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">4</div>
                <h4 className="font-semibold text-gray-800 mb-2">Start Teaching</h4>
                <p className="text-sm text-gray-600">Access your teacher dashboard and create courses</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;