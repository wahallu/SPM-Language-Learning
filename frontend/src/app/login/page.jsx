"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/layout/Header';
import LoginForm from '../components/auth/LoginForm';
import ForgotPassword from '../components/auth/ForgotPassword';

const LoginPage = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'forgot'

  const handleForgotPassword = () => {
    setCurrentView('forgot');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-md mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {currentView === 'login' && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm onForgotPassword={handleForgotPassword} />
            </motion.div>
          )}
          
          {currentView === 'forgot' && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ForgotPassword onBack={handleBackToLogin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;