import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import lockImage from "../assets/lock.jpg";
import people from "../assets/about_hero.jpg";
import yellowPattern from "../assets/bg_about.png";
import scalesIcon from "../assets/law_about.png";
import lawOrder from "../assets/law2_about.png";

const AboutPage = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <div className="bg-[#FAF4E7] min-h-screen flex items-center justify-center py-8 sm:py-12">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Left Section */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center min-h-[400px] sm:min-h-[500px] order-2 lg:order-1">
          {/* Yellow Pattern */}
          <motion.div
            className="absolute top-[-30px] sm:top-[-50px] left-[-20px] sm:left-[-40px] z-0 hidden lg:block"
            variants={imageVariants}
            animate={isInView ? floatingAnimation : {}}
          >
            <Image
              src={yellowPattern}
              alt="Yellow Pattern"
              width={150}
              height={150}
              className="object-cover w-[150px] sm:w-[200px]"
            />
          </motion.div>

          {/* Lock Image */}
          <motion.div
            className="relative z-10 block"
            variants={imageVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={lockImage}
              alt="Lock Image"
              width={240}
              height={360}
              className="object-cover rounded-md shadow-md w-[240px] sm:w-[300px]"
            />
          </motion.div>

          {/* Scales Icon */}
          <motion.div
            className="absolute top-[360px] sm:top-[480px] left-[120px] sm:left-[160px] z-20 hidden lg:block"
            variants={imageVariants}
            animate={isInView ? floatingAnimation : {}}
          >
            <Image
              src={scalesIcon}
              alt="Scales Icon"
              width={60}
              height={60}
              className="object-contain w-[60px] sm:w-[80px]"
            />
          </motion.div>

          {/* Law Order Icon */}
          <motion.div
            className="absolute bottom-[180px] sm:bottom-[230px] right-[-100px] sm:right-[-180px] z-20 hidden lg:block"
            variants={imageVariants}
            animate={isInView ? floatingAnimation : {}}
          >
            <Image
              src={lawOrder}
              alt="Law Order Icon"
              width={60}
              height={60}
              className="object-contain w-[60px] sm:w-[80px]"
            />
          </motion.div>

          {/* People Image */}
          <motion.div
            className="absolute bottom-[-30px] sm:bottom-[-50px] right-[-120px] sm:right-[-220px] z-10 hidden lg:block"
            variants={imageVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={people}
              alt="People Image"
              width={120}
              height={200}
              className="object-cover rounded-md shadow-lg w-[120px] sm:w-[150px]"
            />
          </motion.div>
        </div>

        {/* Right Section */}
        <motion.div
          className="flex flex-col justify-center order-1 lg:order-2 text-center lg:text-left px-4 sm:px-0"
          variants={containerVariants}
        >
          <motion.p
            className="text-[#C28500] text-xs sm:text-sm uppercase mb-2 sm:mb-4"
            variants={itemVariants}
          >
            Trusted Solutions
          </motion.p>
          <motion.h1
            className="text-black text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 sm:mt-4"
            variants={itemVariants}
          >
            About Contractify
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl font-medium text-black mt-2"
            variants={itemVariants}
          >
            eSigning, automation, management
          </motion.p>
          <motion.p
            className="text-gray-600 text-sm sm:text-base leading-relaxed mt-4 sm:mt-8"
            variants={itemVariants}
          >
            At Contractify, we revolutionize how you manage contracts - easy
            eSigning, automated generation, and enhanced compliance for your
            business.
          </motion.p>
          <motion.a
            href="#"
            className="mt-4 sm:mt-6 text-black font-medium hover:underline inline-block"
            variants={itemVariants}
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
