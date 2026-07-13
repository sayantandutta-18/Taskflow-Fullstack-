import express from "express";
import {
  registerUser,
  login,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const routes = express.Router();

routes.post("/register", registerUser);
routes.post("/login", login);
routes.get("/profile", protect, getProfile);

export default routes;