const connectToDatabase = require("./connectdb.js");
const { ObjectId } = require("mongodb");

const getItems = async () => {
  const client = await connectToDatabase();
  try {
    const db = client.db("PantryPal");
    return await db.collection("items").find({}).toArray();
  } catch (error) {
    console.error("Get Items Error:", error);
    throw new Error("Failed to fetch items");
  } finally {
    await client.close();
  }
};

const addItem = async (item) => {
  if (!item.name || !item.quantity) {
    throw new Error("Missing required fields: name and quantity");
  }

  const client = await connectToDatabase();
  try {
    const db = client.db("PantryPal");
    const result = await db.collection("items").insertOne(item);
    return { _id: result.insertedId, ...item };
  } catch (error) {
    console.error("Add Item Error:", error);
    throw new Error("Failed to create item");
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
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Failed to update item");
  } finally {
    await client.close();
  }
};

const deleteItem = async (id) => {
  const client = await connectToDatabase();
  try {
    const db = client.db("PantryPal");
    const result = await db.collection("items").deleteOne({ 
      _id: new ObjectId(id) 
    });
    return result.deletedCount;
  } catch (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete item");
  } finally {
    await client.close();
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
