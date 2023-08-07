const fastify = require("./src/app");
const { log } = require("./src/modules/logModule");
const port = parseInt(process.env.PORT) || 8012;

// Run the server!
fastify.listen({ port, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
  log(`${process.env.CURRENTSERVICE} Server Up! on address: ${address}`);
});
require("./src/db/dbConnection");
require("./src/queue/connect");
