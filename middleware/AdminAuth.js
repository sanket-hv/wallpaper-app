var connection = require('./../config');
const jwt = require("jsonwebtoken")
const md5 = require('md5')

const jwtKey = "wallpaper-app"
const jwtExpirySeconds = 259200 //86400 second for 1 day..Here it is set for 3 days

const signIn = (req, res) => {
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
                    // console.log(token);
                    var op = {
                        "status": true,
                        "_token": token,
                        "message": "Authenticated Successfully"
                    };
                    req.session.token = token;
                    if (req.session.token) {
                        res.render('index', { op });
                    }
                    else {
                        return res.redirect("/login");
                    }

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
}

const welcome = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        var op = {
            status: false,
            message: "You need to login first..." 
        }
        res.render('login', { op });
    }
    else {
        var payload
        try {
            payload = jwt.verify(token, jwtKey)
            next();
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                var op = {
                    status: false,
                    message: "Login Again..."
                }
                res.render('login', { op });
            }
            var op = {
                status: false,
                message: "Login Again..."
            }
            res.render('login', { op });
        }
    }
}

const logout = (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {

            }
            else {
                var op = {
                    "message": "Loggout Successfully"
                }
                res.render('login', { op })
            }
        })
    }
}

module.exports = {
    signIn,
    welcome,
    logout
}