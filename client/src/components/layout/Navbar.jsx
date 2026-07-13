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
        <button
          onClick={() => navigate("/login")}
          className="border px-5 py-2 rounded-lg"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Get Started
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;