import Task from "../models/Task.js";
import User from "../models/User.js";

// ==============================
// Predefined Task Templates
// ==============================
export const TASK_TEMPLATES = [
  {
    id: "study_prep",
    title: "Exam & Study Session",
    category: "Study",
    priority: "High",
    description: "Structured academic study session using active recall.",
    subtasks: [
      { title: "Review lecture notes & slides", completed: false },
      { title: "Solve practice quiz problems", completed: false },
      { title: "Create flashcard memory summary", completed: false },
    ],
    notes: "Utilize 25-minute Pomodoro intervals with 5-minute hydration breaks.",
  },
  {
    id: "sprint_feature",
    title: "Sprint Feature Delivery",
    category: "Work",
    priority: "High",
    description: "End-to-end task breakdown for building a software feature.",
    subtasks: [
      { title: "Define specifications and UI mockups", completed: false },
      { title: "Implement backend API & model schemas", completed: false },
      { title: "Build responsive frontend UI with validation", completed: false },
      { title: "Run test suite & perform code review", completed: false },
    ],
    notes: "Commit with descriptive git messages and follow clean architecture guidelines.",
  },
  {
    id: "wellness_routine",
    title: "Daily Wellness & Fitness",
    category: "Health",
    priority: "Medium",
    description: "Daily routine to stay energized, hydrated, and focused.",
    subtasks: [
      { title: "30-minute cardio or strength workout", completed: false },
      { title: "Drink 2.5 Liters of water throughout the day", completed: false },
      { title: "10-minute mindfulness meditation & stretch", completed: false },
    ],
    notes: "Consistent daily habits compound into long-term vitality.",
  },
  {
    id: "finance_audit",
    title: "Monthly Budget & Expense Review",
    category: "Finance",
    priority: "Medium",
    description: "Track monthly spending and allocate savings investments.",
    subtasks: [
      { title: "Review credit card & bank account transactions", completed: false },
      { title: "Audit recurring subscriptions and cancel unused ones", completed: false },
      { title: "Transfer monthly allocation to savings/investments", completed: false },
    ],
    notes: "Maintain a 50/30/20 budget framework for needs, wants, and savings.",
  },
];

// ==============================
// Gamification: Idempotent Reward Granting
// ==============================
const grantCompletionRewards = async (userId, task) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    // Base XP: 10
    let earnedXp = 10;
    if (task.priority === "High") earnedXp += 5;
    if (task.subtasks && task.subtasks.length > 0 && task.subtasks.every((s) => s.completed)) {
      earnedXp += 5;
    }

    // Streak calculation (UTC date based)
    const now = new Date();
    const todayEpochDays = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    let lastEpochDays = null;
    if (user.lastCompletedDate) {
      lastEpochDays = Math.floor(
        new Date(user.lastCompletedDate).getTime() / (1000 * 60 * 60 * 24)
      );
    }

    if (lastEpochDays === todayEpochDays) {
      // Completed on same calendar day: keep existing streak
    } else if (lastEpochDays === todayEpochDays - 1) {
      // Completed consecutive day: increment streak
      user.streak = (user.streak || 0) + 1;
    } else {
      // First completion or streak broken
      user.streak = 1;
    }

    user.lastCompletedDate = now;
    user.xp = (user.xp || 0) + earnedXp;
    user.level = Math.floor(user.xp / 100) + 1;

    // Check achievements
    const currentAchIds = new Set((user.achievements || []).map((a) => a.id));
    const newAchievements = [];

    if (!currentAchIds.has("first_task")) {
      const ach = {
        id: "first_task",
        title: "Novice Achiever",
        description: "Completed your first task in TaskFlow!",
      };
      user.achievements.push(ach);
      newAchievements.push(ach);
    }

    if (user.streak >= 3 && !currentAchIds.has("streak_3")) {
      const ach = {
        id: "streak_3",
        title: "Momentum Builder",
        description: "Maintained a 3-day completion streak!",
      };
      user.achievements.push(ach);
      newAchievements.push(ach);
    }

    if (user.streak >= 7 && !currentAchIds.has("streak_7")) {
      const ach = {
        id: "streak_7",
        title: "Flow Master",
        description: "Achieved a 7-day completion streak!",
      };
      user.achievements.push(ach);
      newAchievements.push(ach);
    }

    if (user.level >= 2 && !currentAchIds.has("level_2")) {
      const ach = {
        id: "level_2",
        title: "Level Up",
        description: "Reached Level 2 in TaskFlow!",
      };
      user.achievements.push(ach);
      newAchievements.push(ach);
    }

    if (user.xp >= 100 && !currentAchIds.has("xp_100")) {
      const ach = {
        id: "xp_100",
        title: "Century Club",
        description: "Earned 100+ total XP!",
      };
      user.achievements.push(ach);
      newAchievements.push(ach);
    }

    await user.save();

    return {
      earnedXp,
      totalXp: user.xp,
      level: user.level,
      streak: user.streak,
      newAchievements,
    };
  } catch (err) {
    console.error("Reward calculation error:", err);
    return null;
  }
};

