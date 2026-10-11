import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  archiveTask,
  restoreTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  getTemplates,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/templates", protect, getTemplates);
router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id/archive", protect, archiveTask);
router.patch("/:id/restore", protect, restoreTask);

// Subtask routes
router.post("/:id/subtasks", protect, addSubtask);
router.patch("/:id/subtasks/:subtaskId/toggle", protect, toggleSubtask);
router.delete("/:id/subtasks/:subtaskId", protect, deleteSubtask);

export default router;