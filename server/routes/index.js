module.exports = function (app) {

  app.get("/", function (req, res) {
    req.isAuthenticated() ?
      res.render('index') :
      res.redirect('welcome');
  });

  app.get("/welcome", function (req, res) {
    req.isAuthenticated() ?
      res.redirect("/") :
      res.render('welcome');
  });

  app.post('/signup', function (req, res) {
    req.check("login").notEmpty();
    req.check("email").notEmpty();
    req.check("email").isEmail();
    req.check("password").notEmpty();
    req.check("confirmPassword").notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      console.log(errors);
      return res.redirect('/');
    }

    const user = User.findOne({
      login: req.body.login
    }, function (err, user) {
      if (err) {
        return console.log(err);
      }
      if (!user) {
        User.create({
          login: req.body.login,
          password: req.body.password,
          email: req.body.email
        }, function (err, user) {
          if (err) {
            res.render('welcome');
          }
          res.render('welcome');
        });
      }
    });
  });

  require("./auth")(app);

}
