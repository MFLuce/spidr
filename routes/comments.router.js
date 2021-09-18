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
    Comment.create({ text, author: req.session.user._id }).then(
      (createdComment) => {
        Post.findByIdAndUpdate(post._id, {
          $addToSet: { comments: createdComment._id },
        }).then(() => {
          res.redirect(`/posts/${post._id}`);
        });
      }
    );
  });
});

module.exports = router;
