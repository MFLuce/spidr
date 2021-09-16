// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "spidr";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} - Generated with Ironlauncher`;

// app.use((req, res, next) => {
//   // req -> REQUEST OBJECT
//   // res -> RESPONSE OBJECT
//   // next -> Function
//   req.gato = "Un gatito";
//   console.log(req.session);
//   req.user = req.session.user;
//   next();
// });

app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home-page", { user: req.session.user });
  } else {
    res.render("home-page");
  }
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile.router");
const postsRouter = require("./routes/posts.router");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/posts", postsRouter);
// app.use("/posts", require("./routes/posts.router"));
// app.use is for middlewares

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
