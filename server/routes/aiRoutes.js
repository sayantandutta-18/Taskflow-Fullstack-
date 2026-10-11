import express from "express";
import { breakdownTask, planDay } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/breakdown", protect, breakdownTask);
router.get("/plan-day", protect, planDay);

export default router;
