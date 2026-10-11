import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.error("Calendar tasks fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Month navigation calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Group tasks by date string YYYY-MM-DD
  const tasksByDay = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const dayNum = d.getDate();
        if (!tasksByDay[dayNum]) tasksByDay[dayNum] = [];
        tasksByDay[dayNum].push(task);
      }
    }
  });

  const handleToggleTask = async (taskToToggle) => {
    const updatedStatus =
      taskToToggle.status === "Pending" ? "Completed" : "Pending";
    try {
      await api.put(`/tasks/${taskToToggle._id}`, { status: updatedStatus });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskToToggle._id ? { ...t, status: updatedStatus } : t
        )
      );
      if (selectedTask && selectedTask._id === taskToToggle._id) {
        setSelectedTask({ ...selectedTask, status: updatedStatus });
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Task Calendar
          </h1>
          <p className="text-gray-400 mt-1">
            Track schedules, due dates, and deadlines directly from your task database.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={prevMonth}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-gray-300 hover:text-white hover:border-slate-700 transition"
            aria-label="Previous Month"
          >
            ◀
          </button>
          <button
            onClick={today}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-cyan-400 hover:bg-slate-800 transition"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-gray-300 hover:text-white hover:border-slate-700 transition"
            aria-label="Next Month"
          >
            ▶
          </button>
          <span className="text-lg font-bold text-white ml-2 min-w-[140px] text-right">
            {monthName} {year}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[480px] text-gray-400 gap-3">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading calendar tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2 min-h-[480px]">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="bg-slate-950/40 rounded-xl border border-slate-900/60 p-2 min-h-[90px] opacity-30"
                  />
                );
              }

            const dayTasks = tasksByDay[day] || [];
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === day;

            return (
              <div
                key={`day-${day}`}
                className={`bg-slate-950/70 border rounded-xl p-2 min-h-[90px] flex flex-col justify-between transition-all hover:border-cyan-500/50 ${
                  isToday
                    ? "border-cyan-500 shadow-md shadow-cyan-500/20"
                    : "border-slate-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? "bg-cyan-500 text-slate-950 font-black"
                        : "text-gray-300"
                    }`}
                  >
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-cyan-400 font-semibold">
                      {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
                    </span>
                  )}
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px]">
                  {dayTasks.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => setSelectedTask(t)}
                      className={`text-[11px] px-2 py-1 rounded truncate cursor-pointer font-medium transition ${
                        t.status === "Completed"
                          ? "bg-green-950/60 text-green-300 line-through border border-green-800/40"
                          : t.priority === "High"
                          ? "bg-red-950/80 text-red-300 border border-red-800/50"
                          : "bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-400"
                      }`}
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-900 text-cyan-300 border border-cyan-700">
                📁 {selectedTask.category || "General"}
              </span>
              {selectedTask.recurrence && selectedTask.recurrence !== "none" && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-900 text-purple-300 border border-purple-700">
                  🔁 {selectedTask.recurrence}
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mt-3">
              {selectedTask.title}
            </h3>

            {selectedTask.description && (
              <p className="text-gray-400 text-sm mt-2 whitespace-pre-wrap">
                {selectedTask.description}
              </p>
            )}

            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Subtasks ({selectedTask.subtasks.filter((s) => s.completed).length}/
                  {selectedTask.subtasks.length})
                </span>
                <div className="space-y-1.5 text-xs">
                  {selectedTask.subtasks.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300">
                      <span>{st.completed ? "✓" : "○"}</span>
                      <span className={st.completed ? "line-through text-gray-500" : ""}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTask.notes && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Notes
                </span>
                <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedTask.notes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-gray-300">
              <div className="p-3 bg-slate-800 rounded-xl">
                <span className="text-gray-500 block">Priority</span>
                <span className="font-semibold text-white">{selectedTask.priority}</span>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl">
                <span className="text-gray-500 block">Status</span>
                <span
                  className={`font-semibold ${
                    selectedTask.status === "Completed"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedTask.status}
                </span>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl col-span-2">
                <span className="text-gray-500 block">Due Date</span>
                <span className="font-semibold text-white">
                  {selectedTask.dueDate
                    ? new Date(selectedTask.dueDate).toLocaleDateString()
                    : "No Due Date"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleToggleTask(selectedTask)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedTask.status === "Pending"
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-orange-500 hover:bg-orange-400 text-white"
                }`}
              >
                {selectedTask.status === "Pending"
                  ? "Mark as Completed"
                  : "Mark as Pending"}
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default CalendarPage;
