function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5">
      <h1 className="text-3xl font-bold text-blue-600">
        TaskFlow AI
      </h1>

      <ul className="flex gap-8 font-medium">
        <li>Home</li>
        <li>Features</li>
        <li>Contact</li>
      </ul>

      <div className="flex gap-3">
        <button className="border px-5 py-2 rounded-lg">
          Login
        </button>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default Navbar;