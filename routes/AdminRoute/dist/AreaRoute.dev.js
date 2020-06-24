"use strict";

var connection = require('./../../config');

var express = require('express');

var router = express.Router(); //get data

router.get('/', function (req, res) {
  connection.query('SELECT * FROM AreaTbl', function (error, results, fields) {
    if (error) {
      var op = {
        success: "false",
        status: 404,
        data: error
      };
    }

    if (results) {
      console.log(req.url);
      var op = {
        flag: 0,
        success: "true",
        status: 200,
        data: results,
        message: "Redirected"
      };
    }

    res.render('area', {
      op: op
    });
  });
}); //add Database

router.post('/add', function (req, res) {
  var areaname = req.body.txtAreaName;
  connection.query('SELECT * FROM AreaTbl', function (error, results, fields) {
    if (error) {
      var op = {
        success: "false",
        status: 404,
        data: error
      };
    }

    if (results) {
      console.log(req.url);
      var op = {
        flag: 0,
        success: "true",
        status: 200,
        data: results,
        message: "Redirected"
      };
    }

    res.render('area', {
      op: op
    });
  });
}); //edit data page

router.get('/edit/:id', function (req, res) {
  var aid = req.params.id;
  connection.query('SELECT * FROM AreaTbl WHERE AreaId = ?', [aid], function (error, results, fields) {
    if (error) {
      var op = {
        success: "false",
        status: 404,
        data: error
      };
    } else if (results.length > 0) {
      var op = {
        flag: 1,
        success: "true",
        status: 200,
        data: results,
        message: "Redirected"
      };
    } else {
      console.log('false');
      var op = {
        flag: 0,
        success: "false",
        status: 200,
        data: results,
        message: "Area Not Available"
      };
    }

    res.render('area', {
      op: op
    });
  });
}); //edit submit

router.post('/edit', function (req, res) {
  var areaid = req.body.txtAreaId;
  var areaname = req.body.txtAreaName;
  var data = [areaname, areaid];
  var sql = "UPDATE AreaTbl SET AreaName = ? WHERE AreaId = ?";
  connection.query(sql, data, function (error, results, fields) {
    if (error) {
      var op = {
        success: "false",
        status: 404,
        data: error
      };
    } else {
      var op = {
        flag: 0,
        success: "true",
        status: 200,
        data: results,
        message: "Redirected"
      };
    }

    res.redirect('/area');
  });
});
module.exports = router;