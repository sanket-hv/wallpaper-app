"use strict";

var connection = require('./../../config');

var express = require('express');

var router = express.Router(); //get data

router.get('/', function (req, res) {
  connection.query('SELECT * FROM OfferTbl', function (error, results, fields) {
    if (error) {
      var op = {
        success: "false",
        status: 404,
        data: error
      };
    }

    if (results) {
      var op = {
        flag: 0,
        success: "true",
        status: 200,
        data: results,
        message: "Redirected"
      };
    }

    res.render('offer', {
      op: op
    });
  });
}); //edit data page

router.get('/edit/:id', function (req, res) {
  var oid = req.params.id;
  connection.query('SELECT * FROM OfferTbl WHERE OfferId = ?', [oid], function (error, results, fields) {
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
        message: "Offer Not Available"
      };
    }

    res.render('offer', {
      op: op
    });
  });
}); //edit submit

router.post('/edit', function (req, res) {
  var offerid = req.body.txtOfferId;
  var offername = req.body.txtOfferName;
  var data = [offername, offerid];
  var sql = "UPDATE OfferTbl SET OfferName = ? WHERE OfferId = ?";
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

    res.redirect('/offer');
  });
});
module.exports = router;