const { DateTime } = require("luxon");
const db = require("../db/db");

const log = (input, module = "default", color = "green") => {
  if (module == null || module == undefined) {
    module = "default";
  }
  if (typeof color !== "string") {
    color = "green";
  }
  color = color.toLowerCase();
  switch (color) {
    case "green":
      color = "\x1b[32m";
      break;
    case "red":
      color = "\x1b[31m";
      break;
    case "blue":
      color = "\x1b[34m";
      break;
    case "yellow":
      color = "\x1b[33m";
      break;
    case "cyan":
      color = "\x1b[36m";
      break;
    case "magenta":
      color = "\x1b[35m";
      break;
    default:
      color = "\x1b[32m";
      break;
  }
  const now = DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
  console.log(`${now} - ${color}|ENV: ${db.ENV}| ${module}\x1b[0m: ${input}`);
};

module.exports = {
  log,
};
