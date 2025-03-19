const connectToDatabase = require("./connectdb.cjs");
const { ObjectId } = require("mongodb");

const getItems = async () => {
  const client = await connectToDatabase();
  try {
    const db = client.db("PantryPal");
    const items = await db.collection("items").find({}).toArray();
    return items;
  } finally {
    await client.close();
  }
};

const addItem = async (item) => {
  const client = await connectToDatabase();
  try {
    const db = client.db("PantryPal");
    const result = await db.collection("items").insertOne(item);
    return result.ops[0];
  } finally {
    await client.close();
  }
};

const updateItem = async (id, updates) => {
  const client = await connectToDatabase();
  try {
    const db = client.db("PantryPal");
    const result = await db.collection("items").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result.modifiedCount;
  } finally {
    await client.close();
  }
};

const deleteItem = async (id) => {
  const client = await connectToDatabase();
  try {
    const db = client.db("PantryPal");
    const result = await db.collection("items").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount;
  } finally {
    await client.close();
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
