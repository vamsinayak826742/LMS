import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import bookRoutes from "./routes/books.js";
import transactionRoutes from "./routes/transactions.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes); // API path for auth
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("MONGODB CONNECTED");
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to LibraryApp");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
