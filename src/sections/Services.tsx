export default function Services() {
  return (
    <section className="py-16 px-6 bg-gray-50 text-center">
      
      <h2 className="text-3xl font-bold text-gray-800">
        Our Home Tuition Services in Raipur
      </h2>

      <p className="mt-2 text-gray-600">
        Personalized tutoring for every class and subject
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-600">
            Class 1 – 5
          </h3>
          <p className="mt-2 text-gray-600">
            Strong foundation in all subjects with fun learning
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-green-600">
            Class 6 – 10
          </h3>
          <p className="mt-2 text-gray-600">
            Focus on Maths, Science and exam preparation
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-600">
            Class 11 – 12
          </h3>
          <p className="mt-2 text-gray-600">
            Advanced subject expertise and board exam support
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="mt-10">
        <a
          href="https://wa.me/917999854628"
          className="bg-green-500 px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-600"
        >
          Book Free Demo Class
        </a>
      </div>

    </section>
  );
}