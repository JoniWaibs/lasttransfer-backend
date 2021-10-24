const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require('./Schema')

const usersSchema = new Schema(config);

module.exports = mongoose.model('users', usersSchema);
