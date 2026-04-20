"use client";
import { useState } from "react";
import Reveal from "@/components/Reveal";
export default function LeadForm() {
  const [form, setForm] = useState({
    class: "",
    subject: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

  const handleSubmit = () => {
    const message = `New Lead:%0AClass: ${form.class}%0ASubject: ${form.subject}%0APhone: ${form.phone}`;
    
    window.open(`https://wa.me/917999854628?text=${message}`, "_blank");
  };

  return (
    <Reveal>
      <section id="form" className="py-20 md:py-24 px-6 bg-gray-100 text-center">
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Get a Perfect Tutor for Your Child!
        </h2>

        <p className="mt-3 text-gray-600 text-lg">
          Fill details and we will contact you within 24 hours
        </p>

        <div className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Class */}
            <select
            name="class"
            onChange={handleChange}
            className="p-3 border rounded-lg w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="" className="text-gray-400">Select Class</option>
            <option>Class 1-5</option>
            <option>Class 6-8</option>
            <option>Class 9-10</option>
            <option>Class 11-12</option>
            </select>

            {/* Subject */}
            <select
            name="subject"
            onChange={handleChange}
            className="p-3 border rounded-lg w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="" className="text-gray-400">Select Subject</option>
            <option>Maths</option>
            <option>Science</option>
            <option>English</option>
            </select>

            {/* Phone */}
            <input
            type="tel"
            name="phone"
            placeholder="Enter Phone Number"
            onChange={handleChange}
            className="w-full mt-4 p-3 border rounded-lg text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Get Free Demo
            </button>

          </div>
        </div>
      </section>
    </Reveal>
  );
}