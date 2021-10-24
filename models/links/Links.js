const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("./Schema");

const linksSchema = new Schema(config);

module.exports = mongoose.model("links", linksSchema);
