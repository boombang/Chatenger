let db = require("./core/mongo")();
let app = require("./core/express")(db);

app.listen(3000, () => {
  console.log("Server is alive");
});
