var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const format = require('date-format');
const md5 = require('md5');
//get data
router.get('/', (req, res) => {
    res.render('register')
})

//Customer List
router.get('/clist', (req, res) => {
    connection.query('SELECT u.UserId,u.UserName,u.Email,a.AreaName FROM UserTbl u,AreaTbl a WHERE u.AreaId = a.AreaId AND u.RoleId=?', [1], function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.send({ op })
        }
        else {
            if (results) {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
            }
            res.render('customer', { op });
        }
    });
})

//Installer List
router.get('/ilist', (req, res) => {
    connection.query('SELECT u.UserId,u.UserName,u.Email,a.AreaName FROM UserTbl u,AreaTbl a WHERE u.AreaId = a.AreaId AND u.RoleId=?', [2], function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.send({ op })
        }
        else {
            if (results) {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
            }
            res.render('installer', { op });
        }
    });
})


//add Database
router.post('/add', (req, res) => {
    let username = req.body.txtUsername;
    let email = req.body.txtEmail;
    let password = md5(req.body.txtPassword);
    let areaid = req.body.cmbArea
    let roleid = req.body.cmbRole;
    let val = [username, email, password, areaid, roleid];
    connection.query('INSERT INTO UserTbl(UserName,Email,Password,AreaId,RoleId) VALUES(?,?,?,?,?)', val, function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.send(error)
        }
        if (results) {
            var op = {
                flag: 0,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
            res.redirect('/register');
        }
        
    });
})

module.exports = router;