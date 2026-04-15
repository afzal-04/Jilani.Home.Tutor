import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center text-white">
      
      {/* Background Image */}
      <Image
        src="/hero.jpg" // 👈 add this image in public folder
        alt="Home Tutor"
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 text-center md:text-left">
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Struggling with <br /> Your Child’s Studies?
        </h1>

        <p className="mt-4 text-lg md:text-xl">
          Get Expert Home Tutor in Raipur
        </p>

        <p className="mt-2 text-green-300 font-semibold">
          Improvement Guaranteed!
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          
          <a
            href="https://wa.me/917999854628"
            className="bg-green-500 px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-600"
          >
            Book Free Demo
          </a>

          <a
            href="#form"
            className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold"
          >
            Find a Tutor
          </a>

        </div>

      </div>
    </section>
  );
}