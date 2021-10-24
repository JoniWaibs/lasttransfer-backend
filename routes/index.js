const express = require("express");
const app = express();

const users = require("./users/users");
const links = require("./links/links");
const files = require("./files/files");
const auth = require("./auth/auth");

/**
 * Enabled body data
 */
app.use(express.json());

/**
 * app routes
 */
app.use(`/users`, users);
app.use(`/links`, links);
app.use(`/auth`, auth);
app.use(`/files`, files);

module.exports = app;
