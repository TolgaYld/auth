const queue = require("./connect");

const push = (service, crud, payload) => {
  queue.pushToMessageQ({ service, action: crud, payload });
};

module.exports = push;