// ==============================
// Recurrence Spawning
// ==============================
const handleRecurringSpawn = async (task) => {
  try {
    if (!task.recurrence || task.recurrence === "none") return null;

    const baseDate = task.dueDate ? new Date(task.dueDate) : new Date();
    const nextDate = new Date(baseDate);

    if (task.recurrence === "daily") {
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (task.recurrence === "weekly") {
      nextDate.setDate(nextDate.getDate() + 7);
    } else if (task.recurrence === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    // Reset subtasks for next occurrence
    const resetSubtasks = (task.subtasks || []).map((s) => ({
      title: s.title,
      completed: false,
    }));

    const nextTask = await Task.create({
      title: task.title,
      description: task.description || "",
      category: task.category || "General",
      priority: task.priority || "Medium",
      recurrence: task.recurrence,
      dueDate: nextDate,
      subtasks: resetSubtasks,
      notes: task.notes || "",
      status: "Pending",
      archived: false,
      user: task.user,
    });

    return nextTask;
  } catch (err) {
    console.error("Recurring task spawn error:", err);
    return null;
  }
};

// ==============================
// Create Task
// ==============================
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      category,
      dueDate,
      subtasks,
      notes,
      recurrence,
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    let parsedSubtasks = [];
    if (Array.isArray(subtasks)) {
      parsedSubtasks = subtasks
        .filter((s) => s && (typeof s.title === "string" || typeof s === "string"))
        .map((s) => ({
          title: typeof s === "string" ? s.trim() : s.title.trim(),
          completed: Boolean(s.completed),
        }))
        .filter((s) => s.title.length > 0);
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      status: status || "Pending",
      priority: priority || "Medium",
      category: category || "General",
      dueDate: dueDate || null,
      subtasks: parsedSubtasks,
      notes: notes ? notes.trim() : "",
      recurrence: recurrence || "none",
      user: req.user.id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get All Tasks
// ==============================
export const getTasks = async (req, res) => {
  try {
    const query = { user: req.user.id };

    if (req.query.archived !== undefined) {
      query.archived = req.query.archived === "true";
    }

    if (req.query.priority && req.query.priority !== "All") {
      query.priority = req.query.priority;
    }

    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Task
// ==============================
export const updateTask = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "category",
      "dueDate",
      "archived",
      "subtasks",
      "notes",
      "recurrence",
      "completedAt",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const existingTask = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    let rewards = null;
    let nextRecurringTask = null;

    // Check if task is transitioning from Pending to Completed
    if (updates.status === "Completed" && existingTask.status !== "Completed") {
      updates.completedAt = new Date();
      rewards = await grantCompletionRewards(req.user.id, existingTask);
      nextRecurringTask = await handleRecurringSpawn(existingTask);
    } else if (updates.status === "Pending" && existingTask.status === "Completed") {
      updates.completedAt = null;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
      rewards,
      nextRecurringTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Subtasks: Add Subtask
// ==============================
export const addSubtask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Subtask title is required" });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.subtasks.push({ title: title.trim(), completed: false });
    await task.save();

    res.status(200).json({
      message: "Subtask added successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// Subtasks: Toggle Subtask
// ==============================
export const toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    subtask.completed = !subtask.completed;
    await task.save();

    res.status(200).json({
      message: "Subtask toggled successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// Subtasks: Delete Subtask
// ==============================
export const deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.subtasks.pull(req.params.subtaskId);
    await task.save();

    res.status(200).json({
      message: "Subtask deleted successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// Get Task Templates
// ==============================
export const getTemplates = (req, res) => {
  res.status(200).json(TASK_TEMPLATES);
};

// ==============================
// Delete Task
// ==============================
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Archive Task
// ==============================
export const archiveTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { archived: true } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task archived successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Restore Task
// ==============================
export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { archived: false } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task restored successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};