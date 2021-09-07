const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dlfxinw9v/image/upload/v1631037631/default-profile-picture_sohcwq.png",
  },
  jobTitle: String,
  cohort: String,
  slack: String,
  personalWebsite: String,
  jobLocation: String,
  socialMedia: {
    type: Array,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
