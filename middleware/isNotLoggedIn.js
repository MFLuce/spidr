module.exports = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  //   you can only keep going if req.session.user (loggedin user) is not available

  next();
};
