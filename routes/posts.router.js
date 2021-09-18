const router = require("express").Router();
const isLoggedInMiddleware = require("../middleware/isLoggedIn");
const Post = require("../models/Post.model");
const User = require("../models/User.model");

router.get("/create", isLoggedInMiddleware, (req, res) => {
  res.render("posts/post-create");
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("author")
    .then((thePost) => {
      // We need to check if the logged in user is the author of the current post -> http://localhost:3000/posts/614385a7f901f0cbc0cbd141
      let isAuthor = false;
      if (req.session.user) {
        if (req.session.user._id.toString() === thePost.author._id.toString()) {
          isAuthor = true;
        }
      }
      res.render("posts/single", { post: thePost, isAuthor });
    });
});

router.get("/:id/edit", isLoggedInMiddleware, (req, res) => {
  // create new view (handlebars file)
  Post.findById(req.params.id).then((thePost) => {
    res.render("posts/edit-single-post", { post: thePost });
  });
});

// To be Author, or Not To Be Author, thats the question? -> lets figure out how to answer this
// we need to do something else if you are not the author and trying to access a route you should not see
// after all, lets make it pretty using middleware(s) -> i know that theres no (s) but screw it

router.post("/:id/edit", isLoggedInMiddleware, (req, res) => {});

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
