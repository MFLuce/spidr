const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: String, // this will eventually change
    title: String,
    hashtag: String, // this will also change
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
