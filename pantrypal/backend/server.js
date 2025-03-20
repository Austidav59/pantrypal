//server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getItems, addItem, updateItem, deleteItem } = require("./db.cjs");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utility function to validate environment variables
if (!process.env.PORT) {
  console.error("PORT is not defined in the environment variables.");
  process.exit(1);
}

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Routes

// Get all items
app.get("/items", async (req, res, next) => {
  try {
    const items = await getItems();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err); // Pass error to centralized error handler
  }
});

// Add a new item
app.post("/items", async (req, res, next) => {
  try {
    const newItem = req.body;

    // Validate input
    if (!newItem.name || !newItem.quantity) {
      throw { status: 400, message: "Name and quantity are required." };
    }

    const addedItem = await addItem(newItem);
    res.status(201).json({ success: true, data: addedItem });
  } catch (err) {
    next(err);
  }
});

// Update an item
app.put("/items/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    // Validate input
    if (!updates || Object.keys(updates).length === 0) {
      throw { status: 400, message: "Updates cannot be empty." };
    }

    const updatedCount = await updateItem(id, updates);
    if (updatedCount === 0) {
      throw { status: 404, message: "Item not found." };
    }

    res.json({ success: true, updatedCount });
  } catch (err) {
    next(err);
  }
});

// Delete an item
app.delete("/items/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedCount = await deleteItem(id);

    if (deletedCount === 0) {
      throw { status: 404, message: "Item not found." };
    }

    res.json({ success: true, deletedCount });
  } catch (err) {
    next(err);
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

