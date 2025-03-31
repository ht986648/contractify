"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
const housImage = require("../assets/home.jpg");

const OnboardingPage = () => {
  const router = useRouter();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.3,
      },
    },
  };

  const handleGetStarted = () => {
    router.push("/signup");
  };

  return (
    <motion.main
      className='pt-8 bg-[#FAF4E7] sm:pt-8 pb-12 sm:pb-8 px-4 sm:px-6 lg:px-8'
      initial='hidden'
      animate='visible'
      variants={staggerContainer}
    >
      <div className='max-w-7xl bg-[#FAF4E7] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Left Column */}
          <motion.div className='space-y-6 sm:space-y-8' variants={fadeIn}>
            <div className='inline-block bg-[#FAF4E7]'>
              <motion.span
                className='bg-[#FAF4E7] text-[#C28500] px-4 py-2 rounded-full text-xs sm:text-sm font-medium'
                variants={fadeIn}
              >
                EFFORTLESS ESIGNING
              </motion.span>
            </div>

            <motion.h1
              className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-gray-900'
              variants={fadeIn}
            >
              Streamline Your Contract Management Process
            </motion.h1>

            <motion.p
              className='text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed'
              variants={fadeIn}
            >
              Generate, e-sign, and manage your contracts all in one secure
              platform with Contractify.
            </motion.p>

            <motion.div
              className='flex flex-col sm:flex-row gap-4'
              variants={fadeIn}
            >
              <button
                onClick={() => router.push("/choices")}
                className='bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-800 transition-all text-sm sm:text-lg'
              >
                Get Started
              </button>
              <button className='border-2 border-black text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-black hover:text-white transition-all text-sm sm:text-lg'>
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div className='relative bg-[#FAF4E7]' variants={fadeIn}>
            <div className='relative h-[300px] bg-[#FAF4E7] sm:h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl'>
              <Image
                src={housImage}
                alt='House key with coins'
                fill
                className='object-cover'
                priority
              />
              {/* Overlay gradient */}
              <div className='absolute inset-0 bg-gradient-to-t  from-black/20 to-transparent'></div>
            </div>

            {/* Testimonial Card */}
            <motion.div
              className='absolute bottom-[-2rem] mr-[13px] sm:bottom-[-2.5rem] right-[-1.5rem] sm:right-[-2rem] bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-[280px] sm:max-w-[320px] transform hover:scale-105 transition-transform'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className='flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold'>
                  A
                </div>
                <div>
                  <p className='font-semibold text-gray-900 text-sm sm:text-base'>
                    Alex Morrison
                  </p>
                  <p className='text-xs sm:text-sm text-gray-500'>
                    Contract Manager
                  </p>
                </div>
              </div>
              <div className='flex text-amber-400 mb-2 sm:mb-3'>★★★★★</div>
              <p className='text-gray-600 text-xs sm:text-sm'>
                "Contractify transformed our contract management process. The
                seamless eSigning feature is a game-changer!"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default OnboardingPage;
