"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../utils/translations";

const Benefit = () => {
  const { language } = useLanguage();

  return (
    <div className="w-screen h-auto px-[15em] py-[1.5em] flex flex-col justify-center items-center bg-white">
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-1/2">
          <motion.div
            key={`title1-${language}`}
            className={`text-[#FF7D29] text-5xl ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("benefitTitle1", language)}
          </motion.div>
          <motion.div
            key={`desc1-${language}`}
            className={`text-gray-700 text-lg my-4 font-normal w-4/5 ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            style={{
              fontFamily:
                language === "si"
                  ? "Noto Sans Sinhala, Arial, Helvetica, sans-serif"
                  : "Arial, Helvetica, sans-serif",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("benefitDesc1", language).split(t("researchWorks", language))[0]}
            <span className="text-[#1cb0f6]">
              {t("researchWorks", language)}
            </span>
            {t("benefitDesc1", language).split(t("researchWorks", language))[1]}
          </motion.div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/Cup.gif"
            alt="Learning achievement cup animation"
            width={700}
            height={700}
          />
        </div>
      </motion.div>

      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/Person1.gif"
            alt="Learning achievement cup animation"
            width={500}
            height={500}
          />
        </div>
        <div className="w-1/2">
          <motion.div
            key={`title2-${language}`}
            className={`text-[#FF7D29] text-5xl ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("benefitTitle2", language)}
          </motion.div>
          <motion.div
            key={`desc2-${language}`}
            className={`text-gray-700 text-lg my-4 font-normal w-4/5 ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            style={{
              fontFamily:
                language === "si"
                  ? "Noto Sans Sinhala, Arial, Helvetica, sans-serif"
                  : "Arial, Helvetica, sans-serif",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("benefitDesc2", language)}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="w-1/2">
          <motion.div
            key={`title3-${language}`}
            className={`text-[#FF7D29] text-5xl ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("benefitTitle3", language)}
          </motion.div>
          <motion.div
            key={`desc3-${language}`}
            className={`text-gray-700 text-lg my-4 font-normal w-4/5 ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            style={{
              fontFamily:
                language === "si"
                  ? "Noto Sans Sinhala, Arial, Helvetica, sans-serif"
                  : "Arial, Helvetica, sans-serif",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("benefitDesc3", language)}
          </motion.div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/Robot.gif"
            alt="Learning achievement cup animation"
            width={500}
            height={500}
          />
        </div>
      </motion.div>

      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/Gif/readingboy2.gif"
            alt="Learning achievement cup animation"
            width={500}
            height={500}
          />
        </div>
        <div className="w-1/2">
          <motion.div
            key={`title4-${language}`}
            className={`text-[#FF7D29] text-5xl ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("benefitTitle4", language)}
          </motion.div>
          <motion.div
            key={`desc4-${language}`}
            className={`text-gray-700 text-lg my-4 font-normal w-4/5 ${
              language === "si" ? "font-noto-sans-sinhala" : ""
            }`}
            style={{
              fontFamily:
                language === "si"
                  ? "Noto Sans Sinhala, Arial, Helvetica, sans-serif"
                  : "Arial, Helvetica, sans-serif",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("benefitDesc4", language)}
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;500;600;700&display=swap");

        .font-noto-sans-sinhala {
          font-family: "Noto Sans Sinhala", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Benefit;
