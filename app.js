const express = require("express");
require("./db");
const app = express();
require("./config")(app); // everything that is application configuration - look here

app.get("/", (req, res) => {
  res.render("home-page");
});

// we ecommerce
// products
// get PRODUCTS
// get PRODUCTS/:id
// get PRODUCTS/:id/edit
// POST PRODUCTS/new

// authentication
// GET Login
// GET SIGNUP
// GET LOGOUT
const PORT = process.env.PORT;

const authRouter = require("./routes/auth");

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
});
