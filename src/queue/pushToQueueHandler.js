const queue = require("./connect");

const push = (crud, payload) => {
  queue.pushToMessageQ({ action: crud, payload });
};

module.exports = push;
