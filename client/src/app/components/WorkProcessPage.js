import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import bakingImage from "../assets/baking.jpg";

const WorkProcess = () => {
  const ref = React.useRef(null); // Reference for the section
  const isInView = useInView(ref, { once: true, margin: "-200px" }); // Trigger animation when it's close to the viewport

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3, // Delay between children
      },
    },
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref} // Reference for in-view detection
      className="bg-[#FAF4E7] py-16 md:py-24 overflow-hidden"
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"} // Trigger animation based on visibility
      >
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={itemVariants}
        >
          <h3 className="text-[#C28500] text-sm md:text-base uppercase tracking-wide font-medium mb-4">
            Streamlined Steps
          </h3>
          <h2 className="text-[#1A1A1A] text-4xl md:text-5xl font-bold font-serif">
            Our Work Process
          </h2>
        </motion.div>

        {/* Content Section */}
        <motion.div className="relative" variants={itemVariants}>
          {/* Image Container */}
          <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
            <Image
              src={bakingImage}
              alt="Baking Process"
              fill
              className="object-cover"
              priority
            />

            {/* Text Overlay */}
            <motion.div
              className="absolute bottom-8 left-8 bg-[#f8f6ed] p-8 md:p-10 max-w-xs md:max-w-md lg:max-w-lg shadow-lg rounded-md"
              variants={itemVariants}
            >
              <h3 className="text-[#1A1A1A] text-xl md:text-2xl font-serif font-semibold mb-4">
                eSigning
              </h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Our work process revolves around efficient contract management,
                providing you an effortless experience from creation to signing.
              </p>
              <div className="w-12 h-1 bg-[#C5A572] mt-6"></div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WorkProcess;
