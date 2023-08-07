const { createLogger, transports, format } = require("winston");
const db = require("../db/db");
require("winston-mongodb");

let service = process.env.CURRENTSERVICE;
service = service.toLowerCase();

const customerLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: db.connectionString,
      filename: `${service.toLowerCase()}-error.log`,
      level: "error",
      collection: "error_logs",
      options: { useUnifiedTopology: true },
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = customerLogger;
