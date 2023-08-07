const log = require("./logger");
const errorHandler = async (
  statusCode,
  errorMessage,
  loadi18next,
  request,
  reply,
) => {
  if (loadi18next) {
    log.error(
      `Status Code: ${statusCode} / Error Message: ${await request.i18n
        .changeLanguage("en")
        .then((t) => {
          t(errorMessage);
        })}`,
    );
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
