const router = require("express").Router();
const isLoggedInMiddleware = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comments.model");
const bcrypt = require("bcrypt");

router.get("/", isLoggedInMiddleware, (req, res) => {
  Post.find({ author: req.session.user._id }).then((allPosts) => {
    res.render("profile/home", { allPosts });
  });
});

router.get("/update-profile", isLoggedInMiddleware, (req, res) => {
  res.render("profile/update-profile", {
    name: req.session.user.name,
    location: req.session.user.location,
    email: req.session.user.email,
  });
});

router.post("/update-profile", isLoggedInMiddleware, (req, res) => {
  // Juan said maybe the body -> post request -> req.body {email, name,location }
  // Getting this data, we are going to update the user in the backend
  // mongoose -> we need to go more specific -> UserModel
  const { email, name, location } = req.body;
  User.findByIdAndUpdate(
    req.session.user._id,
    { name, email, location },
    { new: true }
  ).then((updatedUser) => {
    // updates the user in the cookie. keeps the user in the db and the user in the session in sync
    req.session.user = updatedUser;
    res.redirect("/profile/update-profile");
  });
});

router.get("/update-password", isLoggedInMiddleware, (req, res) => {
  res.render("profile/update-password");
});

router.post("/update-password", isLoggedInMiddleware, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    res.render("profile/update-password", {
      errorMessage:
        "Revise yo' password, foo. I pity the foo that does not revise the password",
    });
    return;
  }

  User.findById(req.session.user._id).then((user) => {
    const arePasswordsTheSame = bcrypt.compareSync(oldPassword, user.password);

    if (!arePasswordsTheSame) {
      return res.render("profile/update-password", {
        errorMessage: "wrong credentials",
      });
    }

    // the oldPassword is the correct one
    // && -> both have to be true for this to be executed
    if (newPassword.length < 8 || !/\d/g.test(newPassword)) {
      return res.render("profile/update-password", {
        errorMessage: "Stop trying to test me foo!",
      });
    }

    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);

    const hashPassword = bcrypt.hashSync(newPassword, salt);

    User.findByIdAndUpdate(
      user._id,
      { password: hashPassword },
      { new: true }
    ).then((updatedUser) => {
      req.session.user = updatedUser;
      res.redirect("/");
    });
  });
  // check if old password and new password are not the same
  // before we need to do a check to see if the old one is correct
  // if its correct then
  // we need to hash a password (which one?O)
});

// first check if the old is the same as the one in the db
//

router.get("/delete-account", isLoggedInMiddleware, async (req, res) => {
  const userId = req.session.user._id;

  await User.findByIdAndDelete(userId);
  await Comment.deleteMany({ user: userId });
  // await Promise.all([User.findByIdAndDelete(userId), Comment.deleteMany({ user: userId })])
  const arrOfPostsFromUser = await Post.find({ author: userId });
  const getPostIds = arrOfPostsFromUser.map((e) => e._id);
  await Comment.deleteMany({ post: { $in: getPostIds } });
  await Post.deleteMany({ _id: { $in: getPostIds } });
  // await Promise.all([Comment.deleteMany({ post: { $in: getPostIds } }, ), Post.deleteMany({ _id: { $in: getPostIds } })])

  req.session.destroy((err) => {
    if (err) {
      console.error("err: ", err);
    }

    res.redirect("/profile");
  });
});

module.exports = router;
