"use strict";

var connection = require('./../../config');

var express = require('express');

var router = express.Router();

var fs = require('fs');

var tempimg = ""; //get data

router.get('/', function (req, res) {
  connection.query('SELECT * FROM CategoryTbl', function (error, results, fields) {
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

    res.render('category', {
      op: op
    });
  });
}); //add category

router.post('/add', function _callee(req, res) {
  var imgfile, fname;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          imgfile = req.files.categoryImage;
          fname = Date.now() + req.files.categoryImage.name;
          _context.next = 4;
          return regeneratorRuntime.awrap(imgfile.mv('./public/images/category/' + fname, function (err) {
            if (err) {
              console.log(err);
              var op = {
                success: "false",
                status: 404,
                data: error
              };
            } else {
              var CategoryName = req.body.txtCategoryName;
              var sql = "INSERT INTO CategoryTbl(CategoryName,Img) VALUES(?,?)";
              var data = [CategoryName, fname];
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

                res.redirect('/category');
              });
            }
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); //edit data page

router.get('/edit/:id', function (req, res) {
  var cid = req.params.id;
  var sql = 'SELECT * FROM CategoryTbl WHERE CategoryId = ?';
  connection.query('SELECT * FROM CategoryTbl WHERE CategoryId = ?', [cid], function (error, results, fields) {
    if (error) {
      var op = {
        success: "false",
        status: 404,
        data: error
      };
    } else {
      if (results.length > 0) {
        var op = {
          flag: 1,
          success: "true",
          status: 200,
          data: results,
          message: "Redirected"
        };
      } else {
        var op = {
          flag: 0,
          success: "false",
          status: 200,
          data: results,
          message: "Category Not Available"
        };
      }
    }

    tempimg = op.data[0].Img; // console.log(tempimg)

    res.render('category', {
      op: op
    });
  });
}); //edit submit

router.post('/edit', function _callee2(req, res) {
  var CategoryName, cid, sql, rmpath;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          CategoryName = req.body.txtCategoryName;
          cid = req.body.txtCategoryId;
          sql = "";

          if (!req.files) {
            console.log("File not found");
            sql = "UPDATE CategoryTbl SET CategoryName = ? WHERE CategoryId = ?";
            connection.query(sql, [CategoryName, cid], function (error, results, fields) {
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

              res.redirect('/category');
            });
          } else {
            imgfile = req.files.categoryImage;
            fname = Date.now() + req.files.categoryImage.name;
            rmpath = './public/images/category/' + tempimg;
            fs.unlink(rmpath, function (err) {
              if (err) {
                res.send("error file remove");
              } else {
                imgfile.mv('./public/images/category/' + fname, function (err1) {
                  if (err1) {
                    console.log(err1);
                  } else {
                    console.log("File deleted");
                    sql = "UPDATE CategoryTbl SET CategoryName = ?, Img = ? WHERE CategoryId = ?";
                    connection.query(sql, [CategoryName, fname, cid], function (error, results, fields) {
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

                      res.redirect('/category');
                    });
                  }
                });
              }
            });
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;