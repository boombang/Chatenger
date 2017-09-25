const express = require("express");
const path = require('path');
const history = require('connect-history-api-fallback');
const validator = require("express-validator");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const config = require("../config");
const routes = require("../routes");

function initAuth(app) {
  require("./auth/passport")(app);
}

function initSession(app, db) {
  // использовать функции в запросах к авторизации
  // https://github.com/expressjs/session
  app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: "MB9x-hOkx-UdcCbOprxggu-Wv1PetuoqzBny1h8DULA",
    httpOnly: false, //убрать, когда буду делать запрос на юзера каждую перезагрузку
    store: new MongoStore({
      url: 'mongodb://localhost/chatengerdb',
      mongooseConnection: db.connection
    }),
    cookie: {
      maxAge: 7 * 24 * (60 * 60 * 1000),
      // secure: true // раскоментить при переходе на https, указать при production
    },
    name: "sessionId",
    // genid: function(req) {
    //   return genuuid() // use UUIDs for session IDs
    // },
  }));
}

function initWebpack(app) {
  if (!config.isProductionMode()) {
    let webpack = require("webpack");
    let wpConfig = require("../../build/webpack.dev.config");

    let compiler = webpack(wpConfig);
    let devMiddleware = require('webpack-dev-middleware'); // eslint-disable-line
    app.use(devMiddleware(compiler, {
      noInfo: true,
      publicPath: wpConfig.output.publicPath,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      stats: {
        colors: true
      }
    }));

    let hotMiddleware = require('webpack-hot-middleware'); // eslint-disable-line
    app.use(hotMiddleware(compiler));
  }
}

function initMiddleware(app) {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(validator());
  app.use(bodyParser.json()); //потестить с json с клиента

  if (config.isProductionMode()) {
    app.use(express.static(path.join(__dirname, '..', "public")));
  }
  // app.use(favicon(path.join(serverFolder, "public", "favicon.ico")));
}

function initViewEngine(app) {
  app.set("views", path.join(__dirname, '..', "views"));
  app.set('view engine', 'hbs');
}

module.exports = function (db) {

  let app = express();

  initMiddleware(app);
  initViewEngine(app);
  initSession(app, db);
  initWebpack(app);
  initAuth(app);

  // Load socket.io server
  // let server = require("./sockets").init(app, db);
  // server._app = app;

  require("../routes")(app);
  app.use(history()); //vue js history polyfill

  return app;
};
