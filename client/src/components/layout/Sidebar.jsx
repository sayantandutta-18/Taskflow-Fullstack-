function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        Dashboard
      </h2>

      <ul className="space-y-4">
        <li className="cursor-pointer hover:text-blue-400">
          📋 All Tasks
        </li>

        <li className="cursor-pointer hover:text-blue-400">
          ➕ Add Task
        </li>

        <li className="cursor-pointer hover:text-blue-400">
          👤 Profile
        </li>

        <li className="cursor-pointer hover:text-blue-400">
          ⚙ Settings
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;