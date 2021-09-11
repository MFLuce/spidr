module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  //   you can only keep going if req.session.user (loggedin user) is available
  next();
};
