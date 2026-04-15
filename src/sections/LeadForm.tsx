"use client";
import { useState } from "react";

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
    <section id="form" className="py-16 px-6 bg-white text-center">
      
      <h2 className="text-3xl font-bold text-gray-800">
        Book Your Free Demo Class
      </h2>

      <p className="mt-2 text-gray-600">
        Fill details and we will contact you within 24 hours
      </p>

      <div className="mt-10 max-w-md mx-auto bg-gray-100 p-6 rounded-xl shadow">
        
        {/* Class */}
        <select
          name="class"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg border"
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
          className="w-full p-3 mb-4 rounded-lg border"
        >
          <option value="">Select Subject</option>
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
          className="w-full p-3 mb-4 rounded-lg border"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
        >
          Get Free Demo
        </button>

      </div>
    </section>
  );
}