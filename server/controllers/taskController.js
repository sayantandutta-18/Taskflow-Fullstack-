import Task from "../models/Task.js";

// ==============================
// Create Task
// ==============================
export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required",
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
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
        const tasks = await Task.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

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
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ==============================
// Delete Task
// ==============================
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}