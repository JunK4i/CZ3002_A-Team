//db configuration
var mysql = require("mysql2");
require("dotenv").config();
const config = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
};
var con = mysql.createConnection(config);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports = con;
