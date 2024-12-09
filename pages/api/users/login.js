import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

export default async function handler(req, res) {
  console.log("Received payload:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in a cookie
    setCookie("token", token, {
      req,
      res,
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 1 day
    });

    // Remove password from user object for response
    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      message: "Login successful",
      user: userObject,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
