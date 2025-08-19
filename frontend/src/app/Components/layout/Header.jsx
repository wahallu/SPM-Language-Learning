'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          </div>
        </header>
      </div>

      {/* Sticky header - only visible after 800px scroll */}
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-all duration-300 ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
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
          </div>
        </motion.header>
      </div>
    </>
  );
};

export default Header;