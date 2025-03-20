//app.js
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// Simple in-memory storage for pantry items
let pantryItems = [];

// Mock API routes
app.use("/api/meals", (req, res) => {
  // Add mock meal handling if needed
  res.json([]);
});

app.use("/api/pantry", (req, res, next) => {
  // Simple mock pantry routes
  switch (req.method) {
    case 'GET':
      res.json(pantryItems);
      break;
    case 'POST':
      const newItem = {
        id: Date.now().toString(),
        ...req.body,
        quantity: 1
      };
      pantryItems.push(newItem);
      res.json(newItem);
      break;
    default:
      next();
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catchall handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = app;
