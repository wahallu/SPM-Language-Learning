import React from "react";
import Image from "next/image";

const Benefit = () => {
  return (
    <div className="w-screen h-auto px-[15em] py-[1.5em] flex flex-col justify-center items-center bg-white">
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <div className="text-[#FF7D29] text-5xl">free. fun. effective.</div>
          <div
            className="text-gray-700 text-lg my-4 font-normal w-4/5"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            Learning with Duolingo is fun, and{" "}
            <span className="text-[#1cb0f6]">
              research shows that it works!
            </span>{" "}
            With quick, bite-sized lessons, you'll earn points and unlock new
            levels while gaining real-world communication skills.
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/Cup.gif"
            alt="Learning achievement cup animation"
            width={700}
            height={700}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/Person1.gif"
            alt="Learning achievement cup animation"
            width={500}
            height={500}
          />
        </div>
        <div className="w-1/2">
          <div className="text-[#FF7D29] text-5xl">backed by science</div>
          <div
            className="text-gray-700 text-lg my-4 font-normal w-4/5"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            We use a combination of research-backed teaching methods and
            delightful content to create courses that effectively teach reading,
            writing, listening, and speaking skills!
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <div className="text-[#FF7D29] text-5xl">stay motivated</div>
          <div
            className="text-gray-700 text-lg my-4 font-normal w-4/5"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            We make it easy to form a habit of language learning with game-like
            features, fun challenges, and reminders from our friendly mascot,
            Duo the owl.
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/Robot.gif"
            alt="Learning achievement cup animation"
            width={500}
            height={500}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/readingboy2.gif"
            alt="Learning achievement cup animation"
            width={500}
            height={500}
          />
        </div>
        <div className="w-1/2">
          <div className="text-[#FF7D29] text-5xl">backed by science</div>
          <div
            className="text-gray-700 text-lg my-4 font-normal w-4/5"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            We use a combination of research-backed teaching methods and
            delightful content to create courses that effectively teach reading,
            writing, listening, and speaking skills!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefit;
