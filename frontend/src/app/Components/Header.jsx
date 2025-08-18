'use client'
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-[1.5em] px-[15em] bg-white text-black text-2xl">
      <div>ZorsCode - Academy</div>
      <div className="flex justify-between w-[8em] text-2xl">
        <div>Login</div>
        <div>Signup</div>
      </div>
    </div>
  );
};

export default Header;
