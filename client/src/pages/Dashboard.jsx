console.log("DASHBOARD RENDER");

import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import api from "../services/api";

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
  });

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

const visibleTasks = tasks.filter((task) => {
  if (viewMode === "active") {
    return !task.archived;
  }

  return task.archived;
});
  
  // ==============================


  // Filter Tasks
  // ==============================
  const filteredTasks = visibleTasks
  .filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      task.category === categoryFilter;

    return (
      matchesSearch &&
      matchesPriority &&
      matchesCategory
    );
  })
  .sort((a, b) => {

    // Latest created first
    if (sortBy === "latest") {
      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    }

    // Oldest created first
    if (sortBy === "oldest") {
      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );
    }

    // High Priority first
    if (sortBy === "high") {
      const priorityOrder = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      return (
        priorityOrder[b.priority] -
        priorityOrder[a.priority]
      );
    }

    // Medium Priority first
    if (sortBy === "medium") {
      const priorityOrder = {
        Medium: 3,
        High: 2,
        Low: 1,
      };

      return (
        priorityOrder[b.priority] -
        priorityOrder[a.priority]
      );
    }

    // Low Priority first
    if (sortBy === "low") {
      const priorityOrder = {
        Low: 3,
        Medium: 2,
        High: 1,
      };

      return (
        priorityOrder[b.priority] -
        priorityOrder[a.priority]
      );
    }

    // Due Date
    if (sortBy === "dueDate") {

      // Tasks without due date go to the bottom
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return (
        new Date(a.dueDate) -
        new Date(b.dueDate)
      );
    }

    return 0;
  });

  // ==============================
  // Statistics
  // ==============================
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  // ==============================
  // Fetch Tasks
  // ==============================
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Fetched Tasks:", res.data);

      setTasks(res.data);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // Create / Update Task
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (editingId) {
        await api.put(
          `/tasks/${editingId}`,
          task,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );
      } else {
        await api.post(
          "/tasks",
          task,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );
      }

      // Reset Form
      setTask({
        title: "",
        description: "",
        priority: "Medium",
        category: "General",
        dueDate: "",
      });

      setEditingId(null);

      await fetchTasks();
    } catch (err) {
      console.error("Save Task Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Delete Task
  // ==============================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchTasks();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  }; 

// Archive Task

  const handleArchive = async (id) => {
  try {
    await api.patch(`/tasks/${id}/archive`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchTasks();
  } catch (err) {
    console.error("Archive Error:", err);
  }
};

  // ==============================
  // Change Task Status
  // ==============================
  const handleStatus = async (task) => {
    try {
      const updatedStatus =
        task.status === "Pending"
          ? "Completed"
          : "Pending";

      await api.put(
        `/tasks/${task._id}`,
        {
          ...task,
          status: updatedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      fetchTasks();
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  // ==============================
  // Edit Task
  // ==============================
  const handleEdit = (item) => {
    setTask({
      title: item.title,
      description: item.description,
      priority: item.priority,
      category: item.category || "General",
      dueDate: item.dueDate
        ? item.dueDate.substring(0, 10)
        : "",
    });

    setEditingId(item._id);
  };

  return (
    <MainLayout>

      {/* ==============================
          Header
      ============================== */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">
          👋 Welcome Back
        </h1>

        <p className="text-gray-400 mt-2">
          Organize, track and complete your daily tasks efficiently.
        </p>
      </div>

      {/* ==============================
          Search + Filters + Statistics
      ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {/* Search */}
        <Input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
          className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
          className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="General">📁 General</option>
  <option value="Study">📚 Study</option>
  <option value="Work">💼 Work</option>
  <option value="Personal">🏠 Personal</option>
  <option value="Health">❤️ Health</option>
  <option value="Finance">💰 Finance</option>
  <option value="Shopping">🛒 Shopping</option>
  <option value="Travel">✈️ Travel</option>
  <option value="Fitness">🏋️ Fitness</option>
  <option value="Entertainment">🎮 Entertainment</option>

        </select>

        {/* Total Tasks */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all duration-300">
          <p className="text-gray-400 text-sm">
            Total Tasks
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {totalTasks}
          </h2>
        </div>

      </div>

      {/* ==============================
          Statistics Cards
      ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Pending */}
        <div className="bg-yellow-500 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-all">
          <p className="text-white font-medium">
            Pending
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {pendingTasks}
          </h2>
        </div>

        {/* Completed */}
        <div className="bg-green-600 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-all">
          <p className="text-white font-medium">
            Completed
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {completedTasks}
          </h2>
        </div>

        {/* High Priority */}
        <div className="bg-red-600 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-all">
          <p className="text-white font-medium">
            High Priority
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {highPriorityTasks}
          </h2>
        </div>

      </div>

      {/* ==============================
          Add / Edit Task Form
      ============================== */}

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">

        <h2 className="text-2xl font-semibold mb-6">
          {editingId
            ? "✏️ Edit Task"
            : "➕ Add New Task"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Title */}
          <Input
            type="text"
            name="title"
            placeholder="Task Title"
            value={task.title}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Task Description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          />

          {/* Priority */}
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>
          </select>

          {/* Category */}
          <select
            name="category"
            value={task.category}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="General">
              📁 General
            </option>

            <option value="Study">
              📚 Study
            </option>

            <option value="Work">
              💼 Work
            </option>

            <option value="Personal">
              🏠 Personal
            </option>

            <option value="Health">
              💪 Health
            </option>

            <option value="Shopping">
              🛒 Shopping
            </option>

            <option value="Finance">
              💰 Finance
            </option>
          </select>

          {/* Due Date */}
          <Input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="transition-all duration-300 hover:scale-105"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Task"
              : "Create Task"}
          </Button>

        </form>
      </div>

      {/* ==============================
          Tasks List
      ============================== */}

      <div className="mt-10">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold">
            Your Tasks
          </h2>

          <span className="text-sm text-gray-400">
            Showing {filteredTasks.length} of {tasks.length}
          </span>

        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 ? (

          <div className="bg-slate-900 rounded-2xl p-10 text-center border border-slate-800">

            <h2 className="text-4xl">
              📭
            </h2>

            <p className="text-gray-300 mt-3 text-lg">
              No Tasks Found
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Create your first task or change your filters 🚀
            </p>

          </div>

        ) : (

          <div className="grid gap-5">

            {filteredTasks.map((item) => (

              <div
                key={item._id}
                className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1"
              >

                {/* Task Title */}
                <h3 className="text-xl font-bold text-white">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mt-2">
                  {item.description}
                </p>

                {/* Task Information */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {/* Priority */}
                  <span className="bg-cyan-600 px-3 py-1 rounded-full text-sm">
                    {item.priority}
                  </span>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Completed"
                        ? "bg-green-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {item.status}
                  </span>

                  {/* Category */}
                  <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                    📁 {item.category || "General"}
                  </span>

                  {/* Due Date */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      item.dueDate &&
                      new Date(item.dueDate) < new Date() &&
                      item.status !== "Completed"
                        ? "bg-red-600"
                        : "bg-blue-600"
                    }`}
                  >
                    📅{" "}
                    {item.dueDate
                      ? new Date(
                          item.dueDate
                        ).toLocaleDateString()
                      : "No Due Date"}
                  </span>

                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-5">

                  {/* Status Button */}
                  <button
                    onClick={() =>
                      handleStatus(item)
                    }
                    className={`px-4 py-2 rounded-lg text-white transition-all duration-300 hover:scale-105 ${
                      item.status === "Pending"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {item.status === "Pending"
                      ? "✅ Complete"
                      : "↩️ Mark Pending"}
                  </button>

                  {/* Edit + Delete */}
                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      ✏️ Edit
                    </button>

                    <button
                    onClick={() => handleArchive(item._id)}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
             >
                  📦 Archive
                 </button>
                    <button
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </MainLayout>
  );
}

export default Dashboard;