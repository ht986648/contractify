"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

const ClientsSection = () => {
  const stats = [
    {
      value: 100,
      title: "Contracts Processed",
      description:
        "We have processed over 100+ contracts annually, showcasing our efficiency and reliability in contract management.",
    },
    {
      value: 5000,
      title: "Signed Contracts",
      description:
        "Our platform handles over 5000+ signed contracts every year, increasing your business's credibility and efficiency.",
    },
    {
      value: 2000,
      title: "Satisfied Clients",
      description:
        "Join our satisfied clients by leveraging our service, with 2000+ businesses already trusting us.",
    },
  ];

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Use `react-intersection-observer` to track when the section comes into view
  const { ref, inView } = useInView({
    threshold: 0.3, // Trigger when 30% of the section is visible
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="bg-[#FAF4E7] text-gray-800 py-16 px-6 md:px-12 lg:px-20"
    >
      {/* Header */}
      <motion.h2
        className="text-6xl font-bold text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInVariants}
      >
        Clients
      </motion.h2>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-[#FAF4E7] p-6 rounded-lg shadow-md"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 * index }}
            variants={fadeInVariants}
          >
            <h3 className="text-5xl font-bold mb-4 text-gray-800">
              {inView ? (
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2}
                  separator=","
                />
              ) : (
                0
              )}
              +
            </h3>
            <h4 className="text-xl font-semibold mb-2 text-gray-800">
              {stat.title}
            </h4>
            <p className="text-gray-600">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;
