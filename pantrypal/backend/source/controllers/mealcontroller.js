const User = require("./models/mealModel");
const Meal = require("./models/userModel");
const mongoose = require("mongoose");

// 📌 Add Meal to User's Meal Plan
const addMealToPlan = async (req, res) => {
  try {
    const { userId, date, mealType, mealId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const mealExists = await Meal.findById(mealId);
    if (!mealExists) return res.status(404).json({ error: "Meal not found" });

    // Find the meal plan entry for the given date or create a new one
    let mealPlan = user.mealPlans.find((plan) => plan.date === date);
    if (!mealPlan) {
      mealPlan = { date, meals: [] };
      user.mealPlans.push(mealPlan);
    }

    // Add meal to the plan
    mealPlan.meals.push({ mealType, mealId });
    await user.save();

    res.json({ message: "Meal added successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Edit a Meal in User's Meal Plan
const editMealInPlan = async (req, res) => {
  try {
    const { userId, date, mealType, mealId, newMealId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(mealId) ||
      !mongoose.Types.ObjectId.isValid(newMealId)
    ) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const mealPlan = user.mealPlans.find((plan) => plan.date === date);
    if (!mealPlan)
      return res.status(404).json({ error: "Meal plan not found" });

    const mealIndex = mealPlan.meals.findIndex(
      (meal) => meal.mealType === mealType && meal.mealId.equals(mealId)
    );
    if (mealIndex === -1)
      return res.status(404).json({ error: "Meal not found in plan" });

    mealPlan.meals[mealIndex].mealId = newMealId;
    await user.save();

    res.json({ message: "Meal updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Remove a Meal from User's Meal Plan
const removeMealFromPlan = async (req, res) => {
  try {
    const { userId, date, mealType, mealId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const mealPlan = user.mealPlans.find((plan) => plan.date === date);
    if (!mealPlan)
      return res.status(404).json({ error: "Meal plan not found" });

    mealPlan.meals = mealPlan.meals.filter(
      (meal) => !(meal.mealType === mealType && meal.mealId.equals(mealId))
    );

    // Remove the date entry if no meals are left
    if (mealPlan.meals.length === 0) {
      user.mealPlans = user.mealPlans.filter((plan) => plan.date !== date);
    }

    await user.save();

    res.json({ message: "Meal removed successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addMealToPlan, editMealInPlan, removeMealFromPlan };
