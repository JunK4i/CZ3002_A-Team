var expect = require("chai").expect;
var chai = require("chai");
var chaihttp = require("chai-http");
var server = require("../app");

// Assertion
chai.should();
chai.use(chaihttp);

//Test case 1
describe("Test /newuser", () => {
  describe("Add user on /async", () => {
    it("User should be added.", (done) => {
      chai
        .request(server)
        .post("/newuser")
        .send({ name: "Greg", lastName: "12345544" })
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
});
