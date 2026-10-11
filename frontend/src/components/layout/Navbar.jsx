import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Calendar", path: "/calendar" },
    { name: "Focus Room", path: "/focus" },
    { name: "Games", path: "/games" },
    { name: "Insights", path: "/insights" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div
          onClick={() => navigate(token ? "/dashboard" : "/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">
            🚀
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            TaskFlow AI
          </span>
        </div>

        {/* Desktop Links (if logged in) */}
        {token && (
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
            {navLinks.map((link) => (
              <li
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`cursor-pointer transition-colors py-1 ${
                  location.pathname === link.path
                    ? "text-cyan-400 font-bold border-b-2 border-cyan-400"
                    : "hover:text-cyan-300 text-gray-300"
                }`}
              >
                {link.name}
              </li>
            ))}
          </ul>
        )}

        {/* Right CTA / Auth Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {token ? (
            <>
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500 cursor-pointer transition text-xs font-semibold text-gray-200"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user?.name ? user.name[0] : "U"}
                </div>
                <span>{user?.name || "Profile"}</span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="border border-slate-700 hover:bg-slate-800 text-gray-200 text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 pb-2">
          {token ? (
            <>
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? "bg-cyan-600/20 text-cyan-400 font-bold"
                      : "text-gray-300 hover:bg-slate-800"
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 text-center py-2 bg-slate-800 rounded-lg text-xs font-semibold text-gray-300"
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 text-center py-2 bg-red-600 rounded-lg text-xs font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center rounded-lg border border-slate-700 text-gray-300 text-xs font-semibold"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center rounded-lg bg-cyan-600 text-white text-xs font-semibold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;