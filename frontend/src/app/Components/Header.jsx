'use client'
import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-[1.5em] px-[10em] bg-[#FF7D29]/5  text-[#FF7D29] text-[2em]">
      <div>
        <Image
          src="/ZAlogo.png"
          alt="Logo"
          width={100}
          height={40}
          unoptimized={true}
        />
      </div>
      <div className="flex justify-between w-[8em] text-[1em]">
        <div>Login</div>
        <div>Signup</div>
      </div>
    </div>
  );
};

export default Header;
