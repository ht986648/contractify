"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaLinkedin } from "react-icons/fa";
import AnkurImage from "../assets/ankur.jpg";
import RoshanImage from "../assets/roshan.jpg";
import AshutoshImage from "../assets/ashutosh.jpg";

const teamMembers = [
  {
    name: "Ankur Dwivedi",
    role: "Founder & Developer",
    image: AnkurImage,
    linkedin: "https://www.linkedin.com/in/ankur-dwivedi-a82463258/",
  },
  {
    name: "Ashutosh Mishra",
    role: "Developer",
    image: AshutoshImage,
    linkedin: "https://www.linkedin.com/in/ashutosh-mishra-46a082238/",
  },
  {
    name: "Roshan",
    role: "Developer",
    image: RoshanImage,
    linkedin: "https://www.linkedin.com/in/roshan2003/",
  },
];

const TeamSection = () => {
  const ref = useRef(null); // Create a reference for the section
  const isInView = useInView(ref, { once: true, margin: "-200px" }); // Monitor if the section is in view

  return (
    <section ref={ref} className="bg-[#FAF4E7] py-12 px-4 md:px-12 lg:px-20">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-6xl font-bold text-gray-800">
          Our Team
        </h2>
        <p className="text-lg text-gray-600">Dedicated Experts</p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-16"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform w-60"
          >
            <img
              src={member.image.src || member.image}
              alt={member.name}
              className="w-full h-96 object-cover"
            />
            <div className="bg-[#FAF4E7] text-black p-4 text-center">
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-sm">{member.role}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-blue-600 mt-2 hover:underline"
              >
                <FaLinkedin className="mr-2" /> LinkedIn
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TeamSection;
