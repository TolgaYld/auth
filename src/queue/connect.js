const amqp = require("amqplib/callback_api");
const winstonlog = require("../errors/logger");
const { log } = require("../modules/logModule");
require("dotenv").config();

const adminQ = "auth";

let adminChannel = null;

let amqpUrl;

if (process.env.NODE_ENV === "test") {
  amqpUrl = process.env.AMQPURLTEST;
} else if (process.env.NODE_ENV === "production") {
  amqpUrl = process.env.AMQPURLPRODUCTION;
}

try {
  amqp.connect(amqpUrl + "?heartbeat=60", (err, conn) => {
    if (err) winstonlog.error("amqpt error: " + err);
    conn.createChannel(async (e, ch) => {
      if (err) winstonlog.error("amqpt error: " + e);

      ch.assertQueue(adminQ, { durable: true });

      adminChannel = ch;
    });
  });
} catch (error) {
  winstonlog.error("amqpt error: " + error);
}

const pushToMessageQ = (msg) => {
  if (!adminChannel) {
    setTimeout(() => {
      pushToMessageQ(msg);
    }, 999);
  }
  try {
    adminChannel.sendToQueue(adminQ, Buffer.from(JSON.stringify(msg)));
    log("push to queue: " + adminQ);
  } catch (error) {
    winstonlog.error("amqpt error: " + error);
  }

  return { m: "done" };
};

module.exports = {
  pushToMessageQ,
};
