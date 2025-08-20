"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for auth token in localStorage
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);

  return (
    <section className="bg-white min-h-screen flex items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"
        style={{
          background:
            "linear-gradient(to bottom, #FFEEE6 100px, #FFEEE6 100px, transparent 50%)",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Mascot (previously Right Content) */}
          <div className="relative flex justify-center items-center">
            {/* Main Mascot */}
            <div className="text-center relative z-10">
              <Image
                src="/Gif/reading boy.gif"
                alt="Reading boy mascot"
                width={600}
                height={600}
                className="animate-float"
                unoptimized={true}
              />
            </div>
          </div>

          {/* Right Content - Text (previously Left Content) */}
          <div className="text-gray-600 space-y-10">
            <h1 className="text-2xl lg:text-4xl font-bold leading-tight text-center">
              The free, fun, and effective way to learn a language!
            </h1>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isLoggedIn ? (
                // Show "Continue Learning" button for logged-in users
                <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                  <Link href="/lessons">
                    <button className="bg-[#FF7D29] text-white px-40 py-4 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:transform hover:bg-[#FF9D5C]">
                      CONTINUE LEARNING
                    </button>
                  </Link>
                </div>
              ) : (
                // Show "Get Started" and "I Already Have An Account" buttons for visitors
                <>
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                    <Link href="/register">
                      <button className="bg-[#FF7D29] text-white px-40 py-4 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:transform hover:bg-[#FF9D5C]">
                        GET STARTED
                      </button>
                    </Link>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                    <Link href="/login">
                      <button className="bg-gray-100 text-[#1B9EDD] px-22 py-4 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] hover:transform hover:bg-gray-300">
                        I ALREADY HAVE AN ACCOUNT
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
            {/* Stats */}
          </div>
        </div>

        {/* Language selection line */}
        <div className="flex justify-center items-center mt-20 gap-4 overflow-x-auto py-4">
          <div className="flex items-center gap-10">
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
              <Image
                src="/flags/us.png"
                alt="English"
                width={30}
                height={24}
                className="rounded-sm"
                unoptimized={true}
              />
              <span className="text-gray-600 font-medium">ENGLISH</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
              <Image
                src="/flags/sri.png"
                alt="Spanish"
                width={30}
                height={24}
                className="rounded-sm"
                unoptimized={true}
              />
              <span className="text-gray-600 font-medium">SINHALA</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
              <Image
                src="/flags/india.png"
                alt="French"
                width={30}
                height={24}
                className="rounded-sm"
                unoptimized={true}
              />
              <span className="text-gray-600 font-medium">TAMIL</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
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
          background: radial-gradient(
              circle at 20% 80%,
              rgba(255, 125, 41, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(255, 125, 41, 0.1) 0%,
              transparent 50%
            );
        }
      `}</style>
    </section>
  );
};

export default Hero;
