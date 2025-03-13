const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const connectToDatabase = async () => {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const insertMeals = async (db) => {
  const mealsCollection = db.collection("Meals");

  const mealsDummyData = [
    {
      name: "Spaghetti Bolognese",
      type: "Pasta",
      ingredients: ["Spaghetti", "Ground Beef", "Tomato Sauce"],
    },
    {
      name: "Chicken Salad",
      type: "Salad",
      ingredients: ["Chicken", "Lettuce", "Tomatoes", "Cucumbers"],
    },
    {
      name: "Tacos",
      type: "Mexican",
      ingredients: [
        "Taco Shells",
        "Ground Beef",
        "Cheese",
        "Lettuce",
        "Tomato",
      ],
    },
  ];

  const result = await mealsCollection.insertMany(mealsDummyData);
  console.log(`${result.insertedCount} meals inserted`);
};

const insertUsers = async (db) => {
  const usersCollection = db.collection("Users");

  const usersDummyData = [
    {
      username: "john_doe",
      email: "john.doe@example.com",
      password: "password123",
    },
    {
      username: "jane_smith",
      email: "jane.smith@example.com",
      password: "password456",
    },
    {
      username: "alice_jones",
      email: "alice.jones@example.com",
      password: "password789",
    },
  ];

  const result = await usersCollection.insertMany(usersDummyData);
  console.log(`${result.insertedCount} users inserted`);
};

const fetchMeals = async (db) => {
  const mealsCollection = db.collection("Meals");
  const meals = await mealsCollection.find().toArray();
  console.log("Meals:", meals);
};

const fetchUsers = async (db) => {
  const usersCollection = db.collection("Users");
  const users = await usersCollection.find().toArray();
  console.log("Users:", users);
};

module.exports = {
  connectToDatabase,
  insertMeals,
  insertUsers,
  fetchMeals,
  fetchUsers,
};
