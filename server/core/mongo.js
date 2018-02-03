let mongoose = require("mongoose");
let autoIncrement = require("mongoose-auto-increment");
module.exports = function () {
  let db;

  mongoose.Promise = global.Promise;

  if (mongoose.connection.readyState !== 1) {
    console.log('Connecting to Mongo...');
    db = mongoose.connect('mongodb://localhost/chatengerdb', {
      useMongoClient: true,
    }, (err) => {
      if (err) {
        console.log('Could not connect to MongoDB!');
        console.log(err);
      }

      mongoose.set("debug", true || config.isDevMode());
    });

    mongoose.connection.on("error", (err) => {
      if (err.message.code === "ETIMEDOUT") {
        console.log("Mongo connection timeout!", err);
        setTimeout(() => {
          mongoose.connect('mongodb://localhost/chatengerdb', {
            useMongoClient: true,
          });
        }, 1000);
        return;
      }
      console.log("Could not connect to MongoDB!");
      console.log(err);
    });

    /*
    	Maybe change to 
    		https://github.com/icebob/mongoose-autoincrement
     */
    autoIncrement.initialize(db);

    mongoose.connection.once("open", function mongoAfterOpen() {
      console.log('Mongo DB connected.');
      // require("./seed-db")();	
    });

  } else {
    console.log('Mongo already connected.');
    db = mongoose;
  }

  return db;
};
