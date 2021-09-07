const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: String, // this will eventually change
  post: String, //this will change
  dateCreated: { type: Date, default: Date.now() },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
