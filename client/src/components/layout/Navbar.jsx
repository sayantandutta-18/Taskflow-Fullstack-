import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 shadow-lg">

      {/* Logo */}
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent cursor-pointer"
      >
        🚀 TaskFlow AI
      </h1>

      {/* Menu */}
      <ul className="hidden md:flex gap-8 font-medium text-gray-300">

        <li
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-cyan-400 transition"
        >
          Dashboard
        </li>

        <li
          onClick={() => navigate("/profile")}
          className="cursor-pointer hover:text-cyan-400 transition"
        >
          Profile
        </li>

        <li
          onClick={() => navigate("/settings")}
          className="cursor-pointer hover:text-cyan-400 transition"
        >
          Settings
        </li>

      </ul>

      {/* Buttons */}
      <div className="flex gap-3">

        <button
          onClick={() => navigate("/login")}
          className="border border-slate-600 px-5 py-2 rounded-lg hover:bg-slate-800 transition-all duration-300 hover:scale-105"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg text-white transition-all duration-300 hover:scale-105"
        >
          Register
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;