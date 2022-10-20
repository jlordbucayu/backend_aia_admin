const mongoose = require("mongoose");

const Access_levelSchema = mongoose.Schema({
  user_id: {
    type: String,
  },

  access_level: {
    //admin, client
    type: String,
  },

  date: {
    type: Number,
  },
});

const Access_level = mongoose.model("Access_level", Access_levelSchema);

module.exports = Access_level;
