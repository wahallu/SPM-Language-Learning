'use client'
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-[1.5em] px-[10em] bg-white text-[#FF7D29] text-[2em]">
      <div>ZorsCode Academy</div>
      <div className="flex justify-between w-[8em] text-[1em]">
        <div>Login</div>
        <div>Signup</div>
      </div>
    </div>
  );
};

export default Header;
