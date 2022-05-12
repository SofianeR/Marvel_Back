const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  token: String,
  salt: String,
  hash: String,
  favoris: Array,
});

module.exports = User;
