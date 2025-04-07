//server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');

// Load environment variables from root .env file
const result = require("dotenv").config({ path: path.join(__dirname, '../.env') });
if (result.error) {
  console.error("Error loading .env:", result.error);
  process.exit(1);
}

// Log loaded environment variables
console.log("Environment variables loaded from .env:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGODB_URI starts with:", process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + "..." : "undefined");

const app = express();
const port = process.env.PORT || 8081;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("\x1b[31m%s\x1b[0m", "❌ ERROR: MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

console.log("\n=== MongoDB Connection Attempt ===");
console.log("🔄 Attempting to connect to MongoDB...");

// Connect to MongoDB first
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("\x1b[32m%s\x1b[0m", "✅ Successfully connected to MongoDB!");
  })
  .catch(err => {
    console.error("\x1b[31m%s\x1b[0m", "❌ MongoDB CONNECTION FAILED!");
    console.error("Error details:");
    console.error("  - Name:", err.name);
    console.error("  - Message:", err.message);
    if (err.code) console.error("  - Code:", err.code);
    process.exit(1);
  });

// CORS configuration
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for logging
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} ${req.url} ===`);
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  next();
});

// Define Item Schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const Item = mongoose.model("Item", itemSchema);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Items routes
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    console.log("Found items:", items);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});

app.post("/items", async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || quantity === undefined) {
      return res.status(400).json({ message: "Name and quantity are required" });
    }
    const item = new Item({ name, quantity });
    await item.save();
    console.log("Created item:", item);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item" });
  }
});

app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const item = await Item.findByIdAndUpdate(
      id,
      { name, quantity },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    console.log("Updated item:", item);
    res.json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    console.log("Deleted item:", item);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Add a catch-all route for debugging
app.use((req, res, next) => {
  console.log(`\n=== Unhandled Route: ${req.method} ${req.url} ===`);
  res.status(404).json({
    message: `Route ${req.method} ${req.url} not found`,
    path: req.path,
    method: req.method,
    headers: req.headers
  });
});

// Start the server only after MongoDB is connected
app.listen(port, "0.0.0.0", () => {
  console.log(`\n🚀 Server is running at http://localhost:${port}`);
  console.log("📝 Available routes:");
  console.log("  GET    /items         - Get all items");
  console.log("  POST   /items         - Add a new item");
  console.log("  PUT    /items/:id     - Update an item");
  console.log("  DELETE /items/:id     - Delete an item");
  console.log("  GET    /test         - Test the server");
});

// Error handling for MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error("\x1b[31m%s\x1b[0m", "❌ MongoDB connection error!");
  console.error("Error:", err);
});

mongoose.connection.on('disconnected', () => {
  console.log("\x1b[33m%s\x1b[0m", "⚠️  MongoDB disconnected!");
});

