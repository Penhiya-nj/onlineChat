const mongoose = require("mongoose");

const connectDB = async (mongoUrl, databaseName) => {
  try {
    await mongoose.connect(mongoUrl + databaseName);
    if (process.env.NODE_ENV === "development")
      console.log(`Mongoose connected to ${databaseName} `);
  } catch (err) {
    console.error(err.message);
    // process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
