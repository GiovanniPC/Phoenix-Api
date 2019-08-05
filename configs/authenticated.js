
module.exports = ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(500).json({ message: "Not logged in! ENSUREAUTHENTICATED"});
  }
}
