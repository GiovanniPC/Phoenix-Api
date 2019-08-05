module.exports =  isRole = (role) => {
  return function(req, res, next){
    if (req.user.role === role) {
      return next();
    } else {
      res.status(500).json({ message: "Your role don't have access to this area!"});
    }
  }
};