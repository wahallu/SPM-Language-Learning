'use client'
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-[1.5em] px-[20em] bg-white text-black">
      <div>Logo</div>
      <div className="flex justify-between w-[8em]">
        <div>Login</div>
        <div>Signup</div>
      </div>
    </div>
  );
};

export default Header;
