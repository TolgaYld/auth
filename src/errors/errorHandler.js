const log = require("./logger");
const i18next = require("i18next");
const errorHandler = async (
  statusCode,
  errorMessage,
  loadi18next,
  request,
  reply,
) => {
  if (loadi18next) {
    i18next.changeLanguage("en", (err, t) => {
      if (err) return console.log("something went wrong loading", err);

      const loadVariable = t(errorMessage); // -> same as i18next.t
      log.error(`Status Code: ${statusCode} / Error Message: ${loadVariable}`);
    });

    return await reply
      .code(statusCode)
      .send({ msg: await request.t(errorMessage), success: false });
  } else {
    log.error(`Status Code: ${statusCode} / Error Message: ${errorMessage}`);

    return await reply
      .code(statusCode)
      .send({ msg: errorMessage, success: false });
  }
};

module.exports = errorHandler;
