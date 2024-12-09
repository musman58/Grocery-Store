import { setCookie } from "cookies-next";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    const userObject = await user.save();

    // Create and sign JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in a cookie
    setCookie("token", token, {
      req,
      res,
      httpOnly: true,
      maxAge: 8 * 3600, // 8 hours
    });

    res.status(201).json({
      message: "User registered successfully",
      user: userObject,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
