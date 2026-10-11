import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // ==============================
    // Task Title
    // ==============================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // Task Description
    // ==============================
    description: {
      type: String,
      trim: true,
    },

    // ==============================
    // Task Status
    // ==============================
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    // ==============================
    // Task Priority
    // ==============================
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    // ==============================
    // Task Category
    // ==============================
    category: {
      type: String,
      enum: [
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
      ],
      default: "General",
    },

    // ==============================
    // Due Date
    // ==============================
    dueDate: {
      type: Date,
    },

    // ==============================
    // Archive Status
    // ==============================
    archived: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // User
    // ==============================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  // ==============================
  // Timestamps
  // ==============================
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;