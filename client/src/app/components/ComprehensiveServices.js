"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const eSigningImage = require("../assets/esigning.jpeg");
const contract_genrationImage = require("../assets/contract_genration.jpeg");
const automated_workflows = require("../assets/automated_workflows.jpeg");
const secure_storage = require("../assets/secure_storage.jpeg");

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const cards = [
    {
      title: "eSigning",
      description: "Quickly sign contracts from anywhere anytime.",
      image: eSigningImage,
    },
    {
      title: "Contract Generation",
      description: "Generate contracts in minutes with templates.",
      image: contract_genrationImage,
    },
    {
      title: "Automated Workflows",
      description:
        "Streamline your contract processes efficiently with our tools.",
      image: automated_workflows,
    },
    {
      title: "Secure Storage",
      description: "Store contracts securely and access them easily with us.",
      image: secure_storage,
    },
  ];

  return (
    <motion.div
      ref={sectionRef}
      className="bg-[#FAF4E7] mt-6 py-16 px-6 md:px-12 lg:px-32 relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h2
          className="text-sm font-medium text-[#C28500] tracking-wide uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          Simplifying Contracts
        </motion.h2>
        <motion.h1
          className="text-4xl font-bold text-black mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Our Comprehensive Services
        </motion.h1>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="relative bg-[#fad481] shadow-lg rounded-lg overflow-hidden"
            style={{ height: "300px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : {} /* Ensures items remain visible after animation */
            }
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover opacity-40"
              priority={true}
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-2xl font-semibold text-black mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-black">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Button Section */}
      <div className="text-center mt-12">
        <motion.button
          className="bg-black text-white text-lg py-3 px-8 rounded-lg"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 },
          }}
        >
          Explore Services
        </motion.button>
      </div>
    </motion.div>
  );
}
