let config	= require("./config");

let db = require("./core/mongo")();
let app = require("./core/express")(db);

app.listen(config.port, () => {
  console.log("Server is alive");
});
