export default function Trust() {
  return (
    <section className="py-16 px-6 bg-white text-center">
      
      <h2 className="text-3xl font-bold text-gray-800">
        Why Parents Trust Jilani Home Tutor
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-green-600">
            Experienced Tutors
          </h3>
          <p className="mt-2 text-gray-600">
            Qualified and verified teachers with strong subject knowledge
          </p>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-600">
            Proven Results
          </h3>
          <p className="mt-2 text-gray-600">
            Students improve marks within 1–2 months with proper guidance
          </p>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-purple-600">
            1-to-1 Personal Attention
          </h3>
          <p className="mt-2 text-gray-600">
            Individual focus ensures better understanding and confidence
          </p>
        </div>

      </div>

      {/* Testimonial */}
      <div className="mt-12 bg-gray-100 p-6 rounded-xl max-w-2xl mx-auto">
        <p className="text-gray-700 italic">
  {"My child improved from 60% to 85% in Maths within 2 months. Highly recommended!"}
</p>
        <p className="mt-2 font-semibold text-gray-900">
          – Parent from Raipur
        </p>
      </div>

    </section>
  );
}