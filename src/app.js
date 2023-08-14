require("dotenv").config();
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");
const path = require("path");

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug:
      process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
        ? true
        : false,
    fallbackLng: "en",
    backend: {
      loadPath:
        path.join(__dirname, "..") + "/locales/{{lng}}/translation.json",
    },
  });

const fastify = require("fastify")({
  logger: true,
  cors: true,
});

fastify.register(require("./routes/authRouter"), {
  logLevel:
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
      ? "debug"
      : "warn",
  prefix: "/api/v1.0",
});

fastify.get("/api/v1.0/hc", (request, reply) => {
  reply.send({ hello: "world" });
});

fastify.register(i18nextMiddleware.plugin, { i18next });

// Run the server!

module.exports = fastify;
