const express = require("express");
const cors = require('cors');
const routes = require("./routes");
const app = express();
const dataBaseConnect = require("./settings/dataBase");
const { apiBasePath } = require("./settings/utils/apiConfig");

const PORT = process.env.PORT || 8080;

/**
 * Connection with database
 */
dataBaseConnect();

/**
 * CORS middleware
 */
app.use(cors());

/**
 * Api routes
 */
app.use(`${apiBasePath}`, routes);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is listening at port", PORT);
});

module.exports = {app , server};
