import { useState, useEffect, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import api from "../services/api";

const CATEGORIES = [
  "General",
  "Study",
  "Work",
  "Personal",
  "Health",
  "Finance",
  "Shopping",
  "Travel",
  "Fitness",
  "Entertainment",
];

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "🔁 Daily" },
  { value: "weekly", label: "🔁 Weekly" },
  { value: "monthly", label: "🔁 Monthly" },
];

function Dashboard() {
  // ==============================
  // Task Form State
  // ==============================
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "General",
    dueDate: "",
    notes: "",
    recurrence: "none",
    subtasks: [],
  });

  const [formSubtaskInput, setFormSubtaskInput] = useState("");

  // ==============================
  // Main States
  // ==============================
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("active");
  const [notification, setNotification] = useState(null);

  // Checkpoint 6 & 12: AI & Templates & Expanders
  const [templates, setTemplates] = useState([]);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [expandedSubtasks, setExpandedSubtasks] = useState({});
  const [expandedNotes, setExpandedNotes] = useState({});
  const [cardSubtaskInputs, setCardSubtaskInputs] = useState({});

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // ==============================
  // Fetch Tasks & Templates
  // ==============================
  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
      showNotification("Failed to load tasks from server", "error");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/tasks")
      .then((res) => {
        if (isMounted) setTasks(res.data);
      })
      .catch((err) => console.error("Initial Fetch Error:", err));

    api
      .get("/tasks/templates")
      .then((res) => {
        if (isMounted) setTemplates(res.data);
      })
      .catch((err) => console.error("Templates Fetch Error:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Tasks by active/archived
  const visibleTasks = tasks.filter((t) => {
    if (viewMode === "active") return !t.archived;
    return !!t.archived;
  });

  // Filter & Sort Tasks
  const filteredTasks = visibleTasks
    .filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
        (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));

      const matchesPriority =
        priorityFilter === "All" || t.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "All" || t.category === categoryFilter;

      return matchesSearch && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "high") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      if (sortBy === "medium") {
        const priorityOrder = { Medium: 3, High: 2, Low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      if (sortBy === "low") {
        const priorityOrder = { Low: 3, Medium: 2, High: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  // Task Stats
  const activeCount = tasks.filter((t) => !t.archived).length;
  const archivedCount = tasks.filter((t) => t.archived).length;
  const completedCount = tasks.filter((t) => t.status === "Completed" && !t.archived).length;
  const pendingCount = activeCount - completedCount;
  const overdueCount = tasks.filter(
    (t) =>
      !t.archived &&
      t.status !== "Completed" &&
      t.dueDate &&
      new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
  ).length;

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    setTask((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Subtasks in Form
  const handleAddFormSubtask = (e) => {
    e.preventDefault();
    if (!formSubtaskInput.trim()) return;
    setTask((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), { title: formSubtaskInput.trim(), completed: false }],
    }));
    setFormSubtaskInput("");
  };

  const handleRemoveFormSubtask = (idx) => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== idx),
    }));
  };

  // ==============================
  // AI Breakdown Assistant
  // ==============================
  const handleAiBreakdown = async () => {
    if (!task.title.trim()) {
      showNotification("Please provide a task title first", "error");
      return;
    }

    setAiLoading(true);
    setAiSuggestion(null);

    try {
      const res = await api.post("/ai/breakdown", {
        title: task.title,
        description: task.description,
        category: task.category,
      });

      setAiSuggestion(res.data);
      showNotification("✨ AI breakdown ready for review!", "success");
    } catch (err) {
      console.error("AI Assistant Error:", err);
      showNotification("AI breakdown failed to generate", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;

    setTask((prev) => {
      const existingTitles = new Set((prev.subtasks || []).map((s) => s.title));
      const newSubtasks = [...(prev.subtasks || [])];

      (aiSuggestion.subtasks || []).forEach((st) => {
        if (!existingTitles.has(st)) {
          newSubtasks.push({ title: st, completed: false });
        }
      });

      return {
        ...prev,
        subtasks: newSubtasks,
        priority: aiSuggestion.suggestedPriority || prev.priority,
        category: aiSuggestion.suggestedCategory || prev.category,
      };
    });

    setAiSuggestion(null);
    showNotification("✨ AI suggestions applied to task form!", "success");
  };

  // ==============================
  // Template Application
  // ==============================
  const handleApplyTemplate = (tmpl) => {
    setTask({
      title: tmpl.title,
      description: tmpl.description || "",
      category: tmpl.category || "General",
      priority: tmpl.priority || "Medium",
      notes: tmpl.notes || "",
      recurrence: "none",
      dueDate: "",
      subtasks: (tmpl.subtasks || []).map((s) => ({
        title: s.title,
        completed: false,
      })),
    });
    setShowTemplatesModal(false);
    showNotification(`Applied "${tmpl.title}" template!`, "success");
  };

  // ==============================
  // Create / Update Task
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title.trim()) {
      showNotification("Please provide a task title", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, task);
        showNotification("Task updated successfully!");
      } else {
        await api.post("/tasks", task);
        showNotification("Task created successfully!");
      }

      setTask({
        title: "",
        description: "",
        priority: "Medium",
        category: "General",
        dueDate: "",
        notes: "",
        recurrence: "none",
        subtasks: [],
      });
      setFormSubtaskInput("");
      setEditingId(null);
      setAiSuggestion(null);
      await fetchTasks();
    } catch (err) {
      console.error("Save Task Error:", err);
      showNotification(
        err.response?.data?.message || "Failed to save task",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Delete Task
  // ==============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this task?")) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      showNotification("Task deleted permanently");
      fetchTasks();
    } catch (err) {
      console.error("Delete Error:", err);
      showNotification("Failed to delete task", "error");
    }
  };

  // ==============================
  // Archive / Restore Task
  // ==============================
  const handleArchive = async (id) => {
    try {
      await api.patch(`/tasks/${id}/archive`);
      showNotification("Task moved to Archive 📦");
      fetchTasks();
    } catch (err) {
      console.error("Archive Error:", err);
      showNotification("Failed to archive task", "error");
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.patch(`/tasks/${id}/restore`);
      showNotification("Task restored to Active list 🚀");
      fetchTasks();
    } catch (err) {
      console.error("Restore Error:", err);
      showNotification("Failed to restore task", "error");
    }
  };

  // ==============================
  // Change Task Status (Rewards & Streak)
  // ==============================
  const handleStatus = async (item) => {
    try {
      const updatedStatus = item.status === "Pending" ? "Completed" : "Pending";
      const res = await api.put(`/tasks/${item._id}`, {
        status: updatedStatus,
      });

      if (updatedStatus === "Completed") {
        if (res.data.rewards) {
          const { earnedXp, level, streak, newAchievements } = res.data.rewards;
          let msg = `🎉 +${earnedXp} XP! Level ${level} • Streak: ${streak}d`;
          if (newAchievements && newAchievements.length > 0) {
            msg += ` • 🏆 Unlocked "${newAchievements[0].title}"!`;
          }
          showNotification(msg, "success");
        } else {
          showNotification("Task completed! 🎉");
        }

        if (res.data.nextRecurringTask) {
          const nextDate = new Date(res.data.nextRecurringTask.dueDate).toLocaleDateString();
          setTimeout(() => {
            showNotification(`🔁 Next recurring task scheduled for ${nextDate}`, "info");
          }, 2000);
        }
      } else {
        showNotification("Task marked pending");
      }

      fetchTasks();
    } catch (err) {
      console.error("Status Update Error:", err);
      showNotification("Failed to update status", "error");
    }
  };

  // ==============================
  // Subtasks on Card Handlers
  // ==============================
  const handleToggleCardSubtask = async (taskId, subtaskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
    } catch (err) {
      console.error("Subtask toggle error:", err);
      showNotification("Failed to update subtask", "error");
    }
  };

  const handleAddCardSubtask = async (taskId) => {
    const inputVal = cardSubtaskInputs[taskId];
    if (!inputVal || !inputVal.trim()) return;

    try {
      const res = await api.post(`/tasks/${taskId}/subtasks`, {
        title: inputVal.trim(),
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
      setCardSubtaskInputs((prev) => ({ ...prev, [taskId]: "" }));
      showNotification("Subtask added!", "success");
    } catch (err) {
      console.error("Add subtask error:", err);
      showNotification("Failed to add subtask", "error");
    }
  };

  // ==============================
  // Edit Task Prep
  // ==============================
  const handleEdit = (item) => {
    setTask({
      title: item.title,
      description: item.description || "",
      priority: item.priority || "Medium",
      category: item.category || "General",
      dueDate: item.dueDate ? item.dueDate.split("T")[0] : "",
      notes: item.notes || "",
      recurrence: item.recurrence || "none",
      subtasks: item.subtasks || [],
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setTask({
      title: "",
      description: "",
      priority: "Medium",
      category: "General",
      dueDate: "",
      notes: "",
      recurrence: "none",
      subtasks: [],
    });
    setFormSubtaskInput("");
    setEditingId(null);
    setAiSuggestion(null);
  };

  return (
    <MainLayout>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all transform animate-bounce border ${
            notification.type === "error"
              ? "bg-red-950/90 text-red-200 border-red-800"
              : notification.type === "info"
              ? "bg-cyan-950/90 text-cyan-200 border-cyan-800"
              : "bg-emerald-950/90 text-emerald-200 border-emerald-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* ==============================
          Header & Metrics Bar
      ============================== */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Organize, track, and conquer your daily goals with AI assistance and gamification.
            </p>
          </div>

          {/* View Mode Toggle: Active vs Archived */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setViewMode("active")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                viewMode === "active"
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🚀 Active ({activeCount})
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                viewMode === "archived"
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📦 Archived ({archivedCount})
            </button>
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-gray-400 font-medium">Pending Tasks</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{pendingCount}</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-gray-400 font-medium">Completed</span>
            <div className="text-2xl font-bold text-green-400 mt-1">{completedCount}</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-gray-400 font-medium">Overdue</span>
            <div className={`text-2xl font-bold mt-1 ${overdueCount > 0 ? "text-red-400" : "text-gray-500"}`}>
              {overdueCount}
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-gray-400 font-medium">Total Registered</span>
            <div className="text-2xl font-bold text-purple-400 mt-1">{tasks.length}</div>
          </div>
        </div>
      </div>

      {/* ==============================
          Filters, Search & Controls
      ============================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Search */}
        <Input
          type="text"
          placeholder="🔍 Search tasks, descriptions, or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="All">All Priorities</option>
          <option value="High">🔥 High Priority</option>
          <option value="Medium">⚡ Medium Priority</option>
          <option value="Low">🌱 Low Priority</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="All">📁 All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="latest">⏱ Latest Created</option>
          <option value="oldest">🕰 Oldest Created</option>
          <option value="high">🔥 High Priority First</option>
          <option value="medium">⚡ Medium Priority First</option>
          <option value="low">🌱 Low Priority First</option>
          <option value="dueDate">📅 Due Date (Soonest)</option>
        </select>
      </div>

      {/* ==============================
          Templates Modal
      ============================== */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📋 Productivity Templates
              </h3>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Select a pre-built workflow routine to populate your task with validated subtasks and notes.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-base">{tmpl.title}</h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{tmpl.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tmpl.subtasks.map((st, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-900 border border-slate-700/60 text-gray-300 px-2 py-0.5 rounded-md"
                      >
                        ✓ {st.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==============================
          Add / Edit Task Form (only in active mode)
      ============================== */}
      {viewMode === "active" && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{editingId ? "✏️ Edit Task" : "➕ Add New Task"}</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTemplatesModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold transition"
              >
                📋 Use Template
              </button>

              <button
                type="button"
                onClick={handleAiBreakdown}
                disabled={aiLoading}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-900/30"
              >
                {aiLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>✨ AI Breakdown</>
                )}
              </button>

              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs text-gray-400 hover:text-white underline cursor-pointer ml-2"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          {/* AI Suggestion Review Panel */}
          {aiSuggestion && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/80 animate-fadeIn">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    ✨ AI Breakdown Suggestions
                  </h4>
                  <p className="text-xs text-cyan-100/70 mt-1">
                    {aiSuggestion.tips}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  ✕ Dismiss
                </button>
              </div>

              <div className="mt-3 space-y-1">
                {(aiSuggestion.subtasks || []).map((st, i) => (
                  <div key={i} className="text-xs text-gray-200 flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition"
                >
                  Apply Suggestions to Task
                </button>
                <span className="text-[11px] text-gray-400">
                  Priority: {aiSuggestion.suggestedPriority} • Category: {aiSuggestion.suggestedCategory}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="title"
              placeholder="Task title (e.g. Design 3D Hero scene)"
              value={task.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Task description & overview (optional)..."
              value={task.description}
              onChange={handleChange}
              rows={2}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition text-sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Priority */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                >
                  <option value="High">🔥 High</option>
                  <option value="Medium">⚡ Medium</option>
                  <option value="Low">🌱 Low</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                <select
                  name="category"
                  value={task.category}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recurrence */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Recurrence</label>
                <select
                  name="recurrence"
                  value={task.recurrence}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                >
                  {RECURRENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Due Date</label>
                <Input
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Subtasks Section in Form */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <label className="text-xs font-semibold text-gray-300 mb-2 block">
                Subtasks & Action Checklist ({task.subtasks?.length || 0})
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a subtask step..."
                  value={formSubtaskInput}
                  onChange={(e) => setFormSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFormSubtask(e);
                    }
                  }}
                  className="flex-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFormSubtask}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition"
                >
                  + Add
                </button>
              </div>

              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.subtasks.map((st, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs bg-slate-800 text-gray-300 px-3 py-1 rounded-lg border border-slate-700"
                    >
                      <span>✓ {st.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFormSubtask(i)}
                        className="text-gray-400 hover:text-red-400 text-sm font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Section in Form */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-gray-400">
                  Notes & Key References (Optional)
                </label>
                <span className="text-[11px] text-gray-500">
                  {(task.notes || "").length} / 2000
                </span>
              </div>
              <textarea
                name="notes"
                placeholder="Detailed reference links, acceptance criteria, or scratch notes..."
                value={task.notes || ""}
                onChange={handleChange}
                maxLength={2000}
                rows={2}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition text-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="w-full md:w-auto px-8">
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Task"
                  : "Create Task"}
              </Button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="border border-slate-700 hover:bg-slate-800 px-6 py-2 rounded-lg text-gray-300 transition text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ==============================
          Tasks List
      ============================== */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>{viewMode === "active" ? "Your Tasks" : "Archived Tasks"}</span>
          </h2>
          <span className="text-sm text-gray-400">
            Showing {filteredTasks.length} {viewMode === "active" ? "active" : "archived"}
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900/60 rounded-2xl p-12 text-center border border-slate-800">
            <h2 className="text-5xl mb-3">{viewMode === "active" ? "📭" : "📦"}</h2>
            <p className="text-gray-300 text-lg font-medium">
              {viewMode === "active" ? "No Tasks Found" : "No Archived Tasks"}
            </p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
              {viewMode === "active"
                ? "Create a new task above or adjust your search and filters."
                : "Tasks you archive will be stored here safely and can be restored anytime."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((item) => {
              const isOverdue =
                item.dueDate &&
                new Date(item.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) &&
                item.status !== "Completed";

              const subtaskCount = item.subtasks?.length || 0;
              const completedSubtasks = (item.subtasks || []).filter((s) => s.completed).length;
              const subtaskPercent =
                subtaskCount > 0 ? Math.round((completedSubtasks / subtaskCount) * 100) : 0;

              const isSubtasksExpanded = !!expandedSubtasks[item._id];
              const isNotesExpanded = !!expandedNotes[item._id];

              return (
                <div
                  key={item._id}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3
                          className={`text-lg font-bold text-white ${
                            item.status === "Completed"
                              ? "line-through text-gray-400"
                              : ""
                          }`}
                        >
                          {item.title}
                        </h3>

                        {isOverdue && (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            ⚠️ Overdue
                          </span>
                        )}

                        {item.recurrence && item.recurrence !== "none" && (
                          <span className="bg-purple-950/70 text-purple-300 border border-purple-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            🔁 {item.recurrence.charAt(0).toUpperCase() + item.recurrence.slice(1)}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-gray-400 text-sm mt-2 whitespace-pre-wrap">
                          {item.description}
                        </p>
                      )}

                      {/* Subtask Progress Summary Bar */}
                      {subtaskCount > 0 && (
                        <div className="mt-3 max-w-xs">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Checklist Progress</span>
                            <span>{completedSubtasks}/{subtaskCount} ({subtaskPercent}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${subtaskPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mt-4 text-xs font-medium">
                        {/* Priority */}
                        <span
                          className={`px-3 py-1 rounded-full ${
                            item.priority === "High"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : item.priority === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                          }`}
                        >
                          {item.priority} Priority
                        </span>

                        {/* Category */}
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full">
                          📁 {item.category || "General"}
                        </span>

                        {/* Due Date */}
                        {item.dueDate && (
                          <span className="bg-slate-800 text-gray-300 border border-slate-700 px-3 py-1 rounded-full">
                            📅 {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        )}

                        {/* Toggle Subtasks Button */}
                        {subtaskCount > 0 && (
                          <button
                            onClick={() =>
                              setExpandedSubtasks((prev) => ({
                                ...prev,
                                [item._id]: !prev[item._id],
                              }))
                            }
                            className="bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 px-3 py-1 rounded-full transition cursor-pointer"
                          >
                            {isSubtasksExpanded ? "Hide Subtasks ▲" : `Subtasks (${completedSubtasks}/${subtaskCount}) ▼`}
                          </button>
                        )}

                        {/* Toggle Notes Button */}
                        {item.notes && (
                          <button
                            onClick={() =>
                              setExpandedNotes((prev) => ({
                                ...prev,
                                [item._id]: !prev[item._id],
                              }))
                            }
                            className="bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 px-3 py-1 rounded-full transition cursor-pointer"
                          >
                            {isNotesExpanded ? "Hide Notes ▲" : "📝 Notes ▼"}
                          </button>
                        )}
                      </div>

                      {/* Expandable Subtask Checklist */}
                      {isSubtasksExpanded && (
                        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                            Subtask Steps
                          </h4>
                          <div className="space-y-2">
                            {item.subtasks.map((st) => (
                              <div
                                key={st._id}
                                className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition"
                              >
                                <input
                                  type="checkbox"
                                  checked={st.completed}
                                  onChange={() => handleToggleCardSubtask(item._id, st._id)}
                                  className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500 cursor-pointer"
                                />
                                <span className={st.completed ? "line-through text-gray-500" : ""}>
                                  {st.title}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Quick inline subtask adder */}
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              placeholder="Add another step..."
                              value={cardSubtaskInputs[item._id] || ""}
                              onChange={(e) =>
                                setCardSubtaskInputs((prev) => ({
                                  ...prev,
                                  [item._id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCardSubtask(item._id);
                                }
                              }}
                              className="flex-1 p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCardSubtask(item._id)}
                              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expandable Notes Section */}
                      {isNotesExpanded && item.notes && (
                        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Task Notes & References
                          </h4>
                          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {item.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex md:flex-col items-center gap-2 self-end md:self-auto shrink-0 mt-3 md:mt-0">
                      {viewMode === "active" ? (
                        <>
                          <button
                            onClick={() => handleStatus(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              item.status === "Completed"
                                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                                : "bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                            }`}
                          >
                            {item.status === "Completed" ? "✓ Completed" : "Mark Done"}
                          </button>

                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-cyan-400 hover:bg-slate-700 border border-slate-700 transition"
                            title="Edit Task"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() => handleArchive(item._id)}
                            className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-yellow-400 hover:bg-slate-700 border border-slate-700 transition"
                            title="Archive Task"
                          >
                            📦
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-red-400 hover:bg-slate-700 border border-slate-700 transition"
                            title="Delete Task"
                          >
                            🗑
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRestore(item._id)}
                            className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
                          >
                            🚀 Restore
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-red-400 hover:bg-slate-700 border border-slate-700 transition"
                            title="Delete Permanently"
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;
