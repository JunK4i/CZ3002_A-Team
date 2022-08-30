//https://www.tutsmake.com/node-express-js-creating-a-restful-api-mysql-example/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// connection configurations
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: 'ASE_DB'
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// set port
app.listen(3000, function () {
  console.log('Node app is running on port 3000');
});