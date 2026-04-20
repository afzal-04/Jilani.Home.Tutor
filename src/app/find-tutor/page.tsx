"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FindTutor() {
  const [form, setForm] = useState({
    class: "",
    subject: "",
    location: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const message = `New Tutor Request:%0AClass: ${form.class}%0ASubject: ${form.subject}%0ALocation: ${form.location}%0APhone: ${form.phone}`;
    window.open(`https://wa.me/917999854628?text=${message}`, "_blank");
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Struggling with Your Child’s Studies?
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Get expert home tutors in Raipur at your doorstep.
          </p>

          <p className="mt-2 text-green-600 font-semibold">
            📈 Guaranteed Improvement in Marks
          </p>

          <div className="mt-6 space-y-3 text-gray-700 text-base">
            <p>✔ 500+ Verified Tutors</p>
            <p>✔ Free Demo Class</p>
            <p>✔ 24hr Tutor Matching</p>
            <p>✔ Trusted by 100+ Parents</p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Get Started Now
          </h2>

          <div className="mt-6 space-y-4">

            {/* Class */}
            <select
              name="class"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Class</option>
              <option>Class 1-5</option>
              <option>Class 6-8</option>
              <option>Class 9-10</option>
              <option>Class 11-12</option>
            </select>

            {/* Subject */}
            <select
              name="subject"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Subject</option>
              <option>Maths</option>
              <option>Science</option>
              <option>English</option>
              <option>Physics</option>
            </select>

            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Enter Location (e.g. Shankar Nagar)"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              placeholder="Enter Phone Number"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Urgency */}
            <p className="text-sm text-red-500 text-center">
              ⚡ Limited tutors available today
            </p>

            {/* CTA */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition transform hover:scale-105"
            >
              Get Best Tutor Now
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}