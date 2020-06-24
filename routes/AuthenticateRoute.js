var connection = require('./../config');
var express = require('express');
const md5 = require('md5');
var router = express.Router();
// var sess;
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = md5(req.body.password);
    connection.query('SELECT * FROM AdminTbl WHERE Email = ?', [email], function(error, results, fields) {
        if (error) {
            var op = {
                status: false,
                message: 'there are some error with query'
            }
            res.render('login', { op });
        } else {
            if (results.length > 0) {
                if (password == results[0].Password) {
                    var op = {
                        "status": true,
                        "message": "Authenticated Successfully"
                    };
                    res.cookie('AdminId', results[0].AdminId);
                    res.cookie('email', email);
                    res.render('layout', { op });
                } else {
                    var op = {
                        status: false,
                        message: "Email or Password does not match"
                    }
                    res.render('login', { op });
                }
            } else {
                var op = {
                    status: false,
                    message: "Email does not exits"
                }
                res.render('login', { op });
            }
        }
    });
})

module.exports = router;