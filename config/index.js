const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

module.exports = (app) => {
  app.set("view engine", "hbs");
  app.use(express.urlencoded({ extended: true })); // this allows us to receive post requests and hold whatever was sent inside req.body
  app.use(logger("dev"));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, "..", "public")));
};
