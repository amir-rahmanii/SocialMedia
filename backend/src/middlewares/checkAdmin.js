const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
      next();
    } else {
      return res.status(403).json({ message: "You do not have access." });
    }
  };



  module.exports = isAdmin;
