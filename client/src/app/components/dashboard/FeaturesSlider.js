"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    title: "Smart Contract Management",
    description:
      "Centralize and organize all your contracts in one place with ease. Streamline your workflow and ensure compliance with automated contract tracking.",
    icon: "🤝",
    image: "/images/contract-management.png", // Add image paths
  },
  {
    title: "Automated Renewals",
    description:
      "Never miss a contract renewal with smart notifications and reminders. Stay ahead of deadlines and avoid costly lapses.",
    icon: "🔄",
    image: "/images/automated-renewals.png",
  },
  {
    title: "Analytics & Insights",
    description:
      "Gain deep insights into your contract performance and optimize your workflow. Make data-driven decisions with real-time analytics.",
    icon: "📊",
    image: "/images/analytics.png",
  },
  {
    title: "Secure Document Storage",
    description:
      "Keep your contracts safe with bank-grade encryption and access control. Ensure data privacy and compliance with industry standards.",
    icon: "🔒",
    image: "/images/secure-storage.png",
  },
];

export default function FeaturesSlider() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className='w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden'>
      <div className='flex flex-col md:flex-row items-center'>
        {/* Feature Details */}
        <div className='md:w-1/2 mb-8 md:mb-0 md:pr-10'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className='text-4xl font-bold text-blue-900 mb-4 tracking-wide'>
                {features[currentFeature].title}
              </h2>
              <p className='text-gray-700 text-lg mb-6 leading-relaxed'>
                {features[currentFeature].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Feature Navigation Dots */}
          <div className='flex space-x-3 mb-6'>
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentFeature === index ? "bg-blue-600 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className='flex space-x-4'>
            <button
              onClick={prevFeature}
              className='p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all'
            >
              ←
            </button>
            <button
              onClick={nextFeature}
              className='p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all'
            >
              →
            </button>
          </div>
        </div>

        {/* Feature Icon and Image */}
        <div className='md:w-1/2 flex justify-center items-center'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className='relative'
            >
              <div className='text-9xl text-blue-700 mb-6'>
                {features[currentFeature].icon}
              </div>
              <Image
                src={features[currentFeature].image}
                alt={features[currentFeature].title}
                width={400}
                height={300}
                className='rounded-lg shadow-lg'
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Background Gradient */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-30 pointer-events-none' />
    </div>
  );
}
