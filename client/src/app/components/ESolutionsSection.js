import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import mapImage from "../assets/laptop.jpeg";
import laptopImage from "../assets/map.jpeg";
import patternImage from "../assets/bg1.jpeg";
import hammerIcon from "../assets/law2_about.png";

export default function ESolutionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
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
    <div className="bg-[#FAF4E7] min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-16"
        >
          {/* Left Content Section */}
          <motion.div
            variants={containerVariants}
            className="flex-1 space-y-6 lg:space-y-10 max-w-lg"
          >
            <div>
              <motion.p
                variants={itemVariants}
                className="text-[#C28500] text-sm font-medium tracking-wide uppercase mb-3"
              >
                Seamless Transition
              </motion.p>
              <motion.h1
                variants={itemVariants}
                className="text-gray-800 text-3xl sm:text-4xl lg:text-6xl font-serif mb-4 leading-tight tracking-tight"
              >
                Unmatched E-
                <br />
                Signing Solutions
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-gray-500 text-base sm:text-lg lg:text-xl leading-relaxed"
              >
                Our platform offers unparalleled eSigning capabilities that
                simplify your workflow and enhance security.
              </motion.p>
            </div>

            <motion.div variants={containerVariants} className="space-y-4">
              {[
                "E-signature Compliance",
                "Real-time Document Editing",
                "Templates and Clauses",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  <div className="bg-orange-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-[#C28500]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm sm:text-base lg:text-lg">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Images Grid */}
          <motion.div
            variants={containerVariants}
            className="flex-1 pt-[80px] mt-[30px] max-w-xl space-y-10"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="relative mt-[60px]">
                {/* Floating Animation for Hammer Icon */}
                <motion.div
                  variants={imageVariants}
                  animate={isInView ? floatingAnimation : {}}
                  className="mt-[-35px] mb-[4px] w-14 h-14 rounded-lg flex justify-center right-0 absolute -top-8 z-10"
                >
                  <Image
                    src={hammerIcon}
                    alt="Legal icon"
                    width={52}
                    height={52}
                    className="text-white"
                  />
                </motion.div>
                <motion.div
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={laptopImage}
                    alt="Map"
                    width={280}
                    height={400}
                    className="object-cover w-full h-[400px]"
                  />
                </motion.div>
              </div>
              <div className="mt-[-6px] space-y-6">
                <motion.div
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={mapImage}
                    alt="Laptop"
                    width={280}
                    height={400}
                    className="object-cover w-[220px] h-[280px]"
                  />
                </motion.div>
                <motion.div
                  variants={imageVariants}
                  animate={isInView ? floatingAnimation : {}}
                  className="relative mt-[-6px] h-[140px] w-[160px] overflow-hidden"
                >
                  <Image
                    src={patternImage}
                    alt="Pattern background"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
