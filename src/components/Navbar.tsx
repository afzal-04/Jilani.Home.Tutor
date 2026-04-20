"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO + NAME */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="hometutor/logo.png" 
            alt="Jilani Home Tutor"
            width={45}
            height={45}
          />
          <span className="text-xl font-bold text-gray-800">
            Jilani Home Tutor
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/#services" className="hover:text-blue-600 transition">
            Services
          </Link>
          <Link href="/find-tutor" className="hover:text-blue-600 transition">
            Find Tutor
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        {/* CTA BUTTON */}
        <div className="flex items-center gap-4">
          
          <a
            href="#form"
            className="hidden md:inline-block bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Book Demo
          </a>

          {/* MOBILE MENU ICON (future use) */}
          <button className="md:hidden text-gray-700 text-2xl">
            ☰
          </button>

        </div>

      </div>
    </header>
  );
}