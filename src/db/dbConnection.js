const mongoose = require("mongoose");
const { log } = require("../modules/logModule");
const db = require("./db");
mongoose.set("strictQuery", false);

mongoose
  .connect(db.connectionString)
  .then(() => {
    log(`Connected to ${process.env.CURRENTSERVICE}-MongoDb!`);
  })
  .catch((error) => {
    log(
      `Connection to ${process.env.CURRENTSERVICE}-MongoDb failed!: ` + error,
    );
  });
