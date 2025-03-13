const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
  const uri = process.env.ATLAS_URI;
  console.log(`MongoDB URI: ${uri}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Fetching collections
    const db = client.db("PantryPal");
    const collections = await db.collections();

    console.log("Collections:");
    collections.forEach((collection) => console.log(collection.collectionName));

    // Inserting dummy data into 'Meals' collection
    const mealsCollection = db.collection("Meals");
    const insertMealResult = await mealsCollection.insertOne({
      name: "Spaghetti Bolognese",
      ingredients: ["Spaghetti", "Tomato Sauce", "Ground Beef", "Onion"],
      prepTime: 30,
    });
    console.log(`Inserted meal with ID: ${insertMealResult.insertedId}`);

    // Inserting dummy data into 'Users' collection
    const usersCollection = db.collection("Users");
    const insertUserResult = await usersCollection.insertOne({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    });
    console.log(`Inserted user with ID: ${insertUserResult.insertedId}`);
  } catch (e) {
    console.error("Error occurred:", e);
  } finally {
    await client.close();
  }
}

main();
