"use client";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function Services() {
  return (
    <section className="py-20 px-6 bg-gray-50 text-center">
      
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
        Our Home Tuition Services in Raipur
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        
        <motion.div variants={item} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
          <h3 className="text-xl font-semibold text-blue-600">Class 1–5</h3>
          <p className="mt-2 text-gray-600">Strong foundation</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
          <h3 className="text-xl font-semibold text-green-600">Class 6–10</h3>
          <p className="mt-2 text-gray-600">Maths & Science focus</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
          <h3 className="text-xl font-semibold text-purple-600">Class 11–12</h3>
          <p className="mt-2 text-gray-600">Board exam prep</p>
        </motion.div>

      </motion.div>

    </section>
  );
}