const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getItems, addItem, updateItem, deleteItem } = require("./db.cjs");

require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Get all items
app.get("/items", async (req, res) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch items.");
  }
});

// Add a new item
app.post("/items", async (req, res) => {
  try {
    const newItem = req.body;
    const addedItem = await addItem(newItem);
    res.json(addedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add item.");
  }
});

// Update an item
app.put("/items/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedCount = await updateItem(id, updates);
    res.json({ updatedCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update item.");
  }
});

// Delete an item
app.delete("/items/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCount = await deleteItem(id);
    res.json({ deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete item.");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
