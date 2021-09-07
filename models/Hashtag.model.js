const mongoose = require("mongoose");

const hashSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Hashtag = mongoose.model("Hashtag", hashSchema);

module.exports = Hashtag;
