//connectdb.js
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
    console.error("Failed to connect to MongoDB:", e);
    throw e;
  }
};

module.exports = connectToDatabase;
