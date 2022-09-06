//https://www.tutsmake.com/node-express-js-creating-a-restful-api-mysql-example/
var express = require("express");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const route = require("./router.js");

var app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("", route);
var con = require("./utility/dbconfig");

// set port
app.listen(process.env.PORT, function () {
  console.log(`Node app is running on ${process.env.PORT}`);
});
