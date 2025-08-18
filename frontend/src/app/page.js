'use client'

import React from 'react';

const Hero = () => {
  return (
    <section className="bg-white min-h-screen flex items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FF7D29]/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-[#FF7D29] space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-shadow-lg">
              Learn Languages the Fun Way! 🌟
            </h1>
            
            <p className="text-xl lg:text-2xl leading-relaxed text-gray-700">
              Join thousands of kids on an amazing language adventure! 
              Play games, earn stars, and become a language superstar! ⭐
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#FF7D29] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform hover:bg-[#FF6B14]">
                Start Learning 🚀
              </button>
              <button className="bg-white text-[#FF7D29] border-2 border-[#FF7D29] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#FF7D29] hover:text-white hover:-translate-y-1 transition-all duration-300 transform shadow-lg">
                Watch Video 📺
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7D29]">1M+</div>
                <div className="text-sm text-gray-600">Happy Kids</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7D29]">15+</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF7D29]">100+</div>
                <div className="text-sm text-gray-600">Fun Games</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Mascot */}
          <div className="relative flex justify-center items-center">
            {/* Main Mascot */}
            <div className="text-center relative z-10">
              <div className="text-8xl mb-6 animate-bounce">
                🦉
              </div>
              
              {/* Speech Bubble */}
              <div className="bg-[#FF7D29] text-white px-6 py-4 rounded-2xl font-bold relative shadow-lg max-w-xs mx-auto">
                Hi there! Ready to learn?
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#FF7D29]"></div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-[10%] left-[10%] text-3xl animate-float">🌈</span>
              <span className="absolute top-[20%] right-[10%] text-3xl animate-float-delayed-1">⭐</span>
              <span className="absolute bottom-[30%] left-[5%] text-3xl animate-float-delayed-2">🎯</span>
              <span className="absolute bottom-[10%] right-[20%] text-3xl animate-float-delayed-3">🏆</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed-1 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .animate-float-delayed-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-delayed-3 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at 20% 80%, rgba(255, 125, 41, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 125, 41, 0.1) 0%, transparent 50%);
        }
      `}</style>
    </section>
  );
};

export default Hero;