const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mealPlans: [
    {
      date: String, // e.g., "2025-02-19"
      meals: [
        {
          mealType: String,
          mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
        },
      ],
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
