import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "📋",
      path: "/dashboard",
    },
    {
      name: "Add Task",
      icon: "➕",
      path: "/dashboard",
    },
    {
      name: "Profile",
      icon: "👤",
      path: "/profile",
    },
    {
      name: "Settings",
      icon: "⚙",
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700 text-white p-6">

      <h2 className="text-3xl font-extrabold text-cyan-400 mb-10">
        🚀 TaskFlow
      </h2>

      <ul className="space-y-3">

        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
            ${
              location.pathname === item.path
                ? "bg-cyan-600 text-white shadow-lg"
                : "hover:bg-slate-800 hover:text-cyan-400"
            }`}
          >
            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>
          </li>
        ))}

      </ul>

      <div className="mt-16 p-4 rounded-xl bg-slate-800 border border-slate-700">

        <h3 className="font-semibold text-cyan-400">
          🚀 TaskFlow AI
        </h3>

        <p className="text-sm text-gray-400 mt-2">
          Stay productive.
          Complete your daily tasks efficiently.
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;