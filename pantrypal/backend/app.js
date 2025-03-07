const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const mealRoutes = require("./routes/mealRoutes");
const pantryRoutes = require("./routes/pantryRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// API routes
app.use("/api/meals", mealRoutes);
app.use("/api/pantry", pantryRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = app;
