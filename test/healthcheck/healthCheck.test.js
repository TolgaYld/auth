const request = require("supertest");
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const chaiaspromise = require("chai-as-promised");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");

chai.use(chaiaspromise);
chai.use(sinonChai);

let fastify = require("../../src/app");
let sandbox = sinon.createSandbox();

before(async () => {
  await fastify.ready();
  sandbox.restore();
});

describe("app", () => {
  context("GET /hc", () => {
    it("should returns 200 when healthcheck request is valid", (done) => {
      request(fastify.server)
        .get("/api/v1.0/hc")
        .end((err, response) => {
          expect(response.status).to.be.equal(200);
          expect(response.body).to.have.property("hello").to.equal("world");
          done(err);
        });
    });
  });
});
