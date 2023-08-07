require("dotenv").config();
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "../locales/{{lng}}/translation.json",
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
// Run the server!

module.exports = fastify;
