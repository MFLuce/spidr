const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});

// req.query -> q?search=hello&age=24&location=ISLA_MAGICA&
// req.params -> /users/marie /users/anna /users/juan -> :username {username: marie}| {username: "anna"} | {username:"juan"}
// req.body -> is what a post request sends
// form input:name=name input:name=password input:name=email {name:whateverwasinsidethefirstinput, password:whateverwasthepassword, email:whateverwastheemail}
router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  const { email, password, name, location } = req.body; //

  // if any of those inputs is blank it should fail
  if (!email || !name || !location) {
    res.render("auth/signup", {
      errorMessage: "Yo, one of these is not filled in: name, email, location",
      ...req.body, // spread
    });
    return;
  }
  // password thats smaller 8 characters

  if (password.length < 8) {
    res.render("auth/signup", {
      errorMessage:
        "More than 8 characters or something like that.. dont know, please",
      ...req.body,
    });
    return;
  }

  // password must contain at least one number

  if (!/\d/g.test(password)) {
    res.render("auth/signup", {
      errorMessage: "Your passport has no number",
      ...req.body,
    });
    return;
  }

  // IF WE ARE HERE, WE ARE SURE THAT WE JUST NEED TO DO ONE LAST CHECK: IS THERE A USER WITH THIS EMAIL
  // if they're already signed up, or if that email is already taken

  try {
    const foundUser = await User.findOne({ email });
    // {user} || null
    if (foundUser) {
      res.render("auth/signup", {
        errorMessage:
          "Pablo was 'thinking'. Sure... Catchy, like a funny thing",
        ...req.body,
      });
      return;
    }

    // first, we tell bcrypt how to create the destroyer logic: in bcrypt thats called salt rounds
    const saltRounds = 10;
    // then we generate the salt
    const theSaltIsGenerated = bcrypt.genSaltSync(saltRounds);
    // then, we hash the password

    const hashThePassword = bcrypt.hashSync(password, theSaltIsGenerated);

    const createdUser = await User.create({
      name,
      location,
      email,
      password: hashThePassword,
    });

    req.session.user = createdUser; // stateful information
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("auth/signup", {
      errorMessage: "'Dont know', Velarde, A",
      ...req.body,
    });
  }

  // .catch((ohlalalaBanana) => {
  //   console.error(ohlalalaBanana);
  //   res.render("auth/signup", {
  //     errorMessage: "'Dont know', Velarde, A",
  //     ...req.body,
  //   });
  // });
  // .catch((err) => {
  //   res.render("auth/signup", {
  //     errorMessage: "'Dont know', Velarde, A",
  //     ...req.body,
  //   });
  // });
});

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isNotLoggedIn, async (req, res) => {
  const { email, password } = req.body; //

  // nothing written
  if (!email) {
    res.render("auth/login", {
      errorMessage: "Hey, did you forget to put your email?",
    });
    return;
  }

  const foundUser = await User.findOne({ email });

  // no user with this email in db
  // {user} || null
  if (!foundUser) {
    res.render("auth/login", { errorMessage: "Wrong credentials" });
    return;
  }

  // wrong password
  const isValidPassword = bcrypt.compareSync(password, foundUser.password);

  if (!isValidPassword) {
    res.render("auth/login", { errorMessage: "Wrong credentials" });
    return;
  }
  req.session.user = foundUser;
  res.redirect("/");
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("err:", err);
    }
    res.redirect("/");
  });
});

module.exports = router;
