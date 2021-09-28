const router = require("express").Router();
const isLoggedInMiddleware = require("../middleware/isLoggedIn");
const Post = require("../models/Post.model");
const Comment = require("../models/Comments.model");
const compareIds = require("../utils/compareIds");
const goHomeYoureDrunk = require("../utils/goHomeYoureDrunk");

router.post("/:postId/new", isLoggedInMiddleware, (req, res) => {
  Post.findById(req.params.postId).then((post) => {
    if (!post) {
      return goHomeYoureDrunk(res);
    }

    const { text } = req.body;
    Comment.create({ text, author: req.session.user._id, post: post._id }).then(
      () => {
        res.redirect(`/posts/${post._id}`);
      }
    );
  });
});

router.get("/:postId/:commentId/delete", (req, res) => {
  Post.findById(req.params.postId).then((singlePost) => {
    if (!singlePost) {
      return goHomeYoureDrunk(res);
    }

    Comment.findById(req.params.commentId).then((singleComment) => {
      if (!singleComment) {
        return goHomeYoureDrunk(res);
      }
      if (!compareIds(singleComment.author, req.session.user._id)) {
        return res.redirect(`/posts/${singlePost._id}`);
      }

      Comment.findByIdAndDelete(singleComment._id).then(() => {
        res.redirect(`/posts/${singlePost._id}`);
      });
    });
  });
});

module.exports = router;
