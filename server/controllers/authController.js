import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const{email,password} = req.body;


    if(!email || !password){
      return res.status(400).json({
        message: "please fill all fields",
      });
    }

    // find user by email
    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({
        message:"Invalid email or password",
      });
    }
     //compare password
     const isMatch = await bcrypt.compare(password,user.password);

     if(!isMatch){
      return res.status(400).json({
        message:"Invalid email or password",
      });
     }

     //Login success

     const token = jwt.sign(
      {
        id:user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
     )

     res.status(200).json({
      message:"Login succesfully",
      token,
      user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        avatar:user.avatar,
      },
     });



    } catch (error){
      res.status(500).json({
        message: error.message,
      });
    }

  };

  // Get Logged-in User Profile
// Get Logged-in User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};