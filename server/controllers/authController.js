import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==========================
// Register User
// ==========================
export const registerUser = async (req, res) => {
  try {
    console.log("Register Request:", req.body);

    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    email = email.toLowerCase();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User Registered:", user.email);

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Login User
// ==========================
export const login = async (req, res) => {
  try {
    console.log("Login Request:", req.body);

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login Success:", user.email);

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get Profile
// ==========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      }); 
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};