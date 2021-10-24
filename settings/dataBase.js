const mongoose = require("mongoose");
const config = require("./utils/dbConfig");
require("dotenv").config({ path: ".env" });

const { NODE_ENV, DB_URL, DB_URL_TEST } = process.env;

const connectionString = NODE_ENV === "test" ? DB_URL_TEST : DB_URL;

const connectDataBase = async () => {
  try {
    await mongoose.connect(connectionString, config);
    console.log("database connect in enviromenment", NODE_ENV);
  } catch (error) {
    console.log({ message: `database error, ${error}` });
    process.exit(1);
  }
};

module.exports = connectDataBase;
