const mongoose = require("mongoose");

module.exports = {
  link_url: {
    type: String,
    required: true,
  },
  link_name: {
    type: String,
    required: true,
  },
  link_original_name: {
    type: String,
    required: true,
  },
  link_quantity_downloads: {
    type: Number,
    default: 1,
  },
  link_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  link_password: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
};
