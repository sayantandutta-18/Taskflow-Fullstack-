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
      name: "Calendar",
      icon: "📅",
      path: "/calendar",
    },
    {
      name: "Focus Room",
      icon: "⏱️",
      path: "/focus",
    },
    {
      name: "Arcade Games",
      icon: "🎮",
      path: "/games",
    },
    {
      name: "Insights",
      icon: "📊",
      path: "/insights",
    },
    {
      name: "Profile",
      icon: "👤",
      path: "/profile",
    },
    {
      name: "Settings",
      icon: "⚙️",
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900/95 border-r border-slate-800 text-white p-5 hidden md:flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <span className="text-2xl">🚀</span>
          <div>
            <h2 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TaskFlow AI
            </h2>
            <p className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
              Pro Workspace
            </p>
          </div>
        </div>

        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 font-semibold"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mt-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold text-gray-300">
            TaskFlow AI
          </h3>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
          Productivity elevated with 3D visuals & gamification.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;