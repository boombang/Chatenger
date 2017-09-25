var auth = function (req, res, next) {
  req.isAuthenticated() ? next() : res.sendStatus(404);
};
