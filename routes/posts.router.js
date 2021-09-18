const router = require("express").Router();
const isLoggedInMiddleware = require("../middleware/isLoggedIn");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const compareIds = require("../utils/compareIds");

router.get("/create", isLoggedInMiddleware, (req, res) => {
  res.render("posts/post-create");
});

function dynamicPostMiddleware(req, res, next) {
  Post.findById(req.params.id)
    .populate("author")
    .then((singlePost) => {
      if (!singlePost) {
        return res.redirect(`/`);
      }

      req.post = singlePost;
      req.mufasaAndSimbaSittingInATree =
        "THey are not doing anything, because that would be necrophilia and incest together. Just disgusting";
      next();
    });
}

router.get("/:id", dynamicPostMiddleware, (req, res) => {
  let isAuthor = false;
  console.log(req.mufasaAndSimbaSittingInATree);
  if (req.session.user) {
    if (compareIds(req.session.user._id, req.post.author._id)) {
      isAuthor = true;
    }
  }
  return res.render("posts/single", { post: req.post, isAuthor });
  // Post.findById(req.params.id)
  //   .populate("author")
  //   .then((thePost) => {
  //     // We need to check if the logged in user is the author of the current post -> http://localhost:3000/posts/614385a7f901f0cbc0cbd141
  //     let isAuthor = false;
  //     if (req.session.user) {
  //       if (compareIds(req.session.user._id, thePost.author._id)) {
  //         isAuthor = true;
  //       }
  //     }
  //     res.render("posts/single", { post: thePost, isAuthor });
  //   });
});

router.get(
  "/:id/edit",
  isLoggedInMiddleware,
  dynamicPostMiddleware,
  (req, res) => {
    if (!compareIds(req.session.user._id, req.post.author._id)) {
      return res.redirect(`/posts/${req.params.id}`);
    }
    res.render("posts/edit-single-post", { post: req.post });

    // Post.findById(req.params.id).then((thePost) => {
    //   // check if user is the author
    //   if (!compareIds(req.session.user._id, thePost.author._id)) {
    //     return res.redirect(`/posts/${req.params.id}`);
    //   }
    //   res.render("posts/edit-single-post", { post: thePost });

    // });
  }
);

// To be Author, or Not To Be Author, thats the question? -> lets figure out how to answer this
// we need to do something else if you are not the author and trying to access a route you should not see
// after all, lets make it pretty using middleware(s) -> i know that theres no (s) but screw it

router.post(
  "/:id/edit",
  isLoggedInMiddleware,
  dynamicPostMiddleware,
  (req, res) => {
    const { title, text } = req.body;

    if (!compareIds(req.session.user._id, req.post.author._id)) {
      return res.redirect(`/posts/${req.post._id}`);
    }

    return Post.findByIdAndUpdate(req.post._id, { title, text }).then(() => {
      res.redirect(`/posts/${req.post._id}`);
    });

    // Check if the post even exists
    // Post.findById(req.params.id).then((singlePost) => {
    //   if (!singlePost) {
    //     return res.redirect("/");
    //   }

    //   if (!compareIds(req.session.user._id, singlePost.author._id)) {
    //     return res.redirect(`/posts/${singlePost._id}`);
    //   }

    //   Post.findByIdAndUpdate(singlePost._id, { title, text }).then(() => {
    //     res.redirect(`/posts/${singlePost._id}`);
    //   });
    // });
  }
);

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
