export default function Problems() {
  return (
    <section className="py-20 md:py-24 px-6 bg-gray-50 text-center">
      <div className="max-w-6xl mx-auto"></div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
          Is Your Child Facing These Problems?
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-red-500">Low Marks</h3>
            <p className="mt-2 text-gray-600 text-lg leading-relaxed">
              Your child is scoring less despite studying
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-yellow-500">No Focus</h3>
            <p className="mt-2 text-gray-600 text-lg leading-relaxed">
              Easily distracted and unable to concentrate
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-blue-500">Weak in Maths/Science</h3>
            <p className="mt-2 text-gray-600 text-lg leading-relaxed">
              Struggling to understand core concepts
            </p>
          </div>
      </div>
    </section>
  );
}