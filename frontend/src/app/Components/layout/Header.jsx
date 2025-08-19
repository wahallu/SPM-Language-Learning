'use client'

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

const Header = () => {
  return (
    <motion.header className="flex justify-between items-center py-6 px-4 md:px-20 bg-[#fffbf9] text-[#FF7D29]">
      <Link href="/" className="text-2xl md:text-3xl font-bold hover:text-[#FF9D5C] transition-colors">
        ZorsCode Academy
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
  );
};

export default Header;