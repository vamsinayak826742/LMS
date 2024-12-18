import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Helper function to validate request body
const validateRequestBody = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) {
      return `${field} is required.`;
    }
  }
  return null;
};

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password, userFullName, userType } = req.body;

    // Validate request body
    const validationError = validateRequestBody(
      ["email", "password", "userFullName", "userType"],
      req.body
    );
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      email,
      password: hashedPassword,
      userFullName,
      userType,
    });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: savedUser._id, email: savedUser.email, userFullName, userType },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login
// User Login
// User Login
router.post('/signin', async (req, res) => {
  const { email, password } = req.body; // Expect email and password from the request body

  try {
      let user = await User.findOne({ email }); // Find the user by email

      if (!user) {
          return res.status(400).json({ message: 'User not found' }); // Return error if user not found
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password); // Compare password
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid credentials' }); // Return error if password is incorrect
      }

      res.status(200).json({
          user: {
              username: user.userFullName, // Send user data as response
              isAdmin: user.isAdmin,
          },
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});




export default router;
