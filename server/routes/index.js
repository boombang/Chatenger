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

  require("./auth")(app);
  require("./profile")(app);
  require("./friends")(app);
  require("./dialogues")(app);
  
}
