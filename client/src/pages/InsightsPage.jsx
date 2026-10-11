import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function InsightsPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Insights fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Compute truthful database stats
  const totalCreated = tasks.length;
  const activeTasks = tasks.filter((t) => !t.archived);
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const pendingTasks = tasks.filter((t) => !t.archived && t.status === "Pending");
  const archivedTasks = tasks.filter((t) => t.archived);

  const overdueTasks = tasks.filter(
    (t) =>
      !t.archived &&
      t.status !== "Completed" &&
      t.dueDate &&
      new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  const completionRate =
    totalCreated > 0
      ? Math.round((completedTasks.length / totalCreated) * 100)
      : 0;

  // Priority Breakdown
  const priorityCounts = { High: 0, Medium: 0, Low: 0 };
  tasks.forEach((t) => {
    if (priorityCounts[t.priority] !== undefined) {
      priorityCounts[t.priority]++;
    }
  });

  // Category Breakdown
  const categoryCounts = {};
  tasks.forEach((t) => {
    const cat = t.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryEntries = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-2">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Productivity Insights
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Truthful analytics calculated strictly from your active MongoDB task records.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 bg-slate-900 border border-slate-800 rounded-2xl">
            Loading your verified productivity statistics...
          </div>
        ) : totalCreated === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center">
            <span className="text-5xl block mb-4">📊</span>
            <h2 className="text-2xl font-bold text-white">No Task History Yet</h2>
            <p className="text-gray-400 max-w-md mx-auto mt-2 text-sm">
              As you create, prioritize, and complete tasks in your workspace, your
              productivity metrics and category breakdown will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-gray-400 uppercase font-semibold">
                  Total Lifetime Tasks
                </span>
                <h3 className="text-3xl font-black text-white mt-1">
                  {totalCreated}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  {activeTasks.length} active, {archivedTasks.length} archived
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-green-400 uppercase font-semibold">
                  Completed Tasks
                </span>
                <h3 className="text-3xl font-black text-green-400 mt-1">
                  {completedTasks.length}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Verified completed
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-yellow-400 uppercase font-semibold">
                  Pending Active
                </span>
                <h3 className="text-3xl font-black text-yellow-400 mt-1">
                  {pendingTasks.length}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Awaiting action
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-red-400 uppercase font-semibold">
                  Overdue Deadlines
                </span>
                <h3 className="text-3xl font-black text-red-400 mt-1">
                  {overdueTasks.length}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Past due date
                </p>
              </div>
            </div>

            {/* Completion Rate Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Completion Efficiency
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Overall Completion Rate: {completionRate}%
                </h2>
                <p className="text-gray-400 text-sm mt-1 max-w-lg">
                  Calculated by comparing your {completedTasks.length} completed tasks against all {totalCreated} created items.
                </p>
              </div>

              <div className="w-full md:w-64 bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-green-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Breakdown Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority Breakdown */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>⚡ Priority Distribution</span>
                </h3>

                <div className="space-y-4">
                  {["High", "Medium", "Low"].map((lvl) => {
                    const count = priorityCounts[lvl] || 0;
                    const pct = totalCreated > 0 ? Math.round((count / totalCreated) * 100) : 0;
                    const barColor =
                      lvl === "High"
                        ? "bg-red-500"
                        : lvl === "Medium"
                        ? "bg-cyan-500"
                        : "bg-emerald-500";

                    return (
                      <div key={lvl}>
                        <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                          <span>{lvl} Priority</span>
                          <span>
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`${barColor} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>📁 Category Distribution</span>
                </h3>

                <div className="space-y-4">
                  {categoryEntries.slice(0, 5).map(([cat, count]) => {
                    const pct = totalCreated > 0 ? Math.round((count / totalCreated) * 100) : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                          <span>{cat}</span>
                          <span>
                            {count} tasks ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default InsightsPage;
