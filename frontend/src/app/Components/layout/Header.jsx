"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showProfile, setShowProfile] = useState(false);

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
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Welcome, {username}</span>
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
                          Dashboard
                        </Link>
                        <Link
                          href="/student/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign Out
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
                  className="font-medium hover:text-[#FF9D5C] transition-colors px-4 py-2 rounded-lg hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="font-medium bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Signup
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
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Welcome, {username}
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
                          Dashboard
                        </Link>
                        <Link
                          href="/student/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign Out
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
                  className="font-medium hover:text-[#FF9D5C] transition-colors px-4 py-2 rounded-lg hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="font-medium bg-[#FF7D29] text-white px-6 py-2 rounded-lg hover:bg-[#FF9D5C] transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Signup
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
