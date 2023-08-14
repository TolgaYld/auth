const mongoose = require("mongoose");
const { log } = require("../modules/logModule");
const db = require("./db");
mongoose.set("strictQuery", false);

let dbConnection;

mongoose
  .connect(db.connectionString)
  .then(() => {
    log(`Connected to ${process.env.CURRENTSERVICE}-MongoDb!`);
    dbConnection = mongoose.connection.db;
  })
  .catch((error) => {
    log(
      `Connection to ${process.env.CURRENTSERVICE}-MongoDb failed!: ` + error,
    );
  });

module.exports = dbConnection;
