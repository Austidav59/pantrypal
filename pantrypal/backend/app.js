const express = require("express");
const mongoose = require("mongoose");
const mealRoutes = require("./routes/mealRoutes");
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

app.use("/api/meals", mealRoutes);

module.exports = app;
