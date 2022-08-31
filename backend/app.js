//https://www.tutsmake.com/node-express-js-creating-a-restful-api-mysql-example/

var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config();
var bodyParser = require('body-parser');
var mysql = require('mysql');
//use router.js
const route = require('./router.js');
app.use('', route);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// connection configurations
var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// set port
app.listen(process.env.PORT, function () {
  console.log(`Node app is running on ${process.env.PORT}`);
});
