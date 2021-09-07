const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: String, // this will eventually change
  title: String,
  dateCreated: { type: Date, default: Date.now() },
  hashtag: String, // this will also change
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
