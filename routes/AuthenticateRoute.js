var connection = require('./../config');
var express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken')
const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300
var router = express.Router();
// var sess;
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = md5(req.body.password);
    connection.query('SELECT * FROM AdminTbl WHERE Email = ?', [email], function (error, results, fields) {
        if (error) {
            var op = {
                status: false,
                message: 'there are some error with query'
            }
            res.render('login', { op });
        } else {
            if (results.length > 0) {
                if (password == results[0].Password) {
                    const token = jwt.sign({ email }, jwtKey, {
                        algorithm: "HS256",
                        expiresIn: jwtExpirySeconds,
                    })
                    console.log(token);
                    var op = {
                        "status": true,
                        "_token": token,
                        "message": "Authenticated Successfully"
                    };
                    res.render('index', { obj: op });
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