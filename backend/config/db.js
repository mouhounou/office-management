const mongoose = require("mongoose");
const { mongoUri } = require("./env");

mongoose.set("strictQuery", true);

async function connectDB() {
  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log(`MongoDB connecté : ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

module.exports = { connectDB };
