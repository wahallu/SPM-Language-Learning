"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../utils/translations";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const pathname = usePathname();
  
  // Only use language context on home page
  const isHomePage = pathname === '/';
  let language = 'en';
  let toggleLanguage = () => {};
  
  // Only access language context if we're on the home page
  if (isHomePage) {
    try {
      const languageContext = useLanguage();
      language = languageContext.language;
      toggleLanguage = languageContext.toggleLanguage;
    } catch (error) {
      // Fallback to default if context is not available
      console.warn('LanguageProvider not available, using default language');
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");

    if (authToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    // Update state
    setIsLoggedIn(false);
    setUsername("");

    // Redirect to home page
    window.location.href = "/";
  };

  const LanguageSwitcher = () => (
    <motion.div
      className="relative flex items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Switch Container */}
      <motion.button
        onClick={toggleLanguage}
        className="relative flex items-center w-20 h-10 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full border-2 border-[#FF7D29]/20 hover:border-[#FF7D29]/40 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background Track */}
        <div className="absolute inset-1 bg-white/50 rounded-full" />
        
        {/* Sliding Toggle */}
        <motion.div
          className="absolute top-1 w-8 h-8 bg-gradient-to-br from-[#FF7D29] to-[#FF9D5C] rounded-full shadow-lg flex items-center justify-center z-10"
          animate={{
            x: language === 'en' ? 2 : 42
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {/* Flag inside toggle */}
          <motion.div
            className="w-5 h-6 rounded-full overflow-hidden"
            animate={{ rotateY: language === 'en' ? 0 : 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Image
              src={language === 'en' ? "/flags/us.png" : "/flags/sri.png"}
              alt={language === 'en' ? "English" : "Sinhala"}
              width={20}
              height={20}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Language Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold">
          <motion.span
            className={`transition-colors duration-300 ${
              language === 'en' ? 'text-white' : 'text-[#FF7D29]'
            }`}
            animate={{
              scale: language === 'en' ? 0.8 : 1,
              opacity: language === 'en' ? 0.7 : 1
            }}
          >
            EN
          </motion.span>
          <motion.span
            className={`transition-colors duration-300 ${
              language === 'si' ? 'text-white' : 'text-[#FF7D29]'
            }`}
            animate={{
              scale: language === 'si' ? 0.8 : 1,
              opacity: language === 'si' ? 0.7 : 1
            }}
          >
            සි
          </motion.span>
        </div>

        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF7D29]/20 to-[#FF9D5C]/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Decorative Particles */}
      <motion.div
        className="absolute -inset-2 pointer-events-none"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FF7D29] rounded-full"
            style={{
              top: `${20 + i * 20}%`,
              left: `${80 + i * 30}%`
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {/* Normal header - always visible at top */}
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

          <div className="flex items-center gap-6 text-base md:text-lg">
            {/* Language Switcher - Only show on homepage */}
            {isHomePage && (
              <div className="mr-4">
                <LanguageSwitcher />
              </div>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">
                  {isHomePage ? t('welcome', language) : 'Welcome'}, {username}
                </span>
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-10 h-10 bg-[#FF7D29] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  </motion.button>

                  {showProfile && (
                    <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-[100]">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-800">
                          {username}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/student"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {isHomePage ? t('dashboard', language) : 'Dashboard'}
                        </Link>
                        <Link
                          href="/student/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {isHomePage ? t('settings', language) : 'Settings'}
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          {isHomePage ? t('signOut', language) : 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium hover:text-[#FF9D5C] transition-colors px-4 py-2 rounded-lg hover:bg-orange-50 w-30 text-center"
                >
                  <motion.span
                    key={`login-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isHomePage ? t('login', language) : 'Login'}
                  </motion.span>
                </Link>
                <Link
                  href="/register"
                  className="font-medium bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-all shadow-md hover:shadow-lg transform hover:scale-105 w-40 text-center"
                >
                  <motion.span
                    key={`signup-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isHomePage ? t('signup', language) : 'Sign Up'}
                  </motion.span>
                </Link>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Sticky header - only visible after 800px scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-all duration-300 ${
          isSticky
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <motion.header
          className="rounded-2xl max-w-6xl mx-auto bg-[#FFEEE6] flex justify-between items-center py-4 px-6 md:px-8 lg:px-12 text-[#FF7D29] transition-all duration-300 shadow-lg"
          initial={false}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/ZAlogo.png"
              alt="ZorsCode Academy"
              width={160}
              height={60}
              className="h-12 md:h-12 w-auto"
            />
          </Link>

          <div className="flex items-center gap-6 text-base md:text-lg">
            {/* Language Switcher - Only show on homepage */}
            {isHomePage && (
              <div className="mr-4">
                <LanguageSwitcher />
              </div>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  {isHomePage ? t('welcome', language) : 'Welcome'}, {username}
                </span>
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 bg-[#FF7D29] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  </motion.button>

                  {showProfile && (
                    <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-[100]">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-800">
                          {username}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/student"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {isHomePage ? t('dashboard', language) : 'Dashboard'}
                        </Link>
                        <Link
                          href="/student/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {isHomePage ? t('settings', language) : 'Settings'}
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          {isHomePage ? t('signOut', language) : 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium hover:text-[#FF9D5C] transition-colors px-4 py-2 rounded-lg hover:bg-orange-50 w-30 text-center"
                >
                  <motion.span
                    key={`sticky-login-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isHomePage ? t('login', language) : 'Login'}
                  </motion.span>
                </Link>
                <Link
                  href="/register"
                  className="font-medium bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-all shadow-md hover:shadow-lg transform hover:scale-105 w-40 text-center"
                >
                  <motion.span
                    key={`sticky-signup-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isHomePage ? t('signup', language) : 'Sign Up'}
                  </motion.span>
                </Link>
              </>
            )}
          </div>
        </motion.header>
      </div>
    </>
  );
};

export default Header;
