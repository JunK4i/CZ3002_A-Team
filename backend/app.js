//https://www.tutsmake.com/node-express-js-creating-a-restful-api-mysql-example/
var express = require("express");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const route = require("./router.js");

var app = express();
dotenv.config();

var bodyParser = require("body-parser");
// var mysql = require('mysql');

app.use("", route);

// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

app.use(express.json());
app.use(express.text());
app.use("", route);
var con = require("./utility/dbconfig");

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// set port
app.listen(process.env.PORT, function () {
  console.log(`Node app is running on ${process.env.PORT}`);
});
