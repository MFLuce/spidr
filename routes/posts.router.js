const router = require("express").Router();
const isLoggedInMiddleware = require("../middleware/isLoggedIn");
const Comment = require("../models/Comments.model");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const compareIds = require("../utils/compareIds");

router.get("/create", isLoggedInMiddleware, (req, res) => {
  res.render("posts/post-create");
});

function dynamicPostMiddleware(req, res, next) {
  Post.findById(req.params.id)
    .populate([
      { path: "author" }, // post.author
    ])
    // .populate({ path: "comments" })
    // .populate({ path: "author" })
    // .populate("author")
    // .populate("comments")
    // .populate("author comments") // i want the post author, the comment, and, from the comment, the author of the comment
    // .populate("author comments")
    .then((singlePost) => {
      if (!singlePost) {
        return res.redirect(`/`);
      }

      req.post = singlePost;

      next();
    });
}

router.get("/:id", dynamicPostMiddleware, async (req, res) => {
  let isAuthor = false;
  if (req.session.user) {
    if (compareIds(req.session.user._id, req.post.author?._id)) {
      isAuthor = true;
    }
  }
  const allComments = await Comment.find({ post: req.post._id });

  const allCommentsByUser = allComments.map((comment) => {
    if (req.session.user) {
      if (compareIds(req.session.user?._id, comment.author?._id)) {
        return { ...comment.toJSON(), isAuthor: true };
      }
    }
    return { ...comment.toJSON() };
  });

  // const currentPostComments = req.post.comments.map((comment) => {
  //   if (req.session.user) {
  //     if (compareIds(req.session.user?._id, comment.author?._id)) {
  //       return { ...comment.toJSON(), isAuthor: true };
  //     }
  //   }

  //   return { ...comment.toJSON() };
  // });

  return res.render("posts/single", {
    post: { ...req.post.toJSON(), comments: allCommentsByUser },
    isAuthor,
  });
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
    if (!compareIds(req.session.user._id, req.post?.author?._id)) {
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

    if (!compareIds(req.session.user._id, req.post?.author?._id)) {
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

router.get(
  "/:id/delete",
  isLoggedInMiddleware,
  dynamicPostMiddleware,
  async (req, res) => {
    const isAuthor = compareIds(req.session.user._id, req.post.author._id);

    if (!isAuthor) {
      return res.redirect(`/posts/${req.params.id}`);
    }

    await Comment.deleteMany({ post: { $in: [req.post._id] } });
    await Post.findByIdAndDelete(req.post._id);
    // better version with Promise.all
    // await Promise.all([Comment.deleteMany({ post: { $in: [req.post._id] } }),Post.findByIdAndDelete(req.post._id)])

    res.redirect("/");
  }
);

module.exports = router;
