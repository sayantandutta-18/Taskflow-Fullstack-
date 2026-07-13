console.log("DASHBOARD RENDER");

// Dashboard.jsx
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import api from "../services/api";

function Dashboard() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const [tasks, setTasks] = useState([]);
const [editingId, setEditingId] = useState(null);
const [search, setSearch] = useState("");
const [priorityFilter, setPriorityFilter] = useState("All");

const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesPriority =
    priorityFilter === "All" ||
    task.priority === priorityFilter;

  return matchesSearch && matchesPriority;
});
const totalTasks = filteredTasks.length;

const pendingTasks = tasks.filter(
  (task) => task.status === "Pending"
).length;

const completedTasks = tasks.filter(
  (task) => task.status === "Completed"
).length;

const highPriorityTasks = tasks.filter(
  (task) => task.priority === "High"
).length;


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
      console.error(err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await api.put(`/tasks/${editingId}`, task, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } else {
      await api.post("/tasks", task, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    }

    setTask({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    });

    setEditingId(null);

    fetchTasks();
  } catch (err) {
    console.error(err);
  }
};


  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    fetchTasks();
  };
const handleStatus = async (task) => {
  try {
    const updatedStatus =
      task.status === "Pending" ? "Completed" : "Pending";

    await api.put(
      `/tasks/${task._id}`,
      {
        ...task,
        status: updatedStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchTasks();
  } catch (err) {
    console.error(err);
  }
};
  
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-white">Welcome to TaskFlow AI 🚀</h1>
      <p className="mt-2 text-gray-300">Manage your daily tasks efficiently.</p>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
  
<select
  value={priorityFilter}
  onChange={(e) => setPriorityFilter(e.target.value)}
  className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
>
  <option value="All">All</option>
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Low">Low</option>
</select>
  <div className="bg-slate-900 p-6 rounded-xl shadow-lg">
    <h3 className="text-gray-400">Total Tasks</h3>
    <h1 className="text-4xl font-bold text-white mt-2">
      {totalTasks}
    </h1>
  </div>

  <div className="bg-yellow-500 p-6 rounded-xl shadow-lg">
    <h3 className="text-white">Pending</h3>
    <h1 className="text-4xl font-bold text-white mt-2">
      {pendingTasks}
    </h1>
  </div>

  <div className="bg-green-600 p-6 rounded-xl shadow-lg">
    <h3 className="text-white">Completed</h3>
    <h1 className="text-4xl font-bold text-white mt-2">
      {completedTasks}
    </h1>
  </div>

  <div className="bg-red-600 p-6 rounded-xl shadow-lg">
    <h3 className="text-white">High Priority</h3>
    <h1 className="text-4xl font-bold text-white mt-2">
      {highPriorityTasks}
    </h1>
  </div>

</div>
<div className="mb-6">
  <Input
    type="text"
    placeholder="🔍 Search tasks..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      <div className="bg-slate-900 rounded-xl p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6">Add New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input type="text" name="title" placeholder="Task Title" value={task.title} onChange={handleChange}/>
          <textarea name="description" placeholder="Task Description" value={task.description} onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white"/>
          <select name="priority" value={task.priority} onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <Input type="date" name="dueDate" value={task.dueDate} onChange={handleChange}/>
          <Button type="submit">
  {editingId ? "Update Task" : "Create Task"}
</Button>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">Your Tasks</h2>

        {filteredTasks.length===0 ? (
          <div className="bg-slate-900 rounded-xl p-6 text-center text-gray-400">
            No tasks found.
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredTasks.map((item) => (
              <div key={item._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.description}</p>

                <div className="flex justify-between mt-4">
                  <div className="flex gap-2">
                    <span className="bg-cyan-600 px-3 py-1 rounded">{item.priority}</span>
                    <span className="bg-green-600 px-3 py-1 rounded">{item.status}</span>
                 <span
  className={`px-3 py-1 rounded text-white ${
    item.dueDate &&
    new Date(item.dueDate) < new Date()
      ? "bg-red-600"
      : "bg-blue-600"
  }`}
>
  📅{" "}
  {item.dueDate
    ? new Date(item.dueDate).toLocaleDateString()
    : "No Due Date"}
</span>
                  </div>

                  <div className="flex gap-2">

  <button
    onClick={() => {
      setTask({
        title: item.title,
        description: item.description,
        priority: item.priority,
        dueDate: item.dueDate
          ? item.dueDate.substring(0, 10)
          : "",
      });

      setEditingId(item._id);
    }}
    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(item._id)}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
  >
    Delete
  </button>

  <button
  onClick={() => handleStatus(item)}
  className={`px-4 py-2 rounded text-white transition ${
    item.status === "Pending"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-orange-500 hover:bg-orange-600"
  }`}
>
  {item.status === "Pending"
    ? "Complete"
    : "Mark Pending"}
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
