"use strict";

var mysql = require('mysql');

require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});
connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
  }
});
module.exports = connection;