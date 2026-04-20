"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] flex items-center overflow-hidden bg-gray-50">

      {/* BACKGROUND IMAGE */}
      <Image
        src="hometutor/hero.jpg" // 👉 make sure this file exists in /public
        alt="Home Tutor"
        fill
        priority
        className="object-cover object-center"
      />

      {/* DARK BLUE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/50 to-transparent"></div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl text-white">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Struggling with <br />
            Your Child’s Studies?
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Get Expert Home Tutor in Raipur
          </p>

          <p className="mt-2 text-green-400 font-semibold">
            Improvement Guaranteed!
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4 flex-wrap">
            
            <a
              href="#form"
              className="bg-green-500 px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-600 transition transform hover:scale-105"
            >
              Book Free Demo
            </a>

            <a
              href="/find-tutor"
              className="bg-white px-6 py-3 rounded-lg text-blue-900 font-semibold hover:bg-gray-100 transition"
            >
              Find a Tutor
            </a>

          </div>

        </div>
      </div>

    </section>
  );
}