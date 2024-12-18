import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* Get user by ID */
router.get("/getuser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("activeTransactions")
      .populate("prevTransactions");

    if (!user) return res.status(404).json({ error: "User not found." });

    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Get all members in the library */
router.get("/allmembers", async (req, res) => {
  try {
    const users = await User.find({})
      .populate("activeTransactions")
      .populate("prevTransactions")
      .sort({ _id: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching all members:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Update user by ID */
router.put("/updateuser/:id", async (req, res) => {
  try {
    const { userId, isAdmin, password } = req.body;

    if (userId !== req.params.id && !isAdmin) {
      return res.status(403).json({ error: "You can update only your account!" });
    }

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    await User.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Add transaction to active transactions */
router.put("/:id/move-to-activetransactions", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      return res.status(403).json({ error: "Only Admin can add transactions." });
    }

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    await user.updateOne({ $push: { activeTransactions: req.params.id } });
    res.status(200).json({ message: "Transaction moved to active transactions." });
  } catch (err) {
    console.error("Error adding to active transactions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Move transaction to previous transactions */
router.put("/:id/move-to-prevtransactions", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      return res.status(403).json({ error: "Only Admin can perform this action." });
    }

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    await user.updateOne({ $pull: { activeTransactions: req.params.id } });
    await user.updateOne({ $push: { prevTransactions: req.params.id } });
    res.status(200).json({ message: "Transaction moved to previous transactions." });
  } catch (err) {
    console.error("Error moving to previous transactions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Delete user by ID */
router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;

    if (userId !== req.params.id && !isAdmin) {
      return res.status(403).json({ error: "You can delete only your account!" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
