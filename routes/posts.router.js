const router = require("express").Router();
const isLoggedInMiddleware = require("../middleware/isLoggedIn");
const Post = require("../models/Post.model");
const User = require("../models/User.model");

router.get("/create", isLoggedInMiddleware, (req, res) => {
  res.render("posts/post-create");
});

router.get("/:id", (req, res) => {
  console.clear();
  console.log("Hello", req.params);
  Post.findById(req.params.id)
    .populate("author")
    .then((thePost) => {
      console.log("thePost:", thePost);
      //   console.log("user LOOK HERE:", thePost.user);
      res.render("posts/single", { post: thePost });
    });
});

router.post("/create", isLoggedInMiddleware, (req, res) => {
  const { title, text } = req.body;

  Post.create({ text, title, author: req.session.user._id }).then(
    (createdPost) => {
      console.log(createdPost);
      res.redirect("/profile");
    }
  );
});

module.exports = router;
