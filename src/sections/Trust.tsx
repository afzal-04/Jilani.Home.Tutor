"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Reveal from "@/components/Reveal";
export default function Trust() {
  return (
    <Reveal>
      <section className="py-20 md:py-24 px-6 bg-gray-50 text-center">
        
        <h2 className="text-3xl font-bold text-gray-800">
          Why Choose Jilani Home Tutor?
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
            <Image src="hometutor/tutor1.jpg" alt="Teacher" width={400} height={250} className="w-full h-52 object-cover" />
            <div className="bg-blue-900 text-white p-4">
              <h3 className="font-semibold">Experienced Teachers</h3>
              <p className="text-sm">5+ Years Experience</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
            <Image src="hometutor/tutor2.jpg" alt="Results" width={400} height={250} className="w-full h-52 object-cover" />
            <div className="bg-blue-900 text-white p-4">
              <h3 className="font-semibold">Proven Results</h3>
              <p className="text-sm">Personalized Attention</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
            <Image src="hometutor/tutor3.jpg" alt="1 to 1" width={400} height={250} className="w-full h-52 object-cover" />
            <div className="bg-blue-900 text-white p-4">
              <h3 className="font-semibold">1-to-1 Learning</h3>
              <p className="text-sm">At Your Home</p>
            </div>
          </motion.div>

        </div>
      </section>
    </Reveal>

  );
}