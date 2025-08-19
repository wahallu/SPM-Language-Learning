"use client";
import React, { useState } from 'react';

const Getstart = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between items-center pt-36">
            {/* Main content with slogan */}
            <div className="flex-1 flex justify-center items-center">
                <h1 className="text-8xl md:text-7xl text-center text-[#FF7D29] px-5 ">
                    learn a language with <br /> zorscode academy
                </h1>
            </div><br/><br/><br/>
            
            <div className="flex flex-col items-center justify-center gap-6">
                {/* Button with hover effects */}
                <button 
                    className="bg-[#FF7D29] text-white px-40 py-4 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:transform hover:bg-[#FF9D5C] "
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    GET STARTED
                </button>
            </div>

            {/* Footer section with character overlay */}
            <div className="w-full flex justify-center pb-5 relative">
                {/* Background footer gif */}
                <img
                    src="/download.svg"
                    alt="Footer animation"
                    className="w-full h-auto object-cover"
                />
                
                {/* Character images overlay */}
                <div className="absolute inset-0 flex justify-center items-center">
                    <div className="relative w-64 h-64">
                        
                        {/* GIF Image - appears on hover */}
                        <img
                            src="/Gif/Hii.gif"
                            alt="Hello animation"
                            className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 -translate-y-6.5 ${
                                isHovered ? 'opacity-100 scale-170' : 'opacity-0 scale-90'
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Getstart;