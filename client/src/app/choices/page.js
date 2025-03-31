"use client";
import { useState } from "react";
import { Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ChoicesPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleRoleSelect = (role) => {
    // Store user type in localStorage
    localStorage.setItem("userType", role);

    // Navigate to login page without user type in URL
    router.push("/login");
  };

  return (
    <motion.div
      className='min-h-screen flex items-center justify-center bg-white px-6 py-12'
      initial='hidden'
      animate='visible'
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.5, staggerChildren: 0.1 },
        },
      }}
    >
      <motion.div
        className='w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center'
        variants={fadeIn}
      >
        {/* Text Section */}
        <div className='text-center md:text-left space-y-8 order-1'>
          <motion.div variants={fadeIn}>
            <span className='bg-amber-100 text-amber-800 px-5 py-2.5 rounded-full text-sm sm:text-base font-medium inline-block'>
              Choose Your Role
            </span>
          </motion.div>

          <motion.h2
            variants={fadeIn}
            className='text-4xl md:text-5xl font-serif font-bold text-gray-900'
          >
            Select Your Professional Path
          </motion.h2>

          <motion.p
            variants={fadeIn}
            className='text-gray-700 text-lg md:text-xl'
          >
            Discover the right role for your professional journey.
          </motion.p>
        </div>

        {/* Buttons Section */}
        <div className='space-y-6 order-2 md:order-2'>
          <button
            onClick={() => handleRoleSelect("contractor")}
            className={`w-full flex items-center justify-center py-5 px-8 border border-transparent rounded-2xl shadow-xl text-lg font-semibold transition-all ${
              hovered === "contractor"
                ? "bg-black text-white scale-110"
                : "bg-white text-black border-gray-400 hover:bg-gray-100"
            }`}
            onMouseEnter={() => setHovered("contractor")}
            onMouseLeave={() => setHovered(null)}
          >
            <Briefcase className='h-8 w-8 mr-4' />
            <div className='text-left'>
              <span className='block text-xl font-bold'>Contractor</span>
              <p className='text-base opacity-70'>I want to provide services</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("contractee")}
            className={`w-full flex items-center justify-center py-5 px-8 border border-transparent rounded-2xl shadow-xl text-lg font-semibold transition-all ${
              hovered === "contractee"
                ? "bg-black text-white scale-110"
                : "bg-white text-black border-gray-400 hover:bg-gray-100"
            }`}
            onMouseEnter={() => setHovered("contractee")}
            onMouseLeave={() => setHovered(null)}
          >
            <Users className='h-8 w-8 mr-4' />
            <div className='text-left'>
              <span className='block text-xl font-bold'>Contractee</span>
              <p className='text-base opacity-70'>I need professional services</p>
            </div>
          </button>

          <motion.p
            variants={fadeIn}
            className='text-center text-base text-gray-700 mt-6'
          >
            Not sure?{" "}
            <a href='#' className='font-medium text-black hover:text-gray-900'>
              Learn more about roles
            </a>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
