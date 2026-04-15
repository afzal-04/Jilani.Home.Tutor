export default function Navbar() {
  return (
    
    <header className="fixed top-0 left-0 w-full bg-blue-900 text-white z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        
        <h1 className="font-bold text-lg">Jilani Home Tutor</h1>

        <nav className="hidden md:flex gap-6">
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">Find Tutor</a>
          <a href="#">Contact</a>
        </nav>

        <a
          href="#form"
          className="bg-green-500 px-4 py-2 rounded-lg"
        >
          Book Demo
        </a>

      </div>
    </header>
  );
}   